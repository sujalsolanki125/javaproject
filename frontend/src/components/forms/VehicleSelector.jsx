import { useState, useEffect } from 'react';
import { carbonService } from '../../services/carbon.service';

const VehicleSelector = ({ value, onChange }) => {
  const [vehicleMakes, setVehicleMakes] = useState([]);
  const [vehicleModels, setVehicleModels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedMake, setSelectedMake] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedYear, setSelectedYear] = useState('');

  useEffect(() => {
    loadVehicleMakes();
  }, []);

  const loadVehicleMakes = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('🔄 Loading vehicle makes from /api/carbon-interface/vehicles/makes');
      
      const makes = await carbonService.getVehicleMakes();
      console.log('✅ Vehicle makes response:', makes);
      console.log('📊 Makes count:', makes?.length || 0);
      
      if (!makes || makes.length === 0) {
        console.warn('⚠️ No vehicle makes returned - backend may not be connected to Carbon Interface API');
        setError('No vehicles available. Ensure backend is running and has valid Carbon Interface API key.');
      }
      setVehicleMakes(makes || []);
    } catch (err) {
      console.error('❌ Failed to load vehicle makes:', err);
      console.error('Error details:', {
        message: err.message,
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data
      });
      
      if (err.response?.status === 0) {
        setError('Backend API is not responding. Check if server is running on port 8080.');
      } else if (err.response?.status === 401 || err.response?.status === 403) {
        setError('API authentication failed. Check Carbon Interface API key in backend.');
      } else if (err.response?.status === 500) {
        setError('Backend server error. Check backend logs.');
      } else {
        setError(`Failed to load vehicles: ${err.message || 'Network error'}`);
      }
      setVehicleMakes([]);
    } finally {
      setLoading(false);
    }
  };

  const loadVehicleModels = async (makeId) => {
    try {
      setLoading(true);
      const models = await carbonService.getVehicleModels(makeId);
      setVehicleModels(models || []);
    } catch (error) {
      console.error('Failed to load vehicle models:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMakeChange = (e) => {
    const makeId = e.target.value;
    const make = vehicleMakes.find(m => m.id === makeId);
    
    setSelectedMake(makeId);
    setSelectedModel('');
    setSelectedYear('');
    setVehicleModels([]);
    
    if (makeId) {
      loadVehicleModels(makeId);
    }
    
    updateValue(make?.attributes?.name || '', '', '');
  };

  const handleModelChange = (e) => {
    const modelId = e.target.value;
    const model = vehicleModels.find(m => m.id === modelId);
    
    setSelectedModel(modelId);
    setSelectedYear(model?.attributes?.year || '');
    
    updateValue(
      vehicleMakes.find(m => m.id === selectedMake)?.attributes?.name || '',
      model?.attributes?.name || '',
      model?.attributes?.year || '',
      modelId
    );
  };

  const updateValue = (make, model, year, modelId = '') => {
    const vehicleInfo = {
      make,
      model,
      year,
      modelId,
      description: `${year} ${make} ${model}`.trim()
    };
    onChange(vehicleInfo);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Select Your Vehicle</h3>
      
      {/* Vehicle Make */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Vehicle Make
        </label>
        {error && (
          <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            {error}
          </div>
        )}
        <select
          value={selectedMake}
          onChange={handleMakeChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-400"
          disabled={loading || vehicleMakes.length === 0}
        >
          <option value="">
            {loading ? 'Loading vehicles...' : vehicleMakes.length === 0 ? 'No vehicles available' : 'Select a make...'}
          </option>
          {vehicleMakes.map(make => (
            <option key={make.id} value={make.id}>
              {make.attributes.name} ({make.attributes.numberOfModels} models)
            </option>
          ))}
        </select>
      </div>

      {/* Vehicle Model */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Vehicle Model
        </label>
        <select
          value={selectedModel}
          onChange={handleModelChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          disabled={loading || !selectedMake}
        >
          <option value="">Select a model...</option>
          {vehicleModels.map(model => (
            <option key={model.id} value={model.id}>
              {model.attributes.name} ({model.attributes.year})
            </option>
          ))}
        </select>
      </div>

      {/* Selected Vehicle Display */}
      {value?.description && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-green-800">
            <span className="font-medium">Selected Vehicle:</span> {value.description}
          </p>
        </div>
      )}

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      {loading && (
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <div className="animate-spin h-4 w-4 border-2 border-green-500 border-t-transparent rounded-full"></div>
          <span>Loading vehicles...</span>
        </div>
      )}
    </div>
  );
};

export default VehicleSelector;