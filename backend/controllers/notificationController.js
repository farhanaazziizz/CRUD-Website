import database from '../config/database.js';
import { createResponse, createPaginationResponse, formatDate } from '../utils/helpers.js';

export const getAllNotifications = async (req, res) => {
  try {
    const { status, type, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    let whereConditions = [];
    let params = [];

    if (status === 'unread') {
      whereConditions.push('n.is_read = 0');
    } else if (status === 'read') {
      whereConditions.push('n.is_read = 1');
    }

    if (type && type !== 'All') {
      whereConditions.push('n.type = ?');
      params.push(type);
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    // Get total count
    const countSql = `
      SELECT COUNT(*) as total
      FROM notifications n
      JOIN clients c ON n.client_id = c.id
      ${whereClause}
    `;
    const countResult = await database.get(countSql, params);

    // Get paginated notifications with client info
    const sql = `
      SELECT
        n.*,
        c.client_name,
        c.business_type,
        c.client_location,
        c.certificate_expiry_date,
        c.contact_person
      FROM notifications n
      JOIN clients c ON n.client_id = c.id
      ${whereClause}
      ORDER BY n.created_at DESC
      LIMIT ? OFFSET ?
    `;

    const notifications = await database.all(sql, [...params, limit, offset]);

    const response = createPaginationResponse(
      notifications,
      countResult.total,
      page,
      limit
    );

    res.json(response);
  } catch (error) {
    console.error('Error getting notifications:', error);
    res.status(500).json(createResponse(false, null, 'Error getting notifications', error.message));
  }
};

export const getUnreadNotifications = async (req, res) => {
  try {
    const sql = `
      SELECT
        n.*,
        c.client_name,
        c.business_type,
        c.client_location,
        c.certificate_expiry_date,
        c.contact_person
      FROM notifications n
      JOIN clients c ON n.client_id = c.id
      WHERE n.is_read = 0
      ORDER BY n.created_at DESC
      LIMIT 10
    `;

    const notifications = await database.all(sql);

    res.json(createResponse(true, notifications));
  } catch (error) {
    console.error('Error getting unread notifications:', error);
    res.status(500).json(createResponse(false, null, 'Error getting unread notifications', error.message));
  }
};

export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await database.run(
      'UPDATE notifications SET is_read = 1 WHERE id = ?',
      [id]
    );

    if (result.changes === 0) {
      return res.status(404).json(createResponse(false, null, 'Notification not found'));
    }

    res.json(createResponse(true, null, 'Notification marked as read'));
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json(createResponse(false, null, 'Error marking notification as read', error.message));
  }
};

export const markAllAsRead = async (req, res) => {
  try {
    const result = await database.run(
      'UPDATE notifications SET is_read = 1 WHERE is_read = 0'
    );

    res.json(createResponse(true, { updated_count: result.changes }, 'All notifications marked as read'));
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json(createResponse(false, null, 'Error marking all notifications as read', error.message));
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await database.run('DELETE FROM notifications WHERE id = ?', [id]);

    if (result.changes === 0) {
      return res.status(404).json(createResponse(false, null, 'Notification not found'));
    }

    res.json(createResponse(true, null, 'Notification deleted successfully'));
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json(createResponse(false, null, 'Error deleting notification', error.message));
  }
};

export const triggerManualCheck = async (req, res) => {
  try {
    const { checkExpiringCertificates } = await import('../services/notificationService.js');

    const result = await checkExpiringCertificates();

    // Log the manual trigger
    await database.run(
      'INSERT INTO system_logs (action, description) VALUES (?, ?)',
      ['Manual Notification Check', `Manual check triggered. Created ${result.created} notifications, updated ${result.updated} statuses.`]
    );

    res.json(createResponse(true, result, 'Manual notification check completed successfully'));
  } catch (error) {
    console.error('Error triggering manual check:', error);
    res.status(500).json(createResponse(false, null, 'Error triggering manual check', error.message));
  }
};

export const getNotificationStats = async (req, res) => {
  try {
    const stats = await Promise.all([
      database.get('SELECT COUNT(*) as total FROM notifications'),
      database.get('SELECT COUNT(*) as unread FROM notifications WHERE is_read = 0'),
      database.get('SELECT COUNT(*) as warning FROM notifications WHERE type = "warning"'),
      database.get('SELECT COUNT(*) as danger FROM notifications WHERE type = "danger"')
    ]);

    const response = {
      total: stats[0].total,
      unread: stats[1].unread,
      warning: stats[2].warning,
      danger: stats[3].danger
    };

    res.json(createResponse(true, response));
  } catch (error) {
    console.error('Error getting notification stats:', error);
    res.status(500).json(createResponse(false, null, 'Error getting notification stats', error.message));
  }
};