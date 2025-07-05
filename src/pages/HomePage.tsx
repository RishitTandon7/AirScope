import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { 
  Calendar, TrendingUp, Map, Wind, Thermometer, Droplets, 
  Heart, Shield, AlertTriangle, Sparkles, Eye, Activity, ArrowRight,
  Globe, Star, Gauge, Radio, MapPin, Clock, Zap, Download,
  Smartphone, Bell, Navigation, BarChart3, Layers, Target,
  CloudRain, Sun, Cloud, CloudSnow
} from 'lucide-react';
import { LocationPrompt } from '../components/Location/LocationPrompt';
import { LocationSelector } from '../components/Location/LocationSelector';
import { AQIHumanContext } from '../components/AQI/AQIHumanContext';
import { AQILifestyleCard } from '../components/AQI/AQILifestyleCard';
import { WeatherInfoCard } from '../components/Weather/WeatherInfoCard';
import { WeatherCard } from '../components/Weather/WeatherCard';
import { WeatherIcon } from '../components/Weather/WeatherIcon';
import { Card } from '../components/ui/Card';
import { InteractiveButton } from '../components/ui/InteractiveButton';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { AppDownloadModal } from '../components/ui/AppDownloadModal';
import { useAQIData } from '../hooks/useAQIData';
import { useWeatherData } from '../hooks/useWeatherData';
import { useGeolocation } from '../hooks/useGeolocation';
import { useWeatherCondition } from '../hooks/useWeatherCondition';
import { useTheme } from '../contexts/ThemeContext';
import { getAQILevel } from '../constants/aqi';

interface HomePageProps {
  onNavigate: (tab: string) => void;
  onLocationChange?: (location: { lat: number; lng: number; name: string }) => void;
}

const QuantumParticle = ({ delay = 0, size = 'sm' }: { delay?: number; size?: 'sm' | 'md' | 'lg' }) => {
  const { isDark } = useTheme();
  const sizeClasses = {
    sm: 'w-1 h-1',
    md: 'w-2 h-2', 
    lg: 'w-3 h-3'
  };

  return (
    <motion.div
      className={`absolute ${sizeClasses[size]} rounded-full`}
      style={{
        background: isDark 
          ? 'linear-gradient(45deg, #00ffff, #ff00ff, #ffff00)'
          : 'linear-gradient(45deg, #3b82f6, #8b5cf6, #06b6d4)',
        filter: 'blur(0.5px)',
        boxShadow: '0 0 8px currentColor',
        opacity: isDark ? 0.6 : 0.4
      }}
      initial={{ 
        x: Math.random() * window.innerWidth, 
        y: window.innerHeight + 50,
        scale: 0,
        opacity: 0
      }}
      animate={{
        y: -50,
        scale: [0, 1, 0.8, 1, 0],
        opacity: [0, isDark ? 0.6 : 0.4, isDark ? 0.4 : 0.3, isDark ? 0.6 : 0.4, 0],
        x: [
          Math.random() * window.innerWidth,
          Math.random() * window.innerWidth,
          Math.random() * window.innerWidth
        ],
        rotate: [0, 180, 360]
      }}
      transition={{
        duration: 15,
        delay,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  );
};

const WeatherAQIDisplay = ({ aqi, level, loading, source, weatherCondition }: { 
  aqi: number; 
  level: any; 
  loading: boolean; 
  source?: string;
  weatherCondition: any;
}) => {
  const { isDark } = useTheme();
  
  return (
    <motion.div
      className="relative flex items-center justify-center"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 1, ease: "easeOut" }}
    >
      {/* Weather-influenced rings */}
      <motion.div
        className="absolute inset-0 rounded-full border-4 opacity-50"
        style={{ borderColor: level.color }}
        animate={{ 
          scale: [1, 1.2, 1.1, 1],
          opacity: [0.5, 0.8, 0.6, 0.5],
          rotate: [0, 90, 180, 270, 360]
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      
      <motion.div
        className="absolute inset-4 rounded-full border-2 opacity-30"
        style={{ borderColor: level.color }}
        animate={{ 
          scale: [1.1, 0.9, 1.05, 1.1],
          opacity: [0.3, 0.6, 0.4, 0.3],
          rotate: [360, 270, 180, 90, 0]
        }}
        transition={{ duration: 6, repeat: Infinity }}
      />

      {/* Weather-enhanced holographic glow */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(circle, ${level.color}30 0%, transparent 70%)`,
          filter: 'blur(20px)'
        }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.6, 0.9, 0.6]
        }}
        transition={{ duration: 4, repeat: Infinity }}
      />

      {/* Weather condition overlay */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={{
          opacity: [0.1, 0.3, 0.1],
        }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <WeatherIcon 
          condition={weatherCondition.condition} 
          size={120} 
          className="text-white/20"
        />
      </motion.div>

      {/* Main AQI number */}
      <motion.div
        className="relative z-10 text-center"
        animate={{
          filter: [
            'hue-rotate(0deg) brightness(1)',
            'hue-rotate(30deg) brightness(1.1)',
            'hue-rotate(0deg) brightness(1)'
          ]
        }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <motion.div
          className="text-8xl md:text-9xl font-bold font-mono tracking-wider text-white"
          style={{ 
            textShadow: `0 0 30px ${level.color}, 0 0 60px ${level.color}80, 0 2px 4px rgba(0,0,0,0.8)`,
            fontVariantNumeric: 'tabular-nums',
            WebkitTextStroke: `2px ${level.color}`,
            color: 'white'
          }}
          animate={loading ? {} : {
            scale: [1, 1.02, 1],
            textShadow: [
              `0 0 30px ${level.color}, 0 0 60px ${level.color}80, 0 2px 4px rgba(0,0,0,0.8)`,
              `0 0 40px ${level.color}, 0 0 80px ${level.color}FF, 0 2px 4px rgba(0,0,0,0.8)`,
              `0 0 30px ${level.color}, 0 0 60px ${level.color}80, 0 2px 4px rgba(0,0,0,0.8)`
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
          key={`aqi-${aqi}`}
        >
          {loading ? <LoadingSpinner size="lg" color={level.color} /> : aqi}
        </motion.div>
        
        <motion.div
          className="mt-4 space-y-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          key={`level-${level.label}`}
        >
          <h2 className="text-3xl font-bold text-white" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
            {level.label}
          </h2>
          <p className="text-gray-100 text-lg" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>
            {level.description}
          </p>
          <div className="flex items-center justify-center gap-2 text-gray-200 text-sm">
            <WeatherIcon condition={weatherCondition.condition} size={16} />
            <span>{weatherCondition.description}</span>
          </div>
          {source && (
            <p className="text-gray-200 text-sm opacity-75" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>
              📊 Data: {source}
            </p>
          )}
        </motion.div>
      </motion.div>

      {/* Weather-influenced data streams */}
      <motion.div
        className="absolute inset-0 overflow-hidden rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-px h-20"
            style={{
              background: `linear-gradient(to bottom, transparent, ${level.color}, transparent)`,
              left: '50%',
              top: '10%',
              transformOrigin: '0 200px'
            }}
            animate={{
              rotate: i * 45,
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              rotate: { duration: 0, delay: 0 },
              opacity: { duration: 2, repeat: Infinity, delay: i * 0.3 }
            }}
          />
        ))}
      </motion.div>
    </motion.div>
  );
};

const MetricCard = ({ icon: Icon, label, value, unit, color, description }: {
  icon: any;
  label: string;
  value: number | string;
  unit: string;
  color: string;
  description: string;
}) => {
  const { isDark } = useTheme();
  
  return (
    <motion.div
      className={`
        relative p-6 rounded-3xl border group cursor-pointer shadow-lg transition-all duration-500
        ${isDark 
          ? 'bg-weather-cloud-800/80 backdrop-blur-xl border-weather-cloud-600/40' 
          : 'bg-white/95 backdrop-blur-xl border-weather-sky-200/40'
        }
      `}
      whileHover={{ scale: 1.05, y: -5, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      key={`${label}-${value}`}
    >
      <motion.div
        className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100"
        style={{
          background: `linear-gradient(135deg, ${color}10, ${color}05)`
        }}
        transition={{ duration: 0.3 }}
      />
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <motion.div
            className="p-3 rounded-2xl"
            style={{ backgroundColor: `${color}20` }}
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            <Icon size={24} style={{ color }} />
          </motion.div>
          <div>
            <h4 className={`text-sm font-medium uppercase tracking-wide transition-colors duration-500 ${isDark ? 'text-weather-cloud-300' : 'text-weather-cloud-600'}`}>{label}</h4>
            <p className={`text-xs transition-colors duration-500 ${isDark ? 'text-weather-cloud-400' : 'text-weather-cloud-500'}`}>{description}</p>
          </div>
        </div>
        
        <motion.div
          className={`text-3xl font-bold transition-colors duration-500 ${isDark ? 'text-white' : 'text-weather-cloud-800'}`}
          animate={{
            color: [color, color, color]
          }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          {value}<span className={`text-lg ${isDark ? 'text-weather-cloud-400' : 'text-weather-cloud-500'}`}>{unit}</span>
        </motion.div>
      </div>
      
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-1 rounded-b-3xl"
        style={{ backgroundColor: color }}
        initial={{ scaleX: 0 }}
        whileHover={{ scaleX: 1 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
};

const AppPreviewCard = ({ onDownloadClick }: { onDownloadClick: () => void }) => {
  const { isDark } = useTheme();
  
  return (
    <Card variant="weather" className="shadow-lg">
      <div className="text-center mb-6">
        <motion.div
          className="w-20 h-20 mx-auto mb-4 rounded-3xl bg-gradient-to-br from-weather-sky-500 to-weather-rain-600 flex items-center justify-center"
          animate={{
            boxShadow: [
              '0 0 30px rgba(59,130,246,0.5)',
              '0 0 50px rgba(59,130,246,0.8)',
              '0 0 30px rgba(59,130,246,0.5)'
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Smartphone className="text-white" size={40} />
        </motion.div>
        
        <h3 className={`text-2xl font-bold mb-2 transition-colors duration-500 ${isDark ? 'text-white' : 'text-weather-cloud-800'}`}>AirScope Mobile</h3>
        <p className={`mb-6 transition-colors duration-500 ${isDark ? 'text-weather-cloud-300' : 'text-weather-cloud-600'}`}>Advanced air quality monitoring in your pocket</p>
      </div>

      <div className="space-y-4 mb-6">
        <div className={`flex items-center gap-3 transition-colors duration-500 ${isDark ? 'text-weather-cloud-200' : 'text-weather-cloud-700'}`}>
          <Bell size={18} className="text-weather-sky-500" />
          <span className="font-medium">Real-time health alerts</span>
        </div>
        <div className={`flex items-center gap-3 transition-colors duration-500 ${isDark ? 'text-weather-cloud-200' : 'text-weather-cloud-700'}`}>
          <Navigation size={18} className="text-weather-sky-500" />
          <span className="font-medium">Route optimization</span>
        </div>
        <div className={`flex items-center gap-3 transition-colors duration-500 ${isDark ? 'text-weather-cloud-200' : 'text-weather-cloud-700'}`}>
          <BarChart3 size={18} className="text-weather-sky-500" />
          <span className="font-medium">Personal analytics</span>
        </div>
        <div className={`flex items-center gap-3 transition-colors duration-500 ${isDark ? 'text-weather-cloud-200' : 'text-weather-cloud-700'}`}>
          <Target size={18} className="text-weather-sky-500" />
          <span className="font-medium">Hyperlocal precision</span>
        </div>
      </div>

      <InteractiveButton
        onClick={onDownloadClick}
        variant="weather"
        size="lg"
        icon={Download}
        className="w-full"
      >
        Download App
      </InteractiveButton>
    </Card>
  );
};

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onLocationChange }) => {
  const { isDark } = useTheme();
  const [particles, setParticles] = useState<number[]>([]);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [showLocationSelector, setShowLocationSelector] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number; name: string } | null>(null);
  const controls = useAnimation();
  
  const { latitude, longitude, error: locationError, loading: locationLoading, refetch: refetchLocation } = useGeolocation();
  
  const currentLat = selectedLocation?.lat || latitude;
  const currentLng = selectedLocation?.lng || longitude;
  
  // Use the location from AQI data if available, otherwise fall back to geolocation
  const { data: aqiData, loading: aqiLoading, error: aqiError, refetch: refetchAQI } = useAQIData(currentLat || undefined, currentLng || undefined);
  const { data: weatherData, loading: weatherLoading, refetch: refetchWeather } = useWeatherData(
    aqiData?.coordinates?.lat || currentLat || undefined, 
    aqiData?.coordinates?.lng || currentLng || undefined
  );
  
  const weatherCondition = useWeatherCondition(
    aqiData?.aqi,
    weatherData?.temperature,
    weatherData?.humidity,
    weatherData?.condition,
    aqiData?.location // Pass the location name for better weather detection
  );

  useEffect(() => {
    setParticles(Array.from({ length: 8 }, (_, i) => i));
    
    controls.start({
      opacity: 1,
      y: 0,
      transition: { duration: 1.5, ease: "easeOut" }
    });
  }, [controls]);

  useEffect(() => {
    console.log('🎯 Coordinates changed:', { currentLat, currentLng, selectedLocation });
  }, [currentLat, currentLng, selectedLocation]);

  const handleRefresh = () => {
    console.log('🔄 Manual refresh triggered');
    refetchAQI();
    refetchWeather();
  };

  const handleLocationSelect = (location: { lat: number; lng: number; name: string }) => {
    console.log('📍 Location selected:', location);
    setSelectedLocation(location);
    onLocationChange?.(location); // Notify parent component
    setShowLocationSelector(false);
  };

  const displayLocation = selectedLocation?.name || aqiData?.location || 'Unknown Location';

  if (locationError && !latitude && !selectedLocation) {
    return (
      <div className="max-w-md mx-auto">
        <LocationPrompt 
          onEnableLocation={refetchLocation}
          error={locationError}
          loading={locationLoading}
        />
      </div>
    );
  }

  if ((locationLoading || (aqiLoading && !aqiData)) && !selectedLocation) {
    return (
      <div className={`
        min-h-screen flex items-center justify-center transition-all duration-1000
        ${isDark 
          ? 'bg-gradient-to-br from-weather-cloud-900 to-weather-storm-900' 
          : 'bg-gradient-to-br from-weather-sky-50 to-weather-cloud-50'
        }
      `}>
        <Card variant="weather" className="text-center py-16 shadow-lg">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <LoadingSpinner 
              size="lg" 
              text={locationLoading ? "🌍 Finding your location..." : "🌬️ Analyzing air quality..."} 
            />
          </motion.div>
        </Card>
      </div>
    );
  }

  if (aqiError && !aqiData) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Card variant="weather" className="text-center shadow-lg">
          <div className="text-6xl mb-4">😔</div>
          <p className="text-red-600 mb-4 text-lg font-semibold">Something went wrong</p>
          <InteractiveButton onClick={handleRefresh} variant="weather">
            🔄 Try Again
          </InteractiveButton>
        </Card>
      </div>
    );
  }

  if (!aqiData) return null;

  const aqiLevel = getAQILevel(aqiData.aqi);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Theme-aware quantum particles */}
      {particles.map((_, index) => (
        <QuantumParticle 
          key={index} 
          delay={index * 1} 
          size={index % 2 === 0 ? 'md' : 'sm'} 
        />
      ))}

      <div className="relative z-10 space-y-12">
        {/* Enhanced header with weather integration */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center pt-4 md:pt-8 px-4"
        >
          <motion.div
            className={`
              inline-flex items-center gap-2 md:gap-3 px-4 md:px-8 py-3 md:py-4 rounded-full border shadow-lg mb-6 md:mb-8 transition-all duration-500
              ${isDark 
                ? 'bg-weather-cloud-800/90 backdrop-blur-xl border-weather-cloud-700/40' 
                : 'bg-white/90 backdrop-blur-xl border-weather-sky-200/40'
              }
            `}
            whileHover={{ scale: 1.05, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              <Radio className="text-weather-sky-500" size={24} />
            </motion.div>
            <span className={`text-sm md:text-lg font-semibold transition-colors duration-500 ${isDark ? 'text-white' : 'text-weather-cloud-800'}`}>
              Live Weather & Air Quality
            </span>
            <WeatherIcon condition={weatherCondition.condition} size={16} className="md:w-5 md:h-5" />
          </motion.div>

          <motion.h1
            className={`
              text-5xl md:text-6xl lg:text-7xl font-bold mb-6 md:mb-6 transition-colors duration-500
              ${isDark ? 'text-white' : 'text-weather-cloud-800'}
            `}
            style={{
              textShadow: isDark ? '0 2px 4px rgba(0,0,0,0.5)' : '0 2px 4px rgba(0,0,0,0.1)'
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            AirScope
          </motion.h1>

          <motion.p
            className={`text-base md:text-xl max-w-3xl mx-auto leading-relaxed px-4 transition-colors duration-500 ${isDark ? 'text-weather-cloud-300' : 'text-weather-cloud-600'}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Real-time air quality monitoring with weather-integrated analysis and personalized health recommendations
          </motion.p>
        </motion.div>

        {/* Primary AQI Display with Weather Integration */}
        <motion.div
          className="max-w-6xl mx-auto px-4"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 1 }}
          key={`aqi-display-${aqiData.aqi}-${aqiData.location}-${weatherCondition.condition}`}
        >
          {/* AQI-Focused Human Context Display */}
          <AQIHumanContext
            aqi={aqiData.aqi}
            location={displayLocation}
            temperature={weatherData?.temperature}
            weatherCondition={weatherData?.condition}
            onLocationClick={() => setShowLocationSelector(true)}
          />
        </motion.div>

        {/* Comprehensive Weather Information */}
        <motion.div
          className="max-w-6xl mx-auto px-4"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          {weatherData && (
            <WeatherInfoCard
              temperature={weatherData.temperature}
              feelsLike={weatherData.temperature + Math.round((weatherData.humidity - 50) / 10)}
              humidity={weatherData.humidity}
              windSpeed={weatherData.windSpeed}
              windDirection={weatherData.windDirection}
              pressure={weatherData.pressure}
              visibility={weatherData.visibility}
              condition={weatherData.condition || 'Clear'}
              description={weatherData.description || 'Clear sky'}
            />
          )}
        </motion.div>

        {/* AQI Lifestyle Recommendations */}
        <motion.div
          className="max-w-6xl mx-auto px-4"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <AQILifestyleCard
            aqi={aqiData.aqi}
            pollutants={aqiData.pollutants}
          />
        </motion.div>

        {/* App Integration Section */}
        <motion.div
          className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <AppPreviewCard onDownloadClick={() => setShowDownloadModal(true)} />
          
          <Card variant="weather" className="shadow-lg">
            <div className="text-center mb-6">
              <motion.div
                className="w-20 h-20 mx-auto mb-4 rounded-3xl bg-gradient-to-br from-weather-hot-500 to-weather-hot-600 flex items-center justify-center"
                animate={{
                  boxShadow: [
                    '0 0 30px rgba(239,68,68,0.5)',
                    '0 0 50px rgba(239,68,68,0.8)',
                    '0 0 30px rgba(239,68,68,0.5)'
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Heart className="text-white" size={40} />
              </motion.div>
              
              <h3 className={`text-2xl font-bold mb-2 transition-colors duration-500 ${isDark ? 'text-white' : 'text-weather-cloud-800'}`}>Health Analytics</h3>
              <p className={`mb-6 transition-colors duration-500 ${isDark ? 'text-weather-cloud-300' : 'text-weather-cloud-600'}`}>AI-powered health insights and recommendations</p>
            </div>

            <div className="space-y-4 mb-6">
              <div className={`flex items-center gap-3 transition-colors duration-500 ${isDark ? 'text-weather-cloud-200' : 'text-weather-cloud-700'}`}>
                <Target size={18} className="text-weather-hot-500" />
                <span className="font-medium">Personalized alert thresholds</span>
              </div>
              <div className={`flex items-center gap-3 transition-colors duration-500 ${isDark ? 'text-weather-cloud-200' : 'text-weather-cloud-700'}`}>
                <Heart size={18} className="text-weather-hot-500" />
                <span className="font-medium">Health impact assessment</span>
              </div>
              <div className={`flex items-center gap-3 transition-colors duration-500 ${isDark ? 'text-weather-cloud-200' : 'text-weather-cloud-700'}`}>
                <Calendar size={18} className="text-weather-hot-500" />
                <span className="font-medium">Daily exposure tracking</span>
              </div>
              <div className={`flex items-center gap-3 transition-colors duration-500 ${isDark ? 'text-weather-cloud-200' : 'text-weather-cloud-700'}`}>
                <TrendingUp size={18} className="text-weather-hot-500" />
                <span className="font-medium">Long-term analysis</span>
              </div>
            </div>

            <InteractiveButton
              onClick={() => onNavigate('health')}
              variant="secondary"
              size="lg"
              icon={ArrowRight}
              iconPosition="right"
              className="w-full"
            >
              View Health Dashboard
            </InteractiveButton>
          </Card>
        </motion.div>

        {/* Navigation Grid */}
        <motion.div
          className="max-w-6xl mx-auto px-4"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          <div className="text-center mb-8">
            <h2 className={`text-2xl md:text-3xl font-bold mb-2 transition-colors duration-500 ${isDark ? 'text-white' : 'text-weather-cloud-800'}`}>Explore Features</h2>
            <p className={`transition-colors duration-500 ${isDark ? 'text-weather-cloud-300' : 'text-weather-cloud-600'}`}>Access comprehensive air quality tools and insights</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-6">
            <motion.div whileHover={{ scale: 1.05, y: -5 }}>
              <InteractiveButton
                onClick={() => onNavigate('forecast')}
                variant="weather"
                size="xl"
                icon={Calendar}
                className="h-36 md:h-32 w-full flex-col text-center"
              >
                <div className="text-4xl md:text-3xl mb-3 md:mb-3">🔮</div>
                <div className="font-bold text-lg md:text-lg">Forecast</div>
                <div className="text-sm md:text-sm opacity-80">3-day prediction</div>
              </InteractiveButton>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05, y: -5 }}>
              <InteractiveButton
                onClick={() => onNavigate('trends')}
                variant="secondary"
                size="xl"
                icon={TrendingUp}
                className="h-36 md:h-32 w-full flex-col text-center"
              >
                <div className="text-4xl md:text-3xl mb-3 md:mb-3">📊</div>
                <div className="font-bold text-lg md:text-lg">Trends</div>
                <div className="text-sm md:text-sm opacity-80">Historical data</div>
              </InteractiveButton>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05, y: -5 }}>
              <InteractiveButton
                onClick={() => onNavigate('map')}
                variant="ghost"
                size="xl"
                icon={Map}
                className="h-36 md:h-32 w-full flex-col text-center"
              >
                <div className="text-4xl md:text-3xl mb-3 md:mb-3">🗺️</div>
                <div className="font-bold text-lg md:text-lg">Map</div>
                <div className="text-sm md:text-sm opacity-80">Interactive view</div>
              </InteractiveButton>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05, y: -5 }}>
              <InteractiveButton
                onClick={() => onNavigate('health')}
                variant="danger"
                size="xl"
                icon={Heart}
                className="h-36 md:h-32 w-full flex-col text-center"
              >
                <div className="text-4xl md:text-3xl mb-3 md:mb-3">❤️</div>
                <div className="font-bold text-lg md:text-lg">Health</div>
                <div className="text-sm md:text-sm opacity-80">Personal insights</div>
              </InteractiveButton>
            </motion.div>
          </div>
        </motion.div>

        {/* Health Alert System */}
        <AnimatePresence>
          {aqiData.aqi > 100 && (
            <motion.div
              className="max-w-6xl mx-auto px-4"
              initial={{ opacity: 0, y: 50, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -50, height: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <Card className={`
                border-l-4 border-weather-hot-500 shadow-lg transition-all duration-500
                ${isDark 
                  ? 'bg-weather-hot-900/20 backdrop-blur-xl border-weather-hot-600/40' 
                  : 'bg-weather-hot-50 backdrop-blur-xl border-weather-hot-500/40'
                }
              `}>
                <div className="flex items-start gap-8">
                  <motion.div
                    className="p-4 md:p-6 bg-gradient-to-br from-weather-hot-500 to-weather-hot-600 rounded-2xl md:rounded-3xl shadow-lg flex-shrink-0"
                    animate={{ 
                      scale: [1, 1.05, 1],
                      boxShadow: [
                        '0 0 20px rgba(239, 68, 68, 0.3)',
                        '0 0 30px rgba(239, 68, 68, 0.5)',
                        '0 0 20px rgba(239, 68, 68, 0.3)'
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Zap className="text-white" size={24} />
                  </motion.div>
                  
                  <div className="flex-1">
                    <h4 className={`font-bold mb-3 md:mb-4 text-lg md:text-2xl transition-colors duration-500 ${isDark ? 'text-weather-hot-300' : 'text-weather-hot-800'}`}>⚠️ Air Quality Alert</h4>
                    <p className={`mb-4 md:mb-6 text-sm md:text-lg leading-relaxed transition-colors duration-500 ${isDark ? 'text-weather-hot-200' : 'text-weather-hot-700'}`}>
                      Current air quality may be harmful to sensitive individuals. 
                      Consider limiting outdoor activities and using protective measures.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                      <InteractiveButton
                        onClick={() => onNavigate('health')}
                        variant="weather"
                        size="md"
                        icon={ArrowRight}
                        iconPosition="right"
                        className="w-full sm:w-auto"
                      >
                        Health Recommendations
                      </InteractiveButton>
                      
                      <InteractiveButton
                        onClick={() => onNavigate('forecast')}
                        variant="ghost"
                        size="md"
                        className="w-full sm:w-auto"
                      >
                        View Forecast
                      </InteractiveButton>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer CTA */}
        <motion.div
          className="max-w-6xl mx-auto text-center pb-16 px-4"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 }}
        >
          <Card className={`
            border shadow-lg p-12 transition-all duration-500
            ${isDark 
              ? 'bg-weather-cloud-800/50 backdrop-blur-xl border-weather-cloud-700/40' 
              : 'bg-gradient-to-br from-weather-sky-50 to-weather-sun-50 border-weather-sky-200/40'
            }
          `}>
            <motion.div
              className="mb-8"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <div className="text-6xl mb-6">🌟</div>
              <h3 className={`text-2xl md:text-4xl font-bold mb-4 md:mb-6 transition-colors duration-500 ${isDark ? 'text-white' : 'text-weather-cloud-800'}`}>
                Stay Informed, Stay Healthy
              </h3>
              <p className={`text-base md:text-xl max-w-3xl mx-auto leading-relaxed px-4 transition-colors duration-500 ${isDark ? 'text-weather-cloud-300' : 'text-weather-cloud-600'}`}>
                Join thousands of users who trust AirScope for accurate air quality monitoring using EPA standards, 
                predictive analytics, and personalized health recommendations.
              </p>
            </motion.div>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4 md:gap-6">
              <InteractiveButton
                onClick={() => onNavigate('map')}
                variant="weather"
                size="lg"
                icon={Globe}
                className="w-full sm:w-auto"
              >
                Explore Global Map
              </InteractiveButton>
              
              <InteractiveButton
                onClick={() => setShowDownloadModal(true)}
                variant="secondary"
                size="lg"
                icon={Download}
                className="w-full sm:w-auto"
              >
                Download App
              </InteractiveButton>
            </div>
          </Card>
        </motion.div>
      </div>

      <LocationSelector
        isOpen={showLocationSelector}
        onClose={() => setShowLocationSelector(false)}
        currentLocation={displayLocation}
        onLocationSelect={handleLocationSelect}
      />

      <AppDownloadModal 
        isOpen={showDownloadModal} 
        onClose={() => setShowDownloadModal(false)} 
      />
    </div>
  );
};