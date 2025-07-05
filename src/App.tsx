import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { BottomNav } from './components/Navigation/BottomNav';
import { ThemeToggle } from './components/ui/ThemeToggle';
import { PWAInstallBanner } from './components/ui/PWAInstallBanner';
import { WeatherBackground } from './components/Weather/WeatherBackground';
import { HomePage } from './pages/HomePage';
import { AQIMap } from './components/Map/AQIMap';
import { TrendsPage } from './pages/TrendsPage';
import { ForecastPage } from './pages/ForecastPage';
import { HealthDashboard } from './components/Health/HealthDashboard';
import { useAQIData } from './hooks/useAQIData';
import { useWeatherData } from './hooks/useWeatherData';
import { useGeolocation } from './hooks/useGeolocation';
import { useWeatherCondition } from './hooks/useWeatherCondition';

const AppContent = () => {
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState('home');
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number; name: string } | null>(null);
  const { latitude, longitude } = useGeolocation();
  
  // Use selected location or fallback to geolocation
  const currentLat = selectedLocation?.lat || latitude;
  const currentLng = selectedLocation?.lng || longitude;
  
  const { data: aqiData } = useAQIData(currentLat || undefined, currentLng || undefined);
  const { data: weatherData } = useWeatherData(
    aqiData?.coordinates?.lat || currentLat || undefined, 
    aqiData?.coordinates?.lng || currentLng || undefined
  );
  
  // Determine weather condition based on AQI and weather data
  const weatherCondition = useWeatherCondition(
    aqiData?.aqi,
    weatherData?.temperature,
    weatherData?.humidity,
    weatherData?.condition,
    aqiData?.location
  );

  // Register service worker with error handling
  useEffect(() => {
    const isDevelopment = window.location.hostname === 'localhost' ||
                         window.location.hostname === '127.0.0.1' ||
                         window.location.hostname.includes('stackblitz') ||
                         window.location.hostname.includes('webcontainer') ||
                         window.location.port === '5173';
    
    if ('serviceWorker' in navigator && !isDevelopment) {
      window.addEventListener('load', async () => {
        try {
          const registration = await navigator.serviceWorker.register('/sw.js');
          console.log('✅ Service Worker registered successfully:', registration.scope);
          
          registration.addEventListener('updatefound', () => {
            console.log('🔄 Service Worker update found');
          });
        } catch (error) {
          console.error('❌ Service Worker registration failed:', error);
        }
      });
    } else if (isDevelopment) {
      console.log('ℹ️ Service Worker registration skipped (Development environment)');
      
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(registrations => {
          registrations.forEach(registration => {
            console.log('🧹 Unregistering service worker in development');
            registration.unregister();
          });
        });
      }
    }
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomePage onNavigate={setActiveTab} onLocationChange={setSelectedLocation} />;
      case 'map':
        return <AQIMap />;
      case 'trends':
        return <TrendsPage />;
      case 'forecast':
        return <ForecastPage />;
      case 'health':
        return <HealthDashboard aqi={aqiData?.aqi || 0} />;
      default:
        return <HomePage onNavigate={setActiveTab} />;
    }
  };

  const getWeatherBackground = () => {
    const hour = new Date().getHours();
    const isNight = hour < 6 || hour > 18;
    
    if (isDark || isNight) {
      switch (weatherCondition.condition) {
        case 'stormy': return 'bg-gradient-stormy-dark';
        case 'rainy': return 'bg-gradient-rainy-dark';
        case 'snowy': return 'bg-gradient-misty-dark';
        case 'cloudy': return 'bg-gradient-cloudy-dark';
        case 'misty': return 'bg-gradient-misty-dark';
        case 'sunny': return 'bg-gradient-weather-dusk';
        default: return 'bg-gradient-clear-dark';
      }
    } else {
      switch (weatherCondition.condition) {
        case 'stormy': return 'bg-gradient-stormy';
        case 'rainy': return 'bg-gradient-rainy';
        case 'snowy': return 'bg-gradient-misty';
        case 'cloudy': return 'bg-gradient-cloudy';
        case 'misty': return 'bg-gradient-misty';
        case 'sunny': return 'bg-gradient-sunny';
        case 'windy': return 'bg-gradient-weather-day';
        default: return 'bg-gradient-clear';
      }
    }
  };

  return (
    <motion.div 
      className={`
        min-h-screen font-poppins overflow-x-hidden transition-all duration-1000 relative
        ${getWeatherBackground()}
      `}
      animate={{
        backgroundSize: ['400% 400%', '400% 400%'],
        backgroundPosition: [
          '0% 50%',
          '100% 0%', 
          '100% 100%',
          '0% 100%',
          '0% 50%'
        ]
      }}
      transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
    >
      {/* Dynamic Weather Background */}
      <WeatherBackground 
        weatherCondition={weatherCondition.condition}
        intensity={
          aqiData?.aqi && aqiData.aqi > 150 ? 'heavy' :
          aqiData?.aqi && aqiData.aqi > 100 ? 'moderate' : 'light'
        }
      />

      {/* Animated weather overlay with condition-specific effects */}
      <motion.div
        className="fixed inset-0 pointer-events-none z-10"
        animate={{
          background: (() => {
            const baseOpacity = isDark ? 0.1 : 0.05;
            switch (weatherCondition.condition) {
              case 'stormy':
                return [
                  `radial-gradient(circle at 20% 80%, rgba(99,102,241,${baseOpacity}) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(79,70,229,${baseOpacity * 1.5}) 0%, transparent 50%)`,
                  `radial-gradient(circle at 80% 20%, rgba(67,56,202,${baseOpacity * 1.2}) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(99,102,241,${baseOpacity}) 0%, transparent 50%)`,
                  `radial-gradient(circle at 50% 50%, rgba(79,70,229,${baseOpacity}) 0%, transparent 50%), radial-gradient(circle at 50% 50%, rgba(99,102,241,${baseOpacity * 1.3}) 0%, transparent 50%)`
                ];
              case 'rainy':
                return [
                  `radial-gradient(circle at 20% 80%, rgba(59,130,246,${baseOpacity}) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(14,165,233,${baseOpacity}) 0%, transparent 50%)`,
                  `radial-gradient(circle at 80% 20%, rgba(3,105,161,${baseOpacity}) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(59,130,246,${baseOpacity}) 0%, transparent 50%)`,
                  `radial-gradient(circle at 50% 50%, rgba(14,165,233,${baseOpacity}) 0%, transparent 50%), radial-gradient(circle at 50% 50%, rgba(59,130,246,${baseOpacity}) 0%, transparent 50%)`
                ];
              case 'sunny':
                return [
                  `radial-gradient(circle at 50% 30%, rgba(251,191,36,${baseOpacity}) 0%, transparent 50%), radial-gradient(circle at 50% 70%, rgba(245,158,11,${baseOpacity}) 0%, transparent 50%)`,
                  `radial-gradient(circle at 30% 50%, rgba(252,211,77,${baseOpacity}) 0%, transparent 50%), radial-gradient(circle at 70% 50%, rgba(251,191,36,${baseOpacity}) 0%, transparent 50%)`,
                  `radial-gradient(circle at 50% 50%, rgba(245,158,11,${baseOpacity}) 0%, transparent 50%), radial-gradient(circle at 50% 50%, rgba(251,191,36,${baseOpacity}) 0%, transparent 50%)`
                ];
              default:
                return [
                  `radial-gradient(circle at 20% 80%, rgba(148,163,184,${baseOpacity}) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(203,213,225,${baseOpacity}) 0%, transparent 50%)`,
                  `radial-gradient(circle at 80% 20%, rgba(241,245,249,${baseOpacity}) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(148,163,184,${baseOpacity}) 0%, transparent 50%)`,
                  `radial-gradient(circle at 50% 50%, rgba(203,213,225,${baseOpacity}) 0%, transparent 50%), radial-gradient(circle at 50% 50%, rgba(148,163,184,${baseOpacity}) 0%, transparent 50%)`
                ];
            }
          })()
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Enhanced Header with Dynamic Weather Theme */}
      <motion.header 
        className={`
          sticky top-0 z-40 transition-all duration-500
          ${isDark 
            ? 'bg-gradient-to-r from-weather-cloud-900/90 via-weather-storm-900/90 to-weather-rain-900/90 backdrop-blur-xl border-b border-weather-cloud-700/30' 
            : 'bg-gradient-to-r from-weather-sky-50/90 via-weather-cloud-50/90 to-weather-sun-50/90 backdrop-blur-xl border-b border-weather-cloud-200/30'
          }
          shadow-lg weather-glass
        `}
        animate={{
          background: isDark 
            ? [
                'linear-gradient(90deg, rgba(15,23,42,0.9) 0%, rgba(30,41,59,0.9) 50%, rgba(71,85,105,0.9) 100%)',
                'linear-gradient(90deg, rgba(30,41,59,0.9) 0%, rgba(71,85,105,0.9) 50%, rgba(15,23,42,0.9) 100%)',
                'linear-gradient(90deg, rgba(71,85,105,0.9) 0%, rgba(15,23,42,0.9) 50%, rgba(30,41,59,0.9) 100%)'
              ]
            : [
                'linear-gradient(90deg, rgba(240,249,255,0.9) 0%, rgba(248,250,252,0.9) 50%, rgba(255,251,235,0.9) 100%)',
                'linear-gradient(90deg, rgba(248,250,252,0.9) 0%, rgba(255,251,235,0.9) 50%, rgba(240,249,255,0.9) 100%)',
                'linear-gradient(90deg, rgba(255,251,235,0.9) 0%, rgba(240,249,255,0.9) 50%, rgba(248,250,252,0.9) 100%)'
              ]
        }}
        transition={{ duration: 8, repeat: Infinity }}
      >
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <motion.div 
              className="flex items-center gap-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${
                  weatherCondition.condition === 'sunny' ? 'bg-gradient-to-br from-weather-sun-400 via-weather-sun-500 to-weather-sun-600' :
                  weatherCondition.condition === 'rainy' ? 'bg-gradient-to-br from-weather-rain-400 via-weather-sky-500 to-weather-rain-600' :
                  weatherCondition.condition === 'stormy' ? 'bg-gradient-to-br from-weather-storm-400 via-weather-storm-500 to-weather-storm-600' :
                  'bg-gradient-to-br from-weather-sky-400 via-weather-cloud-500 to-weather-rain-400'
                }`}
                whileHover={{ 
                  scale: 1.05,
                  rotate: 5,
                }}
                whileTap={{ scale: 0.95 }}
                animate={{
                  boxShadow: [
                    '0 0 20px rgba(59,130,246,0.4)',
                    '0 0 30px rgba(251,191,36,0.5)',
                    '0 0 25px rgba(14,165,233,0.4)',
                    '0 0 20px rgba(59,130,246,0.4)'
                  ]
                }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <span className="text-white font-bold text-xl">
                  {weatherCondition.condition === 'sunny' ? '☀️' :
                   weatherCondition.condition === 'rainy' ? '🌧️' :
                   weatherCondition.condition === 'stormy' ? '⛈️' :
                   weatherCondition.condition === 'snowy' ? '❄️' :
                   weatherCondition.condition === 'windy' ? '💨' :
                   '☁️'}
                </span>
              </motion.div>
              <div>
                <motion.h1 
                  className={`
                    text-2xl font-bold transition-colors duration-500
                    ${isDark ? 'text-white' : 'text-weather-cloud-800'}
                  `}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  AirScope
                </motion.h1>
                <motion.p 
                  className={`
                    text-sm font-medium transition-colors duration-500
                    ${isDark ? 'text-weather-cloud-200' : 'text-weather-cloud-600'}
                  `}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {weatherCondition.description}
                </motion.p>
              </div>
            </motion.div>
            
            <div className="flex items-center gap-4">
              <ThemeToggle />
              
              <AnimatePresence>
                {aqiData && (
                  <motion.div
                    className={`
                      flex items-center gap-3 px-4 py-2 rounded-full border shadow-lg transition-all duration-500
                      ${isDark 
                        ? 'bg-gradient-to-r from-weather-rain-800/60 to-weather-sky-800/60 backdrop-blur-md border-weather-rain-700/30' 
                        : 'bg-gradient-to-r from-weather-sky-50/60 to-weather-sun-50/60 backdrop-blur-md border-weather-sky-200/30'
                      }
                    `}
                    initial={{ opacity: 0, scale: 0.8, x: 20 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.8, x: 20 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  >
                    <motion.div 
                      className="w-3 h-3 bg-gradient-to-r from-weather-rain-400 to-weather-sky-500 rounded-full shadow-sm"
                      animate={{ 
                        scale: [1, 1.3, 1],
                        boxShadow: [
                          '0 0 0 0 rgba(59,130,246,0.7)',
                          '0 0 0 8px rgba(59,130,246,0)',
                          '0 0 0 0 rgba(59,130,246,0)'
                        ]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <span className={`text-sm font-semibold transition-colors duration-500 ${isDark ? 'text-weather-sky-200' : 'text-weather-sky-700'}`}>
                      Live Weather
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Enhanced Main Content with Weather Theme */}
      <main className="max-w-7xl mx-auto px-4 py-6 pb-24 relative z-20">
        {/* Floating weather decorative elements */}
        <motion.div 
          className={`
            absolute top-10 right-10 w-32 h-32 rounded-full blur-3xl transition-all duration-1000
            ${isDark 
              ? 'bg-gradient-to-br from-weather-storm-600/30 to-weather-rain-600/30' 
              : 'bg-gradient-to-br from-weather-sky-200/40 to-weather-sun-200/40'
            }
          `}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5],
            rotate: [0, 180, 360]
          }}
          transition={{ duration: 12, repeat: Infinity }}
        />
        <motion.div 
          className={`
            absolute bottom-20 left-10 w-24 h-24 rounded-full blur-2xl transition-all duration-1000
            ${isDark 
              ? 'bg-gradient-to-br from-weather-rain-600/30 to-weather-sky-600/30' 
              : 'bg-gradient-to-br from-weather-wind-200/40 to-weather-sky-200/40'
            }
          `}
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.6, 0.3],
            rotate: [360, 180, 0]
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeTab}-${isDark ? 'dark' : 'light'}-${weatherCondition.condition}`}
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            transition={{ 
              type: 'spring',
              stiffness: 300,
              damping: 30,
              duration: 0.4
            }}
            className="relative z-10"
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* PWA Install Banner - only show in production */}
      {window.location.hostname !== 'localhost' && 
       !window.location.hostname.includes('stackblitz') && 
       <PWAInstallBanner />}

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </motion.div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;