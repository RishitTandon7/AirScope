import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, AlertCircle } from 'lucide-react';
import { Card } from '../ui/Card';
import { InteractiveButton } from '../ui/InteractiveButton';

interface LocationPromptProps {
  onEnableLocation: () => void;
  error?: string;
  loading?: boolean;
}

export const LocationPrompt: React.FC<LocationPromptProps> = ({ 
  onEnableLocation, 
  error, 
  loading 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <Card className="text-center bg-gradient-to-br from-blue-50 to-indigo-100 border border-blue-200">
        <motion.div
          className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6"
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0] 
          }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <Navigation className="text-white" size={32} />
        </motion.div>

        <h3 className="text-2xl font-bold text-gray-800 mb-3">
          Enable Location Access
        </h3>
        
        <p className="text-gray-600 mb-6 max-w-sm mx-auto">
          Get personalized air quality data for your exact location. We'll show you real-time 
          AQI levels and health recommendations specific to your area.
        </p>

        {error && (
          <motion.div
            className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg mb-4 text-red-700"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <AlertCircle size={20} />
            <span className="text-sm">{error}</span>
          </motion.div>
        )}

        <div className="space-y-3">
          <InteractiveButton
            onClick={onEnableLocation}
            variant="primary"
            size="lg"
            icon={MapPin}
            loading={loading}
            className="w-full"
          >
            {loading ? 'Getting Location...' : 'Enable Location'}
          </InteractiveButton>
          
          <p className="text-xs text-gray-500">
            Your location data is used only for air quality monitoring and is not stored or shared.
          </p>
        </div>

        {/* Animated background elements */}
        <div className="absolute top-4 right-4 w-12 h-12 bg-blue-200 rounded-full opacity-20 animate-float"></div>
        <div className="absolute bottom-8 left-6 w-8 h-8 bg-indigo-200 rounded-full opacity-30 animate-float" style={{ animationDelay: '1s' }}></div>
      </Card>
    </motion.div>
  );
};