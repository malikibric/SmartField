// Mock field locations in Bosnia and Herzegovina (around Tuzla region)
export const mockFields = [
  {
    id: 1,
    name: 'Polje Tuzla Sjever',
    lat: 44.5475,
    lon: 18.6753,
    status: 'healthy',
    soilMoisture: 45,
    precipitation: 5.2,
    temperature: 24,
    ndvi: 0.72,
    advice: 'Vaše polje je u odličnom stanju. Nastavite sa redovnim održavanjem.'
  },
  {
    id: 2,
    name: 'Polje Lukavac',
    lat: 44.5392,
    lon: 18.5281,
    status: 'medium',
    soilMoisture: 28,
    precipitation: 1.8,
    temperature: 26,
    ndvi: 0.48,
    advice: 'Vegetacija pokazuje znakove stresa. Preporučuje se navodnjavanje u narednih 3 dana.'
  },
  {
    id: 3,
    name: 'Polje Živinice',
    lat: 44.4486,
    lon: 18.6489,
    status: 'dry',
    soilMoisture: 18,
    precipitation: 0.3,
    temperature: 29,
    ndvi: 0.31,
    advice: 'Tlo je suho – hitno zalijte u naredna 2 dana. Razmotriti sistem za navodnjavanje.'
  },
  {
    id: 4,
    name: 'Polje Gradačac',
    lat: 44.8789,
    lon: 18.4281,
    status: 'healthy',
    soilMoisture: 52,
    precipitation: 6.8,
    temperature: 23,
    ndvi: 0.78,
    advice: 'Odlično! Vlažnost tla je optimalna. Usevi rastu zdravo.'
  },
  {
    id: 5,
    name: 'Polje Srebrenik',
    lat: 44.7053,
    lon: 18.4847,
    status: 'medium',
    soilMoisture: 32,
    precipitation: 2.1,
    temperature: 27,
    ndvi: 0.52,
    advice: 'Umjerena vlažnost. Pratite vremenske prilike i planirajte navodnjavanje.'
  }
];

// Generate random field data for clicked location
export const generateMockData = (lat, lon) => {
  const soilMoisture = Math.floor(Math.random() * 50) + 15; // 15-65%
  const precipitation = (Math.random() * 8).toFixed(1); // 0-8mm
  const temperature = Math.floor(Math.random() * 15) + 18; // 18-33°C
  const ndvi = (Math.random() * 0.6 + 0.2).toFixed(2); // 0.2-0.8
  
  let status = 'healthy';
  let advice = 'Vaše polje je u dobrom stanju.';
  
  if (soilMoisture < 25) {
    status = 'dry';
    advice = 'Tlo je suho – hitno zalijte u naredna 2 dana.';
  } else if (soilMoisture < 35) {
    status = 'medium';
    advice = 'Umjerena vlažnost. Planirajte navodnjavanje uskoro.';
  } else {
    advice = 'Odlična vlažnost tla. Nastavite sa redovnim održavanjem.';
  }
  
  return {
    lat,
    lon,
    status,
    soilMoisture,
    precipitation: parseFloat(precipitation),
    temperature,
    ndvi: parseFloat(ndvi),
    advice
  };
};

// Mock chatbot responses
export const getChatbotResponse = (message) => {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('tuzla') || lowerMessage.includes('polje')) {
    return 'Vaše polje kod Tuzle pokazuje umjerenu vlažnost tla (32%). Preporučujem navodnjavanje u narednih 2-3 dana. NDVI indeks je 0.52, što ukazuje na blagi stres vegetacije.';
  } else if (lowerMessage.includes('suša') || lowerMessage.includes('suho')) {
    return 'Detektovao sam niska vlažnost tla na nekoliko lokacija. Preporučujem hitno navodnjavanje i razmatranje sistema za automatsko navodnjavanje.';
  } else if (lowerMessage.includes('kiša') || lowerMessage.includes('padavine')) {
    return 'Prema satelitskim podacima, očekuju se padavine od 3-5mm u naredna 3 dana. To bi trebalo poboljšati vlažnost tla.';
  } else if (lowerMessage.includes('ndvi') || lowerMessage.includes('zdravlje')) {
    return 'NDVI indeks pokazuje zdravlje vegetacije. Vrijednosti iznad 0.6 su odlične, 0.4-0.6 su umjerene, ispod 0.4 ukazuju na stres biljaka.';
  } else {
    return 'Mogu vam pomoći sa informacijama o vlažnosti tla, padavinama, temperaturi i zdravlju biljaka. Kliknite na mapu da vidite podatke za određenu lokaciju.';
  }
};
