const OPENWEATHER_API_KEY = '11aadbe8c1069f916e29aea3edd36110';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

interface WeatherResponse {
  main: {
    temp: number;
    humidity: number;
    pressure: number;
  };
  wind: {
    speed: number;
    deg: number;
  };
  visibility: number;
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
  name: string;
}

interface AirPollutionResponse {
  list: Array<{
    main: {
      aqi: number;
    };
    components: {
      co: number;
      no: number;
      no2: number;
      o3: number;
      so2: number;
      pm2_5: number;
      pm10: number;
      nh3: number;
    };
  }>;
}

export const weatherService = {
  async getCurrentWeather(lat: number, lng: number): Promise<WeatherResponse> {
    try {
      console.log(`Fetching weather for: ${lat}, ${lng}`);
      const response = await fetch(
        `${BASE_URL}/weather?lat=${lat}&lon=${lng}&appid=${OPENWEATHER_API_KEY}&units=metric`
      );
      
      if (!response.ok) {
        throw new Error(`Weather API failed: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Weather API response:', data);
      return data;
    } catch (error) {
      console.error('Weather fetch error:', error);
      throw error;
    }
  },

  async getAirPollution(lat: number, lng: number): Promise<AirPollutionResponse> {
    try {
      console.log(`Fetching air pollution for: ${lat}, ${lng}`);
      const response = await fetch(
        `${BASE_URL}/air_pollution?lat=${lat}&lon=${lng}&appid=${OPENWEATHER_API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error(`Air Pollution API failed: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Air Pollution API response:', data);
      return data;
    } catch (error) {
      console.error('Air pollution fetch error:', error);
      throw error;
    }
  },

  async getForecast(lat: number, lng: number): Promise<any> {
    try {
      console.log(`Fetching forecast for: ${lat}, ${lng}`);
      const response = await fetch(
        `${BASE_URL}/forecast?lat=${lat}&lon=${lng}&appid=${OPENWEATHER_API_KEY}&units=metric`
      );
      
      if (!response.ok) {
        throw new Error(`Forecast API failed: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Forecast API response:', data);
      return data;
    } catch (error) {
      console.error('Forecast fetch error:', error);
      throw error;
    }
  }
};