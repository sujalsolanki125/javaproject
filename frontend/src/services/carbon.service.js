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

  // Carbon Interface API Integration
  testCarbonInterfaceAuth: async () => {
    const response = await api.get('/api/carbon-interface/auth/test');
    return response.data;
  },

  getVehicleMakes: async () => {
    const response = await api.get('/api/carbon-interface/vehicles/makes');
    return response.data;
  },

  getVehicleModels: async (makeId) => {
    const response = await api.get(`/api/carbon-interface/vehicles/makes/${makeId}/models`);
    return response.data;
  },

  calculateElectricityEmissions: async (kwh, country, state = null) => {
    const response = await api.post('/api/carbon-interface/estimate/electricity', {
      kwh, country, state
    });
    return response.data;
  },

  calculateVehicleEmissions: async (distanceMiles, vehicleModelId) => {
    const response = await api.post('/api/carbon-interface/estimate/vehicle', {
      distance_miles: distanceMiles,
      vehicle_model_id: vehicleModelId
    });
    return response.data;
  },

  calculateFlightEmissions: async (passengers, legs, distanceUnit = 'km') => {
    const response = await api.post('/api/carbon-interface/estimate/flight', {
      passengers,
      legs,
      distance_unit: distanceUnit
    });
    return response.data;
  },

  calculateShippingEmissions: async (weightValue, weightUnit, distanceValue, distanceUnit, transportMethod) => {
    const response = await api.post('/api/carbon-interface/estimate/shipping', {
      weight_value: weightValue,
      weight_unit: weightUnit,
      distance_value: distanceValue,
      distance_unit: distanceUnit,
      transport_method: transportMethod
    });
    return response.data;
  },

  calculateFuelEmissions: async (fuelSourceType, fuelSourceUnit, fuelSourceValue) => {
    const response = await api.post('/api/carbon-interface/estimate/fuel', {
      fuel_source_type: fuelSourceType,
      fuel_source_unit: fuelSourceUnit,
      fuel_source_value: fuelSourceValue
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

  // Get trend data for graph
  getTrendData: async (days = 30) => {
    const response = await api.get('/api/carbon-logs/trend', {
      params: { days }
    });
    return response.data;
  },

  // Calculate carbon footprint from survey
  calculateFootprint: (surveyData = {}) => {
    const toNumber = (value) => {
      const parsed = parseFloat(value);
      return Number.isFinite(parsed) ? parsed : 0;
    };

    const round = (value) => Number((value || 0).toFixed(2));

    const breakdown = {
      transportation: 0,
      diet: 0,
      energy: 0,
      lifestyle: 0
    };

    // Transportation (commute + flights)
    const transportFactors = {
      car: 0.192, // kg CO2e per km
      ev: 0.053,
      bus: 0.105,
      train: 0.041,
      bicycle: 0,
      walk: 0
    };

    const frequencyFactors = {
      '5-days': 1,
      '3-days': 0.6,
      '1-day': 0.2,
      'rarely': 0.05
    };

    const weeklyKm = toNumber(surveyData.commuteDistance);
    const frequencyFactor = frequencyFactors[surveyData.commuteFrequency] ?? 1;
    const annualKm = weeklyKm * 52 * frequencyFactor;
    const kgPerKm = transportFactors[surveyData.transportMode] ?? transportFactors.car;
    let transportation = annualKm * kgPerKm;

    const shortFlights = toNumber(surveyData.shortHaulFlights);
    const longFlights = toNumber(surveyData.longHaulFlights);
    transportation += shortFlights * 250 + longFlights * 1100;
    breakdown.transportation = transportation;

    // Diet (annual kg CO2e)
    const dietProfiles = {
      vegan: 1000,
      vegetarian: 1200,
      pescatarian: 1500,
      omnivore: 2500
    };
    breakdown.diet = dietProfiles[surveyData.dietType] ?? 1700;

    // Energy (annual)
    const monthlyElectricity = toNumber(surveyData.electricityUsage);
    const annualElectricity = monthlyElectricity * 12;
    let energy = annualElectricity * 0.417; // kg CO2e per kWh

    const naturalGasUsage = toNumber(surveyData.naturalGasUsage);
    if (naturalGasUsage > 0) {
      const gasFactor = surveyData.naturalGasUnit === 'cubic feet (CCF)' ? 5.3 * 1.037 : 5.3;
      energy += naturalGasUsage * gasFactor;
    }

    const heatingOilUsage = toNumber(surveyData.heatingOilUsage);
    if (heatingOilUsage > 0) {
      energy += heatingOilUsage * 10.16;
    }
    breakdown.energy = energy;

    // Lifestyle savings (negative impact reduces footprint)
    const habitSavings = {
      useReusableBags: 15,
      recycleWaste: 60,
      compostFood: 45,
      unplugElectronics: 25,
      buyLocalProduce: 35
    };

    let lifestyleImpact = 0;
    Object.entries(habitSavings).forEach(([habit, savings]) => {
      if (surveyData[habit]) lifestyleImpact -= savings;
    });
    breakdown.lifestyle = lifestyleImpact;

    const totalEmissions = Math.max(0, breakdown.transportation + breakdown.diet + breakdown.energy + breakdown.lifestyle);

    return {
      totalEmissions: round(totalEmissions),
      breakdown: {
        transportation: round(breakdown.transportation),
        diet: round(breakdown.diet),
        energy: round(breakdown.energy),
        lifestyle: round(breakdown.lifestyle)
      }
    };
  }
};

export { carbonService };
