const express = require('express');

const app = express();
app.use(express.json());

// Simple middleware untuk bypass auth
const mockAuth = (req, res, next) => {
  req.user = { id: 1, role: 'admin_pusat' };
  next();
};

// Test routes
app.post('/api/auth/users', mockAuth, (req, res) => {
  console.log('POST /api/auth/users called');
  res.json({ success: true, message: 'User created' });
});

app.put('/api/auth/users/:id', mockAuth, (req, res) => {
  console.log('PUT /api/auth/users/:id called', req.params.id);
  res.json({ success: true, message: 'User updated' });
});

app.delete('/api/auth/users/:id', mockAuth, (req, res) => {
  console.log('DELETE /api/auth/users/:id called', req.params.id);
  res.json({ success: true, message: 'User deleted' });
});

app.get('/api/auth/users', mockAuth, (req, res) => {
  console.log('GET /api/auth/users called');
  res.json({ success: true, data: [] });
});

// Start server
const PORT = 3004;
app.listen(PORT, () => {
  console.log(`🧪 Simple test server running on port ${PORT}`);
  console.log(`📋 Test endpoints:`);
  console.log(`  POST   http://localhost:${PORT}/api/auth/users`);
  console.log(`  PUT    http://localhost:${PORT}/api/auth/users/1`);
  console.log(`  DELETE http://localhost:${PORT}/api/auth/users/1`);
  console.log(`  GET    http://localhost:${PORT}/api/auth/users`);
});
