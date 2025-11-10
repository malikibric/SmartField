import React from 'react';
import { Sprout } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-primary to-primary-dark text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-3">
          <Sprout className="w-8 h-8" />
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Smart Field</h1>
            <p className="text-sm md:text-base text-green-100">AI Assistant for Farmers</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
