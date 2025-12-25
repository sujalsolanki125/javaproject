import { useState } from 'react';
import api from '../../services/api';

const ApiDiagnostics = () => {
  const [tests, setTests] = useState({
    backend: null,
    carbonInterface: null,
    vehicleMakes: null
  });
  const [loading, setLoading] = useState(false);

  const runDiagnostics = async () => {
    setLoading(true);
    const results = {
      backend: null,
      carbonInterface: null,
      vehicleMakes: null
    };

    // Test 1: Backend health
    try {
      console.log('Testing backend connectivity...');
      const response = await api.get('/api/carbon-logs', { timeout: 5000 });
      results.backend = {
        status: 'success',
        message: 'Backend is running ✅',
        details: `Server responded with status ${response.status}`
      };
    } catch (err) {
      results.backend = {
        status: 'error',
        message: 'Backend is not responding ❌',
        details: err.message || 'Connection failed. Check if server is running on port 8080.'
      };
    }

    // Test 2: Carbon Interface API auth
    try {
      console.log('Testing Carbon Interface API authentication...');
      const response = await api.get('/api/carbon-interface/auth/test');
      if (response.data?.success) {
        results.carbonInterface = {
          status: 'success',
          message: 'Carbon Interface API authenticated ✅',
          details: response.data.message
        };
      } else {
        results.carbonInterface = {
          status: 'error',
          message: 'Carbon Interface API key invalid ❌',
          details: response.data?.message || 'Authentication failed'
        };
      }
    } catch (err) {
      results.carbonInterface = {
        status: 'error',
        message: 'Cannot reach Carbon Interface API test ❌',
        details: err.message || 'Check backend logs and API key configuration'
      };
    }

    // Test 3: Vehicle Makes
    try {
      console.log('Testing vehicle makes API...');
      const response = await api.get('/api/carbon-interface/vehicles/makes', { timeout: 10000 });
      if (response.data && Array.isArray(response.data)) {
        results.vehicleMakes = {
          status: 'success',
          message: `Vehicle makes loaded ✅ (${response.data.length} makes available)`,
          details: `Successfully fetched vehicle makes from Carbon Interface API`
        };
      } else {
        results.vehicleMakes = {
          status: 'warning',
          message: 'Vehicle makes returned empty ⚠️',
          details: 'API responded but no data received'
        };
      }
    } catch (err) {
      results.vehicleMakes = {
        status: 'error',
        message: 'Failed to load vehicle makes ❌',
        details: err.message || 'API call failed'
      };
    }

    setTests(results);
    setLoading(false);
  };

  return (
    <div className="fixed bottom-4 right-4 max-w-sm">
      <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-4">
        <h3 className="text-sm font-bold text-gray-900 mb-4">API Diagnostics</h3>
        
        <button
          onClick={runDiagnostics}
          disabled={loading}
          className="w-full mb-4 px-3 py-2 bg-blue-500 text-white rounded text-sm font-medium hover:bg-blue-600 disabled:bg-gray-400"
        >
          {loading ? 'Running tests...' : 'Run Diagnostics'}
        </button>

        <div className="space-y-3">
          {tests.backend && (
            <div className={`p-2 rounded text-xs ${tests.backend.status === 'success' ? 'bg-green-50' : 'bg-red-50'}`}>
              <p className={tests.backend.status === 'success' ? 'text-green-700 font-bold' : 'text-red-700 font-bold'}>
                Backend
              </p>
              <p className={tests.backend.status === 'success' ? 'text-green-600' : 'text-red-600'}>
                {tests.backend.message}
              </p>
              <p className="text-gray-600 mt-1">{tests.backend.details}</p>
            </div>
          )}

          {tests.carbonInterface && (
            <div className={`p-2 rounded text-xs ${tests.carbonInterface.status === 'success' ? 'bg-green-50' : 'bg-red-50'}`}>
              <p className={tests.carbonInterface.status === 'success' ? 'text-green-700 font-bold' : 'text-red-700 font-bold'}>
                Carbon Interface API
              </p>
              <p className={tests.carbonInterface.status === 'success' ? 'text-green-600' : 'text-red-600'}>
                {tests.carbonInterface.message}
              </p>
              <p className="text-gray-600 mt-1">{tests.carbonInterface.details}</p>
            </div>
          )}

          {tests.vehicleMakes && (
            <div className={`p-2 rounded text-xs ${tests.vehicleMakes.status === 'success' ? 'bg-green-50' : tests.vehicleMakes.status === 'warning' ? 'bg-yellow-50' : 'bg-red-50'}`}>
              <p className={`font-bold ${tests.vehicleMakes.status === 'success' ? 'text-green-700' : tests.vehicleMakes.status === 'warning' ? 'text-yellow-700' : 'text-red-700'}`}>
                Vehicle Makes
              </p>
              <p className={tests.vehicleMakes.status === 'success' ? 'text-green-600' : tests.vehicleMakes.status === 'warning' ? 'text-yellow-600' : 'text-red-600'}>
                {tests.vehicleMakes.message}
              </p>
              <p className="text-gray-600 mt-1">{tests.vehicleMakes.details}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApiDiagnostics;
