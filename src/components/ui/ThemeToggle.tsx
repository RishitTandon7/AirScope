import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Cloud, CloudRain } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export const ThemeToggle: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <motion.button
      onClick={toggleTheme}
      className={`
        relative p-4 rounded-2xl overflow-hidden transition-all duration-500
        ${isDark 
          ? 'bg-gradient-to-br from-weather-cloud-800/90 via-weather-storm-800/90 to-weather-rain-800/90 backdrop-blur-xl border border-weather-cloud-700/40 shadow-xl' 
          : 'bg-gradient-to-br from-weather-sun-100/90 via-weather-sky-100/90 to-weather-sun-200/90 backdrop-blur-xl border border-weather-sun-200/40 shadow-xl'
        }
        hover:scale-105 active:scale-95
      `}
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.05 }}
    >
      {/* Animated weather background */}
      <motion.div
        className={`
          absolute inset-0 rounded-2xl
          ${isDark 
            ? 'bg-gradient-to-br from-weather-storm-700/60 via-weather-cloud-700/60 to-weather-rain-700/60' 
            : 'bg-gradient-to-br from-weather-sun-200/60 via-weather-sky-200/60 to-weather-sun-300/60'
          }
        `}
        animate={{
          opacity: [0.6, 0.9, 0.6],
          scale: [1, 1.05, 1],
          rotate: [0, 180, 360]
        }}
        transition={{ duration: 6, repeat: Infinity }}
      />

      {/* Floating weather particles for dark mode */}
      <AnimatePresence>
        {isDark && (
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full"
                style={{
                  background: `linear-gradient(45deg, ${
                    ['#3b82f6', '#0ea5e9', '#6366f1', '#8b5cf6'][i % 4]
                  }, ${['#60a5fa', '#38bdf8', '#818cf8', '#a78bfa'][i % 4]})`,
                  left: `${20 + (i * 12)}%`,
                  top: `${20 + (i % 3) * 20}%`,
                  filter: 'blur(0.5px)',
                  boxShadow: '0 0 8px currentColor'
                }}
                animate={{
                  opacity: [0.3, 1, 0.3],
                  scale: [0.5, 1.2, 0.5],
                  y: [0, -8, 0]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.3
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating sun rays for light mode */}
      <AnimatePresence>
        {!isDark && (
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-px h-4 bg-gradient-to-t from-weather-sun-400 to-transparent"
                style={{
                  left: '50%',
                  top: '50%',
                  transformOrigin: '0 20px',
                  transform: `rotate(${i * 45}deg)`,
                }}
                animate={{
                  opacity: [0.4, 0.8, 0.4],
                  scaleY: [0.8, 1.2, 0.8],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Weather icon with enhanced animation */}
      <motion.div
        className="relative z-10"
        animate={{ 
          rotate: isDark ? 180 : 0,
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          rotate: { duration: 0.8, ease: "easeInOut" },
          scale: { duration: 2, repeat: Infinity }
        }}
      >
        <AnimatePresence mode="wait">
          {isDark ? (
            <motion.div
              key="night"
              initial={{ scale: 0, rotate: -90, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              exit={{ scale: 0, rotate: 90, opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="text-weather-sky-300"
              style={{
                filter: 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.5))'
              }}
            >
              <CloudRain size={24} />
            </motion.div>
          ) : (
            <motion.div
              key="day"
              initial={{ scale: 0, rotate: -90, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              exit={{ scale: 0, rotate: 90, opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="text-weather-sun-600"
              style={{
                filter: 'drop-shadow(0 0 8px rgba(251, 191, 36, 0.5))'
              }}
            >
              <Sun size={24} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Enhanced weather sparkle effects */}
      <motion.div
        className="absolute top-1 right-1"
        animate={{
          scale: [0, 1.2, 0],
          rotate: [0, 180, 360],
          opacity: [0, 1, 0]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          delay: 1
        }}
      >
        <Cloud 
          size={12} 
          className={isDark ? 'text-weather-cloud-400' : 'text-weather-sky-500'} 
        />
      </motion.div>

      {/* Weather ripple effect on click */}
      <motion.div
        className={`
          absolute inset-0 rounded-2xl
          ${isDark 
            ? 'bg-gradient-to-br from-weather-sky-500/30 to-weather-rain-500/30' 
            : 'bg-gradient-to-br from-weather-sun-400/30 to-weather-sky-400/30'
          }
        `}
        initial={{ scale: 0, opacity: 0.5 }}
        animate={{ scale: 0, opacity: 0 }}
        whileTap={{
          scale: [0, 1.3],
          opacity: [0.5, 0],
          transition: { duration: 0.8 }
        }}
      />
    </motion.button>
  );
};