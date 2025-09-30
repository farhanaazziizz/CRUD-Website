import { differenceInDays, format, parseISO, isValid } from 'date-fns';

export const calculateDaysRemaining = (expiryDate) => {
  try {
    const today = new Date();
    const expiry = typeof expiryDate === 'string' ? parseISO(expiryDate) : expiryDate;

    if (!isValid(expiry)) {
      return 0;
    }

    return differenceInDays(expiry, today);
  } catch (error) {
    console.error('Error calculating days remaining:', error);
    return 0;
  }
};

export const formatDate = (date, formatString = 'PPP') => {
  try {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;

    if (!isValid(parsedDate)) {
      return 'Invalid Date';
    }

    return format(parsedDate, formatString);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid Date';
  }
};

export const formatDateForInput = (date) => {
  try {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;

    if (!isValid(parsedDate)) {
      return '';
    }

    return format(parsedDate, 'yyyy-MM-dd');
  } catch (error) {
    console.error('Error formatting date for input:', error);
    return '';
  }
};

export const getStatusBadgeColor = (daysRemaining, status) => {
  if (status === 'Expired') return 'danger';
  if (daysRemaining <= 5) return 'warning';
  if (daysRemaining <= 30) return 'info';
  return 'success';
};

export const getStatusText = (daysRemaining, status) => {
  if (status === 'Expired') return 'Expired';
  if (daysRemaining <= 0) return 'Expired';
  if (daysRemaining <= 5) return 'Critical';
  if (daysRemaining <= 30) return 'Warning';
  return 'Active';
};

export const getDaysRemainingText = (daysRemaining) => {
  if (daysRemaining < 0) {
    const daysPast = Math.abs(daysRemaining);
    return `${daysPast} day${daysPast === 1 ? '' : 's'} ago`;
  } else if (daysRemaining === 0) {
    return 'Today';
  } else if (daysRemaining === 1) {
    return 'Tomorrow';
  } else {
    return `${daysRemaining} days`;
  }
};