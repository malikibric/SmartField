import React from 'react';
import { Target, Heart } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">Smart Field</h1>
          <p className="text-xl text-gray-600">
            Technology that helps small farmers succeed!
          </p>
        </div>

        {/* Mission Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Target className="w-8 h-8 text-primary" />
            <h2 className="text-3xl font-bold text-gray-800">Our Mission</h2>
          </div>
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            Our mission is to empower small farmers with AI and open data to improve their farming practices and increase their yields.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
           Using open data from NASA and other sources, we provide free, accurate, and up-to-date information to help farmers make better decisions.
          </p>
        </div>

        {/* Team Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <Heart className="w-8 h-8 text-primary" />
            <h2 className="text-3xl font-bold text-gray-800">Our team</h2>
          </div>
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            Our team is made up of agronomists, computer scientists, and data scientists who are passionate about using technology to solve real-world problems and help communities.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            We are committed to making technology accessible to everyone and believe that small farmers deserve the same level of technology as large companies.
          </p>
        </div>

        {/* Contact CTA */}
        <div className="mt-12 text-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            Do you have questions or suggestions?
          </h3>
          <p className="text-gray-600 mb-6">
            Contact us on: <a href="mailto:info@smartfield.com" className="text-primary hover:underline">info@smartfield.com</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
