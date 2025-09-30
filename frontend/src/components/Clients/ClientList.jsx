import { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Calendar,
  AlertTriangle
} from 'lucide-react';
import { clientAPI } from '../../services/api';
import { formatDate, getDaysRemainingText } from '../../utils/dateHelpers';
import StatusBadge from '../common/StatusBadge';
import Table from '../common/Table';
import Modal from '../common/Modal';
import ClientForm from './ClientForm';
import ClientDetail from './ClientDetail';

const ClientList = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Modal states
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [viewingClient, setViewingClient] = useState(null);
  const [deletingClient, setDeletingClient] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  const itemsPerPage = 10;

  useEffect(() => {
    fetchClients();
  }, [currentPage, searchTerm, statusFilter]);

  const fetchClients = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm,
        status: statusFilter
      };

      const response = await clientAPI.getAll(params);

      setClients(response.data || []);
      setTotalPages(response.pagination?.pages || 1);
      setTotalCount(response.pagination?.total || 0);
    } catch (error) {
      console.error('Error fetching clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handleAddClient = async (formData) => {
    setFormLoading(true);
    try {
      await clientAPI.create(formData);
      setShowAddForm(false);
      fetchClients();
      alert('Client added successfully!');
    } catch (error) {
      console.error('Error adding client:', error);
      alert('Error adding client. Please try again.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleEditClient = async (formData) => {
    setFormLoading(true);
    try {
      await clientAPI.update(editingClient.id, formData);
      setEditingClient(null);
      fetchClients();
      alert('Client updated successfully!');
    } catch (error) {
      console.error('Error updating client:', error);
      alert('Error updating client. Please try again.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteClient = async () => {
    if (!deletingClient) return;

    try {
      await clientAPI.delete(deletingClient.id);
      setDeletingClient(null);
      fetchClients();
      alert('Client deleted successfully!');
    } catch (error) {
      console.error('Error deleting client:', error);
      alert('Error deleting client. Please try again.');
    }
  };

  const tableColumns = [
    {
      header: 'No',
      cell: (row, index) => ((currentPage - 1) * itemsPerPage) + index + 1
    },
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
      header: 'Certificate Expiry Date',
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
        <div className="flex items-center">
          {row.days_remaining < 30 && (
            <AlertTriangle size={16} className="text-red-500 mr-2" />
          )}
          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
            row.days_remaining < 0 ? 'bg-black text-white' :
            row.days_remaining < 30 ? 'bg-red-100 text-red-800' :
            row.days_remaining < 45 ? 'bg-yellow-100 text-yellow-800' :
            'bg-green-100 text-green-800'
          }`}>
            {getDaysRemainingText(row.days_remaining)}
          </span>
        </div>
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
            onClick={() => setViewingClient(row)}
            className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
            title="View Details"
          >
            <Eye size={16} />
          </button>
          <button
            onClick={() => setEditingClient(row)}
            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded"
            title="Edit Client"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => setDeletingClient(row)}
            className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
            title="Delete Client"
          >
            <Trash2 size={16} />
          </button>
        </div>
      )
    }
  ];

  const statusOptions = ['All', 'Active', 'Expired'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Client Management</h1>
          <p className="text-gray-600">Manage ISO certificate clients</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="btn-primary flex items-center"
        >
          <Plus size={20} className="mr-2" />
          Add New Client
        </button>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by client name, location, or business type..."
                value={searchTerm}
                onChange={handleSearch}
                className="input-field pl-10"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => handleStatusFilter(e.target.value)}
              className="input-field w-32"
            >
              {statusOptions.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Results info */}
        <div className="mt-4 text-sm text-gray-600">
          Showing {clients.length} of {totalCount} clients
          {searchTerm && (
            <span> matching "{searchTerm}"</span>
          )}
          {statusFilter !== 'All' && (
            <span> with status "{statusFilter}"</span>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="card">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            <Table
              columns={tableColumns}
              data={clients.map(client => ({
                ...client,
                highlight: client.days_remaining <= 5
              }))}
            />

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-between">
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
            )}
          </>
        )}
      </div>

      {/* Add Client Modal */}
      <Modal
        isOpen={showAddForm}
        onClose={() => setShowAddForm(false)}
        title="Add New Client"
        size="lg"
      >
        <ClientForm
          onSave={handleAddClient}
          onCancel={() => setShowAddForm(false)}
          isLoading={formLoading}
        />
      </Modal>

      {/* Edit Client Modal */}
      <Modal
        isOpen={!!editingClient}
        onClose={() => setEditingClient(null)}
        title="Edit Client"
        size="lg"
      >
        <ClientForm
          client={editingClient}
          onSave={handleEditClient}
          onCancel={() => setEditingClient(null)}
          isLoading={formLoading}
        />
      </Modal>

      {/* View Client Modal */}
      <Modal
        isOpen={!!viewingClient}
        onClose={() => setViewingClient(null)}
        title="Client Details"
        size="lg"
      >
        <ClientDetail
          client={viewingClient}
          onEdit={() => {
            setEditingClient(viewingClient);
            setViewingClient(null);
          }}
          onClose={() => setViewingClient(null)}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deletingClient}
        onClose={() => setDeletingClient(null)}
        title="Delete Client"
      >
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Delete Client?
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            Are you sure you want to delete:
          </p>
          <p className="font-semibold text-gray-900 mb-4">
            {deletingClient?.client_name}
          </p>
          <p className="text-sm text-gray-500 mb-6">
            This action cannot be undone. All related notifications will also be deleted.
          </p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => setDeletingClient(null)}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteClient}
              className="btn-danger"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ClientList;