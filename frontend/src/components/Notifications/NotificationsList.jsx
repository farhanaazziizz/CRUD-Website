import { useState, useEffect } from 'react';
import {
  Bell,
  BellOff,
  Eye,
  EyeOff,
  Filter,
  Calendar,
  User,
  MapPin,
  Trash2,
  RefreshCw
} from 'lucide-react';
import { notificationAPI } from '../../services/api';
import { formatDate, getDaysRemainingText } from '../../utils/dateHelpers';

const NotificationsList = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Filters
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('All');
  const [refreshing, setRefreshing] = useState(false);

  const itemsPerPage = 10;

  useEffect(() => {
    fetchNotifications();
  }, [currentPage, statusFilter, typeFilter]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        status: statusFilter,
        type: typeFilter
      };

      const response = await notificationAPI.getAll(params);

      setNotifications(response.data || []);
      setTotalPages(response.pagination?.pages || 1);
      setTotalCount(response.pagination?.total || 0);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchNotifications();
    setRefreshing(false);
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await notificationAPI.markAsRead(notificationId);
      fetchNotifications();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationAPI.markAllAsRead();
      fetchNotifications();
      alert('All notifications marked as read!');
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      alert('Error marking notifications as read. Please try again.');
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    if (!confirm('Are you sure you want to delete this notification?')) {
      return;
    }

    try {
      await notificationAPI.delete(notificationId);
      fetchNotifications();
      alert('Notification deleted successfully!');
    } catch (error) {
      console.error('Error deleting notification:', error);
      alert('Error deleting notification. Please try again.');
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

  const getTypeColor = (type) => {
    switch (type) {
      case 'danger':
        return 'bg-red-100 text-red-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'info':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const statusOptions = [
    { value: 'all', label: 'All' },
    { value: 'unread', label: 'Unread' },
    { value: 'read', label: 'Read' }
  ];

  const typeOptions = ['All', 'warning', 'danger', 'info'];
  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">All Notifications</h1>
          <p className="text-gray-600">
            {totalCount} total notifications
            {unreadCount > 0 && (
              <span className="ml-2 px-2 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded-full">
                {unreadCount} unread
              </span>
            )}
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="btn-secondary flex items-center"
          >
            <RefreshCw size={16} className={`mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="btn-primary flex items-center"
            >
              <Eye size={16} className="mr-2" />
              Mark All as Read
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-gray-400" />
            <span className="text-sm text-gray-600 font-medium">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-field w-32"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-2">
            <Bell size={20} className="text-gray-400" />
            <span className="text-sm text-gray-600 font-medium">Type:</span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="input-field w-32"
            >
              {typeOptions.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="card text-center py-12">
            <BellOff size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No notifications found
            </h3>
            <p className="text-gray-500">
              {statusFilter === 'unread'
                ? "You're all caught up! No unread notifications."
                : typeFilter !== 'All'
                ? `No ${typeFilter} notifications found.`
                : 'No notifications available.'
              }
            </p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`card transition-all duration-200 ${
                !notification.is_read
                  ? 'border-l-4 border-l-primary bg-blue-50'
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">
                        {getNotificationIcon(notification.type)}
                      </span>
                      <div>
                        <h3 className={`text-lg font-semibold ${
                          !notification.is_read ? 'text-gray-900' : 'text-gray-700'
                        }`}>
                          {notification.client_name}
                        </h3>
                        <div className="flex items-center space-x-3 mt-1">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(notification.type)}`}>
                            {notification.type}
                          </span>
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            notification.days_remaining <= 5 ? 'bg-red-100 text-red-800' :
                            notification.days_remaining <= 30 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {getDaysRemainingText(notification.days_remaining)}
                          </span>
                          {!notification.is_read && (
                            <span className="px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full">
                              Unread
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatDate(notification.created_at, 'MMM dd, yyyy HH:mm')}
                    </div>
                  </div>

                  {/* Message */}
                  <p className={`text-sm mb-4 ${
                    !notification.is_read ? 'text-gray-900' : 'text-gray-600'
                  }`}>
                    {notification.message}
                  </p>

                  {/* Client Details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Calendar size={16} className="mr-2 text-gray-400" />
                      <span>
                        Expires: {formatDate(notification.certificate_expiry_date, 'MMM dd, yyyy')}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <MapPin size={16} className="mr-2 text-gray-400" />
                      <span>{notification.client_location}</span>
                    </div>
                    <div className="flex items-center">
                      <User size={16} className="mr-2 text-gray-400" />
                      <span>{notification.contact_person}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2 ml-4">
                  {!notification.is_read && (
                    <button
                      onClick={() => handleMarkAsRead(notification.id)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                      title="Mark as read"
                    >
                      <Eye size={16} />
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteNotification(notification.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                    title="Delete notification"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="card">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsList;