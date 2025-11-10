import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import MyFields from './pages/MyFields';
import MapPage from './pages/MapPage';
import About from './pages/About';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <Navbar />
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/my-fields" element={<MyFields />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/about" element={<About />} />
        </Routes>
        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 py-4 mt-auto">
          <div className="container mx-auto px-4 text-center text-sm text-gray-600">
            <p>
              Smart Field © 2025 | GLOBAL HACKATHON - Malik Ibrić
            </p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
