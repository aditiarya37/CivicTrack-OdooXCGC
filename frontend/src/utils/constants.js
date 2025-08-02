// src/utils/constants.js
export const ISSUE_CATEGORIES = [
  { id: 'roads', name: 'Roads', icon: '🛣️', description: 'Potholes, obstructions' },
  { id: 'lighting', name: 'Lighting', icon: '💡', description: 'Broken or flickering lights' },
  { id: 'water', name: 'Water Supply', icon: '💧', description: 'Leaks, low pressure' },
  { id: 'cleanliness', name: 'Cleanliness', icon: '🗑️', description: 'Overflowing bins, garbage' },
  { id: 'safety', name: 'Public Safety', icon: '⚠️', description: 'Open manholes, exposed wiring' },
  { id: 'obstructions', name: 'Obstructions', icon: '🌳', description: 'Fallen trees, debris' }
];

export const ISSUE_STATUSES = [
  { id: 'reported', name: 'Reported', color: 'bg-yellow-100 text-yellow-800' },
  { id: 'in_progress', name: 'In Progress', color: 'bg-blue-100 text-blue-800' },
  { id: 'resolved', name: 'Resolved', color: 'bg-green-100 text-green-800' }
];

export const DISTANCE_OPTIONS = [
  { value: 1, label: '1 km' },
  { value: 3, label: '3 km' },
  { value: 5, label: '5 km' }
];