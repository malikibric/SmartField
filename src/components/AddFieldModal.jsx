import React, { useState, useEffect } from 'react';
import { X, MapPin, Type, AlertCircle } from 'lucide-react';

const AddFieldModal = ({ isOpen, onClose, onAddField, editMode = false, fieldData = null }) => {
  const [formData, setFormData] = useState({
    name: '',
    lat: '',
    lon: ''
  });
  const [errors, setErrors] = useState({});

  // Populate form when editing
  useEffect(() => {
    if (editMode && fieldData) {
      setFormData({
        name: fieldData.name,
        lat: fieldData.lat.toString(),
        lon: fieldData.lon.toString()
      });
    } else {
      setFormData({ name: '', lat: '', lon: '' });
    }
  }, [editMode, fieldData, isOpen]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setErrors({
      ...errors,
      [e.target.name]: ''
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Ime polja je obavezno';
    }

    const lat = parseFloat(formData.lat);
    if (!formData.lat || isNaN(lat) || lat < -90 || lat > 90) {
      newErrors.lat = 'Unesite validnu geografsku širinu (-90 do 90)';
    }

    const lon = parseFloat(formData.lon);
    if (!formData.lon || isNaN(lon) || lon < -180 || lon > 180) {
      newErrors.lon = 'Unesite validnu geografsku dužinu (-180 do 180)';
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (editMode && fieldData) {
      // Update existing field
      const updatedField = {
        ...fieldData,
        name: formData.name,
        lat: parseFloat(formData.lat),
        lon: parseFloat(formData.lon),
        lastUpdate: new Date().toISOString()
      };
      onAddField(updatedField);
    } else {
      // Create new field object
      const newField = {
        id: Date.now(),
        name: formData.name,
        lat: parseFloat(formData.lat),
        lon: parseFloat(formData.lon),
        lastUpdate: new Date().toISOString(),
        soilMoisture: Math.floor(Math.random() * 50) + 15,
        temperature: Math.floor(Math.random() * 15) + 18,
        ndvi: parseFloat((Math.random() * 0.6 + 0.2).toFixed(2))
      };
      onAddField(newField);
    }
    
    // Reset form
    setFormData({ name: '', lat: '', lon: '' });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">
            {editMode ? 'Uredi Polje' : 'Dodaj Novo Polje'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Zatvori"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Field Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Ime polja
            </label>
            <div className="relative">
              <Type className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="npr. Polje Tuzla Sjever"
              />
            </div>
            {errors.name && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.name}
              </p>
            )}
          </div>

          {/* Latitude */}
          <div>
            <label htmlFor="lat" className="block text-sm font-medium text-gray-700 mb-2">
              Geografska širina (Latitude)
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                id="lat"
                name="lat"
                value={formData.lat}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
                  errors.lat ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="npr. 44.5475"
              />
            </div>
            {errors.lat && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.lat}
              </p>
            )}
          </div>

          {/* Longitude */}
          <div>
            <label htmlFor="lon" className="block text-sm font-medium text-gray-700 mb-2">
              Geografska dužina (Longitude)
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                id="lon"
                name="lon"
                value={formData.lon}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
                  errors.lon ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="npr. 18.6753"
              />
            </div>
            {errors.lon && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.lon}
              </p>
            )}
          </div>


          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Otkaži
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary-dark transition-colors shadow-md"
            >
              {editMode ? 'Sačuvaj Izmjene' : 'Dodaj Polje'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddFieldModal;
