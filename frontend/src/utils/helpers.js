// src/utils/helpers.js
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const getStatusColor = (status) => {
  const statusMap = {
    'reported': 'bg-yellow-100 text-yellow-800',
    'in_progress': 'bg-blue-100 text-blue-800',
    'resolved': 'bg-green-100 text-green-800'
  };
  return statusMap[status] || 'bg-gray-100 text-gray-800';
};

export const getCategoryIcon = (category) => {
  const iconMap = {
    'roads': '🛣️',
    'lighting': '💡',
    'water': '💧',
    'cleanliness': '🗑️',
    'safety': '⚠️',
    'obstructions': '🌳'
  };
  return iconMap[category] || '📍';
};

export const truncateText = (text, maxLength = 100) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};