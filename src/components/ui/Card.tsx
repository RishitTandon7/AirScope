import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  animate?: boolean;
  gradient?: boolean;
  glass?: boolean;
  premium?: boolean;
  glow?: boolean;
  interactive?: boolean;
  variant?: 'default' | 'premium' | 'glass' | 'gradient' | 'solid' | 'weather' | 'storm' | 'sunny' | 'cloudy' | 'rainy' | 'pastel';
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  onClick, 
  animate = true,
  gradient = false,
  glass = false,
  premium = false,
  glow = false,
  interactive = false,
  variant = 'weather'
}) => {
  const { isDark } = useTheme();

  const getVariantClasses = () => {
    switch (variant) {
      case 'premium':
        return isDark 
          ? 'bg-gradient-to-br from-weather-cloud-900/90 via-weather-storm-900/85 to-weather-rain-900/90 backdrop-blur-xl border border-weather-cloud-700/40 shadow-2xl'
          : 'bg-gradient-to-br from-weather-sky-50/90 via-weather-cloud-50/85 to-weather-sun-50/90 backdrop-blur-xl border border-weather-sky-200/40 shadow-2xl';
      case 'glass':
        return isDark 
          ? 'bg-gradient-to-br from-weather-cloud-800/70 via-weather-storm-800/60 to-weather-rain-800/70 backdrop-blur-xl border border-weather-cloud-600/30 shadow-xl'
          : 'bg-gradient-to-br from-white/70 via-weather-sky-50/60 to-white/70 backdrop-blur-xl border border-weather-sky-200/30 shadow-xl';
      case 'gradient':
        return isDark 
          ? 'bg-gradient-to-br from-weather-storm-900/95 via-weather-rain-900/80 to-weather-cloud-800/90 backdrop-blur-xl border border-weather-storm-700/50 shadow-2xl'
          : 'bg-gradient-to-br from-weather-sky-50/95 via-weather-sun-50/80 to-weather-cloud-50/90 backdrop-blur-xl border border-weather-sky-200/50 shadow-2xl';
      case 'solid':
        return isDark 
          ? 'bg-weather-cloud-800 border border-weather-cloud-700 shadow-xl'
          : 'bg-white border border-weather-sky-200 shadow-xl';
      case 'storm':
        return isDark 
          ? 'bg-gradient-to-br from-weather-storm-900/90 via-weather-storm-800/85 to-weather-storm-900/90 backdrop-blur-xl border border-weather-storm-700/40 shadow-2xl storm-glass'
          : 'bg-gradient-to-br from-weather-storm-50/90 via-weather-storm-100/85 to-weather-storm-50/90 backdrop-blur-xl border border-weather-storm-200/40 shadow-2xl';
      case 'sunny':
        return isDark 
          ? 'bg-gradient-to-br from-weather-sun-900/90 via-weather-sun-800/85 to-weather-sun-900/90 backdrop-blur-xl border border-weather-sun-700/40 shadow-2xl'
          : 'bg-gradient-to-br from-weather-sun-50/90 via-weather-sun-100/85 to-weather-sun-50/90 backdrop-blur-xl border border-weather-sun-200/40 shadow-2xl';
      case 'cloudy':
        return isDark 
          ? 'bg-gradient-to-br from-weather-cloud-900/90 via-weather-mist-900/85 to-weather-cloud-900/90 backdrop-blur-xl border border-weather-cloud-700/40 shadow-2xl'
          : 'bg-gradient-to-br from-weather-cloud-50/90 via-weather-mist-100/85 to-weather-cloud-50/90 backdrop-blur-xl border border-weather-cloud-200/40 shadow-2xl';
      case 'rainy':
        return isDark 
          ? 'bg-gradient-to-br from-weather-rain-900/90 via-weather-sky-900/85 to-weather-rain-900/90 backdrop-blur-xl border border-weather-rain-700/40 shadow-2xl'
          : 'bg-gradient-to-br from-weather-rain-50/90 via-weather-sky-100/85 to-weather-rain-50/90 backdrop-blur-xl border border-weather-rain-200/40 shadow-2xl';
      case 'pastel':
        return isDark 
          ? 'bg-gradient-to-br from-pastel-lavender-900/80 via-pastel-sky-900/75 to-pastel-mint-900/80 backdrop-blur-xl border border-pastel-lavender-700/40 shadow-xl'
          : 'bg-gradient-to-br from-pastel-lavender-50/80 via-pastel-sky-50/75 to-pastel-mint-50/80 backdrop-blur-xl border border-pastel-lavender-200/40 shadow-xl';
      case 'weather':
      default:
        return isDark 
          ? 'bg-gradient-to-br from-weather-cloud-800/80 via-weather-sky-800/75 to-weather-rain-800/80 backdrop-blur-xl border border-weather-cloud-600/40 shadow-xl weather-glass'
          : 'bg-gradient-to-br from-white/80 via-weather-sky-50/75 to-weather-cloud-50/80 backdrop-blur-xl border border-weather-sky-200/40 shadow-xl weather-glass';
    }
  };

  const baseClasses = `
    rounded-3xl p-6 transition-all duration-500 relative overflow-hidden
    ${getVariantClasses()}
    ${interactive || onClick ? 'cursor-pointer hover:scale-[1.02] active:scale-[0.98] transform-gpu' : ''}
    ${className}
  `;

  return (
    <motion.div
      className={baseClasses}
      onClick={onClick}
      initial={animate ? { opacity: 0, y: 20, scale: 0.95 } : undefined}
      animate={animate ? { opacity: 1, y: 0, scale: 1 } : undefined}
      transition={{ 
        type: 'spring',
        stiffness: 300,
        damping: 30,
        duration: 0.6
      }}
      whileHover={
        onClick || interactive ? { 
          scale: 1.02,
          y: -2,
          boxShadow: isDark 
            ? '0 20px 40px rgba(59, 130, 246, 0.2), 0 10px 20px rgba(14, 165, 233, 0.1)'
            : '0 20px 40px rgba(59, 130, 246, 0.15), 0 10px 20px rgba(14, 165, 233, 0.08)',
          transition: { duration: 0.2, ease: 'easeOut' }
        } : premium ? {
          boxShadow: isDark 
            ? '0 20px 40px rgba(59, 130, 246, 0.2), 0 10px 20px rgba(14, 165, 233, 0.1)'
            : '0 20px 40px rgba(59, 130, 246, 0.15), 0 10px 20px rgba(14, 165, 233, 0.08)',
          transition: { duration: 0.2, ease: 'easeOut' }
        } : undefined
      }
      whileTap={onClick ? { scale: 0.98 } : undefined}
    >
      {/* Weather shimmer effect */}
      {(premium || variant === 'premium') && (
        <motion.div
          className={`absolute top-0 left-1/4 w-1/2 h-px ${isDark ? 'bg-gradient-to-r from-transparent via-weather-sky-400/70 to-transparent' : 'bg-gradient-to-r from-transparent via-weather-sun-300/70 to-transparent'}`}
          animate={{ 
            x: ['-100%', '200%'],
            opacity: [0, 1, 0]
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity, 
            repeatDelay: 3,
            ease: 'easeInOut'
          }}
        />
      )}
      
      {/* Weather glow effects */}
      {glow && (
        <motion.div
          className={`absolute -inset-1 rounded-3xl blur-lg opacity-40 ${isDark ? 'bg-gradient-to-r from-weather-sky-600/40 via-weather-storm-600/40 to-weather-rain-600/40' : 'bg-gradient-to-r from-weather-sky-300/30 via-weather-sun-300/30 to-weather-cloud-300/30'}`}
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.4, 0.6, 0.4],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}

      {/* Interactive weather ripple effect */}
      {(interactive || onClick) && (
        <motion.div
          className="absolute inset-0 rounded-3xl overflow-hidden"
          whileTap={{
            background: isDark 
              ? 'radial-gradient(circle, rgba(59,130,246,0.2) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)',
          }}
        />
      )}
      
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};