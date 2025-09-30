import { app, initializeApp } from './app.js';

const PORT = process.env.PORT || 5000;

// Initialize application
initializeApp();

// Start server
app.listen(PORT, () => {
  console.log('🚀 ISO Management Backend Server Started');
  console.log(`📡 Server running on http://localhost:${PORT}`);
  console.log(`📊 API endpoints available at http://localhost:${PORT}/api`);
  console.log('');
  console.log('Available endpoints:');
  console.log('  GET  /api/health           - Health check');
  console.log('  GET  /api/clients          - Get all clients');
  console.log('  GET  /api/clients/stats    - Get client statistics');
  console.log('  GET  /api/notifications    - Get all notifications');
  console.log('  GET  /api/notifications/unread - Get unread notifications');
  console.log('  POST /api/notifications/trigger-check - Manual check trigger');
  console.log('  GET  /api/dashboard/stats  - Dashboard statistics');
  console.log('  GET  /api/export/excel     - Export data');
  console.log('');
});