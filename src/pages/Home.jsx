import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Satellite, Brain, TrendingUp, Users, Shield, Zap, Globe, BarChart3, MapPin, Activity, Sparkles, DollarSign, Tractor, CheckCircle2 } from 'lucide-react';

const Home = () => {
  const features = [
    {
      icon: <Satellite className="w-8 h-8" />,
      title: 'Satellite Data',
      description: 'Real-time monitoring using NASA SMAP, GPM, MODIS, and ERA5 open data.'
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: 'AI-Powered Insights',
      description: 'Get smart recommendations for irrigation, fertilization, and crop management.'
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: 'Predictive Analytics',
      description: 'Forecast soil health, predict yields, and plan ahead with confidence.'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'For All Farmers',
      description: 'Accessible technology designed for small farmers with limited resources.'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        className="relative bg-cover bg-center bg-no-repeat h-[700px] flex items-center"
        style={{
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=2070)',
        }}
      >
        <div className="container mx-auto px-4">
          <div className="max-w-4xl text-white">
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-extrabold mb-8 leading-tight drop-shadow-2xl">
              Empowering Small Farmers with AI and Open Data
            </h1>
            <p className="text-2xl md:text-3xl lg:text-4xl mb-10 text-gray-100 font-medium drop-shadow-lg">
              Monitor your crops, predict soil health, and get smart farming advice powered by AI.
            </p>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-bold text-lg px-8 py-4 rounded-lg transition-all transform hover:scale-105 shadow-lg"
            >
              Get Started
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Comparison Section - Small Farmer vs Big Company */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6">
              Why Choose Smart Field?
            </h2>
            <p className="text-2xl text-gray-600 max-w-3xl mx-auto font-medium">
              Enterprise-level technology, accessible to everyone
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto mb-16">
            {/* Small Farmer - Before */}
            <div className="bg-white rounded-2xl p-8 shadow-xl border-2 border-red-200">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                  <Users className="w-8 h-8 text-red-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Small Farmer</h3>
                  <p className="text-red-600 font-semibold">Without Smart Field</p>
                </div>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="text-red-500 text-xl">❌</span>
                  <span className="text-gray-700">No access to satellite data or weather forecasts</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 text-xl">❌</span>
                  <span className="text-gray-700">Guessing when to irrigate - wasting water and money</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 text-xl">❌</span>
                  <span className="text-gray-700">Can't afford expensive soil sensors ($500-$2000)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 text-xl">❌</span>
                  <span className="text-gray-700">No AI insights - relying only on experience</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 text-xl">❌</span>
                  <span className="text-gray-700">Lower yields, higher costs</span>
                </li>
              </ul>
            </div>

            {/* Small Farmer - After */}
            <div className="bg-gradient-to-br from-primary to-green-600 rounded-2xl p-8 shadow-2xl border-2 border-primary text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-full flex items-center justify-center">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">Small Farmer</h3>
                    <p className="text-green-100 font-semibold">With Smart Field ✨</p>
                  </div>
                </div>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-green-200 flex-shrink-0 mt-0.5" />
                    <span className="text-white font-medium">FREE access to NASA satellite data & AI insights</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-green-200 flex-shrink-0 mt-0.5" />
                    <span className="text-white font-medium">Know exactly when to irrigate - save 30% water</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-green-200 flex-shrink-0 mt-0.5" />
                    <span className="text-white font-medium">No expensive equipment needed - just a smartphone</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-green-200 flex-shrink-0 mt-0.5" />
                    <span className="text-white font-medium">AI recommendations like big companies use</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-green-200 flex-shrink-0 mt-0.5" />
                    <span className="text-white font-medium">Increase yields by 20-40%, reduce costs</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-green-500/5 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6">
              How It Works
            </h2>
            <p className="text-2xl text-gray-600 max-w-3xl mx-auto font-medium">
              Three simple steps to smarter farming
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
            {/* Step 1 */}
            <div className="relative group">
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-transparent hover:border-primary/20">
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary to-green-600 text-white rounded-2xl flex items-center justify-center mx-auto shadow-lg transform group-hover:scale-110 transition-transform">
                    <MapPin className="w-10 h-10" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center text-lg font-bold shadow-md">
                    1
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                  Register Your Fields
                </h3>
                <p className="text-gray-600 text-center text-lg leading-relaxed">
                  Add your field locations and basic information to get started with smart monitoring.
                </p>
              </div>
              {/* Connector line */}
              <div className="hidden md:block absolute top-1/3 -right-6 w-12 h-1 bg-gradient-to-r from-primary to-transparent"></div>
            </div>

            {/* Step 2 */}
            <div className="relative group">
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-transparent hover:border-primary/20">
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-600 to-green-700 text-white rounded-2xl flex items-center justify-center mx-auto shadow-lg transform group-hover:scale-110 transition-transform">
                    <Activity className="w-10 h-10" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center text-lg font-bold shadow-md">
                    2
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                  Monitor in Real-Time
                </h3>
                <p className="text-gray-600 text-center text-lg leading-relaxed">
                  View soil moisture, temperature, NDVI, and weather data updated daily from satellites.
                </p>
              </div>
              {/* Connector line */}
              <div className="hidden md:block absolute top-1/3 -right-6 w-12 h-1 bg-gradient-to-r from-green-600 to-transparent"></div>
            </div>

            {/* Step 3 */}
            <div className="relative group">
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-transparent hover:border-primary/20">
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-700 to-primary text-white rounded-2xl flex items-center justify-center mx-auto shadow-lg transform group-hover:scale-110 transition-transform">
                    <Sparkles className="w-10 h-10" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-10 h-10 bg-green-700 text-white rounded-full flex items-center justify-center text-lg font-bold shadow-md">
                    3
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                  Get AI Recommendations
                </h3>
                <p className="text-gray-600 text-center text-lg leading-relaxed">
                  Receive personalized advice on irrigation, fertilization, and crop care powered by AI.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-br from-primary via-green-600 to-green-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Powered by Cutting-Edge Technology
            </h2>
            <p className="text-xl text-gray-100 max-w-3xl mx-auto">
              Real-time data from multiple sources for the most accurate insights
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-center border border-white/20 hover:bg-white/20 transition-all transform hover:scale-105">
              <Globe className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-3xl font-bold mb-2">100%</h3>
              <p className="text-gray-100">Free & Open Source</p>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-center border border-white/20 hover:bg-white/20 transition-all transform hover:scale-105">
              <Zap className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-3xl font-bold mb-2">Real-Time</h3>
              <p className="text-gray-100">Daily Data Updates</p>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-center border border-white/20 hover:bg-white/20 transition-all transform hover:scale-105">
              <BarChart3 className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-3xl font-bold mb-2">AI-Powered</h3>
              <p className="text-gray-100">Smart Recommendations</p>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-center border border-white/20 hover:bg-white/20 transition-all transform hover:scale-105">
              <Shield className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-3xl font-bold mb-2">Secure</h3>
              <p className="text-gray-100">Your Data Protected</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Transform Your Farming?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-gray-300">
            Join thousands of farmers already using AI to improve their yields and reduce costs.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-bold text-lg px-10 py-5 rounded-lg transition-all transform hover:scale-105 shadow-2xl"
          >
            Start Free Today
            <ArrowRight className="w-6 h-6" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
