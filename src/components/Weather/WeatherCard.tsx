import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '../ui/Card';
import { WeatherIcon } from './WeatherIcon';
import { useTheme } from '../../contexts/ThemeContext';

interface WeatherCardProps {
  condition: 'sunny' | 'cloudy' | 'rainy' | 'stormy' | 'misty' | 'snowy' | 'windy';
  temperature: number;
  humidity: number;
  windSpeed: number;
  description: string;
  location: string;
}

export const WeatherCard: React.FC<WeatherCardProps> = ({
  condition,
  temperature,
  humidity,
  windSpeed,
  description,
  location
}) => {
  const { isDark } = useTheme();

  const getCardVariant = () => {
    switch (condition) {
      case 'sunny': return 'sunny';
      case 'cloudy': return 'cloudy';
      case 'rainy': return 'rainy';
      case 'stormy': return 'storm';
      default: return 'weather';
    }
  };

  const getTemperatureColor = () => {
    if (temperature > 30) return 'text-weather-hot-500';
    if (temperature > 20) return 'text-weather-sun-500';
    if (temperature > 10) return 'text-weather-sky-500';
    return 'text-weather-cold-500';
  };

  return (
    <Card variant={getCardVariant()} className="relative overflow-hidden">
      {/* Weather-specific background pattern */}
      <motion.div
        className={`absolute inset-0 opacity-5 ${
          condition === 'sunny' ? 'weather-pattern-sunny' :
          condition === 'cloudy' ? 'weather-pattern-cloudy' :
          condition === 'rainy' ? 'weather-pattern-rainy' :
          condition === 'stormy' ? 'weather-pattern-stormy' :
          'weather-pattern-cloudy'
        }`}
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%'],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className={`text-lg font-bold transition-colors duration-500 ${isDark ? 'text-white' : 'text-weather-cloud-800'}`}>
              {location}
            </h3>
            <p className={`text-sm transition-colors duration-500 ${isDark ? 'text-weather-cloud-300' : 'text-weather-cloud-600'}`}>
              {description}
            </p>
          </div>
          
          <motion.div
            className="p-4 rounded-2xl bg-white/20 backdrop-blur-sm"
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            <WeatherIcon condition={condition} size={32} />
          </motion.div>
        </div>

        {/* Main Temperature */}
        <div className="text-center mb-6">
          <motion.div
            className={`text-6xl font-bold ${getTemperatureColor()}`}
            animate={{
              scale: [1, 1.02, 1],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            {temperature}°
          </motion.div>
          <p className={`text-lg transition-colors duration-500 ${isDark ? 'text-weather-cloud-300' : 'text-weather-cloud-600'}`}>
            Feels like {temperature + Math.round(Math.random() * 4 - 2)}°
          </p>
        </div>

        {/* Weather Details */}
        <div className="grid grid-cols-2 gap-4">
          <motion.div
            className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center"
            whileHover={{ scale: 1.05 }}
          >
            <div className="text-2xl font-bold text-weather-rain-500 mb-1">{humidity}%</div>
            <div className={`text-sm transition-colors duration-500 ${isDark ? 'text-weather-cloud-300' : 'text-weather-cloud-600'}`}>Humidity</div>
          </motion.div>
          
          <motion.div
            className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center"
            whileHover={{ scale: 1.05 }}
          >
            <div className="text-2xl font-bold text-weather-wind-500 mb-1">{windSpeed}</div>
            <div className={`text-sm transition-colors duration-500 ${isDark ? 'text-weather-cloud-300' : 'text-weather-cloud-600'}`}>km/h Wind</div>
          </motion.div>
        </div>

        {/* Weather condition indicator */}
        <motion.div
          className="mt-4 text-center"
          animate={{
            opacity: [0.7, 1, 0.7],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
            condition === 'sunny' ? 'bg-weather-sun-500/20 text-weather-sun-700' :
            condition === 'rainy' ? 'bg-weather-rain-500/20 text-weather-rain-700' :
            condition === 'stormy' ? 'bg-weather-storm-500/20 text-weather-storm-700' :
            'bg-weather-cloud-500/20 text-weather-cloud-700'
          }`}>
            <WeatherIcon condition={condition} size={16} />
            <span className="capitalize">{condition} Weather</span>
          </div>
        </motion.div>
      </div>
    </Card>
  );
};