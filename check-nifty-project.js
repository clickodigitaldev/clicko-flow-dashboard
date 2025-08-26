// Nifty API configuration
const NIFTY_REFRESH_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb2RlIjoiSm5zNzBpbzdIOVQ2YXJLTWNKNmJ6TkRkRjBUWUxtV3BKMExKazA1aUNwZ1RjdzB0RWRtR09sUVVUdWZPUTJEbiIsImNsaWVudF9pZCI6IlJzNFFMQWxiVWNjeUFVMktQNjBEVk5ualRXdjJ1SW43IiwiY2xpZW50X3NlY3JldCI6IndpMjRUelo3WmhOUTJrN2J2d0M5WlZ2S2ZzdXdqYkNrUmtMb28xOTRreWwwNXo4aHMwdFBEMU5tdUxhcEEzV2IiLCJpYXQiOjE3NTYyMTQwNDMsImV4cCI6MzMyODIyNTY0NDN9.p-xP4EOyaND-32OZID5yYYBrLZxdNdCKjk8vdBCj16I';
const NIFTY_CLIENT_ID = 'Rs4QLAlbUccyAU2KP60DVNnjTWv2uIn7';
const NIFTY_CLIENT_SECRET = 'wi24TzZ7ZhNQ2k7bvwC9ZVvKfsuwjbCkRkLoo194kyl05z8hs0tPD1NmuLapA3Wb';

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

// Function to get project from Nifty
async function getNiftyProject(accessToken, projectId) {
  try {
    const response = await fetch(`https://openapi.niftypm.com/api/v1.0/projects/${projectId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to get Nifty project: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error getting Nifty project:', error);
    throw error;
  }
}

// Main function
async function checkProject() {
  const projectId = 'OMskaYDB87rwy';
  
  try {
    console.log(`🔍 Checking project data for: ${projectId}`);
    
    console.log('🔄 Getting Nifty access token...');
    const accessToken = await getNiftyAccessToken();
    console.log('✅ Access token obtained');
    
    console.log('📋 Fetching project data from Nifty...');
    const project = await getNiftyProject(accessToken, projectId);
    
    console.log('📊 Project data:');
    console.log(JSON.stringify(project, null, 2));
    
    // Extract key information
    console.log('\n🎯 Key Project Information:');
    console.log(`   - Name: ${project.name}`);
    console.log(`   - ID: ${project.id}`);
    console.log(`   - Nice ID: ${project.nice_id}`);
    console.log(`   - Progress: ${project.progress || 0}`);
    console.log(`   - Description: ${project.description || 'N/A'}`);
    console.log(`   - Status: ${project.archived ? 'Archived' : 'Active'}`);
    console.log(`   - Demo: ${project.demo || false}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run the script
checkProject();
