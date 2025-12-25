import api from './api';

const goalService = {
  getGoals: async () => {
    const response = await api.get('/api/goals');
    return response.data;
  },

  createGoal: async (goalData) => {
    const response = await api.post('/api/goals', goalData);
    return response.data;
  },

  updateGoal: async (goalId, goalData) => {
    const response = await api.put(`/api/goals/${goalId}`, goalData);
    return response.data;
  },

  deleteGoal: async (goalId) => {
    await api.delete(`/api/goals/${goalId}`);
  }
};

export { goalService };
