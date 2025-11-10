import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, MapPin, Droplets, Thermometer, Leaf, Calendar, Map as MapIcon, Edit2, Trash2 } from 'lucide-react';
import AddFieldModal from '../components/AddFieldModal';

const MyFields = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [fields, setFields] = useState([]);

  // Load fields from localStorage on mount
  useEffect(() => {
    const savedFields = localStorage.getItem('userFields');
    if (savedFields) {
      setFields(JSON.parse(savedFields));
    } else {
      // Initialize with some default fields
      const defaultFields = [
        {
          id: 1,
          name: 'Polje Tuzla Sjever',
          lat: 44.5475,
          lon: 18.6753,
          lastUpdate: new Date().toISOString(),
          soilMoisture: 45,
          temperature: 24,
          ndvi: 0.72
        },
        {
          id: 2,
          name: 'Polje Lukavac',
          lat: 44.5392,
          lon: 18.5281,
          lastUpdate: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          soilMoisture: 28,
          temperature: 26,
          ndvi: 0.48
        },
        {
          id: 3,
          name: 'Polje Živinice',
          lat: 44.4486,
          lon: 18.6489,
          lastUpdate: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
          soilMoisture: 18,
          temperature: 29,
          ndvi: 0.31
        }
      ];
      setFields(defaultFields);
      localStorage.setItem('userFields', JSON.stringify(defaultFields));
    }
  }, []);

  const handleAddField = (newField) => {
    const updatedFields = [...fields, newField];
    setFields(updatedFields);
    localStorage.setItem('userFields', JSON.stringify(updatedFields));
  };

  const handleEditField = (updatedField) => {
    const updatedFields = fields.map(field => 
      field.id === updatedField.id ? updatedField : field
    );
    setFields(updatedFields);
    localStorage.setItem('userFields', JSON.stringify(updatedFields));
  };

  const handleDeleteField = (fieldId) => {
    if (window.confirm('Da li ste sigurni da želite obrisati ovo polje?')) {
      const updatedFields = fields.filter(field => field.id !== fieldId);
      setFields(updatedFields);
      localStorage.setItem('userFields', JSON.stringify(updatedFields));
    }
  };

  const openEditModal = (field) => {
    setEditingField(field);
    setIsEditModalOpen(true);
  };

  const handleViewOnMap = (field) => {
    // Store selected field in localStorage and navigate to map
    localStorage.setItem('selectedField', JSON.stringify(field));
    navigate('/map');
  };

  const getStatusColor = (ndvi) => {
    if (ndvi >= 0.6) return 'text-green-600 bg-green-100';
    if (ndvi >= 0.4) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getStatusText = (ndvi) => {
    if (ndvi >= 0.6) return 'Zdravo';
    if (ndvi >= 0.4) return 'Umjereno';
    return 'Suho';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Danas';
    if (diffDays === 1) return 'Juče';
    if (diffDays < 7) return `Prije ${diffDays} dana`;
    return date.toLocaleDateString('bs-BA');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">My fields</h1>
          <p className="text-gray-600">Manage your fields</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Overall fields</p>
                <p className="text-3xl font-bold text-gray-800">{fields.length}</p>
              </div>
              <MapIcon className="w-10 h-10 text-primary" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Healthy fields</p>
                <p className="text-3xl font-bold text-green-600">
                  {fields.filter(f => f.ndvi >= 0.6).length}
                </p>
              </div>
              <Leaf className="w-10 h-10 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Average moisture</p>
                <p className="text-3xl font-bold text-blue-600">
                  {fields.length > 0 
                    ? Math.round(fields.reduce((sum, f) => sum + f.soilMoisture, 0) / fields.length)
                    : 0}%
                </p>
              </div>
              <Droplets className="w-10 h-10 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Average temperature</p>
                <p className="text-3xl font-bold text-orange-600">
                  {fields.length > 0 
                    ? Math.round(fields.reduce((sum, f) => sum + f.temperature, 0) / fields.length)
                    : 0}°C
                </p>
              </div>
              <Thermometer className="w-10 h-10 text-orange-600" />
            </div>
          </div>
        </div>

        {/* Add Field Button */}
        <div className="mb-6">
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-bold px-6 py-3 rounded-lg transition-colors shadow-md hover:shadow-lg"
          >
            <Plus className="w-5 h-5" />
            Add new field
          </button>
        </div>

        {/* Fields Grid */}
        {fields.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <MapIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">No fields added</h3>
            <p className="text-gray-600 mb-6">Add your first field to start tracking</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-bold px-6 py-3 rounded-lg transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add new field
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fields.map((field) => (
              <div
                key={field.id}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden"
              >
                {/* Card Header */}
                <div className="bg-gradient-to-r from-primary to-primary-dark p-4 text-white">
                  <h3 className="text-xl font-bold mb-1">{field.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-green-100">
                    <MapPin className="w-4 h-4" />
                    <span>{field.lat.toFixed(4)}, {field.lon.toFixed(4)}</span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5">
                  {/* Status Badge */}
                  <div className="mb-4">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(field.ndvi)}`}>
                      <span className="w-2 h-2 rounded-full bg-current"></span>
                      {getStatusText(field.ndvi)}
                    </span>
                  </div>

                  {/* Metrics */}
                  <div className="space-y-3 mb-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Droplets className="w-5 h-5 text-blue-500" />
                        <span className="text-sm">Moisture level</span>
                      </div>
                      <span className="font-bold text-gray-800">{field.soilMoisture}%</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Thermometer className="w-5 h-5 text-orange-500" />
                        <span className="text-sm">Temperature</span>
                      </div>
                      <span className="font-bold text-gray-800">{field.temperature}°C</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Leaf className="w-5 h-5 text-green-500" />
                        <span className="text-sm">NDVI</span>
                      </div>
                      <span className="font-bold text-gray-800">{field.ndvi}</span>
                    </div>
                  </div>

                  {/* Last Update */}
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-4 pb-4 border-b border-gray-200">
                    <Calendar className="w-4 h-4" />
                    <span>Ažurirano: {formatDate(field.lastUpdate)}</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    <button
                      onClick={() => handleViewOnMap(field)}
                      className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold py-2.5 rounded-lg transition-colors"
                    >
                      <MapIcon className="w-5 h-5" />
                      View on map
                    </button>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEditModal(field)}
                        className="flex-1 flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2.5 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                        Edit
                      </button>
                      
                      <button
                        onClick={() => handleDeleteField(field.id)}
                        className="flex-1 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-semibold py-2.5 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Field Modal */}
      <AddFieldModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddField={handleAddField}
      />

      {/* Edit Field Modal */}
      <AddFieldModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingField(null);
        }}
        onAddField={handleEditField}
        editMode={true}
        fieldData={editingField}
      />
    </div>
  );
};

export default MyFields;
