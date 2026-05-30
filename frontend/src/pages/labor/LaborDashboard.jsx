// src/pages/labor/LaborDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useUser } from '../../context/UserContext';
import laborService from '../../services/laborService';
import LaborHistoryCard from '../../components/labor/LaborHistoryCard';
import AvailabilityForm from '../../components/labor/AvailabilityForm';
import Loader from '../../components/common/Loader';
import { formatCurrency } from '../../utils/costUtils';

const LaborRequirementCard = ({ requirement, onAgree }) => {
  const [agreeing, setAgreeing] = useState(false);
  const [agreed, setAgreed] = useState(false); // Track if already agreed

  const slotsLeft = requirement.numberOfPeople - requirement.acceptedCount;
  const isFull = slotsLeft <= 0;

  const handleAgree = async () => {
    if (isFull || agreed || agreeing) return;

    setAgreeing(true);
    try {
      await onAgree(requirement._id);
      setAgreed(true); // Mark as agreed
    } catch (error) {
      // Error already handled in parent
    } finally {
      setAgreeing(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-800">{requirement.workType}</h3>
          <p className="text-gray-600">{requirement.village}, {requirement.mandal}</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-green-700">
            {formatCurrency(requirement.dailyWage)} / {requirement.wageType === 'full_day' ? 'day' : 'half day'}
          </div>
          <div className="text-sm text-gray-600 mt-1">
            {requirement.acceptedCount}/{requirement.numberOfPeople} slots filled
          </div>
        </div>
      </div>

      <div className="text-sm text-gray-600 mb-4">
        Date: {new Date(requirement.requiredDate).toLocaleDateString('en-IN')}
        {requirement.notes && <p className="mt-2 italic">{requirement.notes}</p>}
      </div>

      {isFull ? (
        <div className="text-center py-3 bg-gray-100 rounded text-gray-700 font-medium">
          Slots Filled
        </div>
      ) : agreed ? (
        <div className="text-center py-3 bg-blue-50 border border-blue-200 rounded text-blue-800 font-medium">
          Interest Sent — Waiting for Farmer Confirmation
        </div>
      ) : (
        <button
          onClick={handleAgree}
          disabled={agreeing}
          className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {agreeing ? 'Sending...' : 'Agree to Work'}
        </button>
      )}
    </div>
  );
};

const LaborDashboard = () => {
  const { userProfile } = useUser();
  const [requirements, setRequirements] = useState([]);
  const [workHistory, setWorkHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('requirements');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [reqs, history] = await Promise.all([
        laborService.getAvailableRequirements(),
        laborService.getWorkHistory(),
      ]);
      setRequirements(reqs);
      setWorkHistory(history);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAvailabilityUpdate = () => {
    fetchData();
  };

  const handleAgree = async (requirementId) => {
    try {
      await laborService.agreeToRequirement(requirementId);
      alert('Interest recorded successfully! The farmer will review your profile and confirm if selected.');
      fetchData(); // Refresh list
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to send interest. You may have already applied.');
    }
  };

  if (loading) {
    return <Loader text="Loading your dashboard..." />;
  }

  const workStats = {
    totalDays: workHistory.length,
    uniqueFarmers: [...new Set(workHistory.map(w => w.farmer?._id))].length,
    villages: [...new Set(workHistory.map(w => w.village))].length,
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Labor Dashboard
          </h1>
          <p className="text-gray-600">
            Welcome, {userProfile?.fullName} from {userProfile?.village}
          </p>
        </div>

        {/* Work Statistics */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-3xl font-bold text-green-700">{workStats.totalDays}</div>
            <div className="text-gray-600 mt-1">Days Worked</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-3xl font-bold text-blue-700">{workStats.uniqueFarmers}</div>
            <div className="text-gray-600 mt-1">Farmers Worked With</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-3xl font-bold text-purple-700">{workStats.villages}</div>
            <div className="text-gray-600 mt-1">Villages Covered</div>
          </div>
        </div>

        {/* Availability Settings */}
        <div className="mb-8">
          <AvailabilityForm currentTravel={userProfile?.willingTravel} onUpdate={handleAvailabilityUpdate} />
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex space-x-4 border-b">
            <button
              onClick={() => setActiveTab('requirements')}
              className={`pb-2 px-4 font-medium transition ${activeTab === 'requirements' ? 'border-b-2 border-green-600 text-green-600' : 'text-gray-600 hover:text-gray-800'}`}
            >
              Available Work ({requirements.length})
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`pb-2 px-4 font-medium transition ${activeTab === 'history' ? 'border-b-2 border-green-600 text-green-600' : 'text-gray-600 hover:text-gray-800'}`}
            >
              Work History ({workHistory.length})
            </button>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'requirements' ? (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Available Work Opportunities</h2>
            {requirements.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <p className="text-gray-600 text-lg">No work opportunities available in your area right now.</p>
                <p className="text-gray-500 text-sm mt-2">Update your availability to see more jobs!</p>
              </div>
            ) : (
              <div className="space-y-6">
                {requirements.map((req) => (
                  <LaborRequirementCard key={req._id} requirement={req} onAgree={handleAgree} />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Work History</h2>
            {workHistory.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <p className="text-gray-600 text-lg">No work history yet.</p>
                <p className="text-gray-500 text-sm mt-2">Start applying to jobs to build your record!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {workHistory.map((work) => (
                  <LaborHistoryCard key={work._id} workRecord={work} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LaborDashboard;