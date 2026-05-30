import React, { useState, useEffect } from 'react';
import laborService from '../../services/laborService';
import LaborHistoryCard from '../../components/labor/LaborHistoryCard';
import Loader from '../../components/common/Loader';

const WorkHistory = () => {
  const [workHistory, setWorkHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchWorkHistory();
  }, []);

  const fetchWorkHistory = async () => {
    try {
      const data = await laborService.getWorkHistory();
      setWorkHistory(data);
    } catch (error) {
      console.error('Failed to fetch work history:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader text="Loading work history..." />;
  }

  const filteredHistory = workHistory.filter((work) => {
    if (filter === 'all') return true;
    return work.duration === filter;
  });

  const stats = {
    totalWork: workHistory.length,
    fullDay: workHistory.filter(w => w.duration === 'full_day').length,
    halfDay: workHistory.filter(w => w.duration === 'half_day').length,
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2" data-testid="work-history-title">
              📋 Work History
            </h1>
            <p className="text-gray-600">Complete record of your agricultural work</p>
          </div>

          {/* Statistics */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-3xl font-bold text-gray-800">{stats.totalWork}</div>
              <div className="text-gray-600 mt-1">Total Work Days</div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-3xl font-bold text-blue-700">{stats.fullDay}</div>
              <div className="text-gray-600 mt-1">Full Days</div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-3xl font-bold text-green-700">{stats.halfDay}</div>
              <div className="text-gray-600 mt-1">Half Days</div>
            </div>
          </div>

          {/* Filter */}
          <div className="mb-6 bg-white rounded-lg shadow p-4">
            <div className="flex space-x-4">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded transition ${
                  filter === 'all'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                data-testid="filter-all"
              >
                All ({workHistory.length})
              </button>
              <button
                onClick={() => setFilter('full_day')}
                className={`px-4 py-2 rounded transition ${
                  filter === 'full_day'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                data-testid="filter-fullday"
              >
                Full Day ({stats.fullDay})
              </button>
              <button
                onClick={() => setFilter('half_day')}
                className={`px-4 py-2 rounded transition ${
                  filter === 'half_day'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                data-testid="filter-halfday"
              >
                Half Day ({stats.halfDay})
              </button>
            </div>
          </div>

          {/* Work History List */}
          {filteredHistory.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <p className="text-gray-600">No work history found.</p>
            </div>
          ) : (
            <div className="space-y-4" data-testid="filtered-history-list">
              {filteredHistory.map((work) => (
                <LaborHistoryCard key={work._id} workRecord={work} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkHistory;
