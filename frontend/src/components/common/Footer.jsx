// src/components/common/Footer.jsx
import React from 'react';

function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">CivicTrack</h3>
          <p className="text-gray-400 text-sm">
            Empowering citizens to report and track local issues for a better community.
          </p>
          <div className="mt-4 text-gray-500 text-xs">
            © 2025 CivicTrack. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;