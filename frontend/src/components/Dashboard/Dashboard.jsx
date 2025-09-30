import { useState, useEffect } from 'react';
import {
  Users,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Plus,
  Download,
  RefreshCw,
  Eye,
  Edit,
  Calendar
} from 'lucide-react';
import { dashboardAPI, clientAPI, notificationAPI, exportAPI } from '../../services/api';
import { calculateDaysRemaining, formatDate, getDaysRemainingText } from '../../utils/dateHelpers';
import StatusBadge from '../common/StatusBadge';
import Table from '../common/Table';

const Dashboard = ({ onViewChange }) => {
  const [stats, setStats] = useState({
    total_clients: 0,
    active_certificates: 0,
    expiring_soon: 0,
    expired_certificates: 0
  });
  const [expiringSoonClients, setExpiringSoonClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsResponse, expiringSoonResponse] = await Promise.all([
        dashboardAPI.getStats(),
        dashboardAPI.getExpiringSoon()
      ]);

      setStats(statsResponse.data || {
        total_clients: 0,
        active_certificates: 0,
        expiring_soon: 0,
        expired_certificates: 0
      });

      setExpiringSoonClients(expiringSoonResponse.data || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleManualCheck = async () => {
    setRefreshing(true);
    try {
      await notificationAPI.triggerManualCheck();
      await fetchDashboardData();
      alert('Manual notification check completed successfully!');
    } catch (error) {
      console.error('Error triggering manual check:', error);
      alert('Error triggering manual check. Please try again.');
    } finally {
      setRefreshing(false);
    }
  };

  const handleExportExcel = async () => {
    try {
      const response = await exportAPI.exportToExcel();

      // Create download link
      const dataStr = JSON.stringify(response.data, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });

      const url = window.URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = response.filename || 'iso_clients_export.json';

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);

      alert('Data exported successfully!');
    } catch (error) {
      console.error('Error exporting data:', error);
      alert('Error exporting data. Please try again.');
    }
  };

  const statCards = [
    {
      title: 'Total Clients',
      value: stats.total_clients,
      icon: Users,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Active Certificates',
      value: stats.active_certificates,
      icon: CheckCircle,
      color: 'bg-green-500',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Expiring Soon (≤30d)',
      value: stats.expiring_soon,
      icon: AlertTriangle,
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50'
    },
    {
      title: 'Expired Certificates',
      value: stats.expired_certificates,
      icon: XCircle,
      color: 'bg-red-500',
      bgColor: 'bg-red-50'
    }
  ];

  const tableColumns = [
    {
      header: 'Client Name',
      accessor: 'client_name'
    },
    {
      header: 'Business Type',
      accessor: 'business_type'
    },
    {
      header: 'Location',
      accessor: 'client_location'
    },
    {
      header: 'Expiry Date',
      cell: (row) => (
        <div className="flex items-center">
          <Calendar size={16} className="text-gray-400 mr-2" />
          {formatDate(row.certificate_expiry_date, 'MMM dd, yyyy')}
        </div>
      )
    },
    {
      header: 'Days Remaining',
      cell: (row) => (
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
          row.days_remaining <= 5 ? 'bg-red-100 text-red-800' :
          row.days_remaining <= 30 ? 'bg-yellow-100 text-yellow-800' :
          'bg-green-100 text-green-800'
        }`}>
          {getDaysRemainingText(row.days_remaining)}
        </span>
      )
    },
    {
      header: 'Status',
      cell: (row) => (
        <StatusBadge status={row.status} daysRemaining={row.days_remaining} />
      )
    },
    {
      header: 'Actions',
      cell: (row) => (
        <div className="flex space-x-2">
          <button
            className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
            title="View Details"
          >
            <Eye size={16} />
          </button>
          <button
            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded"
            title="Edit Client"
          >
            <Edit size={16} />
          </button>
        </div>
      )
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">ISO Certificate Management Overview</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleManualCheck}
            disabled={refreshing}
            className="btn-secondary flex items-center"
          >
            <RefreshCw size={16} className={`mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Checking...' : 'Run Manual Check'}
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div key={index} className={`card ${card.bgColor}`}>
              <div className="flex items-center">
                <div className={`flex-shrink-0 ${card.color} rounded-lg p-3`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    {card.title}
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {card.value}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Critical Alerts Table */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              ⚠️ Certificates Expiring Within 30 Days
            </h2>
            <p className="text-sm text-gray-600">
              Clients requiring immediate attention
            </p>
          </div>
          <div className="text-sm text-gray-500">
            {expiringSoonClients.length} of {stats.total_clients} clients
          </div>
        </div>

        <Table
          columns={tableColumns}
          data={expiringSoonClients.map(client => ({
            ...client,
            highlight: client.days_remaining <= 5
          }))}
        />

        {expiringSoonClients.length === 0 && (
          <div className="text-center py-12">
            <CheckCircle size={48} className="mx-auto text-green-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              All certificates are healthy!
            </h3>
            <p className="text-gray-500">
              No certificates are expiring within the next 30 days.
            </p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => onViewChange('clients')}
            className="btn-primary flex items-center justify-center"
          >
            <Plus size={20} className="mr-2" />
            Add New Client
          </button>
          <button
            onClick={handleExportExcel}
            className="btn-secondary flex items-center justify-center"
          >
            <Download size={20} className="mr-2" />
            Export All Data to Excel
          </button>
          <button
            onClick={handleManualCheck}
            disabled={refreshing}
            className="btn-warning flex items-center justify-center"
          >
            <RefreshCw size={20} className={`mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Running Check...' : 'Run Manual Notification Check'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;