import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URL + '/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const adminService = {
  // Get pending posts for moderation
  getPendingPosts: async () => {
    const response = await axios.get(`${API_URL}/admin/posts/pending`, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  // Approve a post
  approvePost: async (postId) => {
    const response = await axios.put(
      `${API_URL}/admin/posts/${postId}/approve`,
      {},
      { headers: getAuthHeader() }
    );
    return response.data;
  },

  // Reject a post
  rejectPost: async (postId, reason) => {
    const response = await axios.put(
      `${API_URL}/admin/posts/${postId}/reject`,
      { reason },
      { headers: getAuthHeader() }
    );
    return response.data;
  },

  // Get all posts (approved, pending, rejected)
  getAllPosts: async () => {
    const response = await axios.get(`${API_URL}/admin/posts`, {
      headers: getAuthHeader(),
    });
    return response.data;
  },
};

export default adminService;
