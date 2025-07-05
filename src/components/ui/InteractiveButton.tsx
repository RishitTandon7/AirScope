import React from 'react';
import { motion } from 'framer-motion';
import { DivideIcon as LucideIcon } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface InteractiveButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'weather' | 'storm' | 'sunny' | 'cloudy' | 'rainy' | 'pastel';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  pulse?: boolean;
  glow?: boolean;
}

export const InteractiveButton: React.FC<InteractiveButtonProps> = ({
  children,
  onClick,
  variant = 'weather',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  className = '',
  disabled = false,
  loading = false,
  pulse = false,
  glow = false,
}) => {
  const { isDark } = useTheme();

  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-gradient-to-r from-weather-sky-500 to-weather-rain-500 text-white shadow-lg hover:shadow-xl hover:from-weather-sky-600 hover:to-weather-rain-600 border-none';
      case 'secondary':
        return 'bg-gradient-to-r from-weather-wind-500 to-weather-wind-600 text-white shadow-lg hover:shadow-xl hover:from-weather-wind-600 hover:to-weather-wind-700 border-none';
      case 'ghost':
        return isDark 
          ? 'bg-gradient-to-br from-weather-cloud-800/60 to-weather-sky-800/60 backdrop-blur-md text-weather-sky-200 border border-weather-cloud-600/40 hover:from-weather-cloud-700/80 hover:to-weather-sky-700/80 hover:border-weather-sky-500/60 shadow-lg hover:shadow-xl'
          : 'bg-gradient-to-br from-white/80 to-weather-sky-50/80 backdrop-blur-md text-weather-sky-700 border border-weather-sky-200/60 hover:from-white/90 hover:to-weather-sky-50/90 hover:border-weather-sky-300/80 shadow-lg hover:shadow-xl';
      case 'danger':
        return 'bg-gradient-to-r from-weather-hot-500 to-weather-hot-600 text-white shadow-lg hover:shadow-xl hover:from-weather-hot-600 hover:to-weather-hot-700 border-none';
      case 'storm':
        return isDark 
          ? 'bg-gradient-to-br from-weather-storm-600 via-weather-storm-500 to-weather-storm-600 text-white shadow-lg hover:shadow-xl hover:from-weather-storm-700 hover:via-weather-storm-600 hover:to-weather-storm-700 border-none'
          : 'bg-gradient-to-br from-weather-storm-400 via-weather-storm-300 to-weather-storm-400 text-white shadow-lg hover:shadow-xl hover:from-weather-storm-500 hover:via-weather-storm-400 hover:to-weather-storm-500 border-none';
      case 'sunny':
        return isDark 
          ? 'bg-gradient-to-br from-weather-sun-600 via-weather-sun-500 to-weather-sun-600 text-white shadow-lg hover:shadow-xl hover:from-weather-sun-700 hover:via-weather-sun-600 hover:to-weather-sun-700 border-none'
          : 'bg-gradient-to-br from-weather-sun-400 via-weather-sun-300 to-weather-sun-400 text-white shadow-lg hover:shadow-xl hover:from-weather-sun-500 hover:via-weather-sun-400 hover:to-weather-sun-500 border-none';
      case 'cloudy':
        return isDark 
          ? 'bg-gradient-to-br from-weather-cloud-600 via-weather-mist-500 to-weather-cloud-600 text-white shadow-lg hover:shadow-xl hover:from-weather-cloud-700 hover:via-weather-mist-600 hover:to-weather-cloud-700 border-none'
          : 'bg-gradient-to-br from-weather-cloud-400 via-weather-mist-300 to-weather-cloud-400 text-white shadow-lg hover:shadow-xl hover:from-weather-cloud-500 hover:via-weather-mist-400 hover:to-weather-cloud-500 border-none';
      case 'rainy':
        return isDark 
          ? 'bg-gradient-to-br from-weather-rain-600 via-weather-sky-500 to-weather-rain-600 text-white shadow-lg hover:shadow-xl hover:from-weather-rain-700 hover:via-weather-sky-600 hover:to-weather-rain-700 border-none'
          : 'bg-gradient-to-br from-weather-rain-400 via-weather-sky-300 to-weather-rain-400 text-white shadow-lg hover:shadow-xl hover:from-weather-rain-500 hover:via-weather-sky-400 hover:to-weather-rain-500 border-none';
      case 'pastel':
        return isDark 
          ? 'bg-gradient-to-br from-pastel-lavender-600 via-pastel-sky-500 to-pastel-mint-600 text-white shadow-lg hover:shadow-xl hover:from-pastel-lavender-700 hover:via-pastel-sky-600 hover:to-pastel-mint-700 border-none'
          : 'bg-gradient-to-br from-pastel-lavender-400 via-pastel-sky-300 to-pastel-mint-400 text-white shadow-lg hover:shadow-xl hover:from-pastel-lavender-500 hover:via-pastel-sky-400 hover:to-pastel-mint-500 border-none';
      case 'weather':
      default:
        return isDark 
          ? 'bg-gradient-to-br from-weather-sky-600 via-weather-cloud-500 to-weather-rain-600 text-white shadow-lg hover:shadow-xl hover:from-weather-sky-700 hover:via-weather-cloud-600 hover:to-weather-rain-700 border-none'
          : 'bg-gradient-to-br from-weather-sky-400 via-weather-cloud-300 to-weather-rain-400 text-white shadow-lg hover:shadow-xl hover:from-weather-sky-500 hover:via-weather-cloud-400 hover:to-weather-rain-500 border-none';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-4 py-3 text-sm';
      case 'md':
        return 'px-6 py-4 text-base md:px-6 md:py-3 md:text-base';
      case 'lg':
        return 'px-8 py-5 text-lg md:px-8 md:py-4 md:text-lg';
      case 'xl':
        return 'px-10 py-6 text-xl md:px-12 md:py-6 md:text-xl';
      default:
        return 'px-6 py-4 text-base md:px-6 md:py-3 md:text-base';
    }
  };

  return (
    <motion.button
      className={`
        rounded-xl md:rounded-2xl font-semibold font-poppins transition-all duration-300
        flex items-center justify-center gap-3 relative overflow-hidden
        btn-premium transform-gpu
        ${getVariantClasses()}
        ${getSizeClasses()}
        ${disabled || loading ? 'opacity-50 cursor-not-allowed' : ''}
        ${pulse ? 'animate-pulse' : ''}
        ${glow ? 'animate-weather-glow' : ''}
        ${className}
      `}
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={!disabled && !loading ? { 
        scale: 1.02, 
        y: -2,
        boxShadow: variant === 'ghost' 
          ? '0 10px 30px rgba(59, 130, 246, 0.15), 0 5px 15px rgba(14, 165, 233, 0.1)'
          : '0 10px 30px rgba(59, 130, 246, 0.3), 0 5px 15px rgba(251, 191, 36, 0.2)',
        transition: { duration: 0.2, ease: 'easeOut' }
      } : undefined}
      whileTap={!disabled && !loading ? { 
        scale: 0.98,
        y: 0,
        transition: { duration: 0.1 }
      } : undefined}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      {/* Enhanced weather shimmer effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0"
        initial={{ x: '-100%' }}
        animate={{ x: '100%' }}
        transition={{ 
          duration: 2.5, 
          repeat: Infinity, 
          repeatDelay: 4,
          ease: 'easeInOut' 
        }}
      />

      {/* Loading spinner */}
      {loading && (
        <motion.div
          className="absolute inset-0 bg-black/10 rounded-2xl flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
        </motion.div>
      )}
      
      <div className="relative z-10 flex items-center gap-3">
        {Icon && iconPosition === 'left' && (
          <motion.div
            animate={loading ? { rotate: 360 } : {}}
            transition={loading ? { duration: 1, repeat: Infinity, ease: 'linear' } : {}}
          >
            <Icon size={20} />
          </motion.div>
        )}
        
        <motion.span
          animate={loading ? { opacity: 0.7 } : { opacity: 1 }}
        >
          {children}
        </motion.span>
        
        {Icon && iconPosition === 'right' && (
          <motion.div
            animate={loading ? { rotate: 360 } : {}}
            transition={loading ? { duration: 1, repeat: Infinity, ease: 'linear' } : {}}
          >
            <Icon size={20} />
          </motion.div>
        )}
      </div>

      {/* Weather ripple effect */}
      <motion.div
        className="absolute inset-0 rounded-2xl overflow-hidden"
        whileTap={!disabled && !loading ? {
          background: variant === 'ghost' 
            ? 'radial-gradient(circle, rgba(59,130,246,0.2) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%)',
        } : undefined}
        transition={{ duration: 0.3 }}
      />
    </motion.button>
  );
};