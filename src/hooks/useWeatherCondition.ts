import { useState, useEffect } from 'react';

export type WeatherCondition = 'sunny' | 'cloudy' | 'rainy' | 'stormy' | 'misty' | 'snowy' | 'windy';

interface WeatherConditionData {
  condition: WeatherCondition;
  intensity: 'light' | 'moderate' | 'heavy';
  description: string;
}

export const useWeatherCondition = (
  aqi?: number, 
  temperature?: number, 
  humidity?: number,
  actualWeatherCondition?: string, // From weather API
  locationName?: string // Location name for better detection
) => {
  const [weatherCondition, setWeatherCondition] = useState<WeatherConditionData>({
    condition: 'cloudy',
    intensity: 'moderate',
    description: 'Partly cloudy'
  });

  useEffect(() => {
    const determineWeatherCondition = (): WeatherConditionData => {
      const hour = new Date().getHours();
      const isNight = hour < 6 || hour > 18;
      
      console.log('🌤️ Weather condition inputs:', {
        actualWeatherCondition,
        temperature,
        humidity,
        aqi,
        locationName,
        isNight
      });
      
      // Priority 1: Use actual weather condition from API if available
      if (actualWeatherCondition) {
        const weatherMain = actualWeatherCondition.toLowerCase();
        console.log('🌤️ Processing weather condition:', weatherMain);
        
        if (weatherMain.includes('clear') || weatherMain.includes('sun') || weatherMain === 'clear' || weatherMain.includes('sunny')) {
          console.log('🌞 Detected clear/sunny weather from API');
          return {
            condition: 'sunny',
            intensity: isNight ? 'light' : 'moderate',
            description: isNight ? 'Clear starlit night' : 'Brilliant sunshine'
          };
        }
        
        if (weatherMain.includes('rain') || weatherMain.includes('drizzle') || weatherMain.includes('shower')) {
          console.log('🌧️ Detected rainy weather from API');
          const intensity = weatherMain.includes('heavy') ? 'heavy' : 
                          weatherMain.includes('light') ? 'light' : 'moderate';
          return {
            condition: 'rainy',
            intensity,
            description: weatherMain.includes('drizzle') ? 'Light drizzle falling' : 
                        intensity === 'heavy' ? 'Heavy rainfall' : 
                        intensity === 'light' ? 'Light rain showers' : 'Steady rainfall'
          };
        }
        
        if (weatherMain.includes('thunder') || weatherMain.includes('storm')) {
          console.log('⛈️ Detected stormy weather from API');
          return {
            condition: 'stormy',
            intensity: 'heavy',
            description: weatherMain.includes('severe') ? 'Severe thunderstorm' : 'Thunderstorm activity'
          };
        }
        
        if (weatherMain.includes('snow') || weatherMain.includes('blizzard')) {
          console.log('❄️ Detected snowy weather from API');
          const intensity = weatherMain.includes('heavy') ? 'heavy' : 
                          weatherMain.includes('light') ? 'light' : 'moderate';
          return {
            condition: 'snowy',
            intensity,
            description: weatherMain.includes('blizzard') ? 'Blizzard conditions' :
                        intensity === 'heavy' ? 'Heavy snowfall' :
                        intensity === 'light' ? 'Light snow flurries' : 'Steady snowfall'
          };
        }
        
        if (weatherMain.includes('wind')) {
          console.log('💨 Detected windy weather from API');
          return {
            condition: 'windy',
            intensity: weatherMain.includes('strong') ? 'heavy' : 'moderate',
            description: weatherMain.includes('strong') ? 'Strong winds' : 'Breezy conditions'
          };
        }
        
        if (weatherMain.includes('mist') || weatherMain.includes('fog') || weatherMain.includes('haze')) {
          console.log('🌫️ Detected misty weather from API');
          return {
            condition: 'misty',
            intensity: weatherMain.includes('dense') ? 'heavy' : 'moderate',
            description: weatherMain.includes('fog') ? 'Dense fog cover' : 
                        weatherMain.includes('haze') ? 'Atmospheric haze' : 'Misty atmosphere'
          };
        }
        
        if (weatherMain.includes('cloud')) {
          console.log('☁️ Detected cloudy weather from API');
          const intensity = weatherMain.includes('overcast') ? 'heavy' : 
                          weatherMain.includes('few') ? 'light' : 'moderate';
          return {
            condition: 'cloudy',
            intensity,
            description: weatherMain.includes('overcast') ? 'Completely overcast' : 
                        weatherMain.includes('broken') ? 'Broken cloud cover' :
                        weatherMain.includes('scattered') ? 'Scattered clouds' :
                        weatherMain.includes('few') ? 'Few clouds' : 'Partly cloudy'
          };
        }
        
        // If we have an API condition but it doesn't match our patterns, log it
        console.log('🤔 Unknown weather condition from API:', actualWeatherCondition);
      }
      
      // Priority 2: Use temperature and humidity to determine conditions
      if (temperature !== undefined && humidity !== undefined) {
        // Snow conditions
        if (temperature < 2 && humidity > 70) {
          return {
            condition: 'snowy',
            intensity: humidity > 90 ? 'heavy' : 'moderate',
            description: 'Cold and snowy conditions'
          };
        }
        
        // Rain conditions
        if (humidity > 85 && temperature > 2) {
          return {
            condition: 'rainy',
            intensity: humidity > 95 ? 'heavy' : 'moderate',
            description: 'High humidity - rainy weather'
          };
        }
        
        // Sunny conditions
        if (temperature > 15 && humidity < 70 && (!aqi || aqi < 100)) {
          console.log('🌞 Detected sunny weather from temperature/humidity');
          return {
            condition: 'sunny',
            intensity: temperature > 30 ? 'heavy' : 'moderate',
            description: isNight ? 'Clear night sky' : 
                        temperature > 30 ? 'Hot and sunny' : 'Pleasant sunshine'
          };
        }
        
        // Misty conditions
        if (humidity > 75 && temperature > 5 && temperature < 15) {
          return {
            condition: 'misty',
            intensity: humidity > 90 ? 'heavy' : 'moderate',
            description: 'Cool and misty'
          };
        }
        
        // Windy conditions (based on season approximation)
        const month = new Date().getMonth();
        if ((month >= 2 && month <= 4) || (month >= 9 && month <= 11)) { // Spring/Fall
          if (temperature > 10 && temperature < 25 && humidity < 70) {
            return {
              condition: 'windy',
              intensity: 'moderate',
              description: 'Pleasant breeze'
            };
          }
        }
      }
      
      // Priority 3: Use AQI to influence weather when no clear conditions
      if (aqi !== undefined) {
        if (aqi > 200) {
          return {
            condition: 'stormy',
            intensity: 'heavy',
            description: 'Hazardous air quality'
          };
        }
        
        if (aqi > 150) {
          return {
            condition: 'misty',
            intensity: 'heavy',
            description: 'Poor air quality - hazy'
          };
        }
        
        if (aqi > 100) {
          return {
            condition: 'cloudy',
            intensity: 'moderate',
            description: 'Moderate air quality'
          };
        }
      }
      
      console.log('🌤️ Using default weather condition');
      // Default fallback based on time and season
      const month = new Date().getMonth();
      
      // Summer months (June-August)
      if (month >= 5 && month <= 7) {
        return {
          condition: 'sunny',
          intensity: 'moderate',
          description: isNight ? 'Warm summer night' : 'Summer sunshine'
        };
      }
      
      // Winter months (December-February)
      if (month === 11 || month <= 1) {
        return {
          condition: temperature && temperature < 5 ? 'snowy' : 'cloudy',
          intensity: 'moderate',
          description: isNight ? 'Cold winter night' : temperature && temperature < 5 ? 'Winter chill' : 'Winter clouds'
        };
      }
      
      // Spring/Fall
      return {
        condition: 'cloudy',
        intensity: 'light',
        description: isNight ? 'Partly cloudy night' : 'Pleasant weather'
      };
    };

    setWeatherCondition(determineWeatherCondition());
  }, [aqi, temperature, humidity, actualWeatherCondition, locationName]);

  return weatherCondition;
};