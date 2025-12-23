import api from './api';

const carbonService = {
  // Carbon Logs CRUD
  getLogs: async () => {
    const response = await api.get('/api/carbon-logs');
    return response.data;
  },

  getLogById: async (id) => {
    const response = await api.get(`/api/carbon-logs/${id}`);
    return response.data;
  },

  createLog: async (logData) => {
    const response = await api.post('/api/carbon-logs', logData);
    return response.data;
  },

  updateLog: async (id, logData) => {
    const response = await api.put(`/api/carbon-logs/${id}`, logData);
    return response.data;
  },

  deleteLog: async (id) => {
    const response = await api.delete(`/api/carbon-logs/${id}`);
    return response.data;
  },

  // Query operations
  getLogsByDateRange: async (startDate, endDate) => {
    const response = await api.get('/api/carbon-logs/range', {
      params: { startDate, endDate }
    });
    return response.data;
  },

  getMonthlySummary: async (year, month) => {
    const response = await api.get('/api/carbon-logs/monthly-summary', {
      params: { year, month }
    });
    return response.data;
  },

  getTotalEmissions: async (startDate, endDate) => {
    const response = await api.get('/api/carbon-logs/total', {
      params: { startDate, endDate }
    });
    return response.data;
  },

  // Survey submission - creates carbon log from survey data
  submitSurvey: async (surveyData) => {
    const response = await api.post('/api/carbon-logs/from-survey', surveyData);
    return response.data;
  },

  // Dashboard stats
  getDashboardStats: async () => {
    const response = await api.get('/api/carbon-logs/dashboard-stats');
    return response.data;
  },

  // Calculate carbon footprint from survey
  calculateFootprint: (surveyData) => {
    let totalEmissions = 0;
    const breakdown = {
      transportation: 0,
      diet: 0,
      energy: 0,
      lifestyle: 0
    };

    // Transportation calculations (kg CO2e per year)
    if (surveyData.transportMode) {
      const transportEmissions = {
        'car': 4600,
        'public_transport': 1200,
        'bike': 0,
        'walk': 0,
        'motorcycle': 2800
      };
      const baseEmission = transportEmissions[surveyData.transportMode] || 0;
      
      // Adjust based on commute frequency
      const frequencyMultiplier = {
        'daily': 1.0,
        'weekly': 0.4,
        'monthly': 0.1,
        'rarely': 0.05
      };
      const freqMult = frequencyMultiplier[surveyData.commuteFrequency] || 0.5;
      
      // Distance factor (normalized to 50km baseline)
      const distanceFactor = surveyData.commuteDistance / 50;
      
      breakdown.transportation = baseEmission * freqMult * distanceFactor;
    }

    // Flight emissions
    breakdown.transportation += (surveyData.shortHaulFlights || 0) * 300; // 300 kg per short flight
    breakdown.transportation += (surveyData.longHaulFlights || 0) * 1200; // 1200 kg per long flight

    // Diet calculations (kg CO2e per year)
    const dietEmissions = {
      'vegan': 1500,
      'vegetarian': 1700,
      'pescatarian': 1900,
      'omnivore': 2500
    };
    breakdown.diet = dietEmissions[surveyData.dietType] || 2000;

    // Energy calculations (kg CO2e)
    if (surveyData.electricityUsage) {
      const electricity = parseFloat(surveyData.electricityUsage) || 0;
      // 0.92 lbs CO2 per kWh = 0.417 kg per kWh
      breakdown.energy += electricity * 0.417;
    }
    
    if (surveyData.naturalGasUsage) {
      const gas = parseFloat(surveyData.naturalGasUsage) || 0;
      // 11.7 lbs CO2 per therm = 5.3 kg per therm
      breakdown.energy += gas * 5.3;
    }
    
    if (surveyData.heatingOilUsage) {
      const oil = parseFloat(surveyData.heatingOilUsage) || 0;
      // 22.4 lbs CO2 per gallon = 10.16 kg per gallon
      breakdown.energy += oil * 10.16;
    }

    // Lifestyle/habits (reduction factors)
    let lifestyleReduction = 0;
    if (surveyData.useReusableBags) lifestyleReduction += 10;
    if (surveyData.recycleWaste) lifestyleReduction += 50;
    if (surveyData.compostFood) lifestyleReduction += 30;
    if (surveyData.unplugElectronics) lifestyleReduction += 20;
    if (surveyData.buyLocalProduce) lifestyleReduction += 40;
    
    breakdown.lifestyle = -lifestyleReduction; // Negative = reduction

    // Calculate total
    totalEmissions = breakdown.transportation + breakdown.diet + breakdown.energy + breakdown.lifestyle;

    return {
      totalEmissions: Math.max(0, totalEmissions).toFixed(2),
      breakdown: {
        transportation: breakdown.transportation.toFixed(2),
        diet: breakdown.diet.toFixed(2),
        energy: breakdown.energy.toFixed(2),
        lifestyle: breakdown.lifestyle.toFixed(2)
      }
    };
  }
};

export default carbonService;
