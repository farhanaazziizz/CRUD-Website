import express from 'express';
import {
  getAllNotifications,
  getUnreadNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  triggerManualCheck,
  getNotificationStats
} from '../controllers/notificationController.js';

const router = express.Router();

router.get('/', getAllNotifications);
router.get('/unread', getUnreadNotifications);
router.get('/stats', getNotificationStats);
router.put('/:id/read', markAsRead);
router.put('/read-all', markAllAsRead);
router.post('/trigger-check', triggerManualCheck);
router.delete('/:id', deleteNotification);

export default router;