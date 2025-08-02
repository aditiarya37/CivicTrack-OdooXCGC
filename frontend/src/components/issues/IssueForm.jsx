// src/components/issues/IssueForm.jsx
import React, { useState, useEffect } from 'react';
import { Camera, MapPin, User, Eye, EyeOff } from 'lucide-react';
import { ISSUE_CATEGORIES } from '../../utils/constants';
import { getCurrentLocation, reverseGeocode } from '../../services/location';
import api from '../../services/api';

function IssueForm({ onSubmitSuccess, isSubmitting, setIsSubmitting }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    latitude: '',
    longitude: '',
    address: '',
    isAnonymous: false
  });
  const [photos, setPhotos] = useState([]);
  const [locationLoading, setLocationLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setError('');
  };

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 3) {
      setError('You can upload maximum 3 photos');
      return;
    }
    
    // Validate file size (5MB max per file)
    const oversizedFiles = files.filter(file => file.size > 5 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      setError('Each photo must be less than 5MB');
      return;
    }

    setPhotos(files);
    setError('');
  };

  const getCurrentLocationData = async () => {
    setLocationLoading(true);
    try {
      const location = await getCurrentLocation();
      const address = await reverseGeocode(location.latitude, location.longitude);
      
      setFormData(prev => ({
        ...prev,
        latitude: location.latitude.toString(),
        longitude: location.longitude.toString(),
        address: address
      }));
    } catch (error) {
      setError('Failed to get your location. Please enter manually or try again.');
    } finally {
      setLocationLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const submitFormData = new FormData();
      
      // Append form fields
      Object.keys(formData).forEach(key => {
        submitFormData.append(key, formData[key]);
      });
      
      // Append photos
      photos.forEach(photo => {
        submitFormData.append('photos', photo);
      });

      await api.post('/issues', submitFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setSuccess('Issue reported successfully! Redirecting...');
      onSubmitSuccess();
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to submit issue. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const removePhoto = (index) => {
    const newPhotos = photos.filter((_, i) => i !== index);
    setPhotos(newPhotos);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
          {success}
        </div>
      )}

      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
          Issue Title *
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          maxLength={200}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Brief description of the issue"
        />
        <p className="mt-1 text-xs text-gray-500">{formData.title.length}/200 characters</p>
      </div>

      {/* Category */}
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
          Category *
        </label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select a category</option>
          {ISSUE_CATEGORIES.map(category => (
            <option key={category.id} value={category.id}>
              {category.icon} {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
          Detailed Description *
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          rows={4}
          maxLength={1000}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Provide detailed information about the issue, including when you noticed it and any relevant context"
        />
        <p className="mt-1 text-xs text-gray-500">{formData.description.length}/1000 characters</p>
      </div>

      {/* Location */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Location *
          </label>
          <button
            type="button"
            onClick={getCurrentLocationData}
            disabled={locationLoading}
            className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <MapPin size={14} className="mr-1" />
            {locationLoading ? 'Getting Location...' : 'Use Current Location'}
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="latitude" className="block text-xs font-medium text-gray-500 mb-1">
              Latitude
            </label>
            <input
              type="number"
              id="latitude"
              name="latitude"
              value={formData.latitude}
              onChange={handleChange}
              required
              step="any"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 40.7128"
            />
          </div>
          <div>
            <label htmlFor="longitude" className="block text-xs font-medium text-gray-500 mb-1">
              Longitude
            </label>
            <input
              type="number"
              id="longitude"
              name="longitude"
              value={formData.longitude}
              onChange={handleChange}
              required
              step="any"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., -74.0060"
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="address" className="block text-xs font-medium text-gray-500 mb-1">
            Address/Landmark
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Street address or nearby landmark"
          />
        </div>
      </div>

      {/* Photos */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Photos (Optional)
        </label>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
          <div className="space-y-1 text-center">
            <Camera className="mx-auto h-12 w-12 text-gray-400" />
            <div className="flex text-sm text-gray-600">
              <label htmlFor="photos" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                <span>Upload photos</span>
                <input
                  id="photos"
                  name="photos"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="sr-only"
                />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB each (max 3 photos)</p>
          </div>
        </div>

        {/* Photo Preview */}
        {photos.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Photos:</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {photos.map((photo, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(photo)}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-24 object-cover rounded-md border border-gray-300"
                  />
                  <button
                    type="button"
                    onClick={() => removePhoto(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Anonymous Reporting */}
      <div className="flex items-center">
        <input
          id="isAnonymous"
          name="isAnonymous"
          type="checkbox"
          checked={formData.isAnonymous}
          onChange={handleChange}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="isAnonymous" className="ml-2 block text-sm text-gray-700">
          Report anonymously (your name will not be shown publicly)
        </label>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 border border-transparent text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Submitting...
            </div>
          ) : (
            'Submit Issue'
          )}
        </button>
      </div>
    </form>
  );
}

export default IssueForm;
