// backend/utils/geocoding.js
const axios = require('axios');

const reverseGeocode = async (lat, lng) => {
  try {
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'CivicTrack/1.0'
        }
      }
    );
    return response.data.display_name || `${lat}, ${lng}`;
  } catch (error) {
    console.error('Geocoding error:', error);
    return `${lat}, ${lng}`;
  }
};

const geocode = async (address) => {
  try {
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`,
      {
        headers: {
          'User-Agent': 'CivicTrack/1.0'
        }
      }
    );
    
    if (response.data && response.data.length > 0) {
      return {
        latitude: parseFloat(response.data[0].lat),
        longitude: parseFloat(response.data[0].lon)
      };
    }
    return null;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
};

module.exports = { reverseGeocode, geocode };