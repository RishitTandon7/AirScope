import { useState, useEffect } from 'react';
import { weatherService } from '../services/weatherService';
import { WeatherData } from '../types';

interface EnhancedWeatherData extends WeatherData {
  condition?: string;
  description?: string;
}

export const useWeatherData = (lat?: number, lng?: number) => {
  const [data, setData] = useState<EnhancedWeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      if (!lat || !lng) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const weatherData = await weatherService.getCurrentWeather(lat, lng);
        
        const processedData: EnhancedWeatherData = {
          temperature: Math.round(weatherData.main.temp),
          humidity: weatherData.main.humidity,
          windSpeed: Math.round(weatherData.wind.speed * 3.6), // Convert m/s to km/h
          windDirection: weatherData.wind.deg || 0,
          pressure: weatherData.main.pressure,
          visibility: Math.round((weatherData.visibility || 10000) / 1000), // Convert to km
          condition: weatherData.weather[0]?.main || 'Clear',
          description: weatherData.weather[0]?.description || 'Clear sky',
        };

        setData(processedData);
        
      } catch (err) {
        setError('Failed to fetch weather data');
        console.error('Weather fetch error:', err);
        
        // Fallback data
        setData({
          temperature: 22,
          humidity: 65,
          windSpeed: 12,
          windDirection: 180,
          pressure: 1013,
          visibility: 10,
          condition: 'Clear',
          description: 'Clear sky',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
    
    // Refresh every 10 minutes
    const interval = setInterval(fetchWeatherData, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, [lat, lng]);

  const refetch = async () => {
    if (!lat || !lng) return;
    
    try {
      setLoading(true);
      const weatherData = await weatherService.getCurrentWeather(lat, lng);
      
      setData({
        temperature: Math.round(weatherData.main.temp),
        humidity: weatherData.main.humidity,
        windSpeed: Math.round(weatherData.wind.speed * 3.6),
        windDirection: weatherData.wind.deg || 0,
        pressure: weatherData.main.pressure,
        visibility: Math.round((weatherData.visibility || 10000) / 1000),
        condition: weatherData.weather[0]?.main || 'Clear',
        description: weatherData.weather[0]?.description || 'Clear sky',
      });
    } catch (err) {
      setError('Failed to refresh weather data');
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refetch };
};