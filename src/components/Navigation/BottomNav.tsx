import React from 'react';
import { motion } from 'framer-motion';
import { Home, Map, TrendingUp, Calendar, Heart } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: 'home', icon: Home, label: 'Home' },
  { id: 'map', icon: Map, label: 'Map' },
  { id: 'trends', icon: TrendingUp, label: 'Trends' },
  { id: 'forecast', icon: Calendar, label: 'Forecast' },
  { id: 'health', icon: Heart, label: 'Health' },
];

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const { isDark } = useTheme();

  return (
    <motion.div 
      className={`
        fixed bottom-0 left-0 right-0 z-50 border-t transition-all duration-500
        ${isDark 
          ? 'bg-gradient-to-r from-weather-cloud-900/95 via-weather-storm-900/95 to-weather-rain-900/95 backdrop-blur-xl border-weather-cloud-700/30' 
          : 'bg-gradient-to-r from-white/95 via-weather-sky-50/95 to-weather-cloud-50/95 backdrop-blur-xl border-weather-sky-200/30'
        }
      `}
      animate={{
        background: isDark 
          ? [
              'linear-gradient(90deg, rgba(15,23,42,0.95) 0%, rgba(30,41,59,0.95) 50%, rgba(71,85,105,0.95) 100%)',
              'linear-gradient(90deg, rgba(30,41,59,0.95) 0%, rgba(71,85,105,0.95) 50%, rgba(15,23,42,0.95) 100%)',
              'linear-gradient(90deg, rgba(71,85,105,0.95) 0%, rgba(15,23,42,0.95) 50%, rgba(30,41,59,0.95) 100%)'
            ]
          : [
              'linear-gradient(90deg, rgba(255,255,255,0.95) 0%, rgba(240,249,255,0.95) 50%, rgba(248,250,252,0.95) 100%)',
              'linear-gradient(90deg, rgba(240,249,255,0.95) 0%, rgba(248,250,252,0.95) 50%, rgba(255,255,255,0.95) 100%)',
              'linear-gradient(90deg, rgba(248,250,252,0.95) 0%, rgba(255,255,255,0.95) 50%, rgba(240,249,255,0.95) 100%)'
            ]
      }}
      transition={{ duration: 8, repeat: Infinity }}
    >
      <div className="flex justify-around items-center px-4 py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <motion.button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                flex flex-col items-center gap-1 py-2 px-3 rounded-xl
                transition-all duration-300 relative
                ${isActive 
                  ? 'text-weather-sky-600' 
                  : isDark ? 'text-weather-cloud-300 hover:text-weather-sky-200' : 'text-weather-cloud-500 hover:text-weather-sky-700'
                }
              `}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isActive && (
                <motion.div
                  className={`
                    absolute inset-0 rounded-xl
                    ${isDark ? 'bg-gradient-to-br from-weather-sky-600/30 to-weather-rain-600/20' : 'bg-gradient-to-br from-weather-sky-100 to-weather-cloud-50'}
                  `}
                  layoutId="activeTab"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              <div className="relative z-10">
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                <span className={`text-xs font-medium ${isActive ? 'font-semibold' : ''}`}>
                  {tab.label}
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
};