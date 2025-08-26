const express = require('express');
const multer = require('multer');
const Project = require('../models/Project');
const currencyService = require('../services/currencyService');

const router = express.Router();

// Configure multer for handling multipart/form-data
const upload = multer();

// Nifty API configuration
const NIFTY_REFRESH_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb2RlIjoiSm5zNzBpbzdIOVQ2YXJLTWNKNmJ6TkRkRjBUWUxtV3BKMExKazA1aUNwZ1RjdzB0RWRtR09sUVVUdWZPUTJEbiIsImNsaWVudF9pZCI6IlJzNFFMQWxiVWNjeUFVMktQNjBEVk5ualRXdjJ1SW43IiwiY2xpZW50X3NlY3JldCI6IndpMjRUelo3WmhOUTJrN2J2d0M5WlZ2S2ZzdXdqYkNrUmtMb28xOTRreWwwNXo4aHMwdFBEMU5tdUxhcEEzV2IiLCJpYXQiOjE3NTYyMTQwNDMsImV4cCI6MzMyODIyNTY0NDN9.p-xP4EOyaND-32OZID5yYYBrLZxdNdCKjk8vdBCj16I';
const NIFTY_CLIENT_ID = 'Rs4QLAlbUccyAU2KP60DVNnjTWv2uIn7';
const NIFTY_CLIENT_SECRET = 'wi24TZz7ZhNQ2k7bvwC9ZVvKfsuwjbCkRkLoo194ky05z8hs0tPD1NmuLapA3Wb';

// Function to get Nifty access token
async function getNiftyAccessToken() {
  try {
    const credentials = Buffer.from(`${NIFTY_CLIENT_ID}:${NIFTY_CLIENT_SECRET}`).toString('base64');
    
    const response = await fetch("https://openapi.niftypm.com/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${credentials}`,
      },
      body: JSON.stringify({
        refresh_token: NIFTY_REFRESH_TOKEN,
        grant_type: "refresh_token",
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to get access token: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('Error getting Nifty access token:', error);
    throw error;
  }
}

// Function to create project in Nifty
async function createNiftyProject(accessToken, projectData) {
  try {
    const response = await fetch('https://openapi.niftypm.com/api/v1.0/projects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        name: projectData.projectName,
        description: projectData.description || `Project created from Salesmate deal: ${projectData.title}`,
        demo: false,
        access_type: 'team',
        project_type: 'general',
        default_tasks_view: 'list'
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to create Nifty project: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating Nifty project:', error);
    throw error;
  }
}

// Function to generate project ID
async function generateProjectId() {
  const allCLProjects = await Project.find(
    { projectId: { $regex: /^CL\d{4}$/ } }
  ).sort({ projectId: 1 });
  
  let nextNumber = 1;
  if (allCLProjects && allCLProjects.length > 0) {
    const clNumbers = allCLProjects
      .map(p => parseInt(p.projectId.substring(2)))
      .filter(num => num <= 2000);
    
    if (clNumbers.length > 0) {
      const highestNumber = Math.max(...clNumbers);
      nextNumber = highestNumber + 1;
    }
  }
  
  return `CL${nextNumber.toString().padStart(4, '0')}`;
}

// Webhook endpoint for Salesmate
router.post('/salesmate', upload.any(), async (req, res) => {
  try {
    console.log('📥 Received webhook from Salesmate');
    console.log('📋 Request headers:', JSON.stringify(req.headers, null, 2));
    console.log('📄 Request body:', JSON.stringify(req.body, null, 2));
    console.log('📁 Request files:', JSON.stringify(req.files, null, 2));
    console.log('🔍 Request method:', req.method);
    console.log('🌐 Request URL:', req.url);
    
    // Handle both JSON and form data
    let webhookData = req.body;
    
    // If body is empty but we have form data, try to parse it
    if (Object.keys(req.body).length === 0 && req.headers['content-type']?.includes('multipart/form-data')) {
      console.log('🔄 Detected multipart/form-data, attempting to parse...');
      
      // For multipart/form-data, the data might be in req.body.fields or similar
      // Let's check if we can access it differently
      webhookData = req.body;
      
      // If still empty, try to get raw body data
      if (Object.keys(webhookData).length === 0) {
        console.log('⚠️ Empty body detected, checking for alternative data sources...');
        // The data might be available in a different format
        webhookData = req.body;
      }
    }
    
    console.log('📊 Final webhook data:', JSON.stringify(webhookData, null, 2));
    
    const {
      closeDate,
      companyName,
      dealValue,
      dueDate,
      id,
      startDate,
      title
    } = webhookData;

    console.log('📊 Parsed data:');
    console.log('  - closeDate:', closeDate);
    console.log('  - companyName:', companyName);
    console.log('  - dealValue:', dealValue);
    console.log('  - dueDate:', dueDate);
    console.log('  - id:', id);
    console.log('  - startDate:', startDate);
    console.log('  - title:', title);

    // Validate required fields
    if (!companyName || !dealValue || !title) {
      console.log('❌ Validation failed:');
      console.log('  - companyName present:', !!companyName);
      console.log('  - dealValue present:', !!dealValue);
      console.log('  - title present:', !!title);
      return res.status(400).json({ 
        error: 'Missing required fields: companyName, dealValue, title',
        received: {
          companyName: !!companyName,
          dealValue: !!dealValue,
          title: !!title
        }
      });
    }

    // Generate project ID
    const projectId = await generateProjectId();
    
    // Convert deal value to number
    const totalAmount = parseFloat(dealValue);
    const totalAmountCurrency = 'AED'; // Default to AED
    const totalAmountInBase = currencyService.convertToBase(totalAmount, totalAmountCurrency);

    // Parse dates
    const expectedStartDate = startDate ? new Date(startDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
    const expectedCompletion = dueDate ? new Date(dueDate).toISOString().split('T')[0] : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    // Calculate month of payment
    const completionDate = new Date(expectedCompletion);
    const monthOfPayment = completionDate.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long' 
    });

    // Create project data for our database
    const projectData = {
      userId: '68a79730091b06b0654ec04a',
      projectId,
      projectName: title,
      clientName: companyName,
      totalAmount,
      totalAmountCurrency,
      totalAmountInBase,
      depositPaid: 0,
      depositPaidCurrency: totalAmountCurrency,
      depositPaidInBase: 0,
      expectedStartDate,
      expectedCompletion,
      status: 'Pending',
      priority: 'Medium',
      monthOfPayment,
      description: `Project created from Salesmate deal ID: ${id}`,
      tags: ['Salesmate', 'Webhook'],
      notes: `Deal Value: ${dealValue} ${totalAmountCurrency}\nClose Date: ${closeDate}\nDue Date: ${dueDate}`,
      salesmateDealId: id
    };

    // Create project in our database
    console.log('💾 Creating project in database...');
    const project = await Project.create(projectData);
    console.log('✅ Project created in database:', project.projectId);

    // Create project in Nifty
    let niftyProject = null;
    try {
      console.log('🔄 Getting Nifty access token...');
      const accessToken = await getNiftyAccessToken();
      
      console.log('📋 Creating project in Nifty...');
      niftyProject = await createNiftyProject(accessToken, {
        projectName: title,
        description: `Project created from Salesmate deal: ${title}\nClient: ${companyName}\nDeal Value: ${dealValue} ${totalAmountCurrency}`
      });
      
      console.log('✅ Project created in Nifty:', niftyProject.id);
      
      // Update our project with Nifty ID
      project.niftyProjectId = niftyProject.id;
      await project.save();
      console.log('✅ Updated project with Nifty ID');
      
    } catch (niftyError) {
      console.error('❌ Failed to create project in Nifty:', niftyError);
      // Continue even if Nifty creation fails - we still have the project in our database
    }

    // Return success response
    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: {
        projectId: project.projectId,
        projectName: project.projectName,
        clientName: project.clientName,
        totalAmount: project.totalAmount,
        niftyProjectId: niftyProject?.id || null,
        salesmateDealId: id
      }
    });

  } catch (error) {
    console.error('❌ Webhook error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
});

// Health check endpoint for webhooks
router.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Webhook service is running',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
