export const AQI_LEVELS = {
  GOOD: { min: 0, max: 50, color: '#00E400', label: 'Good', description: 'Air quality is satisfactory' },
  MODERATE: { min: 51, max: 100, color: '#FFFF00', label: 'Moderate', description: 'Air quality is acceptable' },
  SENSITIVE: { min: 101, max: 150, color: '#FF7E00', label: 'Unhealthy for Sensitive Groups', description: 'Members of sensitive groups may experience health effects' },
  UNHEALTHY: { min: 151, max: 200, color: '#FF0000', label: 'Unhealthy', description: 'Everyone may begin to experience health effects' },
  VERY_UNHEALTHY: { min: 201, max: 300, color: '#8F3F97', label: 'Very Unhealthy', description: 'Health warnings of emergency conditions' },
  HAZARDOUS: { min: 301, max: 500, color: '#7E0023', label: 'Hazardous', description: 'Health alert: everyone may experience serious health effects' },
};

export const getAQILevel = (aqi: number) => {
  if (aqi <= 50) return AQI_LEVELS.GOOD;
  if (aqi <= 100) return AQI_LEVELS.MODERATE;
  if (aqi <= 150) return AQI_LEVELS.SENSITIVE;
  if (aqi <= 200) return AQI_LEVELS.UNHEALTHY;
  if (aqi <= 300) return AQI_LEVELS.VERY_UNHEALTHY;
  return AQI_LEVELS.HAZARDOUS;
};

export const POLLUTANT_INFO = {
  pm25: { name: 'PM2.5', unit: 'μg/m³', description: 'Fine Particulate Matter' },
  pm10: { name: 'PM10', unit: 'μg/m³', description: 'Coarse Particulate Matter' },
  no2: { name: 'NO₂', unit: 'ppb', description: 'Nitrogen Dioxide' },
  so2: { name: 'SO₂', unit: 'ppb', description: 'Sulfur Dioxide' },
  co: { name: 'CO', unit: 'ppm', description: 'Carbon Monoxide' },
  o3: { name: 'O₃', unit: 'ppb', description: 'Ground-level Ozone' },
};