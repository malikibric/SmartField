/**
 * API Service for Pametna Njiva
 * Connects React frontend to Flask AI backend
 */

const API_BASE_URL = 'http://localhost:5000/api';

/**
 * Fetch field data and AI recommendations for specific coordinates
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @returns {Promise<Object>} Field data with AI recommendations
 */
export const getFieldData = async (lat, lon) => {
  try {
    const response = await fetch(`${API_BASE_URL}/field-data?lat=${lat}&lon=${lon}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch field data');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching field data:', error);
    // Fallback to mock data if backend is not available
    return getFallbackData(lat, lon);
  }
};

/**
 * Send message to AI chatbot
 * @param {string} message - User message
 * @param {Object} fieldData - Optional field data for context
 * @returns {Promise<Object>} Chatbot response
 */
export const sendChatMessage = async (message, fieldData = null) => {
  try {
    const response = await fetch(`${API_BASE_URL}/chatbot`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        fieldData
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to get chatbot response');
    }
    
    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error('Error sending chat message:', error);
    // Fallback to simple response
    return 'Izvините, trenutno ne mogu da odgovorim. Pokušajte ponovo.';
  }
};

/**
 * Check if backend is available
 * @returns {Promise<boolean>} Backend health status
 */
export const checkBackendHealth = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    const data = await response.json();
    return data.status === 'healthy';
  } catch (error) {
    console.error('Backend is not available:', error);
    return false;
  }
};

/**
 * Reload meteorological data from files
 * @returns {Promise<Object>} Reload status
 */
export const reloadData = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/reload-data`, {
      method: 'POST'
    });
    
    if (!response.ok) {
      throw new Error('Failed to reload data');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error reloading data:', error);
    throw error;
  }
};

/**
 * Get information about loaded data files
 * @returns {Promise<Object>} Data file information
 */
export const getDataInfo = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/data-info`);
    
    if (!response.ok) {
      throw new Error('Failed to get data info');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error getting data info:', error);
    return null;
  }
};

/**
 * Fallback data generator when backend is not available
 */
const getFallbackData = (lat, lon) => {
  const soilMoisture = Math.floor(Math.random() * 50) + 15;
  const precipitation = (Math.random() * 8).toFixed(1);
  const temperature = Math.floor(Math.random() * 15) + 18;
  const ndvi = (Math.random() * 0.6 + 0.2).toFixed(2);
  
  let status = 'healthy';
  let advice = 'Vaše polje je u dobrom stanju.';
  
  if (soilMoisture < 25) {
    status = 'critical';
    advice = '🚨 HITNO: Tlo je kritično suho. Zalijte odmah!';
  } else if (soilMoisture < 35) {
    status = 'warning';
    advice = '⚠️ Tlo je suho. Planirajte navodnjavanje u naredna 2-3 dana.';
  } else {
    advice = '✅ Odlična vlažnost tla! Navodnjavanje trenutno nije potrebno.';
  }
  
  return {
    lat,
    lon,
    status,
    soilMoisture,
    precipitation: parseFloat(precipitation),
    temperature,
    ndvi: parseFloat(ndvi),
    advice,
    priority: status === 'critical' ? 'urgent' : status === 'warning' ? 'high' : 'low'
  };
};
