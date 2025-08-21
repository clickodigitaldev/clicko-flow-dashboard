const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Clicko Flow API is running',
    timestamp: new Date().toISOString()
  });
});

app.post('/api/auth/register', (req, res) => {
  res.json({ 
    message: 'Registration successful',
    token: 'demo-token',
    _id: '123',
    email: req.body.email,
    firstName: req.body.firstName,
    lastName: req.body.lastName
  });
});

app.post('/api/auth/login', (req, res) => {
  res.json({ 
    message: 'Login successful',
    token: 'demo-token',
    _id: '123',
    email: req.body.email,
    firstName: 'Demo',
    lastName: 'User'
  });
});

app.get('/api/projects', (req, res) => {
  res.json([]);
});

const PORT = 5002;
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
});
