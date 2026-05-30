// src/components/farmer/LandSharingTable.jsx
import React, { useState } from 'react';
import { formatCurrency } from '../../utils/costUtils';
import { formatDate } from '../../utils/dateUtils';
import farmerService from '../../services/farmerService';

const LandSharingTable = ({ sharings, userId, onAccept }) => {
  const [expandedId, setExpandedId] = useState(null);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (!sharings || sharings.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-2xl border border-gray-200 mx-4">
        <div className="text-6xl mb-6">🤝</div>
        <p className="text-xl text-gray-600 font-medium px-4">No land sharing agreements yet</p>
        <p className="text-gray-500 mt-3 px-6">Create or accept an agreement to get started</p>
      </div>
    );
  }

  const isOwner = (sharing) => sharing.owner?._id?.toString() === userId;

  const getStatus = (value) => {
    if (!value || (Array.isArray(value) && value.length === 0)) {
      return { done: false, label: 'Pending' };
    }
    const date = Array.isArray(value) ? value[value.length - 1] : value;
    return { done: true, label: formatDate(date) };
  };

  return (
    <div className="space-y-6 -mx-5">
      {sharings.map((sharing) => {
        const iAmOwner = isOwner(sharing);
        const otherParty = iAmOwner ? sharing.cultivator : sharing.owner;
        const season = sharing.cultivatorSeason;
        const isExpanded = expandedId === sharing._id;

        return (
          <div
            key={sharing._id}
            className={`bg-white rounded-2xl shadow-lg border-2 overflow-hidden transition-all duration-300 mx-auto max-w-5xl
              ${sharing.agreedByBoth 
                ? 'border-green-500 shadow-green-100' 
                : 'border-amber-500 shadow-amber-100'}
            `}
          >
            {/* Compact Header */}
            <div className="p-6 bg-gradient-to-r from-gray-50 to-gray-100">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900">
                    {sharing.crop} • {sharing.area}
                  </h3>
                  <p className="text-lg text-gray-700 mt-1">{sharing.year} Season</p>

                  <div className="mt-4 space-y-2 text-base">
                    <p className="text-gray-700">
                      <span className="font-semibold">
                        {iAmOwner ? 'Cultivator:' : 'Land Owner:'}
                      </span>{' '}
                      {otherParty?.fullName || 'Unknown'}
                    </p>
                    {otherParty?.village && (
                      <p className="text-gray-600">
                        Village: <span className="font-medium">{otherParty.village}</span>
                      </p>
                    )}
                    <p className="text-gray-600">
                      Phone: <span className="font-semibold">{otherParty?.phone || 'Not available'}</span>
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-center lg:items-end gap-4 w-full lg:w-auto">
                  <span
                    className={`px-6 py-3 rounded-full text-base font-bold w-full text-center lg:w-auto
                      ${sharing.agreedByBoth
                        ? 'bg-green-600 text-white'
                        : 'bg-amber-600 text-white'}
                    `}
                  >
                    {sharing.agreedByBoth ? 'Confirmed' : 'Pending'}
                  </span>

                  <button
                    onClick={() => toggleExpand(sharing._id)}
                    className="w-full lg:w-auto px-8 py-3 bg-gray-800 hover:bg-gray-900 text-white font-medium rounded-xl transition shadow-md text-base"
                  >
                    {isExpanded ? 'Hide Details' : 'Show Details'}
                  </button>
                </div>
              </div>
            </div>

            {/* Expanded Details */}
            {isExpanded && (
              <div className="p-6 sm:p-8 border-t-4 border-gray-300 bg-gray-50">
                {/* Accept Button - Only for cultivator */}
                {!sharing.agreedByBoth && !iAmOwner && (
                  <div className="mb-8">
                    <button
                      onClick={async () => {
                        try {
                          await farmerService.acceptLandSharing(sharing._id);
                          alert('Agreement accepted successfully!');
                          onAccept?.();
                        } catch (err) {
                          alert('Failed to accept agreement.');
                        }
                      }}
                      className="w-full py-5 bg-green-600 hover:bg-green-700 text-white text-xl font-bold rounded-2xl shadow-xl transition transform hover:scale-105"
                    >
                      Accept Agreement
                    </button>
                  </div>
                )}

                {/* Season Progress */}
                {season ? (
                  <div className="mb-10">
                    <h4 className="text-2xl font-bold text-gray-800 mb-6 text-center flex items-center justify-center gap-3">
                      <span className="text-3xl">🌱</span> Season Progress
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      {[
                        { label: 'Field Preparation', value: season.preparationDate },
                        { label: 'Ploughing', value: season.ploughingDates },
                        { label: 'Sowing', value: season.sowingDate },
                        { label: 'Transplanting', value: season.transplantingDate },
                        { label: 'Weeding', value: season.weedingDates },
                        { label: 'Harvest', value: season.harvestDate },
                      ].map((item) => {
                        const status = getStatus(item.value);
                        return (
                          <div
                            key={item.label}
                            className="flex flex-col sm:flex-row justify-between items-center p-5 bg-white rounded-xl border border-gray-200 shadow-sm"
                          >
                            <span className="font-semibold text-gray-800 text-center sm:text-left mb-2 sm:mb-0">
                              {item.label}
                            </span>
                            <span className={`font-bold text-lg ${status.done ? 'text-green-700' : 'text-gray-500'}`}>
                              {status.done ? status.label : 'Not started'}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Custom Activities */}
                    {season.customActivities?.length > 0 && (
                      <div className="mt-8">
                        <h5 className="font-bold text-gray-800 mb-4 text-center">Additional Activities</h5>
                        <div className="space-y-3">
                          {season.customActivities.map((act, idx) => (
                            <div key={idx} className="flex justify-between items-center text-base bg-blue-50 px-6 py-4 rounded-xl">
                              <span className="font-medium text-gray-900">{act.name}</span>
                              <span className="text-blue-700 font-bold">{formatDate(act.date)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Final Yield */}
                    {season.harvestDate && (
                      <div className="mt-10 p-8 bg-green-50 rounded-2xl border-4 border-green-300 text-center">
                        <h5 className="text-2xl font-bold text-green-800 mb-6">Final Yield Summary</h5>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                          <div>
                            <p className="text-gray-700 text-lg">Total Bags Harvested</p>
                            <p className="text-5xl font-bold text-green-700 mt-3">
                              {season.totalBags || 0}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-700 text-lg">Amount Received</p>
                            <p className="text-5xl font-bold text-green-700 mt-3">
                              {formatCurrency(season.totalAmountReceived || 0)}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-amber-50 border-2 border-amber-400 rounded-2xl p-8 text-center mb-8">
                    <p className="text-xl text-amber-800 font-medium italic">
                      {iAmOwner
                        ? 'The cultivator has not linked their season record yet.'
                        : 'You have not linked your season record yet.'}
                    </p>
                  </div>
                )}

                {/* Agreement Terms */}
                <div className="mt-10 pt-8 border-t-4 border-dashed border-gray-300">
                  <h4 className="text-xl font-bold text-center text-gray-800 mb-8">Agreement Terms</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="text-center bg-gray-50 p-5 rounded-xl">
                      <p className="text-gray-600 text-sm">Expected Bags</p>
                      <p className="text-3xl font-bold text-gray-900 mt-3">
                        {sharing.expectedBags || '—'}
                      </p>
                    </div>
                    <div className="text-center bg-gray-50 p-5 rounded-xl">
                      <p className="text-gray-600 text-sm">Expected Price/Bag</p>
                      <p className="text-3xl font-bold text-gray-900 mt-3">
                        {sharing.expectedPricePerBag ? formatCurrency(sharing.expectedPricePerBag) : '—'}
                      </p>
                    </div>

                    {(sharing.givenBags !== undefined || sharing.givenAmount !== undefined) && (
                      <>
                        <div className="text-center bg-green-50 p-5 rounded-xl border border-green-300">
                          <p className="text-gray-700 text-sm">Bags Given</p>
                          <p className="text-3xl font-bold text-green-700 mt-3">
                            {sharing.givenBags ?? '—'}
                          </p>
                        </div>
                        <div className="text-center bg-green-50 p-5 rounded-xl border border-green-300">
                          <p className="text-gray-700 text-sm">Amount Paid</p>
                          <p className="text-3xl font-bold text-green-700 mt-3">
                            {sharing.givenAmount ? formatCurrency(sharing.givenAmount) : '—'}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Trust Note */}
                <div className="text-center mt-10 pt-8 border-t border-dashed border-gray-300">
                  <p className="text-base text-gray-600 italic">
                    A mutual agreement built on trust between two farmers.
                  </p>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default LandSharingTable;