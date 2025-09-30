import database from '../config/database.js';
import { calculateDaysRemaining, formatDate } from '../utils/helpers.js';

export const checkExpiringCertificates = async () => {
  try {
    console.log('🔔 Checking expiring certificates...');

    let createdNotifications = 0;
    let updatedStatuses = 0;

    // Get all active clients
    const clients = await database.all('SELECT * FROM clients WHERE status = "Active"');

    for (const client of clients) {
      const daysRemaining = calculateDaysRemaining(client.certificate_expiry_date);

      // Check if certificate is expired
      if (daysRemaining < 0) {
        // Update client status to expired
        await database.run(
          'UPDATE clients SET status = "Expired", updated_at = CURRENT_TIMESTAMP WHERE id = ?',
          [client.id]
        );
        updatedStatuses++;

        // Create expired notification if doesn't exist
        const existingNotification = await database.get(
          'SELECT id FROM notifications WHERE client_id = ? AND type = "danger" AND is_read = 0',
          [client.id]
        );

        if (!existingNotification) {
          await database.run(`
            INSERT INTO notifications (client_id, title, message, type, days_remaining)
            VALUES (?, ?, ?, ?, ?)
          `, [
            client.id,
            `${client.client_name} - Certificate Expired`,
            `Certificate has expired on ${formatDate(client.certificate_expiry_date)}. Please renew immediately.`,
            'danger',
            daysRemaining
          ]);
          createdNotifications++;
        }
      }
      // Create notification if expiring within 5 days
      else if (daysRemaining <= 5 && daysRemaining >= 0) {
        // Check if notification already exists
        const existingNotification = await database.get(
          'SELECT id FROM notifications WHERE client_id = ? AND days_remaining = ? AND is_read = 0',
          [client.id, daysRemaining]
        );

        if (!existingNotification) {
          const notificationType = daysRemaining <= 2 ? 'danger' : 'warning';
          const title = `${client.client_name} - Certificate Expiring Soon`;
          const message = daysRemaining === 0
            ? `Certificate expires today (${formatDate(client.certificate_expiry_date)}). Urgent action required!`
            : `Certificate will expire in ${daysRemaining} day${daysRemaining === 1 ? '' : 's'} on ${formatDate(client.certificate_expiry_date)}`;

          await database.run(`
            INSERT INTO notifications (client_id, title, message, type, days_remaining)
            VALUES (?, ?, ?, ?, ?)
          `, [
            client.id,
            title,
            message,
            notificationType,
            daysRemaining
          ]);
          createdNotifications++;
        }
      }
    }

    console.log(`✅ Notification check completed. Created: ${createdNotifications}, Updated statuses: ${updatedStatuses}`);

    return {
      created: createdNotifications,
      updated: updatedStatuses,
      total_checked: clients.length
    };
  } catch (error) {
    console.error('Error checking expiring certificates:', error);
    throw error;
  }
};

export const createNotification = async (clientId, title, message, type = 'warning', daysRemaining = 0) => {
  try {
    const result = await database.run(`
      INSERT INTO notifications (client_id, title, message, type, days_remaining)
      VALUES (?, ?, ?, ?, ?)
    `, [clientId, title, message, type, daysRemaining]);

    return result;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

export const cleanupOldNotifications = async (daysOld = 30) => {
  try {
    const result = await database.run(`
      DELETE FROM notifications
      WHERE is_read = 1 AND created_at < datetime('now', '-${daysOld} days')
    `);

    console.log(`🧹 Cleaned up ${result.changes} old read notifications`);
    return result.changes;
  } catch (error) {
    console.error('Error cleaning up old notifications:', error);
    throw error;
  }
};