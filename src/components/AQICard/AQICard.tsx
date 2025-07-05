import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, RefreshCw, Wind, Droplets } from 'lucide-react';
import { Card } from '../ui/Card';
import { AQIData } from '../../types';
import { getAQILevel } from '../../constants/aqi';

interface AQICardProps {
  data: AQIData;
  loading?: boolean;
  onRefresh?: () => void;
}

export const AQICard: React.FC<AQICardProps> = ({ data, loading, onRefresh }) => {
  const aqiLevel = getAQILevel(data.aqi);

  return (
    <Card className="relative overflow-hidden" gradient>
      {/* Background Animation */}
      <motion.div
        className="absolute inset-0 opacity-10"
        style={{ backgroundColor: aqiLevel.color }}
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin size={20} />
            <span className="font-medium">{data.location}</span>
          </div>
          <motion.button
            onClick={onRefresh}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.3 }}
          >
            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
          </motion.button>
        </div>

        {/* Main AQI Display */}
        <div className="text-center mb-8">
          <motion.div
            className="text-7xl font-bold font-poppins mb-2"
            style={{ color: aqiLevel.color }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 10 }}
          >
            {data.aqi}
          </motion.div>
          <div className="space-y-2">
            <h3 className="text-2xl font-semibold text-gray-800">{aqiLevel.label}</h3>
            <p className="text-gray-600">{aqiLevel.description}</p>
          </div>
        </div>

        {/* Pollutant Details */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white/50 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-sm font-medium text-gray-600">PM2.5</span>
            </div>
            <div className="text-xl font-bold text-gray-800">{data.pollutants.pm25} μg/m³</div>
          </div>
          <div className="bg-white/50 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full bg-orange-500"></div>
              <span className="text-sm font-medium text-gray-600">PM10</span>
            </div>
            <div className="text-xl font-bold text-gray-800">{data.pollutants.pm10} μg/m³</div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="flex justify-between items-center text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Wind size={16} />
            <span>Last updated: {new Date(data.timestamp).toLocaleTimeString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <Droplets size={16} />
            <span>Source: {data.source}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};