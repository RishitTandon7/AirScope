import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, RefreshCw, Wind, Droplets, Navigation, Share2, Bookmark } from 'lucide-react';
import { Card } from '../ui/Card';
import { InteractiveButton } from '../ui/InteractiveButton';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { AQIData } from '../../types';
import { getAQILevel } from '../../constants/aqi';

interface EnhancedAQICardProps {
  data: AQIData;
  loading?: boolean;
  onRefresh?: () => void;
  showDetails?: boolean;
}

export const EnhancedAQICard: React.FC<EnhancedAQICardProps> = ({ 
  data, 
  loading, 
  onRefresh,
  showDetails = false 
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const aqiLevel = getAQILevel(data.aqi);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'AirScope - Air Quality Data',
          text: `Air Quality in ${data.location}: AQI ${data.aqi} (${aqiLevel.label})`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing', error);
      }
    }
  };

  return (
    <motion.div
      className="perspective-1000"
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <motion.div
        className="relative w-full h-96 preserve-3d cursor-pointer"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        {/* Front Side */}
        <Card className="absolute inset-0 backface-hidden bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 backdrop-blur-md border border-white/30">
          <motion.div
            className="absolute inset-0 opacity-20 rounded-2xl"
            style={{ backgroundColor: aqiLevel.color }}
            animate={{ 
              scale: [1, 1.05, 1],
              opacity: [0.1, 0.2, 0.1] 
            }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          />
          
          <div className="relative z-10 h-full flex flex-col">
            {/* Header with Actions */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <motion.div
                  className="p-2 rounded-full bg-white/20 backdrop-blur-sm"
                  whileHover={{ scale: 1.1 }}
                >
                  <MapPin size={20} className="text-gray-700" />
                </motion.div>
                <div>
                  <h3 className="font-semibold text-gray-800">{data.location}</h3>
                  <p className="text-xs text-gray-600">
                    {new Date(data.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsBookmarked(!isBookmarked);
                  }}
                  className="p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Bookmark 
                    size={18} 
                    className={isBookmarked ? 'text-yellow-500 fill-current' : 'text-gray-600'} 
                  />
                </motion.button>
                
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleShare();
                  }}
                  className="p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Share2 size={18} className="text-gray-600" />
                </motion.button>
                
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRefresh?.();
                  }}
                  className="p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
                  whileHover={{ scale: 1.1, rotate: 180 }}
                  whileTap={{ scale: 0.9 }}
                  disabled={loading}
                >
                  <RefreshCw size={18} className={`text-gray-600 ${loading ? 'animate-spin' : ''}`} />
                </motion.button>
              </div>
            </div>

            {/* Main AQI Display */}
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <motion.div
                className="relative mb-4"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              >
                <div
                  className="text-8xl font-bold font-poppins mb-2 relative z-10"
                  style={{ color: aqiLevel.color }}
                >
                  {loading ? <LoadingSpinner size="lg" color={aqiLevel.color} /> : data.aqi}
                </div>
                
                {/* Animated rings */}
                <motion.div
                  className="absolute inset-0 rounded-full border-4 opacity-30"
                  style={{ borderColor: aqiLevel.color }}
                  animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.1, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
              </motion.div>
              
              <motion.div
                className="space-y-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h3 className="text-2xl font-bold text-gray-800">{aqiLevel.label}</h3>
                <p className="text-gray-600 max-w-xs">{aqiLevel.description}</p>
              </motion.div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              <motion.div
                className="bg-white/30 backdrop-blur-sm rounded-xl p-3 text-center"
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-xl font-bold text-red-600">{data.pollutants.pm25}</div>
                <div className="text-xs text-gray-600">PM2.5 μg/m³</div>
              </motion.div>
              <motion.div
                className="bg-white/30 backdrop-blur-sm rounded-xl p-3 text-center"
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-xl font-bold text-orange-600">{data.pollutants.pm10}</div>
                <div className="text-xs text-gray-600">PM10 μg/m³</div>
              </motion.div>
            </div>

            {/* Tap to flip indicator */}
            <motion.div
              className="absolute bottom-2 right-2 text-xs text-gray-400 flex items-center gap-1"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Navigation size={12} />
              Tap to flip
            </motion.div>
          </div>
        </Card>

        {/* Back Side */}
        <Card className="absolute inset-0 backface-hidden rotate-y-180 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white">
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Detailed Pollutants</h3>
              <div className="text-sm opacity-75">All values</div>
            </div>

            <div className="flex-1 space-y-4">
              {Object.entries(data.pollutants).map(([key, value], index) => (
                <motion.div
                  key={key}
                  className="flex items-center justify-between p-3 bg-white/10 rounded-xl backdrop-blur-sm"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div>
                    <div className="font-semibold">{key.toUpperCase()}</div>
                    <div className="text-xs opacity-70">
                      {key === 'co' ? 'ppm' : key.includes('o') ? 'ppb' : 'μg/m³'}
                    </div>
                  </div>
                  <div className="text-xl font-bold">{value}</div>
                </motion.div>
              ))}
            </div>

            <motion.div
              className="text-xs opacity-50 text-center"
              animate={{ opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Tap to flip back
            </motion.div>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
};