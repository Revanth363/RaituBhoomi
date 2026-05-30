import React, { useState } from 'react';
import laborService from '../../services/laborService';

const AvailabilityForm = ({ currentTravel, onUpdate }) => {
  const [willingTravel, setWillingTravel] = useState(currentTravel || 'same_village');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await laborService.updateAvailability(willingTravel);
      if (onUpdate) onUpdate(willingTravel);
      alert('Availability updated successfully!');
    } catch (error) {
      alert('Failed to update availability');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6" data-testid="availability-form">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Work Availability Settings</h3>
      <form onSubmit={handleSubmit}>
        <div className="space-y-3">
          <label className="block">
            <div className="text-sm font-medium text-gray-700 mb-2">
              How far are you willing to travel for work?
            </div>
            <div className="space-y-2">
              <label className="flex items-center space-x-3 p-3 border rounded hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  name="travel"
                  value="same_village"
                  checked={willingTravel === 'same_village'}
                  onChange={(e) => setWillingTravel(e.target.value)}
                  className="text-green-600 focus:ring-green-500"
                />
                <div>
                  <div className="font-medium">Same Village Only</div>
                  <div className="text-sm text-gray-600">Only work in your home village</div>
                </div>
              </label>

              <label className="flex items-center space-x-3 p-3 border rounded hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  name="travel"
                  value="nearby_villages"
                  checked={willingTravel === 'nearby_villages'}
                  onChange={(e) => setWillingTravel(e.target.value)}
                  className="text-green-600 focus:ring-green-500"
                />
                <div>
                  <div className="font-medium">Nearby Villages</div>
                  <div className="text-sm text-gray-600">Work in neighboring villages</div>
                </div>
              </label>

              <label className="flex items-center space-x-3 p-3 border rounded hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  name="travel"
                  value="mandal_level"
                  checked={willingTravel === 'mandal_level'}
                  onChange={(e) => setWillingTravel(e.target.value)}
                  className="text-green-600 focus:ring-green-500"
                />
                <div>
                  <div className="font-medium">Mandal Level</div>
                  <div className="text-sm text-gray-600">Work anywhere in your mandal</div>
                </div>
              </label>
            </div>
          </label>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded disabled:opacity-50 transition"
          data-testid="save-availability-button"
        >
          {saving ? 'Saving...' : 'Save Availability'}
        </button>
      </form>
    </div>
  );
};

export default AvailabilityForm;
