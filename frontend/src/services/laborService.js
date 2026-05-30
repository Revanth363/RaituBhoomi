import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URL + '/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const laborService = {
  // Update availability settings
  updateAvailability: async (travelRange) => {
    const response = await axios.put(
      `${API_URL}/labor/availability`,
      { willingTravel: travelRange },
      { headers: getAuthHeader() }
    );
    return response.data;
  },

  // Get available labor requirements
  getAvailableRequirements: async () => {
    const response = await axios.get(`${API_URL}/labor/requirements`, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  // NEW: Agree to work (correct endpoint)
  agreeToRequirement: async (requirementId) => {
    const response = await axios.post(
      `${API_URL}/labor/requirements/${requirementId}/agree`,
      {},
      { headers: getAuthHeader() }
    );
    return response.data;
  },

  // Get labor work history
  getWorkHistory: async () => {
    const response = await axios.get(`${API_URL}/labor/work-history`, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  // Create work record (after actual work)
  createWorkRecord: async (workData) => {
    const response = await axios.post(`${API_URL}/labor/work`, workData, {
      headers: getAuthHeader(),
    });
    return response.data;
  },
};

export default laborService;