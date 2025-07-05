import { useState, useEffect } from 'react';
import { AQIData } from '../types';
import { weatherService } from '../services/weatherService';
import { tomtomService } from '../services/tomtomService';
import { calculateOverallAQI, generateRealisticPollutants, shouldUseRealisticData } from '../utils/aqiCalculator';

export const useAQIData = (lat?: number, lng?: number) => {
  const [data, setData] = useState<AQIData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!lat || !lng) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        console.log(`🌍 Fetching AQI data for coordinates: ${lat}, ${lng}`);
        
        // Get location name first
        const locationName = await tomtomService.reverseGeocode(lat, lng);
        console.log(`📍 Location name: ${locationName}`);
        
        let finalPollutants;
        let dataSource;
        
        // Try to get real air pollution data from OpenWeather
        try {
          const airPollutionData = await weatherService.getAirPollution(lat, lng);
          const currentPollution = airPollutionData.list[0];
          
          console.log('🌬️ OpenWeather API raw response:', currentPollution);
          
          // Use actual pollutant concentrations
          const apiPollutants = {
            pm25: Math.round(currentPollution.components.pm2_5 || 0),
            pm10: Math.round(currentPollution.components.pm10 || 0),
            no2: Math.round(currentPollution.components.no2 || 0),
            so2: Math.round(currentPollution.components.so2 || 0),
            co: Math.round((currentPollution.components.co || 0) / 1000 * 100) / 100, // Convert μg/m³ to mg/m³
            o3: Math.round(currentPollution.components.o3 || 0),
          };
          
          console.log('📊 API pollutants:', apiPollutants);
          
          // Check if we should override with realistic data for known polluted cities
          if (shouldUseRealisticData(locationName, apiPollutants)) {
            finalPollutants = generateRealisticPollutants(lat, lng, locationName);
            dataSource = 'Realistic Override (API values too low)';
            console.log('🔄 Using realistic data instead of API for known polluted city');
          } else {
            finalPollutants = apiPollutants;
            dataSource = 'OpenWeather API';
            console.log('✅ Using API data as it seems reasonable');
          }
          
        } catch (apiError) {
          console.warn('⚠️ OpenWeather API failed, using realistic simulated data:', apiError);
          
          // Generate realistic pollutant data based on location
          finalPollutants = generateRealisticPollutants(lat, lng, locationName);
          dataSource = 'Simulated (EPA Standards)';
        }
        
        // Calculate AQI from final pollutant levels
        const calculatedAQI = calculateOverallAQI(finalPollutants);
        
        const aqiData: AQIData = {
          aqi: calculatedAQI,
          location: locationName,
          coordinates: { lat, lng },
          pollutants: finalPollutants,
          timestamp: new Date().toISOString(),
          source: dataSource,
        };
        
        console.log('🎯 Final AQI data:', aqiData);
        setData(aqiData);
        
      } catch (err) {
        console.error('❌ Complete AQI fetch error:', err);
        setError('Failed to fetch air quality data');
        
        // Final fallback with basic realistic data
        const pollutants = generateRealisticPollutants(lat || 0, lng || 0, 'Unknown Location');
        const calculatedAQI = calculateOverallAQI(pollutants);
        
        const mockData: AQIData = {
          aqi: calculatedAQI,
          location: 'Unknown Location',
          coordinates: { lat: lat || 0, lng: lng || 0 },
          pollutants,
          timestamp: new Date().toISOString(),
          source: 'Fallback System',
        };
        
        console.log('🔄 Fallback AQI data:', mockData);
        setData(mockData);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    // Refresh data every 15 minutes
    const interval = setInterval(fetchData, 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, [lat, lng]);

  const refetch = async () => {
    if (!lat || !lng) return;
    
    setLoading(true);
    setError(null);
    
    try {
      console.log(`🔄 Manual refresh for: ${lat}, ${lng}`);
      
      const locationName = await tomtomService.reverseGeocode(lat, lng);
      
      let finalPollutants;
      let dataSource;
      
      try {
        const airPollutionData = await weatherService.getAirPollution(lat, lng);
        const currentPollution = airPollutionData.list[0];
        
        const apiPollutants = {
          pm25: Math.round(currentPollution.components.pm2_5 || 0),
          pm10: Math.round(currentPollution.components.pm10 || 0),
          no2: Math.round(currentPollution.components.no2 || 0),
          so2: Math.round(currentPollution.components.so2 || 0),
          co: Math.round((currentPollution.components.co || 0) / 1000 * 100) / 100,
          o3: Math.round(currentPollution.components.o3 || 0),
        };
        
        // Check if we should override with realistic data
        if (shouldUseRealisticData(locationName, apiPollutants)) {
          finalPollutants = generateRealisticPollutants(lat, lng, locationName);
          dataSource = 'Realistic Override (API values too low)';
        } else {
          finalPollutants = apiPollutants;
          dataSource = 'OpenWeather API';
        }
        
      } catch (apiError) {
        finalPollutants = generateRealisticPollutants(lat, lng, locationName);
        dataSource = 'Simulated (EPA Standards)';
      }

      const calculatedAQI = calculateOverallAQI(finalPollutants);

      const aqiData: AQIData = {
        aqi: calculatedAQI,
        location: locationName,
        coordinates: { lat, lng },
        pollutants: finalPollutants,
        timestamp: new Date().toISOString(),
        source: dataSource,
      };

      setData(aqiData);
    } catch (err) {
      setError('Failed to refresh air quality data');
      console.error('Refresh error:', err);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refetch };
};