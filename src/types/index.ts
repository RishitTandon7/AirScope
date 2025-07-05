export interface AQIData {
  aqi: number;
  location: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  pollutants: {
    pm25: number;
    pm10: number;
    no2: number;
    so2: number;
    co: number;
    o3: number;
  };
  timestamp: string;
  source: string;
}

export interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  pressure: number;
  visibility: number;
  condition?: string;
  description?: string;
}

export interface HealthRecommendation {
  level: string;
  description: string;
  activities: string[];
  sensitiveGroups: string[];
  icon: string;
  color: string;
}

export interface ForecastData {
  timestamp: string;
  aqi: number;
  confidence: number;
  weather: WeatherData;
}

export interface HistoricalData {
  date: string;
  aqi: number;
  pollutants: {
    pm25: number;
    pm10: number;
    no2: number;
  };
}

export interface NotificationSettings {
  enabled: boolean;
  threshold: number;
  geoFencing: boolean;
  types: string[];
}

export interface PollutionReport {
  id: string;
  location: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  type: string;
  description: string;
  severity: number;
  timestamp: string;
  reportedBy: string;
  verified: boolean;
}