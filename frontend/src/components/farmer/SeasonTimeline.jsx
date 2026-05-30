// src/components/farmer/SeasonTimeline.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatDate, calculateDaysBetween } from '../../utils/dateUtils';
import { formatCurrency } from '../../utils/costUtils';
import farmerService from '../../services/farmerService';

const SeasonTimeline = ({ season, onDelete,landSharings, onRefresh }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!season) return null;

  const startDate = new Date(season.preparationDate || season.createdAt);
  const endDate = season.harvestDate ? new Date(season.harvestDate) : null;
  const isCompleted = !!season.harvestDate;

  const currentDay = isCompleted
    ? calculateDaysBetween(startDate, endDate)
    : calculateDaysBetween(startDate);

  const getDayNumber = (date) => {
    if (!date) return null;
    return calculateDaysBetween(startDate, new Date(date));
  };

  const formatMonthYear = (date) => {
    return date.toLocaleString('en-US', { month: 'long', year: 'numeric' });
  };

  const startMonthYear = formatMonthYear(startDate);
  const endMonthYear = endDate ? formatMonthYear(endDate) : null;

  const handleDelete = async () => {
    try {
      await farmerService.deleteSeason(season._id);

if (onDelete) {
  onDelete(season._id);
}

// 🔴 ADD THIS LINE
onRefresh?.();

alert('Season deleted successfully');

    } catch (error) {
      console.error('Delete season error:', error);
      alert('Failed to delete season. Please try again.');
    }
    setShowDeleteConfirm(false);
  };

  const coreActivities = [
    { label: 'Field Preparation', date: season.preparationDate, icon: '🚜' },
    { label: 'Ploughing', dates: season.ploughingDates || [], icon: '🌾' },
    { label: 'Sowing', date: season.sowingDate, icon: '🌱' },
    { label: 'Transplanting', date: season.transplantingDate, icon: '🌿' },
    { label: 'Weeding', dates: season.weedingDates || [], icon: '🌻' },
    { label: 'Harvest', date: season.harvestDate, icon: '✅' },
  ];

  return (
    <div className="bg-white rounded-xl shadow-md p-6 relative">
      {/* Compact Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-800">
            {season.crop}{' '}
            {isCompleted && endMonthYear
              ? `(${startMonthYear} - ${endMonthYear})`
              : `(${startMonthYear})`}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Field: {season.fieldArea || 'Not recorded'}
          </p>
        </div>

        <div className="text-right">
          <p className="text-3xl font-bold text-green-700">Day {currentDay}</p>
          <p className="text-sm text-gray-600">
            {isCompleted ? 'Completed' : 'In Progress'}
          </p>
        </div>
      </div>

      {/* Cost Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <p className="text-xs text-gray-600">Labor</p>
          <p className="text-lg font-bold text-blue-700">
            {formatCurrency(season.totalLaborCost || 0)}
          </p>
        </div>

        <div className="bg-orange-50 rounded-lg p-4 text-center">
          <p className="text-xs text-gray-600">Machinery</p>
          <p className="text-lg font-bold text-orange-700">
            {formatCurrency(season.totalMachineryCost || 0)}
          </p>
        </div>

        <div className="bg-red-50 rounded-lg p-4 text-center">
          <p className="text-xs text-gray-600">Total</p>
          <p className="text-lg font-bold text-red-700">
            {formatCurrency(season.totalInvestment || 0)}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
<div className="flex justify-end gap-4 mb-6 flex-wrap">
  {!isCompleted && (
    <Link
      to={`/farmer/record-harvest/${season._id}`}
      className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold text-sm transition"
    >
      Record Harvest
    </Link>
  )}

  {/* Remove Edit/View button completely after harvest */}
  {!isCompleted && (
    <Link
      to={`/farmer/edit-season/${season._id}`}
      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold text-sm transition"
    >
      Edit Season
    </Link>
  )}

  {/* Delete Button — ONLY if NOT linked to land sharing */}
{!season.landSharing && (
  <button
    onClick={() => setShowDeleteConfirm(true)}
    className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold text-sm transition"
  >
    Delete Season
  </button>
)}

</div>

      {/* Toggle Details */}
      <div className="text-center">
        <button
          onClick={() => setShowDetails((prev) => !prev)}
          className="text-sm font-semibold text-gray-700 hover:text-black transition"
        >
          {showDetails ? '▲ Hide timeline details' : '▼ Show timeline details'}
        </button>
      </div>

         {/* Land Sharing Link - When linked */}
{season.landSharing ? (
  <div className="mb-6 p-6 bg-green-100 rounded-xl border-2 border-green-300">
    <p className="text-green-800 font-bold text-lg mb-3">
      🌾 This season is linked to land sharing agreement
    </p>
    <div className="space-y-2">
      <p className="text-green-900">
        <strong>Land Owner:</strong> {season.landSharing.owner?.fullName || 'Unknown'}
      </p>
      {season.landSharing.owner?.village && (
        <p className="text-green-800">
          <strong>Village:</strong> {season.landSharing.owner.village}
        </p>
      )}
      <p className="text-green-800">
        <strong>Phone:</strong>{' '}
        <span className="font-mono text-green-900">
          {season.landSharing.owner?.phone || 'Not available'}
        </span>
      </p>
      <p className="text-green-800 mt-2">
        <strong>Details:</strong> {season.landSharing.crop} • {season.landSharing.area} • {season.landSharing.year}
      </p>

      {/* Expected vs Given */}
      <div className="mt-4 pt-4 border-t border-green-300">
        <p className="text-sm text-green-900">
          <strong>Expected Share:</strong> {season.landSharing.expectedBags || '—'} bags @ ₹{season.landSharing.expectedPricePerBag || '—'}/bag
        </p>
        <p className="text-sm text-green-900">
          <strong>Actual Given:</strong> {season.landSharing.givenBags || season.totalBags || 0} bags
        </p>
        <p className="text-lg font-bold text-green-900 mt-2">
          Amount: {formatCurrency(season.landSharing.givenAmount || (season.landSharing.givenBags || season.totalBags || 0) * (season.landSharing.expectedPricePerBag || 0))}
        </p>
      </div>

      {/* Payment Status & Button */}
      <div className="mt-4 pt-4 border-t border-green-300 text-center">
        {season.landSharing.paymentCompleted ? (
          <div className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-full font-bold">
            ✓ Payment Completed
          </div>
        ) : isCompleted ? (
          <button
            onClick={async () => {
              if (!window.confirm('Mark payment as completed to the land owner?')) return;

              try {
                await farmerService.markPaymentComplete(season.landSharing._id);
                alert('Payment status updated!');
                onRefresh?.();
              } catch (error) {
                alert('Failed to update payment status');
              }
            }}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full font-bold shadow-lg transition"
          >
            Mark Payment Completed
          </button>
        ) : (
          <p className="text-sm text-gray-600 italic">
            Payment button will appear after harvest is recorded
          </p>
        )}
      </div>
    </div>
  </div>
): (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Is this season on shared land?
          </label>
          <select
            onChange={async (e) => {
              const sharingId = e.target.value;
              if (!sharingId) return;

              if (!window.confirm('Link this season to the selected land sharing agreement?')) {
                e.target.value = '';
                return;
              }

              try {
                await farmerService.linkSeasonToSharing({
                  seasonId: season._id,
                  sharingId
                });
                alert('Season linked successfully! Owner can now see your progress.');
                // Trigger refresh from parent
                if (typeof onRefresh === 'function') {
                  onRefresh();
                }
              } catch (error) {
                console.error('Link failed:', error);
                alert(error.response?.data?.message || 'Failed to link season');
                e.target.value = '';
              }
            }}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            defaultValue=""
          >
            <option value="" disabled>
              Select land sharing agreement (optional)
            </option>
            {landSharings
              ?.filter(
                (ls) =>
                  ls.agreedByBoth && 
                  !ls.cultivatorSeason && 
                  ls.year === season.year
              )
              .map((ls) => (
                <option key={ls._id} value={ls._id}>
                  {ls.owner?.fullName} — {ls.crop} ({ls.area}, {ls.year})
                </option>
              ))}
          </select>
          <p className="text-xs text-gray-500 mt-2">
            Only confirmed agreements from the same year appear here.
          </p>
        </div>
      )}

      {/* Details Section */}
      {showDetails && (
        <div className="mt-6 space-y-4 border-t pt-4">
          {coreActivities.map((act, i) => {
            const dates = act.dates || (act.date ? [act.date] : []);
            const hasData = dates.length > 0;

            return (
              <div
                key={i}
                className={`flex gap-4 p-4 rounded-lg border ${
                  hasData
                    ? 'bg-green-50 border-green-200'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="text-2xl">{act.icon}</div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-800 text-sm">
                    {act.label}
                  </p>

                  {hasData ? (
                    dates.map((d, j) => (
                      <p key={j} className="text-xs text-gray-600 mt-1">
                        {formatDate(d)} — Day {getDayNumber(d)}
                      </p>
                    ))
                  ) : (
                    <p className="text-xs text-gray-500">Not recorded</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full text-center">
            <div className="text-6xl mb-4">🗑️</div>
            <h3 className="text-2xl font-bold text-red-700 mb-4">
              Delete This Season?
            </h3>
            <p className="text-gray-700 mb-2">
              You are about to permanently delete the record for:
            </p>
            <p className="text-xl font-bold text-gray-900 mb-8">
              {season.crop} — {season.year}
            </p>
            <p className="text-gray-600 mb-8">
              This action <strong>cannot be undone</strong>. All data including costs, dates, and harvest details will be lost.
            </p>

            <div className="flex gap-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-3 border-2 border-gray-300 rounded-lg font-bold text-gray-700 hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold transition"
              >
                Yes, Delete Forever
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeasonTimeline;