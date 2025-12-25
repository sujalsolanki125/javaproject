import { useState, useEffect } from 'react';
import { carbonService } from '../../services/carbon.service';

const ApiTestPanel = () => {
  const [authStatus, setAuthStatus] = useState(null);
  const [testResults, setTestResults] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    testAuthentication();
  }, []);

  const testAuthentication = async () => {
    try {
      setLoading(true);
      const result = await carbonService.testCarbonInterfaceAuth();
      setAuthStatus(result);
    } catch (error) {
      setAuthStatus({ success: false, message: 'Authentication failed' });
    } finally {
      setLoading(false);
    }
  };

  const testElectricityCalculation = async () => {
    try {
      setLoading(true);
      const result = await carbonService.calculateElectricityEmissions(100, 'us', 'ca');
      setTestResults(prev => ({ ...prev, electricity: result }));
    } catch (error) {
      setTestResults(prev => ({ ...prev, electricity: { success: false, message: error.message } }));
    } finally {
      setLoading(false);
    }
  };

  const testVehicleData = async () => {
    try {
      setLoading(true);
      const makes = await carbonService.getVehicleMakes();
      setTestResults(prev => ({ 
        ...prev, 
        vehicleMakes: { 
          success: true, 
          count: makes?.length || 0,
          sample: makes?.slice(0, 3)?.map(m => m.attributes?.name).join(', ') 
        } 
      }));
    } catch (error) {
      setTestResults(prev => ({ ...prev, vehicleMakes: { success: false, message: error.message } }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Carbon Interface API Status
      </h3>

      {/* Authentication Status */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Authentication</h4>
        <div className="flex items-center space-x-2">
          {authStatus ? (
            <>
              <div className={`w-3 h-3 rounded-full ${authStatus.success ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className={`text-sm ${authStatus.success ? 'text-green-700' : 'text-red-700'}`}>
                {authStatus.message}
              </span>
            </>
          ) : (
            <>
              <div className="w-3 h-3 rounded-full bg-gray-300 animate-pulse"></div>
              <span className="text-sm text-gray-500">Testing...</span>
            </>
          )}
        </div>
      </div>

      {/* Test Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <button
          onClick={testElectricityCalculation}
          disabled={loading || !authStatus?.success}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Test Electricity
        </button>
        <button
          onClick={testVehicleData}
          disabled={loading || !authStatus?.success}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Test Vehicle Data
        </button>
        <button
          onClick={testAuthentication}
          disabled={loading}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Refresh Auth
        </button>
      </div>

      {/* Test Results */}
      {Object.keys(testResults).length > 0 && (
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-700">Test Results</h4>
          {Object.entries(testResults).map(([test, result]) => (
            <div key={test} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <div className={`w-2 h-2 rounded-full ${result.success ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-sm font-medium text-gray-900 capitalize">{test}</span>
              </div>
              {result.success ? (
                <div className="text-sm text-gray-600">
                  {test === 'electricity' && `Emissions: ${result.emissions_kg} kg CO2e`}
                  {test === 'vehicleMakes' && `Found ${result.count} vehicle makes: ${result.sample}`}
                </div>
              ) : (
                <div className="text-sm text-red-600">{result.message}</div>
              )}
            </div>
          ))}
        </div>
      )}

      {loading && (
        <div className="mt-4 flex items-center space-x-2 text-sm text-gray-500">
          <div className="animate-spin h-4 w-4 border-2 border-gray-400 border-t-transparent rounded-full"></div>
          <span>Testing API...</span>
        </div>
      )}
    </div>
  );
};

export default ApiTestPanel;