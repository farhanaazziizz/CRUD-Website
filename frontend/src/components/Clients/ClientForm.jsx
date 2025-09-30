import { useState, useEffect } from 'react';
import { Save, X } from 'lucide-react';
import { formatDateForInput } from '../../utils/dateHelpers';

const ClientForm = ({ client, onSave, onCancel, isLoading }) => {
  const [formData, setFormData] = useState({
    client_name: '',
    business_type: '',
    client_address: '',
    client_location: '',
    certificate_expiry_date: '',
    last_audit_date: '',
    certification_body: '',
    contact_person: '',
    phone_email: '',
    status: 'Active'
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (client) {
      setFormData({
        client_name: client.client_name || '',
        business_type: client.business_type || '',
        client_address: client.client_address || '',
        client_location: client.client_location || '',
        certificate_expiry_date: formatDateForInput(client.certificate_expiry_date) || '',
        last_audit_date: formatDateForInput(client.last_audit_date) || '',
        certification_body: client.certification_body || '',
        contact_person: client.contact_person || '',
        phone_email: client.phone_email || '',
        status: client.status || 'Active'
      });
    }
  }, [client]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Required field validations
    const requiredFields = [
      'client_name', 'business_type', 'client_address', 'client_location',
      'certificate_expiry_date', 'last_audit_date', 'certification_body',
      'contact_person', 'phone_email'
    ];

    requiredFields.forEach(field => {
      if (!formData[field] || formData[field].trim() === '') {
        newErrors[field] = 'This field is required';
      }
    });

    // Date validations
    const today = new Date();
    const expiryDate = new Date(formData.certificate_expiry_date);
    const auditDate = new Date(formData.last_audit_date);

    if (formData.certificate_expiry_date && expiryDate <= today) {
      newErrors.certificate_expiry_date = 'Certificate expiry date must be in the future';
    }

    if (formData.last_audit_date && auditDate > today) {
      newErrors.last_audit_date = 'Last audit date cannot be in the future';
    }

    // Email format validation (basic)
    const emailRegex = /\S+@\S+\.\S+/;
    if (formData.phone_email && formData.phone_email.includes('@') && !emailRegex.test(formData.phone_email)) {
      newErrors.phone_email = 'Please enter a valid email format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      onSave(formData);
    }
  };

  const businessTypes = [
    'Manufacturing',
    'Construction',
    'Logistics',
    'Food Processing',
    'Textile',
    'Trading',
    'Agriculture',
    'Retail',
    'Shipping',
    'Services',
    'Healthcare',
    'Technology',
    'Other'
  ];

  const certificationBodies = [
    'TUV Rheinland',
    'SGS',
    'Bureau Veritas',
    'Sucofindo',
    'Lloyd\'s Register',
    'DNV GL',
    'BSI',
    'DEKRA',
    'Intertek',
    'Other'
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Client Name */}
        <div>
          <label htmlFor="client_name" className="block text-sm font-medium text-gray-700 mb-2">
            Client Name *
          </label>
          <input
            type="text"
            id="client_name"
            name="client_name"
            value={formData.client_name}
            onChange={handleInputChange}
            className={`input-field ${errors.client_name ? 'border-red-500' : ''}`}
            placeholder="Enter client name"
          />
          {errors.client_name && (
            <p className="text-red-500 text-xs mt-1">{errors.client_name}</p>
          )}
        </div>

        {/* Business Type */}
        <div>
          <label htmlFor="business_type" className="block text-sm font-medium text-gray-700 mb-2">
            Business Type *
          </label>
          <select
            id="business_type"
            name="business_type"
            value={formData.business_type}
            onChange={handleInputChange}
            className={`input-field ${errors.business_type ? 'border-red-500' : ''}`}
          >
            <option value="">Select business type</option>
            {businessTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          {errors.business_type && (
            <p className="text-red-500 text-xs mt-1">{errors.business_type}</p>
          )}
        </div>
      </div>

      {/* Client Address */}
      <div>
        <label htmlFor="client_address" className="block text-sm font-medium text-gray-700 mb-2">
          Client Address *
        </label>
        <textarea
          id="client_address"
          name="client_address"
          value={formData.client_address}
          onChange={handleInputChange}
          rows={3}
          className={`input-field ${errors.client_address ? 'border-red-500' : ''}`}
          placeholder="Enter full address"
        />
        {errors.client_address && (
          <p className="text-red-500 text-xs mt-1">{errors.client_address}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Client Location */}
        <div>
          <label htmlFor="client_location" className="block text-sm font-medium text-gray-700 mb-2">
            Client Location *
          </label>
          <input
            type="text"
            id="client_location"
            name="client_location"
            value={formData.client_location}
            onChange={handleInputChange}
            className={`input-field ${errors.client_location ? 'border-red-500' : ''}`}
            placeholder="e.g., Jakarta, Bandung"
          />
          {errors.client_location && (
            <p className="text-red-500 text-xs mt-1">{errors.client_location}</p>
          )}
        </div>

        {/* Status */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            className="input-field"
          >
            <option value="Active">Active</option>
            <option value="Expired">Expired</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Certificate Expiry Date */}
        <div>
          <label htmlFor="certificate_expiry_date" className="block text-sm font-medium text-gray-700 mb-2">
            Certificate Expiry Date *
          </label>
          <input
            type="date"
            id="certificate_expiry_date"
            name="certificate_expiry_date"
            value={formData.certificate_expiry_date}
            onChange={handleInputChange}
            className={`input-field ${errors.certificate_expiry_date ? 'border-red-500' : ''}`}
          />
          {errors.certificate_expiry_date && (
            <p className="text-red-500 text-xs mt-1">{errors.certificate_expiry_date}</p>
          )}
        </div>

        {/* Last Audit Date */}
        <div>
          <label htmlFor="last_audit_date" className="block text-sm font-medium text-gray-700 mb-2">
            Last Audit Date *
          </label>
          <input
            type="date"
            id="last_audit_date"
            name="last_audit_date"
            value={formData.last_audit_date}
            onChange={handleInputChange}
            className={`input-field ${errors.last_audit_date ? 'border-red-500' : ''}`}
          />
          {errors.last_audit_date && (
            <p className="text-red-500 text-xs mt-1">{errors.last_audit_date}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Certification Body */}
        <div>
          <label htmlFor="certification_body" className="block text-sm font-medium text-gray-700 mb-2">
            Certification Body *
          </label>
          <select
            id="certification_body"
            name="certification_body"
            value={formData.certification_body}
            onChange={handleInputChange}
            className={`input-field ${errors.certification_body ? 'border-red-500' : ''}`}
          >
            <option value="">Select certification body</option>
            {certificationBodies.map(body => (
              <option key={body} value={body}>{body}</option>
            ))}
          </select>
          {errors.certification_body && (
            <p className="text-red-500 text-xs mt-1">{errors.certification_body}</p>
          )}
        </div>

        {/* Contact Person */}
        <div>
          <label htmlFor="contact_person" className="block text-sm font-medium text-gray-700 mb-2">
            Contact Person *
          </label>
          <input
            type="text"
            id="contact_person"
            name="contact_person"
            value={formData.contact_person}
            onChange={handleInputChange}
            className={`input-field ${errors.contact_person ? 'border-red-500' : ''}`}
            placeholder="Enter contact person name"
          />
          {errors.contact_person && (
            <p className="text-red-500 text-xs mt-1">{errors.contact_person}</p>
          )}
        </div>
      </div>

      {/* Phone / Email */}
      <div>
        <label htmlFor="phone_email" className="block text-sm font-medium text-gray-700 mb-2">
          Phone / Email *
        </label>
        <input
          type="text"
          id="phone_email"
          name="phone_email"
          value={formData.phone_email}
          onChange={handleInputChange}
          className={`input-field ${errors.phone_email ? 'border-red-500' : ''}`}
          placeholder="e.g., 081234567890 / email@company.com"
        />
        {errors.phone_email && (
          <p className="text-red-500 text-xs mt-1">{errors.phone_email}</p>
        )}
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-4 pt-6 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="btn-secondary flex items-center"
          disabled={isLoading}
        >
          <X size={16} className="mr-2" />
          Cancel
        </button>
        <button
          type="submit"
          className="btn-primary flex items-center"
          disabled={isLoading}
        >
          <Save size={16} className="mr-2" />
          {isLoading ? 'Saving...' : client ? 'Update Client' : 'Save Client'}
        </button>
      </div>
    </form>
  );
};

export default ClientForm;