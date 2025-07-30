// API Configuration
export const API_CONFIG = {
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

// Date formatting helper
export const formatDate = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// URL builder
export const buildAPIUrl = (proxy = null) => {
  const today = new Date()
  const todayDate = formatDate(today)
  
  const baseUrl = `${API_CONFIG.endpoint}/${API_CONFIG.key}/locations/${API_CONFIG.location}/weather.json?forecasts=${API_CONFIG.requestTypes}&days=${API_CONFIG.period}&startDate=${todayDate}`
  
  if (proxy) {
    // Handle different proxy formats
    if (proxy === 'https://api.allorigins.win/raw?url=') {
      return `${proxy}${encodeURIComponent(baseUrl)}`
    } else if (proxy === 'https://corsproxy.io/?') {
      return `${proxy}${encodeURIComponent(baseUrl)}`
    } else {
      return `${proxy}${baseUrl}`
    }
  }
  
  return baseUrl
} 