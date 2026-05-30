import React, { useState } from 'react';

const ArchiveFilter = ({ onFilter }) => {
  const [crop, setCrop] = useState('');
  const [village, setVillage] = useState('');

  const applyFilters = () => {
    onFilter({ crop, village });
  };

  const resetFilters = () => {
    setCrop('');
    setVillage('');
    onFilter({ crop: '', village: '' });
  };

  return (
    <div className="space-y-4">

      {/* Crop Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Crop Type
        </label>
        <input
          type="text"
          placeholder="e.g. Paddy, Cotton"
          value={crop}
          onChange={(e) => setCrop(e.target.value)}
          onBlur={applyFilters}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
        />
      </div>

      {/* Village Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Village Name
        </label>
        <input
          type="text"
          placeholder="e.g. Narasannapeta"
          value={village}
          onChange={(e) => setVillage(e.target.value)}
          onBlur={applyFilters}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
        />
      </div>

      {/* Reset Button */}
      <button
        onClick={resetFilters}
        className="w-full mt-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 rounded-lg transition border border-gray-300"
      >
         Reset Filters
      </button>

    </div>
  );
};

export default ArchiveFilter;
