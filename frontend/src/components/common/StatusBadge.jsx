import { getStatusBadgeColor, getStatusText } from '../../utils/dateHelpers';

const StatusBadge = ({ status, daysRemaining }) => {
  const badgeColor = getStatusBadgeColor(daysRemaining, status);
  const statusText = getStatusText(daysRemaining, status);

  const getColorClass = (color) => {
    switch (color) {
      case 'success':
        return 'badge-success';
      case 'warning':
        return 'badge-warning';
      case 'danger':
        return 'badge-danger';
      case 'info':
        return 'badge-info';
      case 'black':
        return 'badge-black';
      default:
        return 'badge-info';
    }
  };

  return (
    <span className={getColorClass(badgeColor)}>
      {statusText}
    </span>
  );
};

export default StatusBadge;