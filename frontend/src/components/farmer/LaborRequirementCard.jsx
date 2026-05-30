// src/components/farmer/LaborRequirementCard.jsx
import React, { useState } from 'react';
import { formatDate } from '../../utils/dateUtils';
import farmerService from '../../services/farmerService';

const LaborRequirementCard = ({ requirement, onDelete, openWorkModal, editable = true }) => {
  const [deleting, setDeleting] = useState(false);
  const [confirming, setConfirming] = useState({});

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this requirement?')) return;
    setDeleting(true);
    try {
      await farmerService.deleteLaborRequirement(requirement._id);
      onDelete?.(requirement._id);
    } catch {
      alert('Failed to delete requirement');
    } finally {
      setDeleting(false);
    }
  };

  const handleConfirm = async (agreementId, laborId) => {
    if (confirming[laborId]) return;
    setConfirming((prev) => ({ ...prev, [laborId]: true }));
    try {
      await farmerService.confirmLabor(agreementId);
      alert('Labor confirmed successfully');
      window.location.reload(); // Or use parent callback
    } catch (error) {
      alert('Failed to confirm labor');
    } finally {
      setConfirming((prev) => ({ ...prev, [laborId]: false }));
    }
  };

  const interestedLaborers = requirement.interestedLaborers || [];
  const confirmedLaborers = requirement.confirmedLaborers || [];

  const slotsFilled = confirmedLaborers.length;
  const totalSlots = requirement.numberOfPeople;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
      {/* HEADER */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{requirement.workType}</h3>
          <p className="text-sm text-gray-500">
            {requirement.village}, {requirement.mandal}
          </p>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-green-700">₹{requirement.dailyWage}</p>
          <p className="text-xs text-gray-500">
            {requirement.wageType === 'full_day' ? 'Full Day' : 'Half Day'}
          </p>
        </div>
      </div>

      {/* META INFO */}
      <div className="flex justify-between items-center text-sm text-gray-600 mb-3">
        <span>Date: {formatDate(requirement.requiredDate)}</span>
        <span className="font-medium">
          {slotsFilled}/{totalSlots} confirmed
        </span>
      </div>

      {/* NOTES */}
      {requirement.notes && (
        <div className="text-sm text-gray-600 italic bg-gray-50 rounded-lg px-3 py-2 mb-3">
          “{requirement.notes}”
        </div>
      )}

      {/* INTERESTED / WILLING TO WORK */}
      {interestedLaborers.length > 0 && (
        <div className="border-t pt-3 mt-3">
          <p className="text-sm font-medium text-gray-700 mb-3">
            Willing to Work ({interestedLaborers.length})
          </p>
          <ul className="space-y-3">
            {interestedLaborers.map((labor) => (
              <li
                key={labor._id}
                className="bg-yellow-50 rounded-lg px-4 py-4 border border-yellow-200"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 text-base">
                      {labor.fullName} ({labor.village})
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Past work: {labor.stats.totalDays} days • {labor.stats.farmersWorked} farmers • {labor.stats.villagesWorked} villages
                    </p>
                    <p className="text-base font-semibold text-gray-800 mt-2">
                      📞 Phone: {labor.phone}
                    </p>
                  </div>
                  <button
                    onClick={() => handleConfirm(labor.agreementId, labor._id)}
                    disabled={confirming[labor._id]}
                    className="ml-4 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg text-sm transition disabled:opacity-60"
                  >
                    {confirming[labor._id] ? 'Confirming…' : 'Confirm'}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* CONFIRMED LABORERS */}
      {confirmedLaborers.length > 0 && (
        <div className="border-t pt-3 mt-3">
          <p className="text-sm font-medium text-gray-700 mb-3">
            Confirmed Labor ({confirmedLaborers.length}/{totalSlots})
          </p>
          <ul className="space-y-3">
            {confirmedLaborers.map((labor) => {
              const workRecorded = labor.workRecorded || false;

              return (
                <li
                  key={labor._id}
                  className={`rounded-lg px-4 py-4 border ${
                    workRecorded ? 'bg-gray-100 border-gray-300' : 'bg-green-50 border-green-200'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-gray-900 text-base">
                        {labor.fullName} ({labor.village})
                      </p>
                      <p className="text-base font-semibold text-gray-800 mt-1">
                        📞 Phone: {labor.phone}
                      </p>
                      {workRecorded && (
                        <span className="inline-block mt-2 px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                          ✓ Work Recorded
                        </span>
                      )}
                    </div>

                    {!workRecorded && (
                      <button
                        onClick={() => openWorkModal(labor, labor.agreementId, requirement)}
                        className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm transition"
                      >
                        Record Work Done
                      </button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* DELETE REQUIREMENT */}
      {editable && (
        <div className="border-t pt-4 mt-5 flex justify-end">
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="text-sm font-semibold text-red-600 hover:text-red-800 disabled:opacity-50"
          >
            {deleting ? 'Deleting…' : 'Delete Requirement'}
          </button>
        </div>
      )}
    </div>
  );
};

export default LaborRequirementCard;