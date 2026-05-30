import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URL + '/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const farmerService = {
  // Season Management
  createSeason: async (seasonData) => {
    const response = await axios.post(`${API_URL}/farmer/seasons`, seasonData, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  getSeasons: async () => {
    const response = await axios.get(`${API_URL}/farmer/seasons`, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  getSeasonById: async (seasonId) => {
    const response = await axios.get(`${API_URL}/farmer/seasons/${seasonId}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  updateSeason: async (seasonId, seasonData) => {
    const response = await axios.put(`${API_URL}/farmer/seasons/${seasonId}`, seasonData, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  // Yield Records
  createYieldRecord: async (yieldData) => {
    const response = await axios.post(`${API_URL}/farmer/yield`, yieldData, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  getYieldRecords: async () => {
    const response = await axios.get(`${API_URL}/farmer/yield`, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  // Labor Requirements
  createLaborRequirement: async (requirementData) => {
    const response = await axios.post(`${API_URL}/farmer/labor-requirements`, requirementData, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  getLaborRequirements: async () => {
    const response = await axios.get(`${API_URL}/farmer/labor-requirements`, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  deleteLaborRequirement: async (requirementId) => {
    const response = await axios.delete(`${API_URL}/farmer/labor-requirements/${requirementId}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

 

  getLandSharings: async () => {
    const response = await axios.get(`${API_URL}/farmer/land-sharing`, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  

  recordActualWork: async (workData) => {
  const response = await axios.post(
    `${API_URL}/farmer/record-work`,
    workData,
    { headers: getAuthHeader() }
  );
  return response.data;
},

  // Update farmer profile
  updateProfile: async (updateData) => {
    const response = await axios.put(`${API_URL}/farmer/profile`, updateData, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  // Delete farmer account
  deleteAccount: async () => {
    const response = await axios.delete(`${API_URL}/farmer/account`, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

    recordHarvest: async (seasonId, harvestData) => {
    const response = await axios.post(`${API_URL}/farmer/seasons/${seasonId}/harvest`, harvestData, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  deleteSeason: async (seasonId) => {
    const response = await axios.delete(`${API_URL}/farmer/seasons/${seasonId}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  // farmerService.js
confirmLabor: async (agreementId) => {
  const response = await axios.post(
    `${API_URL}/farmer/labor-agreements/${agreementId}/confirm`,
    {},
    { headers: getAuthHeader() }
  );
  return response.data;
},

  createLandSharing: async (sharingData) => {
    const response = await axios.post(`${API_URL}/farmer/land-sharing`, sharingData, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  acceptLandSharing: async (sharingId) => {
    const response = await axios.put(`${API_URL}/farmer/land-sharing/${sharingId}/accept`, {}, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

    linkSeasonToSharing: async (data) => {
    const response = await axios.put(`${API_URL}/farmer/seasons/link-sharing`, data, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  updateLandSharingSettlement: async (sharingId, data) => {
  const response = await axios.put(`${API_URL}/farmer/land-sharing/${sharingId}/settlement`, data, {
    headers: getAuthHeader(),
  });
  return response.data;
},

markPaymentComplete: async (sharingId) => {
  const response = await axios.patch(
    `${API_URL}/farmer/land-sharing/${sharingId}/payment-complete`,
    {},
    { headers: getAuthHeader() }
  );
  return response.data;
},
};

export default farmerService;
