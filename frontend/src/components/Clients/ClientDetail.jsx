import { Edit, X, Calendar, User, MapPin, Building, Award, Phone } from 'lucide-react';
import { formatDate, getDaysRemainingText } from '../../utils/dateHelpers';
import StatusBadge from '../common/StatusBadge';

const ClientDetail = ({ client, onEdit, onClose }) => {
  if (!client) return null;

  const detailSections = [
    {
      title: 'Client Information',
      icon: Building,
      fields: [
        { label: 'Client Name', value: client.client_name, icon: Building },
        { label: 'Business Type', value: client.business_type, icon: Award },
        { label: 'Location', value: client.client_location, icon: MapPin },
        { label: 'Address', value: client.client_address, icon: MapPin, isMultiline: true }
      ]
    },
    {
      title: 'Certificate Details',
      icon: Award,
      fields: [
        {
          label: 'Certificate Expiry Date',
          value: formatDate(client.certificate_expiry_date, 'PPPP'),
          icon: Calendar
        },
        {
          label: 'Days Remaining',
          value: getDaysRemainingText(client.days_remaining),
          icon: Calendar,
          badge: true
        },
        {
          label: 'Last Audit Date',
          value: formatDate(client.last_audit_date, 'PPPP'),
          icon: Calendar
        },
        {
          label: 'Certification Body',
          value: client.certification_body,
          icon: Award
        },
        {
          label: 'Status',
          value: <StatusBadge status={client.status} daysRemaining={client.days_remaining} />,
          icon: Award
        }
      ]
    },
    {
      title: 'Contact Information',
      icon: User,
      fields: [
        { label: 'Contact Person', value: client.contact_person, icon: User },
        { label: 'Phone / Email', value: client.phone_email, icon: Phone }
      ]
    }
  ];

  const getStatusColor = (daysRemaining) => {
    if (daysRemaining <= 5) return 'text-red-600 bg-red-50 border-red-200';
    if (daysRemaining <= 30) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-green-600 bg-green-50 border-green-200';
  };

  return (
    <div className="space-y-6">
      {/* Header with status indicator */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {client.client_name}
          </h2>
          <div className="flex items-center space-x-4">
            <StatusBadge status={client.status} daysRemaining={client.days_remaining} />
            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(client.days_remaining)}`}>
              {getDaysRemainingText(client.days_remaining)}
            </span>
          </div>
        </div>
      </div>

      {/* Certificate Status Alert */}
      {client.days_remaining <= 30 && (
        <div className={`p-4 rounded-lg border ${
          client.days_remaining <= 5
            ? 'bg-red-50 border-red-200'
            : 'bg-yellow-50 border-yellow-200'
        }`}>
          <div className="flex items-center">
            <Calendar size={20} className={`mr-3 ${
              client.days_remaining <= 5 ? 'text-red-600' : 'text-yellow-600'
            }`} />
            <div>
              <h4 className={`font-semibold ${
                client.days_remaining <= 5 ? 'text-red-800' : 'text-yellow-800'
              }`}>
                {client.days_remaining <= 5 ? 'Urgent: Certificate Expiring Soon!' : 'Certificate Expiring Soon'}
              </h4>
              <p className={`text-sm ${
                client.days_remaining <= 5 ? 'text-red-700' : 'text-yellow-700'
              }`}>
                Certificate expires on {formatDate(client.certificate_expiry_date, 'PPPP')}
                ({getDaysRemainingText(client.days_remaining)})
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Detail Sections */}
      {detailSections.map((section, sectionIndex) => {
        const SectionIcon = section.icon;

        return (
          <div key={sectionIndex} className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <div className="flex items-center">
                <SectionIcon size={20} className="text-gray-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">
                  {section.title}
                </h3>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {section.fields.map((field, fieldIndex) => {
                  const FieldIcon = field.icon;

                  return (
                    <div key={fieldIndex} className={field.isMultiline ? 'md:col-span-2' : ''}>
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mt-1">
                          <FieldIcon size={16} className="text-gray-400" />
                        </div>
                        <div className="ml-3 flex-1">
                          <dt className="text-sm font-medium text-gray-600 mb-1">
                            {field.label}
                          </dt>
                          <dd className={`text-sm text-gray-900 ${field.isMultiline ? 'whitespace-pre-line' : ''}`}>
                            {field.badge && typeof field.value === 'string' ? (
                              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                client.days_remaining <= 5 ? 'bg-red-100 text-red-800' :
                                client.days_remaining <= 30 ? 'bg-yellow-100 text-yellow-800' :
                                'bg-green-100 text-green-800'
                              }`}>
                                {field.value}
                              </span>
                            ) : (
                              field.value
                            )}
                          </dd>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}

      {/* Timestamps */}
      <div className="border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Record Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <dt className="text-sm font-medium text-gray-600 mb-1">Created At</dt>
            <dd className="text-sm text-gray-900">
              {client.created_at ? formatDate(client.created_at, 'PPPp') : 'N/A'}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-600 mb-1">Last Updated</dt>
            <dd className="text-sm text-gray-900">
              {client.updated_at ? formatDate(client.updated_at, 'PPPp') : 'N/A'}
            </dd>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-4 pt-6 border-t">
        <button
          onClick={onClose}
          className="btn-secondary flex items-center"
        >
          <X size={16} className="mr-2" />
          Close
        </button>
        <button
          onClick={onEdit}
          className="btn-primary flex items-center"
        >
          <Edit size={16} className="mr-2" />
          Edit Client
        </button>
      </div>
    </div>
  );
};

export default ClientDetail;