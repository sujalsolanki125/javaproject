# Carbon Interface API Implementation

## Overview
I have successfully implemented the Carbon Interface API integration based on the official documentation from https://docs.carboninterface.com/

## New Features Added

### 1. Enhanced CarbonInterfaceClient
- **Authentication Testing**: `testAuth()` method to verify API key validity
- **Electricity Emissions**: Enhanced with state-level precision for US estimates
- **Vehicle Emissions**: Proper integration with vehicle model IDs from API
- **Flight Emissions**: Support for multiple flight legs and cabin classes
- **Shipping Emissions**: Support for all transport methods (truck, ship, plane, train)
- **Fuel Combustion**: Support for various fuel types and units
- **Vehicle Data**: Methods to fetch vehicle makes and models from API

### 2. New DTOs
- `CarbonEstimateResponse`: Comprehensive response structure for all estimate types
- `VehicleMakeResponse`: Vehicle manufacturer data
- `VehicleModelResponse`: Specific vehicle model data with year and make info

### 3. VehicleLookupService
- Smart vehicle description parsing (e.g., "2020 Toyota Camry")
- Vehicle model ID lookup by make, model, and year
- Fallback mechanisms for unknown vehicles
- Popular vehicle suggestions for UI

### 4. CarbonInterfaceController
- REST endpoints for all API functionality:
  - `GET /api/carbon-interface/auth/test` - Test authentication
  - `GET /api/carbon-interface/vehicles/makes` - Get vehicle makes
  - `GET /api/carbon-interface/vehicles/makes/{makeId}/models` - Get models
  - `POST /api/carbon-interface/estimate/electricity` - Calculate electricity emissions
  - `POST /api/carbon-interface/estimate/vehicle` - Calculate vehicle emissions
  - `POST /api/carbon-interface/estimate/flight` - Calculate flight emissions
  - `POST /api/carbon-interface/estimate/shipping` - Calculate shipping emissions
  - `POST /api/carbon-interface/estimate/fuel` - Calculate fuel combustion emissions

### 5. Enhanced Caching
- Primary cache manager for general API responses
- Long-term cache manager for static data (vehicle makes/models)
- Configurable TTL and cache separation

## API Key Configuration
```yaml
carbon:
  interface:
    api:
      key: ${CARBON_INTERFACE_API_KEY:Z25S0cuIX1yvvRulM1bg}
      url: https://www.carboninterface.com/api/v1
```

## Example Usage

### 1. Test Authentication
```bash
GET /api/carbon-interface/auth/test
Response: {"success": true, "message": "API authentication successful"}
```

### 2. Calculate Electricity Emissions
```json
POST /api/carbon-interface/estimate/electricity
{
  "kwh": 100,
  "country": "us",
  "state": "ca"
}
Response: {
  "success": true,
  "emissions_kg": 42.5,
  "request": {"kwh": 100, "country": "us", "state": "ca"}
}
```

### 3. Calculate Vehicle Emissions
```json
POST /api/carbon-interface/estimate/vehicle
{
  "distance_miles": 50,
  "vehicle_model_id": "7268a9b7-17e8-4c8d-acca-57059252afe9"
}
```

### 4. Calculate Flight Emissions
```json
POST /api/carbon-interface/estimate/flight
{
  "passengers": 2,
  "legs": [
    {"departure_airport": "sfo", "destination_airport": "jfk"},
    {"departure_airport": "jfk", "destination_airport": "sfo"}
  ],
  "distance_unit": "mi"
}
```

## Integration Points

### Updated CarbonCalcService
- Now uses vehicle model ID lookup for accurate vehicle emissions
- Enhanced electricity calculations with state-level data
- Improved error handling and fallback mechanisms

### Error Handling
- Comprehensive HTTP error handling with status codes
- Graceful fallbacks for API failures
- Detailed logging for debugging

### Performance Optimizations
- Smart caching strategies for different data types
- Connection timeouts and retry mechanisms
- Efficient vehicle lookup algorithms

## Testing
The implementation includes comprehensive error handling and logging. You can test the API by:

1. **Authentication**: Check if your API key is working
2. **Vehicle Data**: Fetch available makes and models
3. **Calculations**: Test all emission calculation endpoints

## Benefits
- **Accuracy**: Real-time data from authoritative sources
- **Coverage**: Support for electricity, vehicles, flights, shipping, and fuel
- **Flexibility**: Configurable for different regions and vehicle types
- **Performance**: Intelligent caching and optimized lookups
- **Reliability**: Robust error handling and fallback mechanisms

This implementation provides a complete Carbon Interface API integration that significantly enhances the accuracy and scope of carbon emission calculations in your application.