const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the build directory
app.use(express.static(path.join(__dirname, 'build')));

// Add logging for static file requests
app.use((req, res, next) => {
  if (req.path.startsWith('/static/')) {
    console.log(`📁 Static file request: ${req.path}`);
  }
  next();
});

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
  console.log(`🔄 Serving React route: ${req.path}`);
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Static file server running on port ${PORT}`);
  console.log(`📁 Serving files from: ${path.join(__dirname, 'build')}`);
  console.log(`🌐 Server ready at http://localhost:${PORT}`);
});
