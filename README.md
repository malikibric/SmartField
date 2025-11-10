<<<<<<< HEAD
# 🌾 Pametna Njiva – AI Asistent za Poljoprivrednike

**Smart Field Monitoring System for Small Farmers**

Pametna Njiva is a responsive web application that helps small farmers monitor crop and soil health using open satellite data (NASA SMAP, GPM, MODIS, ERA5). The app is designed to be simple, fast, and accessible even on slow rural internet connections.

## 🎯 Purpose

This application addresses **SDG 10: Reduced Inequalities** by making AI-driven agricultural insights accessible to all farmers, regardless of their technical expertise or resources.

## ✨ Features

### 1. **Responsive Navigation**
- Modern navbar with logo and links
- Desktop: Horizontal menu with Home, My Fields, AI Assistant, About, Login, Register
- Mobile: Hamburger menu that expands to full navigation
- Active link highlighting
- Sticky header

### 2. **Landing Page**
- Hero section with compelling headline and background image
- "Empowering Small Farmers with AI and Open Data"
- Feature showcase (Satellite Data, AI Insights, Predictive Analytics, Accessibility)
- "How It Works" 3-step guide
- Call-to-action buttons leading to registration

### 3. **Authentication System**
- **Login Page**: Email/password form with validation
- **Register Page**: Comprehensive registration with name, email, password, confirm password
- Form validation with real-time error messages
- Demo mode (any credentials work for testing)
- Auto-redirect to My Fields after authentication

### 4. **My Fields Dashboard**
- Statistics overview: Total Fields, Healthy Fields, Average Moisture, Average Temperature
- Grid of field cards showing:
  - Field name and location (lat/lon)
  - Status badge (Healthy/Medium/Dry)
  - Soil moisture, Temperature, NDVI
  - Last update timestamp
  - "View on Map" button
- **"+ Add New Field"** button opens modal
- Add Field Modal with validation for name, latitude, longitude
- Data persistence using localStorage

### 5. **Interactive Map** (🆕 AI-Powered)
- Built with React-Leaflet
- Shows field locations in Bosnia and Herzegovina (Tuzla region)
- Color-coded markers indicate field health:
  - 🟢 **Green** - Healthy (NDVI > 0.6, moisture > 40%)
  - 🟡 **Yellow** - Medium stress (NDVI 0.4-0.6, moisture 25-40%)
  - 🔴 **Red** - Dry/stressed (NDVI < 0.4, moisture < 25%)
- **Click anywhere** on the map to get **real-time AI analysis** from meteorological data
- AI backend analyzes JSON/CSV data files and provides instant recommendations
- Click on existing field markers to see detailed information
- Integrates with My Fields (clicking "View on Map" centers on that field)

### 6. **Real-time Dashboard**
Displays comprehensive data for selected fields:
- **Vlažnost Tla** (Soil Moisture %) - with visual progress bar
- **Padavine** (Precipitation in mm) - last 7 days
- **Temperatura** (Temperature in °C) - current temperature
- **NDVI** (Vegetation Health Index) - satellite-derived health indicator
- **AI Preporuka** (AI Advice) - actionable recommendations in Bosnian
- Status legend explaining color codes

### 7. **AI Chatbot Assistant** (🆕 Powered by Backend AI)
- Floating chat bubble in bottom-right corner
- **Real AI responses** from Flask backend
- Conversational interface in Bosnian language
- Quick question buttons for common queries
- Typing indicator animation
- **Context-aware responses** based on actual field data:
  - Field conditions analysis
  - Irrigation recommendations
  - Weather forecasts
  - NDVI interpretation
  - Fertilization advice
- Fallback to mock data if backend unavailable

### 8. **About Page**
- Mission statement and project goals
- SDG 10: Reduced Inequalities explanation
- Technology overview (NASA SMAP, GPM, MODIS, ERA5)
- Team information and contact details

### 9. **Responsive Design**
- Mobile-first approach with Tailwind CSS
- Works seamlessly on desktop, tablet, and mobile devices
- Optimized for slow internet connections
- Soft green color scheme (#3CA65C, #EDF7ED)
- Modern UI with rounded cards and subtle shadows

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **Mapping**: Leaflet + React-Leaflet
- **Icons**: Lucide React
- **Language**: JavaScript (ES6+)

### Backend (NEW! 🎉)
- **Framework**: Flask 3.0
- **AI Engine**: Custom Python algorithms
- **Data Processing**: NumPy
- **CORS**: Flask-CORS
- **Language**: Python 3.8+

## 🚀 Quick Start

### Option 1: Using Startup Scripts (Recommended)

**1. Start Backend (AI Server):**
```bash
# Double-click or run:
start_backend.bat
```

**2. Start Frontend (Web App):**
```bash
# Double-click or run:
start_frontend.bat
```

**3. Open Browser:**
Navigate to `http://localhost:5173`

### Option 2: Manual Setup

**Backend:**
```bash
pip install -r requirements.txt
python ai_backend.py
```

**Frontend:**
```bash
npm install
npm run dev
```

## 📦 Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Build for production**:
   ```bash
   npm run build
   ```

4. **Preview production build**:
   ```bash
   npm run preview
   ```

## 🗂️ Project Structure

```
pametna-njiva/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx          # Responsive navigation bar
│   │   ├── Header.jsx          # Original header (legacy)
│   │   ├── Map.jsx             # Interactive Leaflet map
│   │   ├── Dashboard.jsx       # Data display panel
│   │   ├── Chatbot.jsx         # AI assistant chat interface
│   │   └── AddFieldModal.jsx   # Add field form modal
│   ├── pages/
│   │   ├── Home.jsx            # Landing page with hero
│   │   ├── Login.jsx           # Login form
│   │   ├── Register.jsx        # Registration form
│   │   ├── MyFields.jsx        # Fields dashboard
│   │   ├── MapPage.jsx         # Map view wrapper
│   │   └── About.jsx           # About page
│   ├── utils/
│   │   └── mockData.js         # Mock satellite data & chatbot responses
│   ├── App.jsx                 # Router setup & main layout
│   ├── main.jsx                # React entry point
│   └── index.css               # Global styles & Tailwind imports
├── public/                     # Static assets
├── index.html                  # HTML template
├── package.json                # Dependencies & scripts
├── vite.config.js              # Vite configuration
├── tailwind.config.js          # Tailwind CSS configuration
└── postcss.config.js           # PostCSS configuration
```

## 🤖 AI Backend (NEW!)

The application now includes a **complete AI backend** that analyzes meteorological data from JSON/CSV files!

### Features:
- **Real-time data analysis** from GRIB2-derived JSON/CSV files
- **Intelligent recommendations** for irrigation, fertilization, and crop care
- **Context-aware chatbot** in Bosnian language
- **Multi-factor analysis**: soil moisture, NDVI, temperature, precipitation
- **Priority-based alerts**: critical, warning, healthy status

### API Endpoints:

```bash
# Get field data and AI recommendations
GET /api/field-data?lat=43.34&lon=17.81

# Chat with AI assistant
POST /api/chatbot
Body: {"message": "Kakva je vlažnost tla?"}

# Health check
GET /api/health

# Reload meteorological data
POST /api/reload-data
```

### How It Works:
1. **Data Loading**: Automatically loads latest `farm_data_*.json` and `farm_data_*.csv` files
2. **AI Analysis**: Processes meteorological parameters (temperature, soil moisture, vegetation, etc.)
3. **Smart Recommendations**: Generates personalized advice based on:
   - Soil moisture levels
   - NDVI vegetation health index
   - Temperature conditions
   - Precipitation patterns
4. **Chatbot**: Provides conversational interface for farmers

### Data Sources:
The backend processes data from:
- **GRIB2 files** (GFS forecast data)
- **JSON exports** (meteorological parameters)
- **CSV exports** (tabular data)

See `AI_DOCUMENTATION.md` for complete API reference and `SETUP_GUIDE.md` for setup instructions.

## 🎨 Design System

### Colors
- **Primary Green**: `#3CA65C`
- **Light Green**: `#EDF7ED`
- **Dark Green**: `#2D8A47`

### Status Colors
- **Healthy**: Green (`#22c55e`)
- **Medium**: Yellow (`#eab308`)
- **Dry**: Red (`#ef4444`)

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🌍 Localization

All UI text is in **Bosnian** (Bosanski jezik):
- Vlažnost tla - Soil moisture
- Padavine - Precipitation
- Temperatura - Temperature
- Zdravlje biljaka - Plant health
- Preporuka - Recommendation

## 🚀 Future Enhancements

1. **Real API Integration**
   - Connect to NASA SMAP, GPM, MODIS, ERA5 APIs
   - Implement data caching for offline access

2. **User Authentication**
   - Allow farmers to save their field locations
   - Track historical data and trends

3. **Advanced Analytics**
   - Predictive models for crop yield
   - Disease detection using satellite imagery
   - Irrigation scheduling optimization

4. **Notifications**
   - SMS/email alerts for critical conditions
   - Weather warnings and frost alerts

5. **Multi-language Support**
   - Add Croatian, Serbian, English translations

6. **Offline Mode**
   - Progressive Web App (PWA) capabilities
   - Local data storage for areas with poor connectivity

## 🤝 Contributing

This project is designed for hackathons and educational purposes. Contributions are welcome!

## 📄 License

MIT License - Free to use for agricultural and educational purposes.

## 👥 Target Users

- Small-scale farmers in rural Bosnia and Herzegovina
- Agricultural cooperatives
- Extension workers and agricultural advisors
- Students and researchers in precision agriculture

## 🎓 Educational Value

This project demonstrates:
- Integration of satellite data for agriculture
- Responsive web design principles
- React component architecture
- Real-time data visualization
- AI-assisted decision making
- Accessibility and inclusive design

---

**Built with ❤️ for farmers everywhere**

*"Making AI-driven agriculture accessible to all"*
=======
# SmartField-GlobalhAIckathon
Smart Field project for global hackathon 2025. (AI platform for farmers)
>>>>>>> 03eee1214474d9385d02f8488ccbac99f0d75ecc
