import api from './api';

export const leaderboardService = {
    getTopLeaderboard: async (limit = 10) => {
        const response = await api.get(`/api/leaderboard/top?limit=${limit}`);
        return response.data;
    },

    getUserLeaderboard: async () => {
        const response = await api.get('/api/leaderboard/user');
        return response.data;
    }
};

export default leaderboardService;
