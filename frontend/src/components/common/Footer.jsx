import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8 mt-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">🌾 Raitu Bhoomi</h3>
            <p className="text-gray-400">
              Preserving agricultural knowledge and supporting farming communities
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-3">Purpose</h4>
            <p className="text-gray-400 text-sm">
              Recording and structuring the full farming lifecycle - time, effort, cost,
              labor, yield, and lived experience.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-3">Contact</h4>
            <p className="text-gray-400 text-sm">
              For support and inquiries about the platform
            </p>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400 text-sm">
          <p>&copy; 2025 Raitu Bhoomi. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
