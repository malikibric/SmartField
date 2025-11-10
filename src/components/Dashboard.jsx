import React from 'react';
import { Droplets, CloudRain, Thermometer, Leaf, AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react';

const Dashboard = ({ fieldData }) => {
  if (!fieldData) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 h-full flex items-center justify-center">
        <div className="text-center text-gray-500">
          <AlertCircle className="w-12 h-12 mx-auto mb-3 text-gray-400" />
          <p className="text-lg">Click on the map to view data</p>
          <p className="text-sm mt-2">Select a field or click anywhere on the map</p>
        </div>
      </div>
    );
  }

  const getStatusIcon = () => {
    switch (fieldData.status) {
      case 'healthy':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'medium':
        return <AlertTriangle className="w-6 h-6 text-yellow-500" />;
      case 'dry':
        return <AlertCircle className="w-6 h-6 text-red-500" />;
      default:
        return <AlertCircle className="w-6 h-6 text-gray-500" />;
    }
  };

  const getStatusText = () => {
    switch (fieldData.status) {
      case 'healthy':
        return 'Healthy';
      case 'medium':
        return 'Medium';
      case 'dry':
        return 'Dry';
      default:
        return 'Unknown';
    }
  };

  const getStatusColor = () => {
    switch (fieldData.status) {
      case 'healthy':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'dry':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 h-full overflow-y-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Field Data</h2>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 ${getStatusColor()} inline-flex`}>
          {getStatusIcon()}
          <span className="font-semibold">Status: {getStatusText()}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Soil Moisture */}
        <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200">
          <div className="flex items-center gap-3 mb-2">
            <Droplets className="w-6 h-6 text-blue-600" />
            <h3 className="font-semibold text-gray-700">Soil Moisture</h3>
          </div>
          <p className="text-3xl font-bold text-blue-600">{fieldData.soilMoisture}%</p>
          <div className="mt-2 bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${Math.min(fieldData.soilMoisture, 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Precipitation */}
        <div className="bg-indigo-50 rounded-lg p-4 border-2 border-indigo-200">
          <div className="flex items-center gap-3 mb-2">
            <CloudRain className="w-6 h-6 text-indigo-600" />
            <h3 className="font-semibold text-gray-700">Precipitation</h3>
          </div>
          <p className="text-3xl font-bold text-indigo-600">{fieldData.precipitation} mm</p>
          <p className="text-sm text-gray-600 mt-1">Last 7 days</p>
        </div>

        {/* Temperature */}
        <div className="bg-orange-50 rounded-lg p-4 border-2 border-orange-200">
          <div className="flex items-center gap-3 mb-2">
            <Thermometer className="w-6 h-6 text-orange-600" />
            <h3 className="font-semibold text-gray-700">Temperature</h3>
          </div>
          <p className="text-3xl font-bold text-orange-600">{fieldData.temperature}°C</p>
          <p className="text-sm text-gray-600 mt-1">Current temperature</p>
        </div>

        {/* NDVI */}
        <div className="bg-green-50 rounded-lg p-4 border-2 border-green-200">
          <div className="flex items-center gap-3 mb-2">
            <Leaf className="w-6 h-6 text-green-600" />
            <h3 className="font-semibold text-gray-700">NDVI</h3>
          </div>
          <p className="text-3xl font-bold text-green-600">{fieldData.ndvi}</p>
          <p className="text-sm text-gray-600 mt-1">Plant health</p>
        </div>
      </div>

      {/* AI Advice */}
      <div className="bg-gradient-to-br from-primary-light to-green-50 rounded-xl p-6 border-2 border-primary shadow-lg">
        <h3 className="font-bold text-xl text-primary-dark mb-4 flex items-center gap-2">
          <Leaf className="w-6 h-6" />
          AI Recommendation
        </h3>
        <div className="text-gray-800 leading-relaxed space-y-3 whitespace-pre-line">
          {fieldData.advice.split('\n').map((line, index) => {
            // Check if line starts with emoji
            const hasEmoji = /^[🌾💧🌊💪⚠️☀️🌱📊🔍♻️🌍]/.test(line.trim());
            const isEcoTip = line.trim().startsWith('♻️');
            const isWarning = line.trim().startsWith('⚠️');
            return (
              <p key={index} className={`${hasEmoji ? 'font-medium text-base' : ''} ${isWarning ? 'text-red-700 font-semibold' : ''} ${isEcoTip ? 'text-green-700 font-semibold' : ''}`}>
                {line}
              </p>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="font-semibold text-gray-700 mb-3">Legend</h4>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-green-500"></div>
            <span>🟢 Healthy - NDVI {'>'} 0.6, Soil Moisture {'>'} 40%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
            <span>🟡 Medium - NDVI 0.4-0.6, Soil Moisture 25-40%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-red-500"></div>
            <span>🔴 Dry - NDVI {'<'} 0.4, Soil Moisture {'<'} 25%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
