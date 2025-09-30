import { differenceInDays } from 'date-fns';

export const calculateDaysRemaining = (expiryDate) => {
  const today = new Date();
  const expiry = new Date(expiryDate);
  return differenceInDays(expiry, today);
};

export const getStatusBadgeColor = (daysRemaining, status) => {
  if (status === 'Expired') return 'danger';
  if (daysRemaining <= 5) return 'warning';
  if (daysRemaining <= 30) return 'info';
  return 'success';
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const createResponse = (success, data = null, message = '', error = null) => {
  return {
    success,
    data,
    message,
    error
  };
};

export const createPaginationResponse = (data, total, page, limit) => {
  const totalPages = Math.ceil(total / limit);

  return {
    success: true,
    data,
    pagination: {
      total,
      page: parseInt(page),
      pages: totalPages,
      limit: parseInt(limit)
    }
  };
};