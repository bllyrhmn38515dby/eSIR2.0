const express = require('express');
const authRoutes = require('./routes/auth');

// Create a test app
const app = express();
app.use(express.json());

// Add auth routes
app.use('/api/auth', authRoutes);

// Add a test route to see all registered routes
app.get('/debug/routes', (req, res) => {
  const routes = [];
  
  app._router.stack.forEach(middleware => {
    if (middleware.route) {
      // Routes registered directly on the app
      const methods = Object.keys(middleware.route.methods);
      methods.forEach(method => {
        routes.push({
          method: method.toUpperCase(),
          path: middleware.route.path,
          stack: middleware.route.stack.length
        });
      });
    } else if (middleware.name === 'router') {
      // Router middleware
      middleware.handle.stack.forEach(handler => {
        if (handler.route) {
          const methods = Object.keys(handler.route.methods);
          methods.forEach(method => {
            routes.push({
              method: method.toUpperCase(),
              path: '/api/auth' + handler.route.path,
              stack: handler.route.stack.length
            });
          });
        }
      });
    }
  });
  
  res.json({
    message: 'Registered routes',
    routes: routes
  });
});

// Start server
const PORT = 3002;
app.listen(PORT, () => {
  console.log(`🔍 Debug server running on port ${PORT}`);
  console.log(`📋 Check routes at: http://localhost:${PORT}/debug/routes`);
});
