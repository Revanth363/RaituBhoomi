// src/pages/farmer/RecordHarvest.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import farmerService from '../../services/farmerService';
import Loader from '../../components/common/Loader';
import { formatCurrency } from '../../utils/costUtils';

const RecordHarvest = () => {
  const { seasonId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isLinkedToSharing, setIsLinkedToSharing] = useState(false);
  const [linkedSharingId, setLinkedSharingId] = useState(null);

  const [formData, setFormData] = useState({
    totalBags: '',
    weightPerBag: 83,
    pricePerBag: '',
    bagsToGive: '', // Will be auto-filled only once
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Check if linked to land sharing
  useEffect(() => {
    const checkLinkedSharing = async () => {
      try {
        const sharings = await farmerService.getLandSharings();
        const linked = sharings.find(
          s => s.cultivatorSeason?._id?.toString() === seasonId
        );
        if (linked) {
          setIsLinkedToSharing(true);
          setLinkedSharingId(linked._id);
        }
      } catch (error) {
        console.warn('Could not check land sharing link:', error);
      }
    };
    checkLinkedSharing();
  }, [seasonId]);

  // Auto-fill bagsToGive when totalBags is first entered (only if empty)
  useEffect(() => {
    if (isLinkedToSharing && formData.totalBags && !formData.bagsToGive) {
      setFormData(prev => ({
        ...prev,
        bagsToGive: formData.totalBags
      }));
    }
  }, [formData.totalBags, isLinkedToSharing]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.totalBags || !formData.pricePerBag) {
      alert('Please fill all required fields');
      return;
    }

    if (isLinkedToSharing && (!formData.bagsToGive || formData.bagsToGive < 0)) {
      alert('Please enter valid Bags to Give (must be 0 or more)');
      return;
    }

    if (!window.confirm('This will permanently lock the season. Are you sure?')) {
      return;
    }

    setLoading(true);

    const totalBags = Number(formData.totalBags);
    const pricePerBag = Number(formData.pricePerBag);
    const totalAmountReceived = totalBags * pricePerBag;
    const bagsToGive = isLinkedToSharing ? Number(formData.bagsToGive) : totalBags;

    try {
      await farmerService.recordHarvest(seasonId, {
        harvestDate: new Date().toISOString(),
        totalBags,
        weightPerBag: Number(formData.weightPerBag),
        pricePerBag,
        totalAmountReceived,
      });

      if (isLinkedToSharing && linkedSharingId) {
        await farmerService.updateLandSharingSettlement(linkedSharingId, {
          givenBags: bagsToGive,
          givenAmount: bagsToGive * pricePerBag,
        });
      }

      alert('Harvest recorded successfully! Season is now locked.');
      navigate('/farmer/dashboard');
    } catch (error) {
      console.error('Harvest recording failed:', error);
      alert('Failed to record harvest. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader text="Recording harvest..." />;

  const totalAmount = formData.totalBags && formData.pricePerBag
    ? Number(formData.totalBags) * Number(formData.pricePerBag)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Record Harvest & Lock Season
        </h2>

        <div className="bg-white rounded-xl shadow-md p-6">
          <p className="text-gray-700 text-center mb-8">
            Once harvest is recorded, this season will be <strong>permanently locked</strong> and no longer editable.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Total Bags */}
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">
                Total Bags Harvested
              </label>
              <input
                type="number"
                name="totalBags"
                value={formData.totalBags}
                onChange={handleChange}
                required
                min="1"
                placeholder="e.g., 120"
                className="w-full px-5 py-3 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            {/* Weight per Bag */}
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">
                Weight per Bag (kg)
              </label>
              <input
                type="number"
                name="weightPerBag"
                value={formData.weightPerBag}
                onChange={handleChange}
                required
                min="1"
                placeholder="Usually 83"
                className="w-full px-5 py-3 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            {/* Price per Bag */}
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">
                Price per Bag (₹)
              </label>
              <input
                type="number"
                name="pricePerBag"
                value={formData.pricePerBag}
                onChange={handleChange}
                required
                min="1"
                placeholder="e.g., 2200"
                className="w-full px-5 py-3 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            {/* Bags to Give - Only if linked */}
            {isLinkedToSharing && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <label className="block text-lg font-medium text-blue-900 mb-3">
                  Bags to Give to Land Owner
                </label>
                <p className="text-sm text-blue-800 mb-4">
                  Default: full yield ({formData.totalBags || 0} bags). You can reduce if keeping some.
                </p>
                <input
                  type="number"
                  name="bagsToGive"
                  value={formData.bagsToGive}
                  onChange={handleChange}
                  required
                  min="0"
                  max={formData.totalBags || undefined}
                  placeholder="Enter bags to give"
                  className="w-full px-5 py-3 border-2 border-blue-300 rounded-lg text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="text-sm text-blue-700 mt-3 font-medium">
                  Amount owner will receive: ₹{formatCurrency((formData.bagsToGive || 0) * (formData.pricePerBag || 0))}
                </p>
              </div>
            )}

            {/* Total Amount Preview */}
            {totalAmount > 0 && (
              <div className="bg-green-50 rounded-lg p-5 text-center border border-green-200">
                <p className="text-gray-700 font-medium">Total Amount Received (Full Yield)</p>
                <p className="text-3xl font-bold text-green-700 mt-2">
                  ₹{totalAmount.toLocaleString('en-IN')}
                </p>
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-4 justify-center pt-6">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-8 py-3 border-2 border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow transition"
              >
                Confirm & Lock Season
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RecordHarvest;