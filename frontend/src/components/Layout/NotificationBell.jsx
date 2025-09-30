import { useState, useEffect, useRef } from 'react';
import { Bell, Eye } from 'lucide-react';
import { notificationAPI } from '../../services/api';
import { formatDate, getDaysRemainingText } from '../../utils/dateHelpers';

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchUnreadNotifications();

    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchUnreadNotifications, 30000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const fetchUnreadNotifications = async () => {
    try {
      const response = await notificationAPI.getUnread();
      const notificationData = response.data || [];

      setNotifications(notificationData);
      setUnreadCount(notificationData.length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleMarkAsRead = async (notificationId, event) => {
    event.stopPropagation();
    try {
      await notificationAPI.markAsRead(notificationId);
      fetchUnreadNotifications();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    setLoading(true);
    try {
      await notificationAPI.markAllAsRead();
      fetchUnreadNotifications();
      setIsOpen(false);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    } finally {
      setLoading(false);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'danger':
        return '🔴';
      case 'warning':
        return '⚠️';
      case 'info':
        return '🔵';
      default:
        return '⚠️';
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell size={24} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white font-medium">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-96 overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Notifications
              </h3>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  disabled={loading}
                  className="text-sm text-primary hover:text-blue-700 font-medium disabled:opacity-50"
                >
                  {loading ? 'Marking...' : 'Mark all read'}
                </button>
              )}
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center">
                <Bell size={48} className="mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500">No unread notifications</p>
                <p className="text-sm text-gray-400 mt-1">
                  You're all caught up!
                </p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <span className="text-lg mr-2">
                          {getNotificationIcon(notification.type)}
                        </span>
                        <h4 className="text-sm font-semibold text-gray-900 truncate">
                          {notification.client_name}
                        </h4>
                        <span className="ml-2 px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                          {getDaysRemainingText(notification.days_remaining)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {notification.message}
                      </p>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-gray-400">
                          {formatDate(notification.certificate_expiry_date, 'MMM dd, yyyy')}
                        </p>
                        <p className="text-xs text-gray-400">
                          Contact: {notification.contact_person}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={(e) => handleMarkAsRead(notification.id, e)}
                      className="ml-3 p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                      title="Mark as read"
                    >
                      <Eye size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {notifications.length > 0 && (
            <div className="p-4 border-t border-gray-200">
              <button
                onClick={() => {
                  // Navigate to notifications page
                  setIsOpen(false);
                }}
                className="w-full text-center text-sm text-primary hover:text-blue-700 font-medium"
              >
                View All Notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;