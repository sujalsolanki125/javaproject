import api from './api';

const userService = {
  // Get current user profile
  getProfile: async () => {
    const response = await api.get('/api/users/profile');
    return response.data;
  },

  // Update user profile
  updateProfile: async (profileData) => {
    const response = await api.put('/api/users/profile', profileData);
    return response.data;
  },

  // Change password
  changePassword: async (passwordData) => {
    const response = await api.put('/api/users/change-password', passwordData);
    return response.data;
  },

  // Update notification preferences
  updateNotificationPreferences: async (preferences) => {
    const response = await api.put('/api/users/notification-preferences', preferences);
    return response.data;
  },

  // Get user stats
  getUserStats: async () => {
    const response = await api.get('/api/users/stats');
    return response.data;
  },

  // Upload profile picture
  uploadProfilePicture: async (base64Image) => {
    const response = await api.post('/api/users/profile-picture', {
      profilePicture: base64Image
    });
    return response.data;
  }
};
export { userService };export default userService;
