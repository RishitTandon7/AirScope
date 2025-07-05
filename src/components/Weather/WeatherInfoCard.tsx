import React from 'react';
import { motion } from 'framer-motion';
import { WeatherMetricCard } from './WeatherMetricCard';
import { useTheme } from '../../contexts/ThemeContext';
import { WeatherIcon } from './WeatherIcon';

interface WeatherInfoCardProps {
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  pressure: number;
  visibility: number;
  condition: string;
  description: string;
  uvIndex?: number;
  dewPoint?: number;
  cloudCover?: number;
}

export const WeatherInfoCard: React.FC<WeatherInfoCardProps> = ({
  temperature,
  feelsLike,
  humidity,
  windSpeed,
  windDirection,
  pressure,
  visibility,
  condition,
  description,
  uvIndex = Math.floor(Math.random() * 11),
  dewPoint = temperature - ((100 - humidity) / 5),
  cloudCover = Math.floor(Math.random() * 100)
}) => {
  const { isDark } = useTheme();

  const getWindDirection = (degrees: number) => {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    return directions[Math.round(degrees / 22.5) % 16];
  };

  const getUVLevel = (uv: number) => {
    if (uv <= 2) return { level: 'Low', color: 'text-green-600', bg: 'bg-green-100' };
    if (uv <= 5) return { level: 'Moderate', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    if (uv <= 7) return { level: 'High', color: 'text-orange-600', bg: 'bg-orange-100' };
    if (uv <= 10) return { level: 'Very High', color: 'text-red-600', bg: 'bg-red-100' };
    return { level: 'Extreme', color: 'text-purple-600', bg: 'bg-purple-100' };
  };

  const uvLevel = getUVLevel(uvIndex);

  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Main Weather Display */}
      <motion.div
        className={`
          p-6 md:p-8 rounded-2xl md:rounded-3xl shadow-2xl transition-all duration-500 relative overflow-hidden
        `}
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
        whileHover={{ scale: 1.02 }}
      >
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 items-center">
          {/* Left: Current Weather */}
          <div className="space-y-4 md:space-y-6">
            <div className="flex items-center gap-4">
              <motion.div
                className="p-3 md:p-4 rounded-xl md:rounded-2xl"
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)',
                }}
                animate={{
                  scale: [1, 1.05, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <WeatherIcon condition={condition.toLowerCase() as any} size={36} className="md:w-12 md:h-12" />
              </motion.div>
              <div>
                <h3 className="text-3xl font-bold text-white">
                  {temperature}°C
                </h3>
                <p className="text-lg md:text-lg text-white/80">
                  Feels like {feelsLike}°C
                </p>
                <p className="text-base capitalize text-white/70">
                  {description}
                </p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              <div 
                className="p-3 md:p-4 rounded-xl md:rounded-2xl"
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-white/80">💧</span>
                  <span className="text-base text-white/80">Humidity</span>
                </div>
                <div className="text-xl md:text-xl font-bold text-white">
                  {humidity}%
                </div>
              </div>
              
              <div 
                className="p-3 md:p-4 rounded-xl md:rounded-2xl"
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-white/80">💨</span>
                  <span className="text-base text-white/80">Wind</span>
                </div>
                <div className="text-xl md:text-xl font-bold text-white">
                  {windSpeed} km/h
                </div>
              </div>
            </div>
          </div>

          {/* Right: Weather Illustration */}
          <motion.div
            className="flex justify-center items-center text-white mt-6 lg:mt-0"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
          >
            <div className="relative">
              {/* Weather-specific illustration */}
              <motion.div
                className="w-32 h-32 md:w-48 md:h-48 rounded-full flex items-center justify-center text-6xl md:text-8xl"
                style={{
                  background: condition.toLowerCase().includes('rain') 
                    ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)'
                    : condition.toLowerCase().includes('sun') || condition.toLowerCase().includes('clear')
                    ? 'linear-gradient(135deg, #fbbf24, #f59e0b)'
                    : condition.toLowerCase().includes('cloud')
                    ? 'linear-gradient(135deg, #6b7280, #4b5563)'
                    : condition.toLowerCase().includes('snow')
                    ? 'linear-gradient(135deg, #f3f4f6, #e5e7eb)'
                    : 'linear-gradient(135deg, #8b5cf6, #7c3aed)'
                }}
                animate={{
                  scale: [1, 1.05, 1],
                  rotate: [0, 2, -2, 0]
                }}
                transition={{ duration: 6, repeat: Infinity }}
              >
                <WeatherIcon 
                  condition={condition.toLowerCase() as any} 
                  size={60} 
                  className="text-white drop-shadow-lg" 
                />
              </motion.div>

              {/* Floating weather particles */}
              {Array.from({ length: 4 }, (_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1.5 md:w-2 h-1.5 md:h-2 bg-white/40 rounded-full"
                  style={{
                    left: `${20 + i * 12}%`,
                    top: `${30 + (i % 3) * 15}%`,
                  }}
                  animate={{
                    y: [0, -15, 0],
                    opacity: [0.4, 0.8, 0.4],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 3 + i * 0.5,
                    repeat: Infinity,
                    delay: i * 0.3,
                  }}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Samsung-Style Weather Metrics Grid */}
      <div 
        className="p-4 md:p-6 rounded-2xl md:rounded-3xl"
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
      >
        <h3 className="text-xl md:text-xl font-bold text-white mb-6 md:mb-6 font-light">Weather Details</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-6">
          <WeatherMetricCard
            type="uv"
            value={uvIndex}
            label="UV index"
            description={`${uvLevel.level} right now`}
            uvLevel={uvLevel.level}
          />
          
          <WeatherMetricCard
            type="humidity"
            value={humidity}
            unit="%"
            label="Humidity"
            description="Higher than yesterday"
            trend="up"
          />
          
          <WeatherMetricCard
            type="wind"
            value={windSpeed}
            unit="km/h"
            label="Wind"
            description="There is a light breeze"
            windDirection={windDirection}
          />
          
          <WeatherMetricCard
            type="dewpoint"
            value={Math.round(dewPoint)}
            unit=""
            label="Dew point"
            description="It is very humid"
          />
          
          <WeatherMetricCard
            type="pressure"
            value={pressure}
            unit="mb"
            label="Pressure"
            description="Currently rising rapidly"
            pressureValue={pressure}
            trend="up"
          />
          
          <WeatherMetricCard
            type="visibility"
            value={visibility}
            unit="km"
            label="Visibility"
            description="Moderate right now"
          />
        </div>
      </div>

      {/* Hourly Forecast Preview */}
      <motion.div
        className={`
          p-4 md:p-6 rounded-2xl md:rounded-3xl shadow-lg transition-all duration-500
        `}
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
        whileHover={{ scale: 1.02 }}
      >
        <h3 className="text-2xl font-bold mb-6 text-white">
          📅 Next 6 Hours
        </h3>
        
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4 md:gap-4">
          {Array.from({ length: 6 }, (_, i) => {
            const hour = new Date();
            hour.setHours(hour.getHours() + i + 1);
            const hourTemp = temperature + (Math.random() - 0.5) * 4;
            const hourCondition = i < 3 ? condition : ['Clear', 'Cloudy', 'Rain'][Math.floor(Math.random() * 3)];
            
            return (
              <motion.div
                key={i}
                className={`
                  text-center p-3 md:p-3 rounded-2xl md:rounded-2xl transition-all duration-300 hover:scale-105
                  ${i >= 3 ? 'hidden md:block' : ''}
                `}
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(10px)',
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.05, y: -2 }}
              >
                <div className="text-sm md:text-sm font-medium mb-2 md:mb-2 text-white/80">
                  {hour.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
                
                <motion.div
                  className="mb-2 md:mb-2"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                >
                  <WeatherIcon condition={hourCondition.toLowerCase() as any} size={24} className="md:w-6 md:h-6" />
                </motion.div>
                
                <div className="text-lg md:text-lg font-bold text-white">
                  {Math.round(hourTemp)}°
                </div>
                
                <div className="text-sm text-white/70">
                  {Math.round(Math.random() * 30 + 40)}%
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Weather Alerts & Tips */}
      <motion.div
        className={`
          p-4 md:p-6 rounded-2xl md:rounded-3xl shadow-lg transition-all duration-500
        `}
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
        whileHover={{ scale: 1.02 }}
      >
        <div className="flex items-center gap-3 md:gap-4 mb-4">
          <motion.div
            className="p-2 md:p-3 rounded-xl md:rounded-2xl flex-shrink-0"
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
            }}
            animate={{
              boxShadow: [
                '0 0 20px rgba(59,130,246,0.3)',
                '0 0 30px rgba(59,130,246,0.5)',
                '0 0 20px rgba(59,130,246,0.3)'
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="text-xl md:text-2xl">⚡</span>
          </motion.div>
          <div>
            <h3 className="text-xl md:text-xl font-bold text-white">
              Weather Insights
            </h3>
            <p className="text-base md:text-base text-white/80">
              Personalized recommendations based on current conditions
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-4">
          <div 
            className="p-4 md:p-4 rounded-2xl md:rounded-2xl"
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <h4 className="font-bold mb-2 text-white text-base md:text-base">
              🌡️ Temperature Comfort
            </h4>
            <p className="text-sm md:text-sm text-white/80">
              {temperature > 25 ? 'Warm weather - stay hydrated and seek shade' :
               temperature > 15 ? 'Pleasant temperature - perfect for outdoor activities' :
               temperature > 5 ? 'Cool weather - light jacket recommended' :
               'Cold weather - dress warmly and limit exposure'}
            </p>
          </div>
          
          <div 
            className="p-4 md:p-4 rounded-2xl md:rounded-2xl"
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <h4 className="font-bold mb-2 text-white text-base md:text-base">
              💨 Wind Conditions
            </h4>
            <p className="text-sm md:text-sm text-white/80">
              {windSpeed > 25 ? 'Strong winds - secure loose objects and avoid high places' :
               windSpeed > 15 ? 'Moderate winds - good for sailing and kite flying' :
               windSpeed > 5 ? 'Light breeze - comfortable for most activities' :
               'Calm conditions - ideal for outdoor dining and events'}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};