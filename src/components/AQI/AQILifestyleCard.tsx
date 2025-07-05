import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import { getAQILevel } from '../../constants/aqi';

interface AQILifestyleCardProps {
  aqi: number;
  pollutants: {
    pm25: number;
    pm10: number;
    no2: number;
    so2: number;
    co: number;
    o3: number;
  };
}

export const AQILifestyleCard: React.FC<AQILifestyleCardProps> = ({ aqi, pollutants }) => {
  const { isDark } = useTheme();
  const aqiLevel = getAQILevel(aqi);

  const getLifestyleRecommendations = () => {
    if (aqi <= 50) {
      return {
        activities: [
          { icon: '🏃‍♀️', text: 'Perfect for running', safe: true },
          { icon: '🚴‍♂️', text: 'Great for cycling', safe: true },
          { icon: '🏀', text: 'Outdoor sports ideal', safe: true },
          { icon: '🌳', text: 'Enjoy parks & nature', safe: true }
        ],
        clothing: [
          { icon: '👕', text: 'Light clothing', recommended: true },
          { icon: '🕶️', text: 'Sunglasses', recommended: true },
          { icon: '🧴', text: 'Sunscreen', recommended: true }
        ],
        windows: { icon: '🪟', text: 'Open windows', action: 'open' },
        commute: { icon: '🚶‍♂️', text: 'Walk or bike', eco: true }
      };
    } else if (aqi <= 100) {
      return {
        activities: [
          { icon: '🚶‍♂️', text: 'Walking is fine', safe: true },
          { icon: '🏃‍♀️', text: 'Light jogging OK', safe: true },
          { icon: '⚽', text: 'Moderate sports', safe: true },
          { icon: '🌸', text: 'Garden activities', safe: true }
        ],
        clothing: [
          { icon: '👕', text: 'Regular clothes', recommended: true },
          { icon: '🧥', text: 'Light jacket', recommended: false },
          { icon: '😷', text: 'Mask optional', recommended: false }
        ],
        windows: { icon: '🪟', text: 'Ventilate normally', action: 'normal' },
        commute: { icon: '🚗', text: 'Any transport', eco: false }
      };
    } else if (aqi <= 150) {
      return {
        activities: [
          { icon: '🚶‍♂️', text: 'Short walks only', safe: false },
          { icon: '🏠', text: 'Indoor activities', safe: true },
          { icon: '🏋️‍♀️', text: 'Gym workouts', safe: true },
          { icon: '📚', text: 'Indoor hobbies', safe: true }
        ],
        clothing: [
          { icon: '😷', text: 'Wear a mask', recommended: true },
          { icon: '🧥', text: 'Cover exposed skin', recommended: true },
          { icon: '👓', text: 'Eye protection', recommended: true }
        ],
        windows: { icon: '🪟', text: 'Keep windows closed', action: 'closed' },
        commute: { icon: '🚗', text: 'Use car/transit', eco: false }
      };
    } else if (aqi <= 200) {
      return {
        activities: [
          { icon: '🏠', text: 'Stay indoors', safe: true },
          { icon: '📺', text: 'Indoor entertainment', safe: true },
          { icon: '🍳', text: 'Cook at home', safe: true },
          { icon: '💻', text: 'Work from home', safe: true }
        ],
        clothing: [
          { icon: '😷', text: 'N95 mask required', recommended: true },
          { icon: '🧥', text: 'Full coverage', recommended: true },
          { icon: '🧤', text: 'Gloves recommended', recommended: true }
        ],
        windows: { icon: '🪟', text: 'Seal windows', action: 'sealed' },
        commute: { icon: '🚗', text: 'Avoid going out', eco: false }
      };
    } else {
      return {
        activities: [
          { icon: '🚨', text: 'Emergency measures', safe: false },
          { icon: '🏠', text: 'Stay inside', safe: true },
          { icon: '💨', text: 'Use air purifier', safe: true },
          { icon: '🏥', text: 'Seek medical help', safe: true }
        ],
        clothing: [
          { icon: '😷', text: 'Full face protection', recommended: true },
          { icon: '🦺', text: 'Protective gear', recommended: true },
          { icon: '🧤', text: 'Sealed clothing', recommended: true }
        ],
        windows: { icon: '🪟', text: 'Emergency sealing', action: 'emergency' },
        commute: { icon: '🚫', text: 'Do not go outside', eco: false }
      };
    }
  };

  const recommendations = getLifestyleRecommendations();

  return (
    <motion.div
      className="space-y-4 md:space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Activities Section */}
      <motion.div
        className={`
          p-4 md:p-6 rounded-2xl md:rounded-3xl border shadow-lg transition-all duration-500
          ${isDark 
            ? 'bg-weather-cloud-800/80 backdrop-blur-xl border-weather-cloud-700/40' 
            : 'bg-white/90 backdrop-blur-xl border-weather-sky-200/40'
          }
        `}
        whileHover={{ scale: 1.02 }}
      >
        <h3 className={`text-lg md:text-xl font-bold mb-3 md:mb-4 transition-colors duration-500 ${isDark ? 'text-white' : 'text-weather-cloud-800'}`}>
          🎯 Recommended Activities
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-4">
          {recommendations.activities.map((activity, index) => (
            <motion.div
              key={index}
              className={`
                flex items-center gap-4 p-4 md:p-4 rounded-2xl md:rounded-2xl transition-all duration-300
                ${activity.safe 
                  ? isDark ? 'bg-green-900/30 border border-green-700/50' : 'bg-green-50 border border-green-200'
                  : isDark ? 'bg-red-900/30 border border-red-700/50' : 'bg-red-50 border border-red-200'
                }
              `}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <span className="text-2xl md:text-2xl flex-shrink-0">{activity.icon}</span>
              <span className={`font-medium text-base md:text-base ${activity.safe ? 'text-green-700' : 'text-red-700'}`}>
                {activity.text}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Clothing & Protection */}
      <motion.div
        className={`
          p-4 md:p-6 rounded-2xl md:rounded-3xl border shadow-lg transition-all duration-500
          ${isDark 
            ? 'bg-weather-cloud-800/80 backdrop-blur-xl border-weather-cloud-700/40' 
            : 'bg-white/90 backdrop-blur-xl border-weather-sky-200/40'
          }
        `}
        whileHover={{ scale: 1.02 }}
      >
        <h3 className={`text-lg md:text-xl font-bold mb-3 md:mb-4 transition-colors duration-500 ${isDark ? 'text-white' : 'text-weather-cloud-800'}`}>
          👕 What to Wear
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-4">
          {recommendations.clothing.map((item, index) => (
            <motion.div
              key={index}
              className={`
                flex items-center gap-4 p-4 md:p-4 rounded-2xl md:rounded-2xl transition-all duration-300
                ${item.recommended 
                  ? isDark ? 'bg-blue-900/30 border border-blue-700/50' : 'bg-blue-50 border border-blue-200'
                  : isDark ? 'bg-gray-800/30 border border-gray-700/50' : 'bg-gray-50 border border-gray-200'
                }
              `}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <span className="text-2xl md:text-2xl flex-shrink-0">{item.icon}</span>
              <span className={`font-medium text-base md:text-base ${item.recommended ? 'text-blue-700' : 'text-gray-600'}`}>
                {item.text}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Home & Commute */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <motion.div
          className={`
            p-4 md:p-6 rounded-2xl md:rounded-3xl border shadow-lg transition-all duration-500
            ${isDark 
              ? 'bg-weather-cloud-800/80 backdrop-blur-xl border-weather-cloud-700/40' 
              : 'bg-white/90 backdrop-blur-xl border-weather-sky-200/40'
            }
          `}
          whileHover={{ scale: 1.02 }}
        >
          <h3 className={`text-lg md:text-xl font-bold mb-3 md:mb-4 transition-colors duration-500 ${isDark ? 'text-white' : 'text-weather-cloud-800'}`}>
            🏠 At Home
          </h3>
          <motion.div
            className={`
              flex items-center gap-4 md:gap-4 p-4 md:p-4 rounded-2xl md:rounded-2xl
              ${recommendations.windows.action === 'open' 
                ? isDark ? 'bg-green-900/30 border border-green-700/50' : 'bg-green-50 border border-green-200'
                : recommendations.windows.action === 'closed'
                ? isDark ? 'bg-yellow-900/30 border border-yellow-700/50' : 'bg-yellow-50 border border-yellow-200'
                : isDark ? 'bg-red-900/30 border border-red-700/50' : 'bg-red-50 border border-red-200'
              }
            `}
            whileHover={{ scale: 1.05 }}
          >
            <span className="text-3xl md:text-3xl flex-shrink-0">{recommendations.windows.icon}</span>
            <div>
              <p className={`font-bold ${
                recommendations.windows.action === 'open' ? 'text-green-700' :
                recommendations.windows.action === 'closed' ? 'text-yellow-700' : 'text-red-700'
              } text-base md:text-base`}>
                {recommendations.windows.text}
              </p>
              <p className="text-sm md:text-sm opacity-70">Air circulation advice</p>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          className={`
            p-4 md:p-6 rounded-2xl md:rounded-3xl border shadow-lg transition-all duration-500
            ${isDark 
              ? 'bg-weather-cloud-800/80 backdrop-blur-xl border-weather-cloud-700/40' 
              : 'bg-white/90 backdrop-blur-xl border-weather-sky-200/40'
            }
          `}
          whileHover={{ scale: 1.02 }}
        >
          <h3 className={`text-lg md:text-xl font-bold mb-3 md:mb-4 transition-colors duration-500 ${isDark ? 'text-white' : 'text-weather-cloud-800'}`}>
            🚗 Transportation
          </h3>
          <motion.div
            className={`
              flex items-center gap-4 md:gap-4 p-4 md:p-4 rounded-2xl md:rounded-2xl
              ${recommendations.commute.eco 
                ? isDark ? 'bg-green-900/30 border border-green-700/50' : 'bg-green-50 border border-green-200'
                : isDark ? 'bg-gray-800/30 border border-gray-700/50' : 'bg-gray-50 border border-gray-200'
              }
            `}
            whileHover={{ scale: 1.05 }}
          >
            <span className="text-3xl md:text-3xl flex-shrink-0">{recommendations.commute.icon}</span>
            <div>
              <p className={`font-bold text-base md:text-base ${recommendations.commute.eco ? 'text-green-700' : 'text-gray-700'}`}>
                {recommendations.commute.text}
              </p>
              <p className="text-sm md:text-sm opacity-70">
                {recommendations.commute.eco ? 'Eco-friendly option' : 'Health-focused choice'}
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Pollutant Breakdown */}
      <motion.div
        className={`
          p-4 md:p-6 rounded-2xl md:rounded-3xl border shadow-lg transition-all duration-500
          ${isDark 
            ? 'bg-weather-cloud-800/80 backdrop-blur-xl border-weather-cloud-700/40' 
            : 'bg-white/90 backdrop-blur-xl border-weather-sky-200/40'
          }
        `}
        whileHover={{ scale: 1.02 }}
      >
        <h3 className={`text-lg md:text-xl font-bold mb-3 md:mb-4 transition-colors duration-500 ${isDark ? 'text-white' : 'text-weather-cloud-800'}`}>
          🧪 Air Quality Breakdown
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-4">
          {Object.entries(pollutants).map(([key, value], index) => {
            const pollutantInfo = {
              pm25: { name: 'PM2.5', unit: 'μg/m³', color: 'text-red-600', icon: '🔴' },
              pm10: { name: 'PM10', unit: 'μg/m³', color: 'text-orange-600', icon: '🟠' },
              no2: { name: 'NO₂', unit: 'ppb', color: 'text-purple-600', icon: '🟣' },
              so2: { name: 'SO₂', unit: 'ppb', color: 'text-yellow-600', icon: '🟡' },
              co: { name: 'CO', unit: 'ppm', color: 'text-gray-600', icon: '⚫' },
              o3: { name: 'O₃', unit: 'ppb', color: 'text-blue-600', icon: '🔵' }
            }[key] || { name: key.toUpperCase(), unit: '', color: 'text-gray-600', icon: '⚪' };

            return (
              <motion.div
                key={key}
                className={`
                  p-4 md:p-4 rounded-2xl md:rounded-2xl border transition-all duration-300
                  ${isDark ? 'bg-gray-800/50 border-gray-700/50' : 'bg-gray-50 border-gray-200'}
                `}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="flex items-center gap-2 mb-2 md:mb-2">
                  <span className="text-lg md:text-lg">{pollutantInfo.icon}</span>
                  <span className={`font-bold text-base ${pollutantInfo.color}`}>
                    {pollutantInfo.name}
                  </span>
                </div>
                <div className={`text-2xl md:text-2xl font-bold ${pollutantInfo.color}`}>
                  {value}
                </div>
                <div className="text-sm opacity-70">
                  {pollutantInfo.unit}
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
};