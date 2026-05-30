// src/services/archiveService.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URL + '/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const archiveService = {
  // Get all approved posts (public)
  getPosts: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await axios.get(`${API_URL}/archive/posts?${params}`);
    return response.data;
  },

  // Create new post with base64 images (farmer only)
  createPost: async (postData) => {
    const response = await axios.post(`${API_URL}/archive/posts`, postData, {
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'application/json'
      },
    });
    return response.data;
  },
};

export default archiveService;