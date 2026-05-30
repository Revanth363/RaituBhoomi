// src/components/farmer/LandSharingOutcomes.jsx
import React from 'react';
import { formatCurrency } from '../../utils/costUtils';

const LandSharingOutcomes = ({ sharings, userId, onClose }) => {
  const isOwner = (sharing) => sharing.owner?._id?.toString() === userId;

  if (!sharings.some(s => isOwner(s))) {
    return null;
  }

  const grouped = {};
  sharings
    .filter(s => isOwner(s) && s.agreedByBoth && s.cultivatorSeason)
    .forEach(sharing => {
      const key = `${sharing.crop}-${sharing.year}`;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(sharing);
    });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-screen overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Land Sharing Outcomes</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-3xl">
            ×
          </button>
        </div>

        <div className="p-8">
          {Object.keys(grouped).length === 0 ? (
            <p className="text-center text-gray-600 py-12">
              No confirmed and linked agreements with recorded harvest yet.
            </p>
          ) : (
            Object.entries(grouped).map(([key, items]) => {
              const [crop, year] = key.split('-');

              const pendingTotal = items
                .filter(s => !s.paymentCompleted)
                .reduce((sum, s) => {
                  const givenBags = s.givenBags || 0;
                  const amount = s.givenAmount || givenBags * (s.expectedPricePerBag || 0);
                  return sum + amount;
                }, 0);

              return (
                <div key={key} className="mb-12">
                  <h3 className="text-xl font-bold text-gray-800 mb-6">
                    {crop} • {year} Season
                  </h3>

                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-100 text-left text-sm font-semibold text-gray-700">
                          <th className="px-4 py-3 border">Cultivator</th>
                          <th className="px-4 py-3 border text-center">Area</th>
                          <th className="px-4 py-3 border text-right">Expected Bags</th>
                          <th className="px-4 py-3 border text-right">Expected Price/Bag</th>
                          <th className="px-4 py-3 border text-right">Expected Total</th>
                          <th className="px-4 py-3 border text-right font-bold text-blue-700">Actual Harvest (Bags)</th>
                          <th className="px-4 py-3 border text-right font-bold text-green-700">Bags Given</th>
                          <th className="px-4 py-3 border text-right">Actual Price/Bag</th>
                          <th className="px-4 py-3 border text-right font-bold text-green-700">Amount Given</th>
                          <th className="px-4 py-3 border text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody className="text-sm">
                        {items.map((sharing) => {
                          const season = sharing.cultivatorSeason;

                          // Direct fetch: actual harvested bags from season
                          const actualBags = season?.yieldRecord?.totalBags || 0;


                          const expectedTotal = (sharing.expectedBags || 0) * (sharing.expectedPricePerBag || 0);
                          const givenBags = sharing.givenBags || 0;
                          const givenPrice = givenBags > 0 && sharing.givenAmount
                            ? sharing.givenAmount / givenBags
                            : sharing.expectedPricePerBag || 0;
                          const amountGiven = sharing.givenAmount || givenBags * givenPrice;

                          return (
                            <tr key={sharing._id} className="hover:bg-gray-50">
                              <td className="px-4 py-4 border font-medium">
                                {sharing.cultivator.fullName}
                                <br />
                                <span className="text-xs text-gray-500">{sharing.cultivator.phone}</span>
                              </td>
                              <td className="px-4 py-4 border text-center">{sharing.area}</td>
                              <td className="px-4 py-4 border text-right">{sharing.expectedBags || '—'}</td>
                              <td className="px-4 py-4 border text-right">
                                {sharing.expectedPricePerBag ? formatCurrency(sharing.expectedPricePerBag) : '—'}
                              </td>
                              <td className="px-4 py-4 border text-right font-medium">
                                {formatCurrency(expectedTotal)}
                              </td>
                              <td className="px-4 py-4 border text-right font-bold text-blue-700">
                                {actualBags}
                              </td>
                              <td className="px-4 py-4 border text-right font-bold text-green-700">
                                {givenBags}
                              </td>
                              <td className="px-4 py-4 border text-right">
                                {formatCurrency(givenPrice)}
                              </td>
                              <td className="px-4 py-4 border text-right font-bold text-green-700">
                                {formatCurrency(amountGiven)}
                              </td>
                              <td className="px-4 py-4 border text-center font-medium">
                                {sharing.paymentCompleted ? (
                                  <span className="text-green-700 font-bold">Paid</span>
                                ) : (
                                  <span className="text-orange-700 font-bold">Pending</span>
                                )}
                              </td>
                            </tr>
                          );
                        })}

                        {items.length > 0 && (
                          <tr className="bg-green-50 font-bold">
                            <td colSpan="8" className="px-4 py-4 text-right border">
                              Total Amount (pending)
                            </td>
                            <td className="px-4 py-4 border text-right text-2xl text-green-800">
                              {formatCurrency(pendingTotal)}
                            </td>
                            <td className="px-4 py-4 border"></td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default LandSharingOutcomes;