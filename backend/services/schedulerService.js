import cron from 'node-cron';
import { checkExpiringCertificates, cleanupOldNotifications } from './notificationService.js';
import database from '../config/database.js';

export const startScheduler = () => {
  // Daily certificate check at 8:00 AM
  cron.schedule('0 8 * * *', async () => {
    try {
      console.log('🔔 [SCHEDULED] Running daily certificate check...');
      const result = await checkExpiringCertificates();

      // Log the scheduled run
      await database.run(
        'INSERT INTO system_logs (action, description) VALUES (?, ?)',
        ['Scheduled Check', `Daily check completed. Created ${result.created} notifications, updated ${result.updated} statuses.`]
      );
    } catch (error) {
      console.error('Error in scheduled certificate check:', error);

      // Log the error
      await database.run(
        'INSERT INTO system_logs (action, description) VALUES (?, ?)',
        ['Scheduled Check Error', error.message]
      );
    }
  });

  // Weekly cleanup of old read notifications (every Sunday at 2:00 AM)
  cron.schedule('0 2 * * 0', async () => {
    try {
      console.log('🧹 [SCHEDULED] Running weekly notification cleanup...');
      const cleaned = await cleanupOldNotifications(30);

      // Log the cleanup
      await database.run(
        'INSERT INTO system_logs (action, description) VALUES (?, ?)',
        ['Notification Cleanup', `Cleaned up ${cleaned} old notifications`]
      );
    } catch (error) {
      console.error('Error in scheduled cleanup:', error);

      // Log the error
      await database.run(
        'INSERT INTO system_logs (action, description) VALUES (?, ?)',
        ['Cleanup Error', error.message]
      );
    }
  });

  console.log('✅ Scheduler started:');
  console.log('   - Daily certificate check: 8:00 AM');
  console.log('   - Weekly notification cleanup: Sunday 2:00 AM');
};

// For testing: Run every minute (commented out by default)
export const startTestScheduler = () => {
  cron.schedule('*/1 * * * *', async () => {
    try {
      console.log('🔔 [TEST] Running certificate check...');
      const result = await checkExpiringCertificates();
      console.log(`Test check completed. Created: ${result.created}, Updated: ${result.updated}`);
    } catch (error) {
      console.error('Error in test scheduler:', error);
    }
  });

  console.log('⚠️  TEST SCHEDULER ACTIVE - Running every minute');
};

// Utility function to validate cron expression
export const isValidCronExpression = (expression) => {
  try {
    return cron.validate(expression);
  } catch (error) {
    return false;
  }
};