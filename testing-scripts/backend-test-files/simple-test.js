const express = require('express');
const authRoutes = require('./routes/auth');

const app = express();
app.use(express.json());

// Add auth routes
app.use('/api/auth', authRoutes);

// Test route
app.get('/test', (req, res) => {
  res.json({ message: 'Test server running' });
});

// Start server
const PORT = 3003;
app.listen(PORT, () => {
  console.log(`🚀 Test server running on port ${PORT}`);
  console.log(`📋 Test endpoint: http://localhost:${PORT}/test`);
  console.log(`🔐 Auth routes mounted at: /api/auth`);
  
  // List all routes
  console.log('\n📋 Available routes:');
  app._router.stack.forEach(middleware => {
    if (middleware.name === 'router') {
      console.log(`  Router: ${middleware.regexp}`);
      middleware.handle.stack.forEach(handler => {
        if (handler.route) {
          const methods = Object.keys(handler.route.methods);
          methods.forEach(method => {
            console.log(`    ${method.toUpperCase()} ${handler.route.path}`);
          });
        }
      });
    }
  });
});
