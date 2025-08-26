const fs = require('fs');
const path = require('path');

console.log('🔍 Testing deployment setup...');
console.log('============================');

// Check if build folder exists
const buildPath = path.join(__dirname, 'build');
if (fs.existsSync(buildPath)) {
  console.log('✅ Build folder exists');
  
  // Check build contents
  const buildContents = fs.readdirSync(buildPath);
  console.log('📁 Build contents:', buildContents);
  
  // Check static folder
  const staticPath = path.join(buildPath, 'static');
  if (fs.existsSync(staticPath)) {
    console.log('✅ Static folder exists');
    
    const staticContents = fs.readdirSync(staticPath);
    console.log('📁 Static contents:', staticContents);
    
    // Check JS files
    const jsPath = path.join(staticPath, 'js');
    if (fs.existsSync(jsPath)) {
      const jsFiles = fs.readdirSync(jsPath);
      console.log('📁 JS files:', jsFiles);
    }
    
    // Check CSS files
    const cssPath = path.join(staticPath, 'css');
    if (fs.existsSync(cssPath)) {
      const cssFiles = fs.readdirSync(cssPath);
      console.log('📁 CSS files:', cssFiles);
    }
  } else {
    console.log('❌ Static folder missing');
  }
  
  // Check index.html
  const indexPath = path.join(buildPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    console.log('✅ index.html exists');
    
    // Read and check for static file references
    const indexContent = fs.readFileSync(indexPath, 'utf8');
    const jsMatches = indexContent.match(/static\/js\/[^"]+/g);
    const cssMatches = indexContent.match(/static\/css\/[^"]+/g);
    
    console.log('🔗 JS references in index.html:', jsMatches);
    console.log('🔗 CSS references in index.html:', cssMatches);
  } else {
    console.log('❌ index.html missing');
  }
  
} else {
  console.log('❌ Build folder missing - run npm run build first');
}

console.log('\n📋 Next steps:');
console.log('1. Check Render dashboard for deployment status');
console.log('2. Look for any build/deployment errors');
console.log('3. Verify both services are running');
console.log('4. Check if the custom Express server is working on Render');
