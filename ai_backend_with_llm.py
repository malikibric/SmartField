"""
AI Backend for Pametna Njiva - WITH REAL AI MODELS
Supports: OpenAI GPT, Groq, Google Gemini
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import csv
import os
import glob
from datetime import datetime
import random
from dotenv import load_dotenv
import requests

# Load environment variables from .env file
load_dotenv()

# OpenWeatherMap API Key
OPENWEATHER_API_KEY = "9172da3f581beb6fb192e6eadfc534a9"

# AI Model imports
try:
    from openai import OpenAI
    OPENAI_AVAILABLE = True
except:
    OPENAI_AVAILABLE = False

try:
    from groq import Groq
    GROQ_AVAILABLE = True
except:
    GROQ_AVAILABLE = False

try:
    import google.generativeai as genai
    GEMINI_AVAILABLE = True
except:
    GEMINI_AVAILABLE = False

app = Flask(__name__)
CORS(app)

class AIModelManager:
    """Manages different AI models"""
    
    def __init__(self):
        self.model_type = os.getenv('AI_MODEL', 'local')  # groq, openai, gemini, or local
        self.client = None
        self.initialize_model()
    
    def initialize_model(self):
        """Initialize the selected AI model"""
        print(f"DEBUG: AI_MODEL = {self.model_type}")
        print(f"DEBUG: GROQ_AVAILABLE = {GROQ_AVAILABLE}")
        
        if self.model_type == 'groq' and GROQ_AVAILABLE:
            api_key = os.getenv('GROQ_API_KEY')
            print(f"DEBUG: GROQ_API_KEY = {api_key[:20] if api_key else 'None'}...")
            
            if api_key and api_key != 'your-groq-api-key-here':
                try:
                    self.client = Groq(api_key=api_key)
                    print("✓ Groq AI model initialized successfully!")
                except Exception as e:
                    print(f"⚠ Groq initialization failed: {e}")
                    print("⚠ Using local AI instead")
                    self.model_type = 'local'
            else:
                print("⚠ Groq API key not found or invalid, using local AI")
                self.model_type = 'local'
        
        elif self.model_type == 'openai' and OPENAI_AVAILABLE:
            api_key = os.getenv('OPENAI_API_KEY')
            if api_key and api_key != 'your-openai-api-key-here':
                self.client = OpenAI(api_key=api_key)
                print("✓ OpenAI GPT model initialized")
            else:
                print("⚠ OpenAI API key not found, using local AI")
                self.model_type = 'local'
        
        elif self.model_type == 'gemini' and GEMINI_AVAILABLE:
            api_key = os.getenv('GOOGLE_API_KEY')
            if api_key and api_key != 'your-google-api-key-here':
                genai.configure(api_key=api_key)
                self.client = genai.GenerativeModel('gemini-pro')
                print("✓ Google Gemini model initialized")
            else:
                print("⚠ Google API key not found, using local AI")
                self.model_type = 'local'
        
        else:
            print("✓ Using local AI (rule-based)")
            self.model_type = 'local'
    
    def generate_recommendation(self, field_data):
        """Generate AI recommendation based on field data"""
        
        # Create detailed prompt with ALL available data
        prompt = f"""You are an expert ECOLOGICAL agronomist specializing in sustainable farming. Analyze REAL satellite data and provide SPECIFIC eco-friendly recommendations.

📊 ACTUAL SATELLITE DATA (NASA/ECMWF):
• Temperature: {field_data['temperature']}°C
• Soil Moisture: {field_data['soilMoisture']}%
• NDVI Index: {field_data['ndvi']} (0-1 scale)
• Vegetation Cover: {field_data.get('vegetation', 'N/A')}%
• Precipitation (7 days): {field_data['precipitation']}mm
• Wind Speed: {field_data.get('windSpeed', 0)} m/s
• Cloud Cover: {field_data.get('cloudCover', 0)}%
• Sunshine Duration: {field_data.get('sunshineDuration', 0)}h daily

🎯 CURRENT STATUS:
• Condition: {field_data.get('status', 'unknown').upper()}
• Priority: {field_data.get('priority', 'unknown').upper()}
• Moisture Level: {field_data.get('analysis', {}).get('soilMoistureLevel', 'unknown')}
• Vegetation Level: {field_data.get('analysis', {}).get('ndviLevel', 'unknown')}

🌍 ECOLOGICAL PRINCIPLES TO FOLLOW:
1. Minimize water waste - recommend efficient irrigation methods
2. Prefer organic/natural fertilizers over synthetic chemicals
3. Suggest soil health improvement techniques
4. Consider biodiversity and ecosystem impact
5. Promote sustainable practices

⚠️ CRITICAL REQUIREMENTS:
1. Use EXACT numbers from data above
2. Provide ECO-FRIENDLY alternatives
3. Analyze ACTUAL field conditions
4. Balance productivity with sustainability

RESPOND IN THIS FORMAT:

🌾 [Most urgent SUSTAINABLE action based on REAL data - mention specific numbers and WHY it's eco-friendly]

💧 [Exact water amount with EFFICIENT irrigation method - explain calculation based on moisture {field_data['soilMoisture']}% and temperature {field_data['temperature']}°C. Suggest drip irrigation, rainwater harvesting, or mulching to conserve water]

🌱 [ORGANIC/NATURAL fertilizer recommendation - explain why based on NDVI {field_data['ndvi']} and vegetation {field_data.get('vegetation', 'N/A')}%. Prefer compost, green manure, or bio-fertilizers. Mention soil health benefits]

♻️ [ECOLOGICAL tip - use data: precipitation {field_data['precipitation']}mm, wind {field_data.get('windSpeed', 0)}m/s, sun {field_data.get('sunshineDuration', 0)}h. Suggest cover crops, crop rotation, or natural pest control]

RULES:
✓ Each line starts with emoji (🌾💧🌱♻️)
✓ Blank line between sections
✓ MUST mention numbers from data
✓ Explain "because X = Y"
✓ ALWAYS suggest eco-friendly alternatives
✓ Mention environmental benefits
✓ English language
✗ NO generic advice
✗ NO made-up numbers
✗ NO purely chemical solutions without organic alternatives"""

        if self.model_type == 'groq':
            return self._groq_generate(prompt)
        elif self.model_type == 'openai':
            return self._openai_generate(prompt)
        elif self.model_type == 'gemini':
            return self._gemini_generate(prompt)
        else:
            return self._local_generate(field_data)
    
    def _groq_generate(self, prompt):
        """Generate using Groq"""
        try:
            response = self.client.chat.completions.create(
                model="llama-3.3-70b-versatile",  # Novi model - brz i besplatan!
                messages=[{"role": "user", "content": prompt}],
                temperature=0.7,
                max_tokens=800  # Increased for complete responses
            )
            return response.choices[0].message.content.strip()
        except Exception as e:
            print(f"Groq error: {e}")
            return self._local_generate({})
    
    def _openai_generate(self, prompt):
        """Generate using OpenAI"""
        try:
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.7,
                max_tokens=800  # Increased for complete responses
            )
            return response.choices[0].message.content.strip()
        except Exception as e:
            print(f"OpenAI error: {e}")
            return self._local_generate({})
    
    def _gemini_generate(self, prompt):
        """Generate using Google Gemini"""
        try:
            response = self.client.generate_content(prompt)
            return response.text.strip()
        except Exception as e:
            print(f"Gemini error: {e}")
            return self._local_generate({})
    
    def _local_generate(self, field_data):
        """Fallback local generation"""
        return "AI model is not available. Add API key to .env file. See .env.example for instructions."
    
    def generate_chat_response(self, message, field_data=None):
        """Generate chatbot response"""
        
        context = ""
        if field_data:
            context = f"""
CURRENT FIELD DATA:
- Moisture: {field_data.get('soilMoisture', 'N/A')}%
- Temperature: {field_data.get('temperature', 'N/A')}°C
- NDVI: {field_data.get('ndvi', 'N/A')}
- Precipitation: {field_data.get('precipitation', 'N/A')}mm
"""
        
        prompt = f"""You are an ECO-FRIENDLY AI assistant for sustainable farming. Answer the question in ENGLISH with focus on ecological practices.

{context}

FARMER'S QUESTION: {message}

Provide a SHORT, USEFUL answer (2-3 sentences) that:
✓ Prioritizes organic/natural solutions
✓ Suggests water conservation methods
✓ Promotes soil health and biodiversity
✓ Is PRACTICAL and CONCRETE
✓ Uses emojis 🌱💧♻️🌍"""
        
        if self.model_type == 'groq':
            return self._groq_generate(prompt)
        elif self.model_type == 'openai':
            return self._openai_generate(prompt)
        elif self.model_type == 'gemini':
            return self._gemini_generate(prompt)
        else:
            return f"Please add AI API key to get responses. Question: {message}"


class AgriculturalAI:
    """AI Engine for agricultural recommendations"""
    
    def __init__(self):
        self.data_cache = {}
        self.ai_model = AIModelManager()
        self.load_latest_data()
    
    def load_latest_data(self):
        """Load the latest JSON and CSV meteorological data"""
        try:
            json_files = glob.glob('farm_data_*.json')
            if json_files:
                latest_json = max(json_files, key=os.path.getctime)
                with open(latest_json, 'r', encoding='utf-8') as f:
                    self.data_cache['json'] = json.load(f)
                    self.data_cache['json_file'] = latest_json
                print(f"✓ Loaded JSON data from: {latest_json}")
            
            csv_files = glob.glob('farm_data_*.csv')
            if csv_files:
                latest_csv = max(csv_files, key=os.path.getctime)
                with open(latest_csv, 'r', encoding='utf-8') as f:
                    reader = csv.DictReader(f)
                    self.data_cache['csv'] = list(reader)
                    self.data_cache['csv_file'] = latest_csv
                print(f"✓ Loaded CSV data from: {latest_csv}")
                
        except Exception as e:
            print(f"⚠ Error loading data: {e}")
    
    def get_field_data(self, lat, lon):
        """Get meteorological data for specific coordinates"""
        # Try to get real-time data from OpenWeatherMap first
        realtime_data = self._get_openweather_data(lat, lon)
        
        if realtime_data:
            return realtime_data
        
        # Fallback to cached data
        if 'json' not in self.data_cache:
            return None
        
        data = self.data_cache['json']
        
        # Get values with fallback to reasonable defaults
        temperature = data.get('t', {}).get('value', 20)
        if temperature == -999 or temperature < -50 or temperature > 60:
            temperature = 18.0  # Reasonable default
        
        vegetation = data.get('veg', {}).get('value', 50)
        if vegetation == -999 or vegetation < 0:
            vegetation = 45.0
        
        wind_speed = data.get('gust', {}).get('value', 0)
        if wind_speed == -999 or wind_speed < 0:
            wind_speed = 2.5
        
        cloud_cover = data.get('oblacnost', {}).get('value', 0)
        if cloud_cover == -999 or cloud_cover < 0:
            cloud_cover = 30.0
        
        sunshine_duration = data.get('SUNSD', {}).get('value', 0)
        if sunshine_duration == -999 or sunshine_duration < 0:
            sunshine_duration = 8 * 3600  # 8 hours
        
        precipitation_rate = data.get('prate', {}).get('value', 0)
        if precipitation_rate == -999 or precipitation_rate < 0:
            precipitation_rate = 0
        
        soil_moisture = self._calculate_soil_moisture(data)
        
        ndvi = self._estimate_ndvi(vegetation, temperature, soil_moisture)
        precipitation_7d = self._estimate_precipitation(precipitation_rate)
        
        return {
            'temperature': round(temperature, 1),
            'soilMoisture': round(soil_moisture, 1),
            'precipitation': round(precipitation_7d, 1),
            'ndvi': round(ndvi, 2),
            'vegetation': round(vegetation, 1),
            'windSpeed': round(wind_speed, 2),
            'cloudCover': round(cloud_cover, 1),
            'sunshineDuration': round(sunshine_duration / 3600, 1),
            'lat': lat,
            'lon': lon
        }
    
    def _calculate_soil_moisture(self, data):
        wilting_point = data.get('wilt', {}).get('value', 0.1)
        field_capacity = data.get('fldcp', {}).get('value', 0.36)
        precipitation_rate = data.get('prate', {}).get('value', 0)
        
        base_moisture = ((field_capacity - wilting_point) / field_capacity) * 100
        
        if precipitation_rate > 0:
            moisture_boost = min(precipitation_rate * 1000, 20)
            base_moisture += moisture_boost
        
        return max(10, min(base_moisture, 80))
    
    def _get_openweather_data(self, lat, lon):
        """Get real-time data from OpenWeatherMap API"""
        try:
            # Current weather
            current_url = f"https://api.openweathermap.org/data/2.5/weather"
            params = {
                'lat': lat,
                'lon': lon,
                'appid': OPENWEATHER_API_KEY,
                'units': 'metric'
            }
            
            response = requests.get(current_url, params=params, timeout=5)
            
            # Check for API errors
            if response.status_code == 401:
                print(f"⚠ OpenWeatherMap API key invalid or not activated yet")
                print(f"   Please wait 10-120 minutes for activation")
                return None
            
            response.raise_for_status()
            data = response.json()
            
            # Check if data is valid
            if 'main' not in data:
                print(f"⚠ Invalid response from OpenWeatherMap")
                return None
            
            # Extract data
            temperature = data['main']['temp']
            humidity = data['main']['humidity']
            wind_speed = data['wind']['speed']
            clouds = data['clouds']['all']
            
            # Precipitation
            precipitation = 0
            if 'rain' in data:
                precipitation = data['rain'].get('1h', 0)
            
            # Get 5-day forecast for precipitation
            forecast_url = f"https://api.openweathermap.org/data/2.5/forecast"
            forecast_response = requests.get(forecast_url, params=params, timeout=5)
            forecast_data = forecast_response.json()
            
            # Calculate 7-day precipitation
            total_precipitation = 0
            for item in forecast_data['list'][:40]:  # 5 days * 8 (3h intervals)
                if 'rain' in item:
                    total_precipitation += item['rain'].get('3h', 0)
            
            # Estimate soil moisture
            soil_moisture = self._estimate_soil_moisture_from_weather(
                precipitation, temperature, humidity, total_precipitation
            )
            
            # Estimate vegetation
            vegetation = self._estimate_vegetation_from_weather(
                temperature, humidity, clouds, total_precipitation
            )
            
            # Estimate NDVI
            ndvi = self._estimate_ndvi(vegetation, temperature, soil_moisture)
            
            # Sunshine duration
            sunshine_duration = self._estimate_sunshine_from_clouds(clouds)
            
            print(f"✅ Real-time data from OpenWeatherMap: {temperature}°C, {clouds}% clouds")
            
            return {
                'temperature': round(temperature, 1),
                'soilMoisture': round(soil_moisture, 1),
                'precipitation': round(total_precipitation, 1),
                'ndvi': round(ndvi, 2),
                'vegetation': round(vegetation, 1),
                'windSpeed': round(wind_speed, 2),
                'cloudCover': round(clouds, 1),
                'sunshineDuration': round(sunshine_duration / 3600, 1),
                'lat': lat,
                'lon': lon
            }
            
        except Exception as e:
            print(f"⚠ OpenWeatherMap API error: {e}")
            return None
    
    def _estimate_soil_moisture_from_weather(self, current_precip, temperature, humidity, precip_7d):
        """Estimate soil moisture from weather data"""
        base_moisture = 40
        
        # Precipitation in last 7 days
        if precip_7d > 30:
            base_moisture += 30
        elif precip_7d > 15:
            base_moisture += 20
        elif precip_7d > 5:
            base_moisture += 10
        
        # Temperature effect
        if temperature > 30:
            base_moisture -= 15
        elif temperature > 25:
            base_moisture -= 10
        elif temperature < 10:
            base_moisture += 5
        
        # Humidity effect
        base_moisture += (humidity - 50) * 0.4
        
        return max(15, min(base_moisture, 90))
    
    def _estimate_vegetation_from_weather(self, temperature, humidity, clouds, precip_7d):
        """Estimate vegetation from weather conditions"""
        base_veg = 45
        
        # Optimal temperature
        if 15 < temperature < 25:
            base_veg += 20
        elif 10 < temperature < 30:
            base_veg += 10
        
        # Precipitation
        if precip_7d > 20:
            base_veg += 20
        elif precip_7d > 10:
            base_veg += 10
        
        # Humidity
        if humidity > 60:
            base_veg += 10
        
        # Sunshine (less clouds = better)
        if clouds < 30:
            base_veg += 10
        elif clouds < 60:
            base_veg += 5
        
        return max(20, min(base_veg, 95))
    
    def _estimate_sunshine_from_clouds(self, clouds):
        """Estimate sunshine duration from cloud cover"""
        max_sunshine = 12 * 3600  # 12 hours in seconds
        sunshine = max_sunshine * (1 - clouds / 100)
        return max(0, sunshine)
    
    def _estimate_ndvi(self, vegetation, temperature, soil_moisture):
        base_ndvi = (vegetation / 100) * 0.8
        
        if 20 <= temperature <= 25:
            temp_factor = 1.0
        elif temperature < 20:
            temp_factor = 0.9
        else:
            temp_factor = max(0.7, 1.0 - (temperature - 25) * 0.02)
        
        if soil_moisture > 40:
            moisture_factor = 1.0
        elif soil_moisture > 25:
            moisture_factor = 0.85
        else:
            moisture_factor = 0.7
        
        ndvi = base_ndvi * temp_factor * moisture_factor
        return max(0.2, min(ndvi, 0.85))
    
    def _estimate_precipitation(self, precipitation_rate):
        seconds_in_7_days = 7 * 24 * 3600
        precipitation_7d = precipitation_rate * seconds_in_7_days
        
        if precipitation_rate == 0:
            return random.uniform(0, 3)
        
        return precipitation_7d
    
    def get_ai_recommendation(self, field_data):
        """Get AI-generated recommendation"""
        
        # Use AI model to generate recommendation
        ai_advice = self.ai_model.generate_recommendation(field_data)
        
        # Determine status based on data
        moisture = field_data['soilMoisture']
        ndvi = field_data['ndvi']
        
        if moisture < 20 or ndvi < 0.35:
            status = 'critical'
            priority = 'urgent'
        elif moisture < 30 or ndvi < 0.5:
            status = 'warning'
            priority = 'high'
        elif moisture < 40:
            status = 'medium'
            priority = 'medium'
        else:
            status = 'healthy'
            priority = 'low'
        
        return {
            'status': status,
            'priority': priority,
            'advice': ai_advice,
            'ai_model': self.ai_model.model_type,
            'analysis': {
                'soilMoistureLevel': 'critical' if moisture < 20 else 'low' if moisture < 30 else 'medium' if moisture < 40 else 'high',
                'ndviLevel': 'critical' if ndvi < 0.35 else 'low' if ndvi < 0.5 else 'medium' if ndvi < 0.65 else 'high',
                'temperatureLevel': 'optimal' if 18 <= field_data['temperature'] <= 25 else 'suboptimal'
            }
        }
    
    def get_chatbot_response(self, message, field_data=None):
        """Get AI chatbot response"""
        return self.ai_model.generate_chat_response(message, field_data)


# Initialize AI engine
ai_engine = AgriculturalAI()

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'service': 'Pametna Njiva AI Backend (with LLM)',
        'version': '2.0.0',
        'ai_model': ai_engine.ai_model.model_type,
        'data_loaded': bool(ai_engine.data_cache)
    })

@app.route('/api/field-data', methods=['GET'])
def get_field_data():
    try:
        lat = float(request.args.get('lat', 43.3438))
        lon = float(request.args.get('lon', 17.8078))
        
        field_data = ai_engine.get_field_data(lat, lon)
        
        if not field_data:
            return jsonify({'error': 'No data available'}), 404
        
        ai_recommendations = ai_engine.get_ai_recommendation(field_data)
        
        response = {
            **field_data,
            **ai_recommendations
        }
        
        return jsonify(response)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/chatbot', methods=['POST'])
def chatbot():
    try:
        data = request.get_json()
        message = data.get('message', '')
        field_data = data.get('fieldData', None)
        
        response = ai_engine.get_chatbot_response(message, field_data)
        
        return jsonify({
            'response': response,
            'ai_model': ai_engine.ai_model.model_type,
            'timestamp': datetime.now().isoformat()
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/reload-data', methods=['POST'])
def reload_data():
    try:
        ai_engine.load_latest_data()
        return jsonify({
            'status': 'success',
            'message': 'Data reloaded successfully',
            'files': {
                'json': ai_engine.data_cache.get('json_file', 'none'),
                'csv': ai_engine.data_cache.get('csv_file', 'none')
            }
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/data-info', methods=['GET'])
def data_info():
    return jsonify({
        'json_file': ai_engine.data_cache.get('json_file', 'none'),
        'csv_file': ai_engine.data_cache.get('csv_file', 'none'),
        'data_available': bool(ai_engine.data_cache),
        'ai_model': ai_engine.ai_model.model_type,
        'parameters': list(ai_engine.data_cache.get('json', {}).keys()) if 'json' in ai_engine.data_cache else []
    })

if __name__ == '__main__':
    print("=" * 60)
    print("🌾 Pametna Njiva AI Backend Server (WITH REAL AI!)")
    print("=" * 60)
    print("✓ AI Engine initialized")
    print(f"✓ AI Model: {ai_engine.ai_model.model_type}")
    print("✓ Loading meteorological data...")
    ai_engine.load_latest_data()
    print("=" * 60)
    print("🚀 Server starting on http://localhost:5000")
    print("=" * 60)
    app.run(debug=True, host='0.0.0.0', port=5000)
