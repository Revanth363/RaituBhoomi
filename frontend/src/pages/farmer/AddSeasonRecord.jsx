// src/pages/farmer/AddSeasonRecord.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import farmerService from '../../services/farmerService';
import Loader from '../../components/common/Loader';
import { getCurrentYear, formatDateForInput } from '../../utils/dateUtils';

const AddSeasonRecord = () => {
  const { seasonId } = useParams();
  const navigate = useNavigate();
  const isEdit = !!seasonId;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    year: getCurrentYear(),
    crop: 'Paddy',
    fieldArea: '',
    preparationDate: '',
    ploughingDates: [''],
    sowingDate: '',
    transplantingDate: '',
    weedingDates: [''],
    harvestDate: '',
    pesticideUses: [],
    machineryUses: [],
    customActivities: [],
    totalLaborCost: '',
    totalMachineryCost: '',
    totalInvestment: '',
    totalBags: '',
    weightPerBag: 83,
    pricePerBag: '',
    totalAmountReceived: '',
  });

  // Season is permanently locked after harvest
  const isSeasonLocked = !!formData.harvestDate;

  useEffect(() => {
    if (isEdit) {
      fetchSeason();
    } else {
      setLoading(false);
    }
  }, [seasonId]);

  const fetchSeason = async () => {
    try {
      const season = await farmerService.getSeasonById(seasonId);
      setFormData({
        year: season.year || getCurrentYear(),
        crop: season.crop || 'Paddy',
        fieldArea: season.fieldArea || '',
        preparationDate: season.preparationDate ? formatDateForInput(new Date(season.preparationDate)) : '',
        ploughingDates: season.ploughingDates?.length > 0 ? season.ploughingDates.map(d => formatDateForInput(new Date(d))) : [''],
        sowingDate: season.sowingDate ? formatDateForInput(new Date(season.sowingDate)) : '',
        transplantingDate: season.transplantingDate ? formatDateForInput(new Date(season.transplantingDate)) : '',
        weedingDates: season.weedingDates?.length > 0 ? season.weedingDates.map(d => formatDateForInput(new Date(d))) : [''],
        harvestDate: season.harvestDate ? formatDateForInput(new Date(season.harvestDate)) : '',
        pesticideUses: season.pesticideUses || [],
        machineryUses: season.machineryUses || [],
        customActivities: season.customActivities || [],
        totalLaborCost: season.totalLaborCost || '',
        totalMachineryCost: season.totalMachineryCost || '',
        totalInvestment: season.totalInvestment || '',
        totalBags: season.totalBags || '',
        weightPerBag: season.weightPerBag || 83,
        pricePerBag: season.pricePerBag || '',
        totalAmountReceived: season.totalAmountReceived || '',
      });
    } catch (err) {
      setError('Failed to load season');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    if (isSeasonLocked) return; // Prevent changes
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addEntry = (field) => {
    if (isSeasonLocked) return;
    if (field === 'pesticideUses') {
      setFormData({ ...formData, pesticideUses: [...formData.pesticideUses, { type: '', date: '', cost: '' }] });
    } else if (field === 'machineryUses') {
      setFormData({ ...formData, machineryUses: [...formData.machineryUses, { machine: '', date: '', duration: '', cost: '' }] });
    } else if (field === 'customActivities') {
      setFormData({ ...formData, customActivities: [...formData.customActivities, { name: '', date: '' }] });
    }
  };

  const updateEntry = (field, index, subfield, value) => {
    if (isSeasonLocked) return;
    const updated = [...formData[field]];
    updated[index][subfield] = value;
    setFormData({ ...formData, [field]: updated });
  };

  const removeEntry = (field, index) => {
    if (isSeasonLocked) return;
    setFormData({ ...formData, [field]: formData[field].filter((_, i) => i !== index) });
  };

  const addDateField = (field) => {
    if (isSeasonLocked) return;
    setFormData({ ...formData, [field]: [...formData[field], ''] });
  };

  const updateDateField = (field, index, value) => {
    if (isSeasonLocked) return;
    const updated = [...formData[field]];
    updated[index] = value;
    setFormData({ ...formData, [field]: updated });
  };

  const removeDateField = (field, index) => {
    if (isSeasonLocked) return;
    setFormData({ ...formData, [field]: formData[field].filter((_, i) => i !== index) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSeasonLocked) return; // Double safety

    setError('');
    setSaving(true);

    try {
      const payload = {
        year: parseInt(formData.year),
        crop: formData.crop.trim(),
        fieldArea: formData.fieldArea.trim(),
        preparationDate: formData.preparationDate || null,
        ploughingDates: formData.ploughingDates.filter(d => d),
        sowingDate: formData.sowingDate || null,
        transplantingDate: formData.transplantingDate || null,
        weedingDates: formData.weedingDates.filter(d => d),
        harvestDate: formData.harvestDate || null,
        pesticideUses: formData.pesticideUses
          .filter(p => p.type && p.date)
          .map(p => ({ type: p.type, date: p.date, cost: parseFloat(p.cost) || 0 })),
        machineryUses: formData.machineryUses
          .filter(m => m.machine && m.date)
          .map(m => ({
            machine: m.machine,
            date: m.date,
            duration: m.duration || '',
            cost: parseFloat(m.cost) || 0,
          })),
        customActivities: formData.customActivities
          .filter(a => a.name && a.date)
          .map(a => ({ name: a.name.trim(), date: a.date })),
        totalLaborCost: parseFloat(formData.totalLaborCost) || 0,
        totalMachineryCost: parseFloat(formData.totalMachineryCost) || 0,
        totalInvestment: parseFloat(formData.totalInvestment) || 0,
        totalBags: formData.harvestDate && formData.crop.toLowerCase() === 'paddy' ? parseInt(formData.totalBags) || 0 : undefined,
        weightPerBag: formData.weightPerBag ? parseInt(formData.weightPerBag) : 83,
        pricePerBag: parseFloat(formData.pricePerBag) || 0,
        totalAmountReceived: parseFloat(formData.totalAmountReceived) || 0,
      };

      if (isEdit) {
        await farmerService.updateSeason(seasonId, payload);
        alert('Season updated successfully');
      } else {
        await farmerService.createSeason(payload);
        alert('Season created successfully');
      }

      // Force reload to refresh dashboard data
      window.location.href = '/farmer/dashboard';
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save season record');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader text="Loading season record..." />;

  const showYieldSection = formData.harvestDate && formData.crop.toLowerCase() === 'paddy';

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            {isEdit ? 'Edit Season Record' : 'Add Season Record'}
          </h1>

          {/* Locked Season Banner */}
          {isSeasonLocked && (
            <div className="mb-8 p-6 bg-gray-100 border-2 border-gray-300 rounded-xl text-center">
              <p className="text-2xl font-bold text-gray-700">🔒 This season is permanently locked</p>
              <p className="text-lg text-gray-600 mt-3">
                Harvest has been recorded. No further changes are allowed.
              </p>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <section>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Basic Information</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Year *</label>
                  <input type="number" name="year" value={formData.year} onChange={handleChange} required disabled={isSeasonLocked} className={`w-full px-4 py-2 border rounded focus:ring-2 focus:ring-green-500 ${isSeasonLocked ? 'bg-gray-100 cursor-not-allowed' : ''}`} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Crop *</label>
                  <select name="crop" value={formData.crop} onChange={handleChange} required disabled={isSeasonLocked} className={`w-full px-4 py-2 border rounded focus:ring-2 focus:ring-green-500 ${isSeasonLocked ? 'bg-gray-100 cursor-not-allowed' : ''}`}>
                    <option value="Paddy">Paddy</option>
                    <option value="Black Gram">Black Gram</option>
                    <option value="Green Gram">Green Gram</option>
                    <option value="Sesame">Sesame</option>
                    <option value="Corn">Corn</option>
                    <option value="Cotton">Cotton</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Field Area *</label>
                  <input type="text" name="fieldArea" value={formData.fieldArea} onChange={handleChange} required disabled={isSeasonLocked} placeholder="e.g., 2 acres 50 cents" className={`w-full px-4 py-2 border rounded focus:ring-2 focus:ring-green-500 ${isSeasonLocked ? 'bg-gray-100 cursor-not-allowed' : ''}`} />
                </div>
              </div>
            </section>

            {/* Timeline Dates */}
            <section>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Activity Timeline</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Preparation Date</label>
                  <input type="date" name="preparationDate" value={formData.preparationDate} onChange={handleChange} disabled={isSeasonLocked} className={`w-full px-4 py-2 border rounded focus:ring-2 focus:ring-green-500 ${isSeasonLocked ? 'bg-gray-100 cursor-not-allowed' : ''}`} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sowing Date</label>
                  <input type="date" name="sowingDate" value={formData.sowingDate} onChange={handleChange} disabled={isSeasonLocked} className={`w-full px-4 py-2 border rounded focus:ring-2 focus:ring-green-500 ${isSeasonLocked ? 'bg-gray-100 cursor-not-allowed' : ''}`} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Transplanting Date</label>
                  <input type="date" name="transplantingDate" value={formData.transplantingDate} onChange={handleChange} disabled={isSeasonLocked} className={`w-full px-4 py-2 border rounded focus:ring-2 focus:ring-green-500 ${isSeasonLocked ? 'bg-gray-100 cursor-not-allowed' : ''}`} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Harvest Date</label>
                  <input type="date" name="harvestDate" value={formData.harvestDate} onChange={handleChange} disabled={isSeasonLocked} className={`w-full px-4 py-2 border rounded focus:ring-2 focus:ring-green-500 ${isSeasonLocked ? 'bg-gray-100 cursor-not-allowed' : ''}`} />
                </div>
              </div>

              {/* Multiple Ploughing */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Ploughing Dates</label>
                {formData.ploughingDates.map((date, i) => (
                  <div key={i} className="flex gap-3 mb-2">
                    <input type="date" value={date} onChange={(e) => updateDateField('ploughingDates', i, e.target.value)} disabled={isSeasonLocked} className={`flex-1 px-4 py-2 border rounded focus:ring-2 focus:ring-green-500 ${isSeasonLocked ? 'bg-gray-100 cursor-not-allowed' : ''}`} />
                    {formData.ploughingDates.length > 1 && !isSeasonLocked && (
                      <button type="button" onClick={() => removeDateField('ploughingDates', i)} className="text-red-600 hover:text-red-800">Remove</button>
                    )}
                  </div>
                ))}
                {!isSeasonLocked && (
                  <button type="button" onClick={() => addDateField('ploughingDates')} className="text-green-600 text-sm hover:underline">+ Add another ploughing</button>
                )}
              </div>

              {/* Multiple Weeding */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Weeding Dates</label>
                {formData.weedingDates.map((date, i) => (
                  <div key={i} className="flex gap-3 mb-2">
                    <input type="date" value={date} onChange={(e) => updateDateField('weedingDates', i, e.target.value)} disabled={isSeasonLocked} className={`flex-1 px-4 py-2 border rounded focus:ring-2 focus:ring-green-500 ${isSeasonLocked ? 'bg-gray-100 cursor-not-allowed' : ''}`} />
                    {formData.weedingDates.length > 1 && !isSeasonLocked && (
                      <button type="button" onClick={() => removeDateField('weedingDates', i)} className="text-red-600 hover:text-red-800">Remove</button>
                    )}
                  </div>
                ))}
                {!isSeasonLocked && (
                  <button type="button" onClick={() => addDateField('weedingDates')} className="text-green-600 text-sm hover:underline">+ Add another weeding</button>
                )}
              </div>
            </section>

            {/* Pesticide & Machinery */}
            <section>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Pesticide & Machinery Used</h3>
              {/* Pesticide */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-700 mb-3">Pesticide Applications</h4>
                {formData.pesticideUses.map((p, i) => (
                  <div key={i} className="grid md:grid-cols-4 gap-4 mb-3 p-4 bg-gray-50 rounded">
                    <input type="text" placeholder="Type" value={p.type} onChange={(e) => updateEntry('pesticideUses', i, 'type', e.target.value)} disabled={isSeasonLocked} className={`px-4 py-2 border rounded ${isSeasonLocked ? 'bg-gray-100 cursor-not-allowed' : ''}`} />
                    <input type="date" value={p.date} onChange={(e) => updateEntry('pesticideUses', i, 'date', e.target.value)} disabled={isSeasonLocked} className={`px-4 py-2 border rounded ${isSeasonLocked ? 'bg-gray-100 cursor-not-allowed' : ''}`} />
                    <input type="number" placeholder="Cost (₹)" value={p.cost} onChange={(e) => updateEntry('pesticideUses', i, 'cost', e.target.value)} disabled={isSeasonLocked} className={`px-4 py-2 border rounded ${isSeasonLocked ? 'bg-gray-100 cursor-not-allowed' : ''}`} />
                    {!isSeasonLocked && (
                      <button type="button" onClick={() => removeEntry('pesticideUses', i)} className="text-red-600">Remove</button>
                    )}
                  </div>
                ))}
                {!isSeasonLocked && (
                  <button type="button" onClick={() => addEntry('pesticideUses')} className="text-green-600 text-sm hover:underline">+ Add pesticide use</button>
                )}
              </div>

              {/* Machinery */}
              <div>
                <h4 className="font-medium text-gray-700 mb-3">Machinery Used</h4>
                {formData.machineryUses.map((m, i) => (
                  <div key={i} className="grid md:grid-cols-5 gap-4 mb-3 p-4 bg-gray-50 rounded">
                    <input type="text" placeholder="Machine (e.g., Tractor)" value={m.machine} onChange={(e) => updateEntry('machineryUses', i, 'machine', e.target.value)} disabled={isSeasonLocked} className={`px-4 py-2 border rounded ${isSeasonLocked ? 'bg-gray-100 cursor-not-allowed' : ''}`} />
                    <input type="date" value={m.date} onChange={(e) => updateEntry('machineryUses', i, 'date', e.target.value)} disabled={isSeasonLocked} className={`px-4 py-2 border rounded ${isSeasonLocked ? 'bg-gray-100 cursor-not-allowed' : ''}`} />
                    <input type="text" placeholder="Duration (hrs)" value={m.duration} onChange={(e) => updateEntry('machineryUses', i, 'duration', e.target.value)} disabled={isSeasonLocked} className={`px-4 py-2 border rounded ${isSeasonLocked ? 'bg-gray-100 cursor-not-allowed' : ''}`} />
                    <input type="number" placeholder="Cost (₹)" value={m.cost} onChange={(e) => updateEntry('machineryUses', i, 'cost', e.target.value)} disabled={isSeasonLocked} className={`px-4 py-2 border rounded ${isSeasonLocked ? 'bg-gray-100 cursor-not-allowed' : ''}`} />
                    {!isSeasonLocked && (
                      <button type="button" onClick={() => removeEntry('machineryUses', i)} className="text-red-600">Remove</button>
                    )}
                  </div>
                ))}
                {!isSeasonLocked && (
                  <button type="button" onClick={() => addEntry('machineryUses')} className="text-green-600 text-sm hover:underline">+ Add machinery use</button>
                )}
              </div>
            </section>

            {/* Custom Activities */}
            <section>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Other Activities (Fertilizer, Bird Scaring, etc.)</h3>
              {formData.customActivities.map((a, i) => (
                <div key={i} className="flex gap-4 mb-3">
                  <input type="text" placeholder="Activity name" value={a.name} onChange={(e) => updateEntry('customActivities', i, 'name', e.target.value)} disabled={isSeasonLocked} className={`flex-1 px-4 py-2 border rounded ${isSeasonLocked ? 'bg-gray-100 cursor-not-allowed' : ''}`} />
                  <input type="date" value={a.date} onChange={(e) => updateEntry('customActivities', i, 'date', e.target.value)} disabled={isSeasonLocked} className={`w-64 px-4 py-2 border rounded ${isSeasonLocked ? 'bg-gray-100 cursor-not-allowed' : ''}`} />
                  {!isSeasonLocked && (
                    <button type="button" onClick={() => removeEntry('customActivities', i)} className="text-red-600">Remove</button>
                  )}
                </div>
              ))}
              {!isSeasonLocked && (
                <button type="button" onClick={() => addEntry('customActivities')} className="text-green-600 hover:underline text-sm">+ Add custom activity</button>
              )}
            </section>

            {/* Investment Summary */}
            <section>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Total Investment</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Total Labor Cost (₹)</label>
                  <input type="number" name="totalLaborCost" value={formData.totalLaborCost} onChange={handleChange} disabled={isSeasonLocked} className={`w-full px-4 py-2 border rounded focus:ring-2 focus:ring-green-500 ${isSeasonLocked ? 'bg-gray-100 cursor-not-allowed' : ''}`} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Total Machinery Cost (₹)</label>
                  <input type="number" name="totalMachineryCost" value={formData.totalMachineryCost} onChange={handleChange} disabled={isSeasonLocked} className={`w-full px-4 py-2 border rounded focus:ring-2 focus:ring-green-500 ${isSeasonLocked ? 'bg-gray-100 cursor-not-allowed' : ''}`} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Total Investment (₹)</label>
                  <input type="number" name="totalInvestment" value={formData.totalInvestment} onChange={handleChange} disabled={isSeasonLocked} className={`w-full px-4 py-2 border rounded focus:ring-2 focus:ring-green-500 ${isSeasonLocked ? 'bg-gray-100 cursor-not-allowed' : ''}`} />
                </div>
              </div>
            </section>

            {/* Paddy Yield */}
            {showYieldSection && (
              <section className="bg-green-50 p-6 rounded-lg border border-green-200">
                <h3 className="text-xl font-bold text-green-800 mb-4">Paddy Yield Record (Required)</h3>
                <div className="grid md:grid-cols-4 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Total Bags Produced *</label>
                    <input type="number" name="totalBags" value={formData.totalBags} onChange={handleChange} required min="0" disabled={isSeasonLocked} className={`w-full px-4 py-2 border rounded focus:ring-2 focus:ring-green-500 ${isSeasonLocked ? 'bg-gray-100 cursor-not-allowed' : ''}`} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Weight per Bag (kg)</label>
                    <input type="number" name="weightPerBag" value={formData.weightPerBag} onChange={handleChange} min="1" disabled={isSeasonLocked} className={`w-full px-4 py-2 border rounded focus:ring-2 focus:ring-green-500 ${isSeasonLocked ? 'bg-gray-100 cursor-not-allowed' : ''}`} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Price per Bag (₹)</label>
                    <input type="number" name="pricePerBag" value={formData.pricePerBag} onChange={handleChange} min="0" disabled={isSeasonLocked} className={`w-full px-4 py-2 border rounded focus:ring-2 focus:ring-green-500 ${isSeasonLocked ? 'bg-gray-100 cursor-not-allowed' : ''}`} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Total Amount Received (₹)</label>
                    <input type="number" name="totalAmountReceived" value={formData.totalAmountReceived} onChange={handleChange} min="0" disabled={isSeasonLocked} className={`w-full px-4 py-2 border rounded focus:ring-2 focus:ring-green-500 ${isSeasonLocked ? 'bg-gray-100 cursor-not-allowed' : ''}`} />
                  </div>
                </div>
              </section>
            )}

            {/* Submit */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <button type="button" onClick={() => navigate('/farmer/dashboard')} className="px-8 py-3 bg-gray-200 hover:bg-gray-300 rounded text-gray-700 font-medium">
                Back to Dashboard
              </button>
              <button 
                type="submit" 
                disabled={saving || isSeasonLocked}
                className={`px-8 py-3 rounded font-bold disabled:opacity-50 ${
                  isSeasonLocked
                    ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                {saving ? 'Saving...' : isSeasonLocked ? 'Season Locked' : (isEdit ? 'Update Record' : 'Save Season Record')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddSeasonRecord;