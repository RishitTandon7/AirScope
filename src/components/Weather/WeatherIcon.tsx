import React from 'react';
import { motion } from 'framer-motion';
import { 
  Sun, Cloud, CloudRain, CloudSnow, CloudLightning, 
  Wind, Droplets, Thermometer, Eye, Gauge 
} from 'lucide-react';

interface WeatherIconProps {
  condition: 'sunny' | 'cloudy' | 'rainy' | 'stormy' | 'misty' | 'snowy' | 'windy';
  size?: number;
  animated?: boolean;
  className?: string;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({ 
  condition, 
  size = 24, 
  animated = true,
  className = '' 
}) => {
  const getIcon = () => {
    switch (condition) {
      case 'sunny':
        return Sun;
      case 'cloudy':
        return Cloud;
      case 'rainy':
        return CloudRain;
      case 'stormy':
        return CloudLightning;
      case 'snowy':
        return CloudSnow;
      case 'windy':
        return Wind;
      case 'misty':
        return Eye;
      default:
        return Cloud;
    }
  };

  const Icon = getIcon();

  const getAnimationProps = () => {
    if (!animated) return {};

    switch (condition) {
      case 'sunny':
        return {
          animate: { rotate: [0, 360] },
          transition: { duration: 20, repeat: Infinity, ease: 'linear' }
        };
      case 'cloudy':
        return {
          animate: { x: [0, 5, 0], y: [0, -2, 0] },
          transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' }
        };
      case 'rainy':
        return {
          animate: { y: [0, -3, 0] },
          transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' }
        };
      case 'stormy':
        return {
          animate: { 
            scale: [1, 1.1, 1],
            filter: ['brightness(1)', 'brightness(1.5)', 'brightness(1)']
          },
          transition: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' }
        };
      case 'windy':
        return {
          animate: { x: [0, 8, 0], rotate: [0, 5, 0] },
          transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' }
        };
      default:
        return {
          animate: { scale: [1, 1.05, 1] },
          transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' }
        };
    }
  };

  return (
    <motion.div
      className={className}
      {...getAnimationProps()}
    >
      <Icon size={size} />
    </motion.div>
  );
};