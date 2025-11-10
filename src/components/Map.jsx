import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, CircleMarker } from 'react-leaflet';
import L from 'leaflet';
import { mockFields, generateMockData } from '../utils/mockData';
import { getFieldData } from '../services/api';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom marker colors based on field status
const getMarkerColor = (status) => {
  switch (status) {
    case 'healthy':
      return '#22c55e'; // green
    case 'medium':
      return '#eab308'; // yellow
    case 'dry':
      return '#ef4444'; // red
    default:
      return '#3b82f6'; // blue
  }
};

const MapClickHandler = ({ onMapClick }) => {
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      onMapClick(lat, lng);
    },
  });
  return null;
};

const Map = ({ onFieldSelect, selectedField }) => {
  const center = [44.5475, 18.6753]; // Tuzla, Bosnia and Herzegovina
  const zoom = 10;
  const [isLoading, setIsLoading] = useState(false);

  const handleMapClick = async (lat, lng) => {
    setIsLoading(true);
    try {
      // Try to get data from AI backend
      const data = await getFieldData(lat, lng);
      onFieldSelect(data);
    } catch (error) {
      console.error('Error fetching field data:', error);
      // Fallback to mock data
      const data = generateMockData(lat, lng);
      onFieldSelect(data);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFieldClick = async (field) => {
    setIsLoading(true);
    try {
      // Get fresh data from AI backend for existing fields
      const data = await getFieldData(field.lat, field.lon);
      onFieldSelect({ ...field, ...data });
    } catch (error) {
      console.error('Error fetching field data:', error);
      // Use existing field data as fallback
      onFieldSelect(field);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full w-full rounded-lg overflow-hidden shadow-lg">
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapClickHandler onMapClick={handleMapClick} />
        
        {mockFields.map((field) => (
          <CircleMarker
            key={field.id}
            center={[field.lat, field.lon]}
            radius={12}
            pathOptions={{
              fillColor: getMarkerColor(field.status),
              fillOpacity: 0.7,
              color: getMarkerColor(field.status),
              weight: 2,
            }}
            eventHandlers={{
              click: () => handleFieldClick(field),
            }}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-bold text-lg mb-2">{field.name}</h3>
                <div className="space-y-1 text-sm">
                  <p><strong>Soil Moisture:</strong> {field.soilMoisture}%</p>
                  <p><strong>Precipitation:</strong> {field.precipitation} mm</p>
                  <p><strong>Temperature:</strong> {field.temperature}°C</p>
                  <p><strong>NDVI:</strong> {field.ndvi}</p>
                  <p className="mt-2 text-gray-600 italic">{field.advice}</p>
                </div>
              </div>
            </Popup>
          </CircleMarker>
        ))}
        
        {selectedField && !mockFields.find(f => f.lat === selectedField.lat && f.lon === selectedField.lon) && (
          <CircleMarker
            center={[selectedField.lat, selectedField.lon]}
            radius={10}
            pathOptions={{
              fillColor: getMarkerColor(selectedField.status),
              fillOpacity: 0.8,
              color: '#ffffff',
              weight: 2,
            }}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-bold text-lg mb-2">New Location</h3>
                <div className="space-y-1 text-sm">
                  <p><strong>Soil Moisture:</strong> {selectedField.soilMoisture}%</p>
                  <p><strong>Precipitation:</strong> {selectedField.precipitation} mm</p>
                  <p><strong>Temperature:</strong> {selectedField.temperature}°C</p>
                  <p><strong>NDVI:</strong> {selectedField.ndvi}</p>
                  <p className="mt-2 text-gray-600 italic">{selectedField.advice}</p>
                </div>
              </div>
            </Popup>
          </CircleMarker>
        )}
      </MapContainer>
    </div>
  );
};

export default Map;
