# Weather API Troubleshooting Guide

## Issue Description
The app was previously working but started showing "Weather data or forecasts are missing" error after migrating from Docker to Kubernetes.

## Root Causes Identified

### 1. Date Format Issue
- **Problem**: The date was being formatted as `YYYY-M-D` instead of `YYYY-MM-DD`
- **Fix**: Updated date formatting to use proper zero-padding
- **Location**: `src/App.js` lines 18-20

### 2. CORS Proxy Issues
- **Problem**: The CORS proxy `https://cors-old.leverson83.org/` was failing with CORS errors and 502 Bad Gateway
- **Fix**: Implemented multiple proxy fallbacks with `cors.leverson83.org` as primary proxy
- **Location**: `src/config.js` and `src/App.js`

### 3. API Key Configuration
- **Problem**: API key might be truncated or expired
- **Fix**: Centralized configuration and added fallback mechanisms
- **Location**: `src/config.js`

## Solutions Implemented

### 1. Enhanced Error Handling
- Added comprehensive logging to track API call failures
- Implemented multiple proxy fallbacks
- Added local storage caching
- Added fallback to local weather data

### 2. Configuration Management
- Created `src/config.js` to centralize API settings
- Added multiple proxy options
- Improved date formatting utilities

### 3. Fallback Mechanisms
- **Level 1**: Try primary proxy
- **Level 2**: Try secondary proxy
- **Level 3**: Try direct API call
- **Level 4**: Use cached data from localStorage
- **Level 5**: Use local fallback data

## API Configuration

The app uses the WillyWeather API with the following configuration:

```javascript
{
  key: 'YTFlM2ExMWM1N2ZkMGRiMzM2NmMyYW',
  endpoint: 'https://api.willyweather.com.au/v2',
  location: '6871', // Golden Beach
  requestTypes: 'tides,wind,sunrisesunset,uv,weather,rainfall,rainfallprobability',
  period: 7,
  proxies: [
    'https://cors.leverson83.org/',
    'https://api.allorigins.win/raw?url=',
    'https://corsproxy.io/?',
    'https://thingproxy.freeboard.io/fetch/',
    null // Direct API call
  ]
}
```

## Debugging Steps

1. **Check Browser Console**: Look for detailed error messages
2. **Verify API Key**: Ensure the API key is valid and not truncated
3. **Test Proxies**: Check if CORS proxies are accessible
4. **Check Network Tab**: Monitor API requests and responses
5. **Verify Date Format**: Ensure dates are in `YYYY-MM-DD` format

## Common Error Messages

- `"Weather data or forecasts are missing"`: API response doesn't contain expected data structure
- `"HTTP error! status: 403"`: API key might be invalid or expired
- `"HTTP error! status: 404"`: API endpoint or location ID might be incorrect
- `"CORS error"`: Proxy is not working, will try next fallback

## Environment Variables (Future Enhancement)

Consider moving the API key to environment variables:

```bash
REACT_APP_WILLYWEATHER_API_KEY=your_api_key_here
```

Then update `src/config.js`:

```javascript
export const API_CONFIG = {
  key: process.env.REACT_APP_WILLYWEATHER_API_KEY || 'YTFlM2ExMWM1N2ZkMGRiMzM2NmMyYW',
  // ... rest of config
}
```

## Testing

To test the API directly, you can use the browser console:

```javascript
// Test direct API call
fetch('https://api.willyweather.com.au/v2/YTFlM2ExMWM1N2ZkMGRiMzM2NmMyYW/locations/6871/weather.json?forecasts=tides,wind,sunrisesunset,uv,weather,rainfall,rainfallprobability&days=7&startDate=2024-01-15')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error(error))
```

## Kubernetes Considerations

When deploying to Kubernetes, ensure:

1. **Environment Variables**: Set API keys as secrets
2. **CORS Headers**: Configure proper CORS headers if needed
3. **Network Policies**: Allow outbound HTTPS traffic to weather APIs
4. **Resource Limits**: Ensure sufficient memory for the React app

## Monitoring

The app now includes comprehensive logging:

- API call attempts and responses
- Proxy fallback attempts
- Error details and stack traces
- Data structure validation
- Local storage operations

Check the browser console for detailed debugging information. 