# VehicleSelector Troubleshooting Guide

## Issue
The Vehicle Make dropdown in the survey form shows "Select a make..." but no options appear when clicked.

## Root Causes
The VehicleSelector component can't load vehicles from the Carbon Interface API for two main reasons:

1. **Backend Server Not Running**
   - The `/api/carbon-interface/vehicles/makes` endpoint needs the backend server to be running
   - If backend is down, the API call returns 0 status code (connection refused)

2. **Invalid Carbon Interface API Key**
   - If the API key is incorrect or expired, the backend will receive no vehicles from Carbon Interface
   - This returns status 401 or 403, or an empty list

## Solution Steps

### Step 1: Ensure Backend is Running
The backend must be running for the survey form to work. In VS Code terminal:

```bash
cd backend
mvn spring-boot:run
```

The server should start on `http://localhost:8080`

### Step 2: Use the API Diagnostics Tool
A new diagnostic panel has been added to the survey form (bottom-right corner). Use it to test:

1. **Backend** - Checks if the server is running and responding
2. **Carbon Interface API** - Verifies the API key is valid
3. **Vehicle Makes** - Tests the actual endpoint that loads vehicles

Each test shows:
- ✅ **Success** (green) - System working correctly
- ⚠️ **Warning** (yellow) - Partial issue
- ❌ **Error** (red) - Something is broken

### Step 3: Check Browser Console
The VehicleSelector component now logs detailed information to the browser console:

```
🔄 Loading vehicle makes from /api/carbon-interface/vehicles/makes
✅ Vehicle makes response: [...]
📊 Makes count: 32
```

If you see errors, check the error details output which includes:
- API response status code
- Backend error messages
- Whether the issue is network or authentication

### Step 4: Verify Backend Configuration

Check that `backend/src/main/resources/application.yml` has:

```yaml
carbon:
  interface:
    api:
      key: ${CARBON_INTERFACE_API_KEY:Z25S0cuIX1yvvRulM1bg}
      url: https://www.carboninterface.com/api/v1
```

If the default key doesn't work, you may need to:
1. Get a valid Carbon Interface API key from their website
2. Set the environment variable: `export CARBON_INTERFACE_API_KEY=your_key`
3. Or update the default in application.yml

### Step 5: Rebuild Frontend (if needed)

If you made changes to VehicleSelector or added diagnostic component:

```bash
cd frontend
npm run build
# or for development:
npm run dev
```

## What the Enhanced VehicleSelector Does

1. **Loads vehicle makes** when component mounts
2. **Shows loading state** - "Loading vehicles..." text
3. **Shows error message** if API fails with details:
   - "Backend API is not responding. Check if server is running on port 8080."
   - "API authentication failed. Check Carbon Interface API key in backend."
   - "Backend server error. Check backend logs."
   - Or the specific error message

4. **Disables make dropdown** if no vehicles loaded
5. **Logs to console** for debugging

## Testing the Full Flow

Once vehicles load:

1. Select a vehicle make from the dropdown
2. Select a specific model
3. Continue through survey steps
4. Submit the survey
5. Check dashboard to see the calculated emissions from Carbon Interface API

## Backend Endpoints

The survey uses these endpoints:

- `GET /api/carbon-interface/vehicles/makes` - Get all vehicle makes
- `GET /api/carbon-interface/vehicles/makes/{makeId}/models` - Get models for a make
- `POST /api/carbon-logs/from-survey` - Submit survey (calls Carbon Interface for calculations)

All endpoints require the backend to be running and properly configured.
