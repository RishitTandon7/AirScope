import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import { getAQILevel } from '../../constants/aqi';
import { MapPin, Info, Shield, AlertTriangle } from 'lucide-react';

interface AQIHumanContextProps {
  aqi: number;
  location: string;
  temperature?: number;
  weatherCondition?: string;
  onLocationClick?: () => void;
}

export const AQIHumanContext: React.FC<AQIHumanContextProps> = ({
  aqi,
  location,
  temperature,
  weatherCondition,
  onLocationClick
}) => {
  const { isDark } = useTheme();
  const aqiLevel = getAQILevel(aqi);

  const getHumanContext = () => {
    if (aqi <= 50) {
      return {
        illustration: '🏃‍♀️',
        activity: 'Perfect for outdoor activities',
        clothing: 'Regular clothes',
        advice: 'Enjoy the fresh air',
        person: 'person-jogging',
        backgroundColor: '#34c75920',
        color: '#34c759',
        icon: Shield
      };
    } else if (aqi <= 100) {
      return {
        illustration: '🚶‍♂️',
        activity: 'Good for walking',
        clothing: 'Regular clothes',
        advice: 'Moderate outdoor activities recommended',
        person: 'person-walking',
        backgroundColor: '#ffcc0020',
        color: '#ffcc00',
        icon: Info
      };
    } else if (aqi <= 150) {
      return {
        illustration: '😷',
        activity: 'Limit outdoor exposure',
        clothing: 'Mask recommended',
        advice: 'Sensitive groups should stay indoors',
        person: 'person-mask',
        backgroundColor: '#ff950020',
        color: '#ff9500',
        icon: AlertTriangle
      };
    } else if (aqi <= 200) {
      return {
        illustration: '🏠',
        activity: 'Stay indoors',
        clothing: 'Wear a mask outside',
        advice: 'Avoid outdoor activities',
        person: 'person-indoor',
        backgroundColor: '#ff3b3020',
        color: '#ff3b30',
        icon: AlertTriangle
      };
    } else {
      return {
        illustration: '🚨',
        activity: 'Hazardous conditions',
        clothing: 'Full protection needed',
        advice: 'Emergency measures recommended',
        person: 'person-emergency',
        backgroundColor: '#af52de20',
        color: '#af52de',
        icon: AlertTriangle
      };
    }
  };

  const context = getHumanContext();
  const Icon = context.icon;

  return (
    <motion.div
      className="ios-card overflow-hidden"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="p-6">
        {/* Location Header */}
        <motion.div
          className="flex items-center justify-between mb-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div 
            className="flex items-center gap-2 cursor-pointer" 
            onClick={onLocationClick}
          >
            <MapPin size={16} className="text-ios-blue" />
            <h2 className="font-medium text-lg">{location}</h2>
          </div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ backgroundColor: context.backgroundColor }}
              onClick={onLocationClick}
            >
              <Icon size={16} style={{ color: context.color }} />
            </div>
          </motion.div>
        </motion.div>

        {/* AQI and Status */}
        <div className="flex flex-col md:flex-row md:items-center gap-6 mb-6">
          <motion.div
            className="flex-1 text-center md:text-left"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Air Quality Index</div>
            <div className="flex items-baseline gap-2 justify-center md:justify-start">
              <div className="text-4xl font-bold" style={{ color: aqiLevel.color }}>
                {aqi}
              </div>
              <div className="text-lg font-medium" style={{ color: aqiLevel.color }}>
                {aqiLevel.label}
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              {aqiLevel.description}
            </p>
          </motion.div>
          
          <motion.div
            className="flex justify-center md:justify-start"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div 
              className="w-24 h-24 rounded-2xl flex items-center justify-center"
              style={{ backgroundColor: context.backgroundColor }}
            >
              <span className="text-5xl">{context.illustration}</span>
            </div>
          </motion.div>
        </div>
        
        {/* Recommendations */}
        <motion.div
          className="space-y-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="font-medium text-base">Recommendations</h3>
          
          <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: context.backgroundColor }}>
                <span className="text-lg">{context.illustration}</span>
              </div>
              <span className="font-medium">{context.activity}</span>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                <span className="text-lg">👕</span>
              </div>
              <span>{context.clothing}</span>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                <span className="text-lg">💡</span>
              </div>
              <span>{context.advice}</span>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Weather Info Footer */}
      <motion.div
        className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex items-center justify-between"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full flex items-center justify-center bg-ios-blue/10">
            <Info size={14} className="text-ios-blue" />
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Last updated: {new Date().toLocaleTimeString()}
          </span>
        </div>
        
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {temperature ? `${temperature}°C` : ''} {weatherCondition || ''}
        </div>
      </motion.div>
    </motion.div>
  );
};