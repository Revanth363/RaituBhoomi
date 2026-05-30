// src/pages/farmer/FarmerDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import farmerService from '../../services/farmerService';
import SeasonTimeline from '../../components/farmer/SeasonTimeline';
import Loader from '../../components/common/Loader';
import { getCurrentYear, calculateDaysBetween } from '../../utils/dateUtils';
import { formatCurrency } from '../../utils/costUtils';
import LaborRequirementCard from '../../components/farmer/LaborRequirementCard';
import ShareExperience from './ShareExperience';
import LandSharingTable from '../../components/farmer/LandSharingTable';
import LandSharingOutcomes from '../../components/farmer/LandSharingOutcomes';

const FarmerDashboard = () => {
  const { userProfile, updateProfile } = useUser();
  const [seasons, setSeasons] = useState([]);
  const [currentSeason, setCurrentSeason] = useState(null);
  const [previousSeasons, setPreviousSeasons] = useState([]);
  const [laborRequirements, setLaborRequirements] = useState([]);
  const [landSharingRecords, setLandSharingRecords] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showOutcomes, setShowOutcomes] = useState(false);
  const [activeSection, setActiveSection] = useState('current');

  // Mobile sidebar
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Profile modals
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [profileForm, setProfileForm] = useState({
    fullName: userProfile?.fullName || '',
    phone: userProfile?.phone || '',
    village: userProfile?.village || '',
    mandal: userProfile?.mandal || '',
    district: userProfile?.district || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createForm, setCreateForm] = useState({
    cultivatorPhone: '',
    crop: '',
    area: '',
    year: getCurrentYear(),
    expectedBags: '',
    expectedPricePerBag: ''
  });

  // Labor work modal
  const [showWorkModal, setShowWorkModal] = useState(false);
  const [selectedLabor, setSelectedLabor] = useState(null);
  const [workForm, setWorkForm] = useState({ duration: 'full_day', amountPaid: '' });
  const [formData, setFormData] = useState({
    village: userProfile?.village || '',
    mandal: userProfile?.mandal || '',
    workType: '',
    requiredDate: '',
    numberOfPeople: '',
    dailyWage: '',
    wageType: 'full_day',
    notes: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setProfileForm({
      fullName: userProfile?.fullName || '',
      phone: userProfile?.phone || '',
      village: userProfile?.village || '',
      mandal: userProfile?.mandal || '',
      district: userProfile?.district || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  }, [userProfile]);

  const fetchData = async () => {
    try {
      const [seasonData, requirementsData, landSharingData] = await Promise.all([
        farmerService.getSeasons(),
        farmerService.getLaborRequirements(),
        farmerService.getLandSharings()
      ]);

      setSeasons(seasonData);
      setLaborRequirements(requirementsData);
      setLandSharingRecords(landSharingData || []);

      const current = seasonData.find(s => s.year === getCurrentYear() && !s.harvestDate);
      setCurrentSeason(current || null);

      const completed = seasonData.filter(s => s.harvestDate).sort((a, b) => b.year - a.year);
      setPreviousSeasons(completed);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await farmerService.createLaborRequirement({
        ...formData,
        numberOfPeople: Number(formData.numberOfPeople),
        dailyWage: Number(formData.dailyWage)
      });
      setFormData({
        village: userProfile?.village || '',
        mandal: userProfile?.mandal || '',
        workType: '',
        requiredDate: '',
        numberOfPeople: '',
        dailyWage: '',
        wageType: 'full_day',
        notes: ''
      });
      setShowForm(false);
      fetchData();
      alert('Labor requirement posted successfully');
    } catch (error) {
      alert('Failed to post requirement');
    }
  };

  const handleDelete = (id) => setLaborRequirements(prev => prev.filter(r => r._id !== id));

  const openWorkModal = (labor, agreementId, requirement) => {
    setSelectedLabor({ ...labor, agreementId, requirement });
    setWorkForm({ duration: requirement.wageType || 'full_day', amountPaid: requirement.dailyWage || '' });
    setShowWorkModal(true);
  };

  const handleRecordWork = async () => {
    if (!selectedLabor || !workForm.amountPaid || workForm.amountPaid <= 0) {
      alert('Please enter valid amount paid');
      return;
    }
    try {
      await farmerService.recordActualWork({
        agreementId: selectedLabor.agreementId,
        duration: workForm.duration,
        amountPaid: Number(workForm.amountPaid)
      });
      alert('Work recorded successfully');
      setShowWorkModal(false);
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to record work');
    }
  };

  const handleProfileChange = (e) => {
    setProfileForm({ ...profileForm, [e.target.name]: e.target.value });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (profileForm.newPassword && profileForm.newPassword !== profileForm.confirmPassword) {
      alert('New passwords do not match');
      return;
    }

    try {
      const updateData = {
        fullName: profileForm.fullName,
        phone: profileForm.phone,
        village: profileForm.village,
        mandal: profileForm.mandal,
        district: profileForm.district,
      };
      if (profileForm.newPassword) {
        updateData.currentPassword = profileForm.currentPassword;
        updateData.newPassword = profileForm.newPassword;
      }

      await farmerService.updateProfile(updateData);
      updateProfile({
        fullName: profileForm.fullName,
        phone: profileForm.phone,
        village: profileForm.village,
        mandal: profileForm.mandal,
        district: profileForm.district,
      });

      alert('Profile updated successfully');
      setShowProfileModal(false);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update profile');
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you ABSOLUTELY sure? This will permanently delete your account and all data.')) return;

    try {
      await farmerService.deleteAccount();
      alert('Your account and all farm records have been permanently deleted.');
      localStorage.removeItem('token');
      window.location.href = '/login';
    } catch (error) {
      alert('Failed to delete account');
    }
  };

  if (loading) return <Loader text="Loading your farm record..." />;

  const currentDay = currentSeason
    ? calculateDaysBetween(currentSeason.preparationDate || currentSeason.createdAt)
    : 0;

  const lastYearSeason = previousSeasons[0];

  const sections = [
    { id: 'current', label: 'Current Season', icon: '🌾' },
    { id: 'timeline', label: 'Season Timeline', icon: '📅' },
    { id: 'labor', label: 'Need Labor', icon: '👥' },
    { id: 'land', label: 'Land Sharing', icon: '🤝' },
    { id: 'share', label: 'Share Experience', icon: '📝' },
    { id: 'completion', label: 'Season Completed', icon: '✅', show: !!currentSeason?.harvestDate },
    { id: 'profile', label: 'My Profile', icon: '👤' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Mobile Hamburger Button - Hidden when sidebar is open */}
{!sidebarOpen && (
  <button
    onClick={() => setSidebarOpen(true)}
    className="fixed top-20 left-2 z-50 md:hidden bg-green-700 text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center text-2xl"
  >
    ☰
  </button>
)}

      {/* Sidebar */}
<div className={`fixed md:static inset-y-0 left-0 z-40 w-80 bg-white shadow-xl border-r border-gray-200 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out flex flex-col`}>
  {/* Close button on mobile */}
  <button
    onClick={() => setSidebarOpen(false)}
    className="absolute top-4 right-4 md:hidden text-3xl text-gray-600 z-10"
  >
    ×
  </button>

  <div className="p-6 md:p-8 border-b">
    <h1 className="text-2xl font-bold text-gray-800">My Farm Record</h1>
    <p className="text-gray-600 mt-2">{userProfile?.fullName}</p>
    <p className="text-gray-600">{userProfile?.village}</p>
  </div>

  {/* Scrollable nav */}
  <nav className="flex-1 overflow-y-auto p-4">
    {sections.filter(s => s.show !== false).map((section) => (
      <button
        key={section.id}
        onClick={() => {
          setActiveSection(section.id);
          setSidebarOpen(false);
        }}
        className={`w-full text-left px-6 py-4 mb-2 rounded-xl flex items-center gap-4 text-base font-medium transition
          ${activeSection === section.id 
            ? 'bg-green-100 text-green-800 shadow-sm' 
            : 'hover:bg-gray-100 text-gray-700'}
        `}
      >
        <span className="text-2xl">{section.icon}</span>
        {section.label}
      </button>
    ))}
  </nav>

  {/* Bottom buttons - fixed at bottom */}
  <div className="p-6 border-t space-y-3">
    <Link to="/farmer/add-season" className="block w-full bg-green-600 hover:bg-green-700 text-white text-center py-3 rounded-lg font-semibold">
      + Add Season Record
    </Link>
    <Link to="/farmer/yield-summary" className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-3 rounded-lg font-semibold">
      Yield Summary
    </Link>
  </div>
</div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
        />
      )}

      {/* Main Content */}
<div className="flex-1 p-6 md:p-8 overflow-y-auto">
  <div className="max-w-5xl mx-auto w-full">

    {/* Current Season */}
    {activeSection === 'current' && (
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <span className="text-2xl ">🌾</span> Current Season
        </h2>

        <div className="bg-white rounded-xl shadow-sm p-6">
          {currentSeason ? (
            <>
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-800">
                  {currentSeason.crop} — {currentSeason.year}
                </h3>
                <p className="text-gray-600 mt-2">
                  Day {currentDay} • Field: {currentSeason.fieldArea || 'Not recorded'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 pt-6 border-t border-gray-200">
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <p className="text-gray-600">Labor Cost</p>
                  <p className="text-2xl font-bold text-blue-700 mt-1">
                    {formatCurrency(currentSeason.totalLaborCost || 0)}
                  </p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg text-center">
                  <p className="text-gray-600">Machinery Cost</p>
                  <p className="text-2xl font-bold text-orange-700 mt-1">
                    {formatCurrency(currentSeason.totalMachineryCost || 0)}
                  </p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg text-center">
                  <p className="text-gray-600">Total Investment</p>
                  <p className="text-2xl font-bold text-red-700 mt-1">
                    {formatCurrency(currentSeason.totalInvestment || 0)}
                  </p>
                </div>
              </div>

              {lastYearSeason && (
                <div className="pt-6 border-t border-gray-200 bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-600">
                    Last year after {currentDay} days:
                  </p>
                  <p className="text-xl font-medium text-gray-800 mt-2">
                    Spent {formatCurrency((lastYearSeason.totalLaborCost || 0) + (lastYearSeason.totalMachineryCost || 0))}
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                No active season.
              </p>
              <Link to="/farmer/add-season" className="inline-block mt-4 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium">
                + Start New Season
              </Link>
            </div>
          )}
        </div>
      </div>
    )}

    {/* Season Timeline */}
    {activeSection === 'timeline' && (
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <span className="text-2xl">📅</span> All Season Timelines
        </h2>
        <div className="space-y-6">
          {seasons.length > 0 ? (
            seasons.map((s) => (
              <SeasonTimeline
                key={s._id}
                season={s}
                landSharings={landSharingRecords.filter(ls => 
                  ls.cultivator?._id?.toString() === userProfile?._id?.toString()
                )}
                onRefresh={fetchData}
                onDelete={(deletedId) => {
                  setSeasons(prev => prev.filter(season => season._id !== deletedId));
                  if (currentSeason?._id === deletedId) setCurrentSeason(null);
                  setPreviousSeasons(prev => prev.filter(p => p._id !== deletedId));
                }}
              />
            ))
          ) : (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm">
              <p className="text-gray-500 text-lg">No seasons recorded yet.</p>
            </div>
          )}
        </div>
      </div>
    )}

    {/* Need Labor */}
    {activeSection === 'labor' && (
      <div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <span className="text-2xl">👥</span> Need Labor
          </h2>

          <button
            onClick={() => setShowForm(!showForm)}
            className={`w-full md:w-auto px-5 py-2.5 rounded-lg text-sm font-semibold transition shadow-sm ${
              showForm
                ? 'bg-gray-300 hover:bg-gray-400 text-gray-800'
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            {showForm ? 'Cancel' : '+ Post Requirement'}
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          {showForm && (
            <div className="mb-8 bg-gray-50 rounded-xl border p-6">
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Village</label>
                        <input type="text" name="village" value={formData.village} onChange={handleInputChange} required className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mandal</label>
                        <input type="text" name="mandal" value={formData.mandal} onChange={handleInputChange} required className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Work Type</label>
                        <input type="text" name="workType" value={formData.workType} onChange={handleInputChange} required placeholder="e.g., Transplanting" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Required Date</label>
                        <input type="date" name="requiredDate" value={formData.requiredDate} onChange={handleInputChange} required min={new Date().toISOString().split('T')[0]} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">People Needed</label>
                        <input type="number" name="numberOfPeople" value={formData.numberOfPeople} onChange={handleInputChange} required min="1" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Daily Wage (₹)</label>
                        <input type="number" name="dailyWage" value={formData.dailyWage} onChange={handleInputChange} required min="1" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Wage Type</label>
                        <select name="wageType" value={formData.wageType} onChange={handleInputChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500">
                          <option value="full_day">Full Day</option>
                          <option value="half_day">Half Day</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
                        <input type="text" name="notes" value={formData.notes} onChange={handleInputChange} placeholder="Any additional info" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500" />
                      </div>



                <div className="md:col-span-2 flex flex-col md:flex-row justify-end gap-3 pt-4">
                  <button type="button" onClick={() => setShowForm(false)} className="w-full md:w-auto px-6 py-2.5 bg-gray-300 hover:bg-gray-400 rounded-lg text-sm font-semibold">
                    Cancel
                  </button>
                  <button type="submit" className="w-full md:w-auto px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-semibold">
                    Post Requirement
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="space-y-4">
            {laborRequirements.length === 0 ? (
              <p className="text-center text-gray-500 py-12">
                No active labor requirements
              </p>
            ) : (
              laborRequirements.map(req => (
                <LaborRequirementCard
                  key={req._id}
                  requirement={req}
                  onDelete={handleDelete}
                  openWorkModal={openWorkModal}
                />
              ))
            )}
          </div>
        </div>
      </div>
    )}

    {/* Land Sharing */}
    {activeSection === 'land' && (
      <div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <span className="text-2xl">🤝</span> Land Sharing Records
          </h2>

          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            <button
              onClick={() => setShowCreateForm(true)}
              className="w-full md:w-auto px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold shadow-sm transition"
            >
              + Create Agreement
            </button>

            {landSharingRecords.some(s => s.owner?._id?.toString() === userProfile?._id?.toString()) && (
              <button
                onClick={() => setShowOutcomes(true)}
                className="w-full md:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-sm transition"
              >
                View Outcomes
              </button>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-8 overflow-x-auto">
          <LandSharingTable 
            sharings={landSharingRecords} 
            userId={userProfile?._id} 
            onAccept={fetchData}
          />
        </div>

        {showOutcomes && (
          <LandSharingOutcomes 
            sharings={landSharingRecords}
            userId={userProfile?._id}
            onClose={() => setShowOutcomes(false)}
            onRefresh={fetchData}
          />
        )}
      </div>
    )}

    {/* Share Experience */}
    {activeSection === 'share' && (
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <span className="text-2xl">📝</span> Share Your Experience
        </h2>
        <div className="bg-white rounded-xl shadow-sm p-8">
          <ShareExperience />
        </div>
      </div>
    )}

    {/* Season Completed */}
    {activeSection === 'completion' && currentSeason?.harvestDate && (
      <div>
        <h2 className="text-2xl font-bold text-green-800 mb-6 flex items-center gap-2">
          <span className="text-2xl">✅</span> Season Completed
        </h2>
        <div className="bg-green-50 rounded-xl p-6 border border-green-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="text-center">
              <p className="text-gray-700">Total Days</p>
              <p className="text-3xl font-bold text-green-700 mt-1">
                {calculateDaysBetween(currentSeason.preparationDate || currentSeason.createdAt, currentSeason.harvestDate)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-gray-700">Final Investment</p>
              <p className="text-3xl font-bold text-green-700 mt-1">
                {formatCurrency(currentSeason.totalInvestment || 0)}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm overflow-x-auto">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Paddy Yield — {currentSeason.year}
            </h3>
            <table className="w-full min-w-max text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-5 py-3 border text-left">Field Area</th>
                  <th className="px-5 py-3 border text-left">Total Bags</th>
                  <th className="px-5 py-3 border text-left">Weight/Bag</th>
                  <th className="px-5 py-3 border text-left">Price/Bag</th>
                  <th className="px-5 py-3 border text-left">Total Received</th>
                  <th className="px-5 py-3 border text-left">Harvest Date</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-5 py-3 border">{currentSeason.fieldArea || 'Not recorded'}</td>
                  <td className="px-5 py-3 border font-bold text-green-700">{currentSeason.totalBags || 'Not recorded'}</td>
                  <td className="px-5 py-3 border">{currentSeason.weightPerBag || 83} kg</td>
                  <td className="px-5 py-3 border">{formatCurrency(currentSeason.pricePerBag || 0)}</td>
                  <td className="px-5 py-3 border font-bold text-green-700">{formatCurrency(currentSeason.totalAmountReceived || 0)}</td>
                  <td className="px-5 py-3 border">{new Date(currentSeason.harvestDate).toLocaleDateString('en-IN')}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )}

    {/* My Profile */}
    {activeSection === 'profile' && (
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <span className="text-2xl">👤</span> My Profile
        </h2>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="bg-gradient-to-br from-green-50 to-white rounded-xl p-6 mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6">My Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <span className="text-gray-600 font-medium">Full Name:</span>
                <p className="font-semibold mt-1">{userProfile?.fullName}</p>
              </div>
              <div>
                <span className="text-gray-600 font-medium">Phone:</span>
                <p className="font-semibold mt-1">{userProfile?.phone}</p>
              </div>
              <div>
                <span className="text-gray-600 font-medium">Village:</span>
                <p className="font-semibold mt-1">{userProfile?.village}</p>
              </div>
              <div>
                <span className="text-gray-600 font-medium">Mandal:</span>
                <p className="font-semibold mt-1">{userProfile?.mandal}</p>
              </div>
              <div>
                <span className="text-gray-600 font-medium">District:</span>
                <p className="font-semibold mt-1">{userProfile?.district}</p>
              </div>
              <div>
                <span className="text-gray-600 font-medium">State:</span>
                <p className="font-semibold mt-1">{userProfile?.state || 'Andhra Pradesh'}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <button
              onClick={() => setShowProfileModal(true)}
              className="w-full md:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
            >
              Update Profile
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full md:w-auto px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
</div>

      {/* Record Work Modal */}
      {showWorkModal && selectedLabor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Record Work Done</h3>

            <div className="space-y-3 mb-8">
              <p className="text-lg font-semibold text-gray-900">
                {selectedLabor.fullName}
              </p>
              <p className="text-gray-600">
                {selectedLabor.village} • {selectedLabor.phone}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Work:</span> {selectedLabor.requirement.workType}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Date:</span>{' '}
                {new Date(selectedLabor.requirement.requiredDate).toLocaleDateString('en-IN')}
              </p>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                <select
                  value={workForm.duration}
                  onChange={(e) => setWorkForm({ ...workForm, duration: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:ring-2 focus:ring-green-500"
                >
                  <option value="full_day">Full Day</option>
                  <option value="half_day">Half Day</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Amount Paid (₹)</label>
                <input
                  type="number"
                  value={workForm.amountPaid}
                  onChange={(e) => setWorkForm({ ...workForm, amountPaid: e.target.value })}
                  min="1"
                  required
                  placeholder="e.g., 600"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:ring-2 focus:ring-green-500"
                />
                <p className="text-gray-500 text-sm mt-2">
                  Agreed wage: <span className="font-medium">₹{selectedLabor.requirement.dailyWage}</span>
                </p>
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <button
                onClick={() => {
                  setShowWorkModal(false);
                  setWorkForm({ duration: 'full_day', amountPaid: '' });
                }}
                className="flex-1 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleRecordWork}
                className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition"
              >
                Confirm Work Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Update Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-2xl w-full max-h-screen overflow-y-auto">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Update My Profile</h3>

            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={profileForm.fullName}
                    onChange={handleProfileChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    type="text"
                    name="phone"
                    value={profileForm.phone}
                    onChange={handleProfileChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Village</label>
                  <input
                    type="text"
                    name="village"
                    value={profileForm.village}
                    onChange={handleProfileChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mandal</label>
                  <input
                    type="text"
                    name="mandal"
                    value={profileForm.mandal}
                    onChange={handleProfileChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">District</label>
                  <input
                    type="text"
                    name="district"
                    value={profileForm.district}
                    onChange={handleProfileChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-gray-200">
                <h4 className="text-lg font-bold text-gray-800 mb-4">Change Password (Optional)</h4>
                <div className="grid md:grid-cols-3 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={profileForm.currentPassword}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                    <input
                      type="password"
                      name="newPassword"
                      value={profileForm.newPassword}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={profileForm.confirmPassword}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  type="button"
                  onClick={() => setShowProfileModal(false)}
                  className="flex-1 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Account Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full text-center">
            <div className="text-5xl mb-4">Trash Can</div>
            <h3 className="text-xl font-bold text-red-700 mb-4">Delete Account?</h3>
            <p className="text-gray-700 mb-8">
              This will <strong>permanently delete</strong> your account and all your farm records.
              This action <strong>cannot be undone</strong>.
            </p>

            <div className="flex gap-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-3 border border-gray-400 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition"
              >
                Yes, Delete Forever
              </button>
            </div>
          </div>
        </div>
      )}

            {/* Create Land Sharing Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Create Land Sharing Agreement</h3>

            <form onSubmit={async (e) => {
              e.preventDefault();
              try {
                await farmerService.createLandSharing(createForm);
                alert('Agreement created! Waiting for cultivator to accept.');
                setShowCreateForm(false);
                fetchData();
              } catch (error) {
                alert(error.response?.data?.message || 'Failed to create agreement');
              }
            }} className="space-y-5">

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cultivator Phone Number</label>
                <input
                  type="text"
                  value={createForm.cultivatorPhone}
                  onChange={(e) => setCreateForm({...createForm, cultivatorPhone: e.target.value})}
                  required
                  placeholder="e.g. 9876543210"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Crop</label>
                <input
                  type="text"
                  value={createForm.crop}
                  onChange={(e) => setCreateForm({...createForm, crop: e.target.value})}
                  required
                  placeholder="e.g. Paddy"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Area</label>
                <input
                  type="text"
                  value={createForm.area}
                  onChange={(e) => setCreateForm({...createForm, area: e.target.value})}
                  required
                  placeholder="e.g. 2 acres"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                <input
                  type="number"
                  value={createForm.year}
                  onChange={(e) => setCreateForm({...createForm, year: e.target.value})}
                  required
                  min="2020"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Expected Bags (Optional)</label>
                <input
                  type="number"
                  value={createForm.expectedBags}
                  onChange={(e) => setCreateForm({...createForm, expectedBags: e.target.value})}
                  placeholder="e.g. 120"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Expected Price/Bag (Optional)</label>
                <input
                  type="number"
                  value={createForm.expectedPricePerBag}
                  onChange={(e) => setCreateForm({...createForm, expectedPricePerBag: e.target.value})}
                  placeholder="e.g. 2200"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="flex-1 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg"
                >
                  Send Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FarmerDashboard;