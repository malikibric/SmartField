import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sprout, Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'My Fields', path: '/my-fields' },
    { name: 'AI Assistant', path: '/map' },
    { name: 'About Us', path: '/about' },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50 border-b-2 border-primary/10">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 text-primary hover:text-primary-dark transition-all transform hover:scale-105">
            <Sprout className="w-12 h-12" />
            <span className="text-3xl font-bold bg-gradient-to-r from-primary to-green-600 bg-clip-text text-transparent">Smart Field</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-lg font-semibold transition-all ${
                  isActive(link.path)
                    ? 'text-primary border-b-3 border-primary pb-1'
                    : 'text-gray-700 hover:text-primary hover:scale-105'
                }`}
              >
                {link.name}
              </Link>
            ))}
            
            <div className="flex items-center gap-4 ml-6">
              <Link
                to="/login"
                className="px-6 py-2.5 text-lg text-primary font-semibold hover:bg-primary-light rounded-lg transition-all transform hover:scale-105"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-6 py-2.5 text-lg bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-all transform hover:scale-105 shadow-md hover:shadow-lg"
              >
                Register
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    isActive(link.path)
                      ? 'bg-primary text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              
              <div className="flex flex-col gap-2 mt-2 pt-2 border-t border-gray-200">
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-center text-primary font-medium border-2 border-primary rounded-lg hover:bg-primary-light transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-center bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors"
                >
                  Register
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
