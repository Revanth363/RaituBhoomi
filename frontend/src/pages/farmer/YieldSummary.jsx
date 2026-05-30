import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import farmerService from '../../services/farmerService';
import YieldTable from '../../components/farmer/YieldTable';
import Loader from '../../components/common/Loader';
import { formatCurrency, calculateProfitLoss } from '../../utils/costUtils';

const YieldSummary = () => {
  const [yieldRecords, setYieldRecords] = useState([]);
  const [seasons, setSeasons] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [yields, seasonData] = await Promise.all([
        farmerService.getYieldRecords(),
        farmerService.getSeasons(),
      ]);
      setYieldRecords(yields);
      setSeasons(seasonData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader text="Loading yield records..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2" data-testid="yield-summary-title">
              📊 Yield Summary
            </h1>
            <p className="text-gray-600">Year-to-year comparison and harvest records</p>
          </div>

          <div className="mb-8">
            <YieldTable yieldRecords={yieldRecords} />
          </div>

          {yieldRecords.length > 1 && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Year-to-Year Comparison</h3>
              <div className="grid md:grid-cols-3 gap-6">
                {yieldRecords.slice(0, 3).map((record, index) => {
                  const season = seasons.find(s => s._id === record.season);
                  const profit = season ? calculateProfitLoss(season.totalInvestment, record.totalAmount) : 0;
                  
                  return (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="text-center mb-4">
                        <div className="text-2xl font-bold text-gray-800">{record.year}</div>
                        <div className="text-sm text-gray-600">{record.season?.crop || 'Paddy'}</div>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Bags:</span>
                          <span className="font-semibold">{record.totalBags}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Amount:</span>
                          <span className="font-semibold text-green-700">
                            {formatCurrency(record.totalAmount)}
                          </span>
                        </div>
                        {season && (
                          <>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Investment:</span>
                              <span className="font-semibold">
                                {formatCurrency(season.totalInvestment)}
                              </span>
                            </div>
                            <div className="flex justify-between pt-2 border-t">
                              <span className="text-gray-600">Profit/Loss:</span>
                              <span className={`font-bold ${profit >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                                {formatCurrency(profit)}
                              </span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="text-center">
            <button
              onClick={() => navigate('/farmer/dashboard')}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded transition"
              data-testid="back-to-dashboard-button"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YieldSummary;
