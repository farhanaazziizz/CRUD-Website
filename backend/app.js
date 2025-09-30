import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import clientRoutes from './routes/clients.js';
import notificationRoutes from './routes/notifications.js';
import { startScheduler } from './services/schedulerService.js';
import { seedDatabase } from './utils/seedData.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/clients', clientRoutes);
app.use('/api/notifications', notificationRoutes);

// Dashboard routes
app.get('/api/dashboard/stats', async (req, res) => {
  try {
    const { getClientStats } = await import('./controllers/clientController.js');
    await getClientStats(req, res);
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error getting dashboard stats' });
  }
});

app.get('/api/dashboard/expiring-soon', async (req, res) => {
  try {
    const { getExpiringSoon } = await import('./controllers/clientController.js');
    await getExpiringSoon(req, res);
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error getting expiring soon data' });
  }
});

// Export route
app.get('/api/export/excel', async (req, res) => {
  try {
    const database = (await import('./config/database.js')).default;
    const { calculateDaysRemaining } = await import('./utils/helpers.js');

    const clients = await database.all('SELECT * FROM clients ORDER BY client_name');

    // Add days_remaining to each client
    const clientsWithDays = clients.map(client => ({
      No: clients.indexOf(client) + 1,
      'Client Name': client.client_name,
      'Business Type': client.business_type,
      'Address': client.client_address,
      'Location': client.client_location,
      'Expiry Date': client.certificate_expiry_date,
      'Last Audit': client.last_audit_date,
      'Certification Body': client.certification_body,
      'Contact Person': client.contact_person,
      'Phone/Email': client.phone_email,
      'Status': client.status,
      'Days Remaining': calculateDaysRemaining(client.certificate_expiry_date)
    }));

    const fileName = `ISO_Clients_Export_${new Date().toISOString().split('T')[0]}.json`;

    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.setHeader('Content-Type', 'application/json');
    res.json({
      success: true,
      data: clientsWithDays,
      filename: fileName,
      exported_at: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error exporting data:', error);
    res.status(500).json({ success: false, error: 'Error exporting data' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'ISO Management API is running',
    timestamp: new Date().toISOString()
  });
});

// Initialize database and start scheduler
const initializeApp = async () => {
  try {
    // Wait a bit for database to be fully initialized
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Seed database with initial data
    await seedDatabase();

    // Start the notification scheduler
    startScheduler();

    console.log('✅ Application initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing application:', error);
    console.error('Retrying in 2 seconds...');

    // Retry once after 2 seconds
    setTimeout(async () => {
      try {
        await seedDatabase();
        startScheduler();
        console.log('✅ Application initialized successfully (retry)');
      } catch (retryError) {
        console.error('❌ Retry failed:', retryError);
      }
    }, 2000);
  }
};

export { app, initializeApp };