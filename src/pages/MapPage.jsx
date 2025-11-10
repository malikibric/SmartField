import React, { useState, useEffect } from 'react';
import Map from '../components/Map';
import Dashboard from '../components/Dashboard';
import Chatbot from '../components/Chatbot';

const MapPage = () => {
  const [selectedField, setSelectedField] = useState(null);

  useEffect(() => {
    // Check if there's a selected field from My Fields page
    const savedField = localStorage.getItem('selectedField');
    if (savedField) {
      const field = JSON.parse(savedField);
      setSelectedField(field);
      // Clear it after loading
      localStorage.removeItem('selectedField');
    }
  }, []);

  const handleFieldSelect = (fieldData) => {
    setSelectedField(fieldData);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="mb-4">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">AI Asistant - map of fields</h1>
          <p className="text-gray-600">Click on the map!</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-240px)]">
          {/* Map Section - Takes 2 columns on large screens */}
          <div className="lg:col-span-2 h-full min-h-[400px]">
            <Map onFieldSelect={handleFieldSelect} selectedField={selectedField} />
          </div>
          
          {/* Dashboard Section - Takes 1 column on large screens */}
          <div className="lg:col-span-1 h-full min-h-[400px]">
            <Dashboard fieldData={selectedField} />
          </div>
        </div>
      </main>

      {/* Chatbot */}
      <Chatbot />
    </div>
  );
};

export default MapPage;
