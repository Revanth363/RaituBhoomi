// src/components/farmer/YieldTable.jsx
import React from 'react';
import { formatCurrency, formatWeight } from '../../utils/costUtils';
import { formatDate } from '../../utils/dateUtils';

const YieldTable = ({ yieldRecords }) => {
  if (!yieldRecords || yieldRecords.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6" data-testid="yield-table-empty">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Yield Records</h3>
        <p className="text-gray-600">No yield records available yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6" data-testid="yield-table">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Yield Records</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Year
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Crop
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Bags
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Weight/Bag
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price/Bag
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Earned
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Investment
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Profit / Loss
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Harvest Date
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {yieldRecords.map((record, index) => {
              const investment = record.season?.totalInvestment || 0;
              const earned = record.totalAmount || 0;
              const profit = earned - investment;
              const isProfit = profit >= 0;

              return (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {record.year}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                    {record.season?.crop || 'Paddy'}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                    {record.totalBags}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                    {formatWeight(record.weightPerBag)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(record.pricePerBag)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-bold text-green-700">
                    {formatCurrency(earned)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(investment)}
                  </td>
                  <td className={`px-4 py-4 whitespace-nowrap text-sm font-bold ${isProfit ? 'text-green-700' : 'text-red-700'}`}>
                    {isProfit ? '+' : ''}{formatCurrency(profit)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                    {formatDate(record.harvestCompletionDate)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Summary Section */}
      {yieldRecords.length > 1 && (
        <div className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border border-gray-200">
          <h4 className="text-lg font-bold text-gray-800 mb-4">Overall Summary</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
            <div>
              <span className="text-gray-600">Total Records:</span>
              <span className="ml-2 font-bold text-xl">{yieldRecords.length}</span>
            </div>
            <div>
              <span className="text-gray-600">Total Earned:</span>
              <span className="ml-2 font-bold text-xl text-green-700">
                {formatCurrency(yieldRecords.reduce((sum, r) => sum + (r.totalAmount || 0), 0))}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Total Invested:</span>
              <span className="ml-2 font-bold text-xl text-orange-700">
                {formatCurrency(yieldRecords.reduce((sum, r) => sum + (r.season?.totalInvestment || 0), 0))}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Net Profit:</span>
              <span className={`ml-2 font-bold text-2xl ${yieldRecords.reduce((sum, r) => sum + (r.totalAmount || 0), 0) - yieldRecords.reduce((sum, r) => sum + (r.season?.totalInvestment || 0), 0) >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                {formatCurrency(
                  yieldRecords.reduce((sum, r) => sum + (r.totalAmount || 0), 0) -
                  yieldRecords.reduce((sum, r) => sum + (r.season?.totalInvestment || 0), 0)
                )}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default YieldTable;