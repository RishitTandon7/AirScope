import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Layers, MapPin, Filter, Plus, Minus, Navigation, 
  Maximize2, Wind, Eye, Thermometer, Droplets, Target,
  Zap, Globe, Satellite, RotateCcw, X, Cloud, Sun, Map,
  Info, Star, TrendingUp, Calendar, Activity, ChevronUp, ChevronDown
} from 'lucide-react';
import { Card } from '../ui/Card';
import { InteractiveButton } from '../ui/InteractiveButton';
import { useTheme } from '../../contexts/ThemeContext';
import { getAQILevel } from '../../constants/aqi';

interface AQIMapProps {
  onLocationSelect?: (location: { lat: number; lng: number; name: string }) => void;
}

interface IndianCity {
  id: number;
  name: string;
  state: string;
  lat: number;
  lng: number;
  population: number; // in millions
  importance: 'major' | 'capital' | 'metro' | 'industrial';
  aqi: number;
  pollutants: {
    pm25: number;
    pm10: number;
    no2: number;
    o3: number;
    so2: number;
    co: number;
  };
  weather: {
    temp: number;
    humidity: number;
    windSpeed: number;
    condition: string;
  };
}

const LAYER_TYPES = [
  { id: 'aqi', name: 'Air Quality Index', color: '#3B82F6', icon: Wind },
  { id: 'pm25', name: 'PM2.5', color: '#EF4444', icon: Target },
  { id: 'pm10', name: 'PM10', color: '#F59E0B', icon: Zap },
  { id: 'no2', name: 'NO₂', color: '#8B5CF6', icon: Globe },
  { id: 'weather', name: 'Weather', color: '#10B981', icon: Thermometer },
];

const MAP_STYLES = [
  { id: 'terrain', name: 'Terrain', icon: Map },
  { id: 'atmospheric', name: 'Atmospheric', icon: Cloud },
  { id: 'satellite', name: 'Satellite', icon: Satellite },
];

// Enhanced Indian Cities Data with comprehensive coverage
const INDIAN_CITIES: Omit<IndianCity, 'aqi' | 'pollutants' | 'weather'>[] = [
  // Metro Cities
  { id: 1, name: 'Delhi', state: 'Delhi', lat: 28.6139, lng: 77.2090, population: 32.9, importance: 'major' },
  { id: 2, name: 'Mumbai', state: 'Maharashtra', lat: 19.0760, lng: 72.8777, population: 20.4, importance: 'major' },
  { id: 3, name: 'Kolkata', state: 'West Bengal', lat: 22.5726, lng: 88.3639, population: 14.8, importance: 'major' },
  { id: 4, name: 'Chennai', state: 'Tamil Nadu', lat: 13.0827, lng: 80.2707, population: 11.0, importance: 'major' },
  { id: 5, name: 'Bangalore', state: 'Karnataka', lat: 12.9716, lng: 77.5946, population: 13.6, importance: 'major' },
  { id: 6, name: 'Hyderabad', state: 'Telangana', lat: 17.3850, lng: 78.4867, population: 10.5, importance: 'major' },
  
  // State Capitals & Major Cities
  { id: 7, name: 'Jaipur', state: 'Rajasthan', lat: 26.9124, lng: 75.7873, population: 3.9, importance: 'capital' },
  { id: 8, name: 'Lucknow', state: 'Uttar Pradesh', lat: 26.8467, lng: 80.9462, population: 3.6, importance: 'capital' },
  { id: 9, name: 'Pune', state: 'Maharashtra', lat: 18.5204, lng: 73.8567, population: 7.2, importance: 'metro' },
  { id: 10, name: 'Ahmedabad', state: 'Gujarat', lat: 23.0225, lng: 72.5714, population: 8.4, importance: 'metro' },
  { id: 11, name: 'Surat', state: 'Gujarat', lat: 21.1702, lng: 72.8311, population: 6.6, importance: 'metro' },
  { id: 12, name: 'Kanpur', state: 'Uttar Pradesh', lat: 26.4499, lng: 80.3319, population: 3.8, importance: 'industrial' },
  { id: 13, name: 'Nagpur', state: 'Maharashtra', lat: 21.1458, lng: 79.0882, population: 2.4, importance: 'metro' },
  { id: 14, name: 'Indore', state: 'Madhya Pradesh', lat: 22.7196, lng: 75.8577, population: 3.3, importance: 'metro' },
  { id: 15, name: 'Bhopal', state: 'Madhya Pradesh', lat: 23.2599, lng: 77.4126, population: 2.4, importance: 'capital' },
  { id: 16, name: 'Visakhapatnam', state: 'Andhra Pradesh', lat: 17.6868, lng: 83.2185, population: 2.0, importance: 'metro' },
  { id: 17, name: 'Patna', state: 'Bihar', lat: 25.5941, lng: 85.1376, population: 2.8, importance: 'capital' },
  { id: 18, name: 'Vadodara', state: 'Gujarat', lat: 22.3072, lng: 73.1812, population: 2.1, importance: 'metro' },
  { id: 19, name: 'Ghaziabad', state: 'Uttar Pradesh', lat: 28.6692, lng: 77.4538, population: 1.7, importance: 'metro' },
  { id: 20, name: 'Ludhiana', state: 'Punjab', lat: 30.9010, lng: 75.8573, population: 1.6, importance: 'industrial' },
  { id: 21, name: 'Agra', state: 'Uttar Pradesh', lat: 27.1767, lng: 78.0081, population: 1.7, importance: 'metro' },
  { id: 22, name: 'Nashik', state: 'Maharashtra', lat: 19.9975, lng: 73.7898, population: 1.5, importance: 'metro' },
  { id: 23, name: 'Faridabad', state: 'Haryana', lat: 28.4089, lng: 77.3178, population: 1.4, importance: 'metro' },
  { id: 24, name: 'Meerut', state: 'Uttar Pradesh', lat: 28.9845, lng: 77.7064, population: 1.5, importance: 'metro' },
  { id: 25, name: 'Rajkot', state: 'Gujarat', lat: 22.3039, lng: 70.8022, population: 1.4, importance: 'metro' },
  { id: 26, name: 'Varanasi', state: 'Uttar Pradesh', lat: 25.3176, lng: 82.9739, population: 1.4, importance: 'metro' },
  { id: 27, name: 'Srinagar', state: 'Jammu & Kashmir', lat: 34.0837, lng: 74.7973, population: 1.3, importance: 'capital' },
  { id: 28, name: 'Aurangabad', state: 'Maharashtra', lat: 19.8762, lng: 75.3433, population: 1.2, importance: 'metro' },
  { id: 29, name: 'Dhanbad', state: 'Jharkhand', lat: 23.7957, lng: 86.4304, population: 1.2, importance: 'industrial' },
  { id: 30, name: 'Amritsar', state: 'Punjab', lat: 31.6340, lng: 74.8723, population: 1.2, importance: 'metro' },
  { id: 31, name: 'Allahabad', state: 'Uttar Pradesh', lat: 25.4358, lng: 81.8463, population: 1.1, importance: 'metro' },
  { id: 32, name: 'Ranchi', state: 'Jharkhand', lat: 23.3441, lng: 85.3096, population: 1.1, importance: 'capital' },
  { id: 33, name: 'Coimbatore', state: 'Tamil Nadu', lat: 11.0168, lng: 76.9558, population: 1.1, importance: 'metro' },
  { id: 34, name: 'Jabalpur', state: 'Madhya Pradesh', lat: 23.1815, lng: 79.9864, population: 1.0, importance: 'metro' },
  { id: 35, name: 'Gwalior', state: 'Madhya Pradesh', lat: 26.2183, lng: 78.1828, population: 1.1, importance: 'metro' },
  { id: 36, name: 'Vijayawada', state: 'Andhra Pradesh', lat: 16.5062, lng: 80.6480, population: 1.0, importance: 'metro' },
  { id: 37, name: 'Jodhpur', state: 'Rajasthan', lat: 26.2389, lng: 73.0243, population: 1.0, importance: 'metro' },
  { id: 38, name: 'Madurai', state: 'Tamil Nadu', lat: 9.9252, lng: 78.1198, population: 1.0, importance: 'metro' },
  { id: 39, name: 'Raipur', state: 'Chhattisgarh', lat: 21.2514, lng: 81.6296, population: 1.0, importance: 'capital' },
  { id: 40, name: 'Kota', state: 'Rajasthan', lat: 25.2138, lng: 75.8648, population: 1.0, importance: 'metro' },
  { id: 41, name: 'Chandigarh', state: 'Chandigarh', lat: 30.7333, lng: 76.7794, population: 1.1, importance: 'capital' },
  { id: 42, name: 'Guwahati', state: 'Assam', lat: 26.1445, lng: 91.7362, population: 1.0, importance: 'metro' },
  { id: 43, name: 'Thiruvananthapuram', state: 'Kerala', lat: 8.5241, lng: 76.9366, population: 1.0, importance: 'capital' },
  { id: 44, name: 'Kochi', state: 'Kerala', lat: 9.9312, lng: 76.2673, population: 2.1, importance: 'metro' },
  { id: 45, name: 'Mysore', state: 'Karnataka', lat: 12.2958, lng: 76.6394, population: 0.9, importance: 'metro' },
  { id: 46, name: 'Bhubaneswar', state: 'Odisha', lat: 20.2961, lng: 85.8245, population: 0.9, importance: 'capital' },
  { id: 47, name: 'Dehradun', state: 'Uttarakhand', lat: 30.3165, lng: 78.0322, population: 0.8, importance: 'capital' },
  { id: 48, name: 'Shimla', state: 'Himachal Pradesh', lat: 31.1048, lng: 77.1734, population: 0.2, importance: 'capital' },
];

// Simple city marker component
const CityMarker: React.FC<{ 
  city: IndianCity; 
  size: number;
  activeLayer: string;
  onSelect: () => void;
  isSelected: boolean;
}> = ({ city, size, activeLayer, onSelect, isSelected }) => {
  const { isDark } = useTheme();
  const aqiLevel = getAQILevel(city.aqi);
  
  const getMarkerColor = () => {
    if (city.aqi <= 50) return '#10b981'; // green
    if (city.aqi <= 100) return '#f59e0b'; // yellow
    if (city.aqi <= 150) return '#f97316'; // orange
    if (city.aqi <= 200) return '#ef4444'; // red
    if (city.aqi <= 300) return '#7c2d12'; // dark red
    return '#450a0a'; // very dark red
  };

  const markerSize = Math.max(20, size + (city.population * 2));

  return (
    <motion.div
      className="relative cursor-pointer group"
      style={{ width: markerSize, height: markerSize }}
      whileHover={{ scale: 1.3, zIndex: 50 }}
      onClick={onSelect}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ 
        scale: isSelected ? 1.4 : 1, 
        opacity: 1,
        zIndex: isSelected ? 40 : 20
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      {/* Main marker circle */}
      <motion.div
        className="absolute inset-0 rounded-full shadow-2xl border-4 border-white/80 flex items-center justify-center"
        style={{ backgroundColor: getMarkerColor() }}
        animate={{
          boxShadow: [
            `0 0 ${markerSize/3}px ${getMarkerColor()}60`,
            `0 0 ${markerSize/2}px ${getMarkerColor()}80`,
            `0 0 ${markerSize/3}px ${getMarkerColor()}60`
          ]
        }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {/* AQI value */}
        <motion.div
          className="text-white font-bold text-center leading-tight"
          style={{ fontSize: Math.max(10, markerSize / 4) }}
        >
          {city.aqi}
        </motion.div>

        {/* Importance star */}
        {city.importance === 'major' && (
          <motion.div
            className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full border-2 border-white flex items-center justify-center"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <Star size={8} className="text-white" />
          </motion.div>
        )}
      </motion.div>

      {/* Hover tooltip */}
      <motion.div
        className={`
          absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 rounded-xl shadow-xl backdrop-blur-md border z-50
          ${isDark ? 'bg-gray-800/95 text-white border-gray-700/50' : 'bg-white/95 text-gray-800 border-gray-200/50'}
          opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap pointer-events-none
        `}
        initial={{ opacity: 0, y: 10 }}
        whileHover={{ opacity: 1, y: 0 }}
      >
        <div className="text-sm font-bold">{city.name}, {city.state}</div>
        <div className="text-xs">AQI: {city.aqi} • {aqiLevel.label}</div>
        <div className="text-xs opacity-75">
          PM2.5: {city.pollutants.pm25} • {city.weather.temp}°C
        </div>
      </motion.div>
    </motion.div>
  );
};

export const AQIMap: React.FC<AQIMapProps> = ({ onLocationSelect }) => {
  const { isDark } = useTheme();
  const [activeLayer, setActiveLayer] = useState('aqi');
  const [mapStyle, setMapStyle] = useState('atmospheric');
  const [searchQuery, setSearchQuery] = useState('');
  const [zoomLevel, setZoomLevel] = useState(5);
  const [selectedCity, setSelectedCity] = useState<IndianCity | null>(null);
  const [showLayers, setShowLayers] = useState(false);
  const [isLegendCollapsed, setIsLegendCollapsed] = useState(false);
  const [cities, setCities] = useState<IndianCity[]>([]);
  const [filterState, setFilterState] = useState<string>('all');

  // Generate realistic AQI data for Indian cities
  useEffect(() => {
    const generateCityData = (): IndianCity[] => {
      return INDIAN_CITIES.map((city) => {
        const timeSeed = Math.floor(Date.now() / (1000 * 60 * 30)); // Changes every 30 minutes
        const locationSeed = Math.abs(Math.sin(city.lat * city.lng * 1000) * 10000);
        const combinedSeed = (locationSeed + timeSeed) % 10000;
        
        // Base AQI influenced by city type and region
        let baseAQI = 50;
        if (city.importance === 'major') baseAQI = 120;
        else if (city.importance === 'metro') baseAQI = 90;
        else if (city.importance === 'industrial') baseAQI = 140;
        else baseAQI = 70;

        // Regional modifiers
        if (city.state === 'Delhi') baseAQI += 50;
        else if (['Uttar Pradesh', 'Bihar', 'Jharkhand'].includes(city.state)) baseAQI += 25;
        else if (['Kerala', 'Goa', 'Himachal Pradesh'].includes(city.state)) baseAQI -= 20;
        else if (['Punjab', 'Haryana'].includes(city.state)) baseAQI += 20;

        // Seasonal and time variation
        const variation = Math.sin(combinedSeed * 0.001) * 40;
        const finalAQI = Math.max(25, Math.min(350, Math.round(baseAQI + variation)));

        // Generate realistic pollutant levels
        const pm25 = Math.round(finalAQI * 0.4 + (combinedSeed % 25));
        const pm10 = Math.round(finalAQI * 0.7 + (combinedSeed % 35));
        const no2 = Math.round(finalAQI * 0.3 + (combinedSeed % 20));
        const o3 = Math.round(finalAQI * 0.5 + (combinedSeed % 30));
        const so2 = Math.round(finalAQI * 0.2 + (combinedSeed % 15));
        const co = Math.round((finalAQI * 0.02 + ((combinedSeed % 50) / 1000)) * 10) / 10;

        // Weather data
        const baseTemp = city.lat > 25 ? 20 : 28; // Northern cities cooler
        const temp = Math.round(baseTemp + Math.sin(combinedSeed * 0.01) * 12);
        const humidity = Math.round(45 + Math.cos(combinedSeed * 0.01) * 30);
        const windSpeed = Math.round(5 + (combinedSeed % 20));
        
        const conditions = ['Clear', 'Partly Cloudy', 'Cloudy', 'Hazy', 'Smoky'];
        const condition = finalAQI > 150 ? 'Hazy' : 
                         finalAQI > 100 ? conditions[Math.floor(Math.random() * 4)] : 
                         conditions[Math.floor(Math.random() * 3)];

        return {
          ...city,
          aqi: finalAQI,
          pollutants: { pm25, pm10, no2, o3, so2, co },
          weather: { temp, humidity, windSpeed, condition }
        };
      });
    };

    setCities(generateCityData());
    
    // Update data every 60 seconds
    const interval = setInterval(() => {
      setCities(generateCityData());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const handleZoomIn = () => setZoomLevel(prev => Math.min(10, prev + 1));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(3, prev - 1));

  const filteredCities = cities.filter(city => {
    const matchesSearch = city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         city.state.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesState = filterState === 'all' || city.state === filterState;
    return matchesSearch && matchesState;
  });

  const uniqueStates = [...new Set(cities.map(city => city.state))].sort();

  const getMapBackground = () => {
    const avgAQI = cities.length > 0 ? Math.round(cities.reduce((sum, city) => sum + city.aqi, 0) / cities.length) : 100;
    
    switch (mapStyle) {
      case 'satellite':
        return isDark 
          ? 'linear-gradient(135deg, #1a365d 0%, #2d5016 30%, #065f46 60%, #1e40af 100%)'
          : 'linear-gradient(135deg, #1e293b 0%, #374151 30%, #4b5563 60%, #6b7280 100%)';
      case 'terrain':
        return isDark
          ? 'linear-gradient(135deg, #451a03 0%, #78350f 20%, #166534 40%, #1e40af 80%, #581c87 100%)'
          : 'linear-gradient(135deg, #fef3c7 0%, #d69e2e 20%, #38a169 40%, #2b6cb0 80%, #553c9a 100%)';
      case 'atmospheric':
      default:
        if (avgAQI <= 50) {
          return isDark 
            ? 'linear-gradient(135deg, #134e4a 0%, #166534 30%, #15803d 60%, #16a34a 100%)'
            : 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 30%, #a7f3d0 60%, #6ee7b7 100%)';
        } else if (avgAQI <= 100) {
          return isDark
            ? 'linear-gradient(135deg, #78350f 0%, #92400e 30%, #b45309 60%, #d97706 100%)'
            : 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 30%, #fde68a 60%, #fcd34d 100%)';
        } else if (avgAQI <= 200) {
          return isDark
            ? 'linear-gradient(135deg, #7f1d1d 0%, #991b1b 30%, #b91c1c 60%, #dc2626 100%)'
            : 'linear-gradient(135deg, #fef2f2 0%, #fecaca 30%, #fca5a5 60%, #f87171 100%)';
        } else {
          return isDark
            ? 'linear-gradient(135deg, #450a0a 0%, #7f1d1d 30%, #991b1b 60%, #dc2626 100%)'
            : 'linear-gradient(135deg, #450a0a 0%, #7f1d1d 30%, #991b1b 60%, #dc2626 100%)';
        }
    }
  };

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Enhanced Header Controls */}
      <Card variant="premium" className="overflow-hidden">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Search Section */}
          <div className="flex-1">
            <div className="relative">
              <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors duration-300 ${isDark ? 'text-pastel-lavender-400' : 'text-pastel-lavender-500'}`} size={20} />
              <input
                type="text"
                placeholder="Search Indian cities or states..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`
                  w-full pl-12 pr-4 py-4 rounded-2xl border transition-all duration-300 font-medium
                  ${isDark 
                    ? 'bg-pastel-lavender-800/60 border-pastel-lavender-700/50 text-white placeholder-pastel-lavender-400 focus:ring-2 focus:ring-pastel-lavender-500 focus:border-transparent' 
                    : 'bg-white/80 border-pastel-lavender-200/60 text-pastel-lavender-800 placeholder-pastel-lavender-500 focus:ring-2 focus:ring-pastel-lavender-400 focus:border-transparent'
                  }
                  backdrop-blur-md shadow-lg
                `}
              />
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex gap-3">
            <select
              value={filterState}
              onChange={(e) => setFilterState(e.target.value)}
              className={`
                px-4 py-3 rounded-2xl border font-medium transition-all duration-300
                ${isDark 
                  ? 'bg-pastel-lavender-800/60 border-pastel-lavender-700/50 text-white' 
                  : 'bg-white/80 border-pastel-lavender-200/60 text-pastel-lavender-800'
                }
              `}
            >
              <option value="all">All States</option>
              {uniqueStates.map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
            
            <InteractiveButton
              onClick={() => setShowLayers(!showLayers)}
              variant={showLayers ? "primary" : "ghost"}
              size="md"
              icon={Layers}
            >
              Layers
            </InteractiveButton>
          </div>
        </div>

        {/* Layer Controls */}
        <AnimatePresence>
          {showLayers && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 pt-6 border-t border-pastel-lavender-200/30"
            >
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {LAYER_TYPES.map((layer) => {
                  const Icon = layer.icon;
                  return (
                    <motion.button
                      key={layer.id}
                      onClick={() => setActiveLayer(layer.id)}
                      className={`
                        flex items-center gap-3 p-4 rounded-2xl transition-all duration-300 group
                        ${activeLayer === layer.id
                          ? `text-white shadow-lg transform scale-105`
                          : `${isDark ? 'bg-pastel-lavender-800/40 hover:bg-pastel-lavender-700/60 text-pastel-lavender-200' : 'bg-pastel-lavender-50/60 hover:bg-pastel-lavender-100 text-pastel-lavender-700'} hover:scale-102`
                        }
                      `}
                      style={{
                        backgroundColor: activeLayer === layer.id ? layer.color : undefined,
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Icon size={20} />
                      <div className="text-left">
                        <div className="font-semibold text-sm">{layer.name}</div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      {/* Enhanced India Map Container */}
      <Card variant="premium" className="relative overflow-hidden">
        {/* Map Controls */}
        <div className="absolute top-4 left-4 z-20 flex gap-2">
          {MAP_STYLES.map((style) => {
            const Icon = style.icon;
            return (
              <motion.button
                key={style.id}
                onClick={() => setMapStyle(style.id)}
                className={`
                  p-3 rounded-xl backdrop-blur-md transition-all duration-300 shadow-lg
                  ${mapStyle === style.id
                    ? `${isDark ? 'bg-pastel-lavender-600 text-white' : 'bg-white text-pastel-lavender-700'} shadow-lg`
                    : `${isDark ? 'bg-pastel-lavender-800/60 text-pastel-lavender-300 hover:bg-pastel-lavender-700/80' : 'bg-white/60 text-pastel-lavender-600 hover:bg-white/80'}`
                  }
                `}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title={style.name}
              >
                <Icon size={16} />
              </motion.button>
            );
          })}
        </div>

        {/* Zoom Controls */}
        <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
          <motion.button
            onClick={handleZoomIn}
            className={`
              p-3 rounded-xl backdrop-blur-md transition-all duration-300 shadow-lg
              ${isDark ? 'bg-pastel-lavender-800/80 text-pastel-lavender-200 hover:bg-pastel-lavender-700' : 'bg-white/80 text-pastel-lavender-700 hover:bg-white'}
            `}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus size={18} />
          </motion.button>
          
          <motion.button
            onClick={handleZoomOut}
            className={`
              p-3 rounded-xl backdrop-blur-md transition-all duration-300 shadow-lg
              ${isDark ? 'bg-pastel-lavender-800/80 text-pastel-lavender-200 hover:bg-pastel-lavender-700' : 'bg-white/80 text-pastel-lavender-700 hover:bg-white'}
            `}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Minus size={18} />
          </motion.button>

          <div className={`
            px-3 py-2 rounded-xl backdrop-blur-md text-sm font-medium
            ${isDark ? 'bg-pastel-lavender-800/80 text-pastel-lavender-200' : 'bg-white/80 text-pastel-lavender-700'}
          `}>
            {zoomLevel}x
          </div>
        </div>

        {/* Main India Map */}
        <motion.div 
          className={`
            relative h-[32rem] lg:h-[40rem] rounded-2xl overflow-hidden transition-all duration-1000 border-2
            ${isDark ? 'border-pastel-lavender-700/30' : 'border-pastel-lavender-200/30'}
          `}
          style={{ background: getMapBackground() }}
          animate={{
            scale: 1 + (zoomLevel - 5) * 0.1,
          }}
          transition={{ duration: 0.5 }}
        >
          {/* India Map Outline */}
          <motion.svg
            className="absolute inset-0 w-full h-full opacity-30"
            viewBox="0 0 800 600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ duration: 1 }}
          >
            {/* Simplified India outline */}
            <path
              d="M200,150 Q220,130 250,140 Q300,130 350,150 Q400,160 450,180 Q500,200 520,250 Q530,300 520,350 Q500,400 480,430 Q450,450 400,460 Q350,470 300,450 Q250,430 220,400 Q190,350 185,300 Q180,250 190,200 Q195,175 200,150 Z"
              fill="none"
              stroke={isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.4)'}
              strokeWidth="3"
              strokeDasharray="10,5"
            />
          </motion.svg>

          {/* Grid pattern for geographic reference */}
          <motion.div 
            className={`absolute inset-0 opacity-10`}
            style={{
              backgroundImage: `
                linear-gradient(${isDark ? '#ffffff' : '#000000'} 1px, transparent 1px),
                linear-gradient(90deg, ${isDark ? '#ffffff' : '#000000'} 1px, transparent 1px)
              `,
              backgroundSize: '80px 80px',
            }}
          />

          {/* City Markers */}
          <AnimatePresence>
            {filteredCities.map((city, index) => {
              // Convert lat/lng to map coordinates (focused on India)
              const x = ((city.lng - 68) / (97 - 68)) * 100; // India longitude range: 68°E to 97°E
              const y = ((37 - city.lat) / (37 - 8)) * 100;   // India latitude range: 8°N to 37°N
              
              const size = 16 + (zoomLevel * 2);

              return (
                <motion.div
                  key={`${city.id}-${activeLayer}`}
                  className="absolute"
                  style={{
                    left: `${Math.max(2, Math.min(98, x))}%`,
                    top: `${Math.max(2, Math.min(98, y))}%`,
                    transform: 'translate(-50%, -50%)',
                    zIndex: selectedCity?.id === city.id ? 30 : 20,
                  }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ 
                    delay: index * 0.03, 
                    type: 'spring',
                    stiffness: 300,
                    damping: 20
                  }}
                >
                  <CityMarker
                    city={city}
                    size={size}
                    activeLayer={activeLayer}
                    isSelected={selectedCity?.id === city.id}
                    onSelect={() => {
                      setSelectedCity(selectedCity?.id === city.id ? null : city);
                      onLocationSelect?.({ lat: city.lat, lng: city.lng, name: `${city.name}, ${city.state}` });
                    }}
                  />
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Compact Map Legend - Now positioned to not block the map */}
          <div className="absolute bottom-4 left-4 right-4 z-30">
            <motion.div
              className={`
                backdrop-blur-md border rounded-2xl transition-all duration-300
                ${isDark ? 'bg-pastel-lavender-800/80 border-pastel-lavender-700/50' : 'bg-white/80 border-pastel-lavender-200/50'}
              `}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
            >
              <div className="flex items-center justify-between p-3">
                <div className="flex items-center gap-4">
                  <h4 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-pastel-lavender-800'}`}>
                    🇮🇳 India AQI
                  </h4>
                  <div className="flex items-center gap-3 text-xs">
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span className={isDark ? 'text-pastel-lavender-300' : 'text-pastel-lavender-600'}>Good</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <span className={isDark ? 'text-pastel-lavender-300' : 'text-pastel-lavender-600'}>Moderate</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <span className={isDark ? 'text-pastel-lavender-300' : 'text-pastel-lavender-600'}>Unhealthy</span>
                    </div>
                  </div>
                </div>
                
                <motion.button
                  onClick={() => setIsLegendCollapsed(!isLegendCollapsed)}
                  className={`p-2 rounded-lg hover:bg-black/10 transition-colors ${isDark ? 'text-pastel-lavender-300' : 'text-pastel-lavender-600'}`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {isLegendCollapsed ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </motion.button>
              </div>
              
              <AnimatePresence>
                {!isLegendCollapsed && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-3 pb-3 border-t border-white/20"
                  >
                    <p className={`text-xs mt-2 ${isDark ? 'text-pastel-lavender-400' : 'text-pastel-lavender-600'}`}>
                      Monitoring {filteredCities.length} cities • Live data updates every 30 min
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Live Update Indicator */}
          <motion.div
            className="absolute top-4 left-1/2 transform -translate-x-1/2 z-30"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className={`
              flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-md shadow-lg
              ${isDark ? 'bg-pastel-mint-800/80 text-pastel-mint-200' : 'bg-pastel-mint-50/80 text-pastel-mint-700'}
            `}>
              <Activity size={16} className="animate-pulse" />
              <span className="text-sm font-medium">Live Data</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Selected City Details Modal */}
        <AnimatePresence>
          {selectedCity && (
            <motion.div
              className="absolute inset-4 z-40 flex items-center justify-center pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="pointer-events-auto max-w-md w-full"
                initial={{ scale: 0.9, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 50 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              >
                <Card variant="premium" className="p-6 shadow-2xl">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className={`text-xl font-bold mb-1 ${isDark ? 'text-white' : 'text-pastel-lavender-800'}`}>
                        {selectedCity.name}
                      </h3>
                      <p className={`text-sm ${isDark ? 'text-pastel-lavender-300' : 'text-pastel-lavender-600'}`}>
                        {selectedCity.state} • Pop: {selectedCity.population}M • {selectedCity.importance}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <div 
                          className="w-4 h-4 rounded-full shadow-lg"
                          style={{ backgroundColor: getAQILevel(selectedCity.aqi).color }}
                        />
                        <span className={`font-medium ${isDark ? 'text-pastel-lavender-200' : 'text-pastel-lavender-700'}`}>
                          AQI: {selectedCity.aqi} • {getAQILevel(selectedCity.aqi).label}
                        </span>
                      </div>
                    </div>
                    
                    <motion.button
                      onClick={() => setSelectedCity(null)}
                      className={`p-2 rounded-full transition-colors ${isDark ? 'hover:bg-pastel-lavender-700 text-pastel-lavender-300' : 'hover:bg-pastel-lavender-100 text-pastel-lavender-600'}`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <X size={20} />
                    </motion.button>
                  </div>

                  <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-4">
                    <div className={`text-center p-3 rounded-xl ${isDark ? 'bg-pastel-lavender-800/50' : 'bg-pastel-lavender-50'}`}>
                      <div className="text-lg font-bold text-red-500">{selectedCity.pollutants.pm25}</div>
                      <div className={`text-xs ${isDark ? 'text-pastel-lavender-300' : 'text-pastel-lavender-600'}`}>PM2.5</div>
                    </div>
                    <div className={`text-center p-3 rounded-xl ${isDark ? 'bg-pastel-lavender-800/50' : 'bg-pastel-lavender-50'}`}>
                      <div className="text-lg font-bold text-orange-500">{selectedCity.pollutants.pm10}</div>
                      <div className={`text-xs ${isDark ? 'text-pastel-lavender-300' : 'text-pastel-lavender-600'}`}>PM10</div>
                    </div>
                    <div className={`text-center p-3 rounded-xl ${isDark ? 'bg-pastel-lavender-800/50' : 'bg-pastel-lavender-50'}`}>
                      <div className="text-lg font-bold text-purple-500">{selectedCity.pollutants.no2}</div>
                      <div className={`text-xs ${isDark ? 'text-pastel-lavender-300' : 'text-pastel-lavender-600'}`}>NO₂</div>
                    </div>
                    <div className={`text-center p-3 rounded-xl ${isDark ? 'bg-pastel-lavender-800/50' : 'bg-pastel-lavender-50'}`}>
                      <div className="text-lg font-bold text-blue-500">{selectedCity.weather.temp}°C</div>
                      <div className={`text-xs ${isDark ? 'text-pastel-lavender-300' : 'text-pastel-lavender-600'}`}>Temp</div>
                    </div>
                    <div className={`text-center p-3 rounded-xl ${isDark ? 'bg-pastel-lavender-800/50' : 'bg-pastel-lavender-50'}`}>
                      <div className="text-lg font-bold text-green-500">{selectedCity.weather.humidity}%</div>
                      <div className={`text-xs ${isDark ? 'text-pastel-lavender-300' : 'text-pastel-lavender-600'}`}>Humidity</div>
                    </div>
                    <div className={`text-center p-3 rounded-xl ${isDark ? 'bg-pastel-lavender-800/50' : 'bg-pastel-lavender-50'}`}>
                      <div className="text-lg font-bold text-cyan-500">{selectedCity.weather.windSpeed}</div>
                      <div className={`text-xs ${isDark ? 'text-pastel-lavender-300' : 'text-pastel-lavender-600'}`}>Wind</div>
                    </div>
                  </div>

                  <div className={`text-center text-sm ${isDark ? 'text-pastel-lavender-400' : 'text-pastel-lavender-600'}`}>
                    {getAQILevel(selectedCity.aqi).description} • {selectedCity.weather.condition}
                  </div>
                </Card>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      {/* Enhanced Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card variant="premium" className="text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <TrendingUp className="text-blue-500" size={24} />
            <h4 className={`font-bold ${isDark ? 'text-white' : 'text-pastel-lavender-800'}`}>National Average</h4>
          </div>
          <div className="text-3xl font-bold text-blue-500 mb-2">
            {cities.length > 0 ? Math.round(cities.reduce((sum, city) => sum + city.aqi, 0) / cities.length) : 0}
          </div>
          <div className={`text-sm ${isDark ? 'text-pastel-lavender-300' : 'text-pastel-lavender-600'}`}>AQI Average</div>
        </Card>

        <Card variant="premium" className="text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <MapPin className="text-green-500" size={24} />
            <h4 className={`font-bold ${isDark ? 'text-white' : 'text-pastel-lavender-800'}`}>Cities Monitored</h4>
          </div>
          <div className="text-3xl font-bold text-green-500 mb-2">{filteredCities.length}</div>
          <div className={`text-sm ${isDark ? 'text-pastel-lavender-300' : 'text-pastel-lavender-600'}`}>Real-time Data</div>
        </Card>

        <Card variant="premium" className="text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Star className="text-orange-500" size={24} />
            <h4 className={`font-bold ${isDark ? 'text-white' : 'text-pastel-lavender-800'}`}>Best Air Quality</h4>
          </div>
          <div className="text-3xl font-bold text-orange-500 mb-2">
            {cities.length > 0 ? Math.min(...cities.map(c => c.aqi)) : 0}
          </div>
          <div className={`text-sm ${isDark ? 'text-pastel-lavender-300' : 'text-pastel-lavender-600'}`}>
            {cities.find(c => c.aqi === Math.min(...cities.map(city => city.aqi)))?.name || 'N/A'}
          </div>
        </Card>

        <Card variant="premium" className="text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Calendar className="text-purple-500" size={24} />
            <h4 className={`font-bold ${isDark ? 'text-white' : 'text-pastel-lavender-800'}`}>Last Updated</h4>
          </div>
          <div className="text-3xl font-bold text-purple-500 mb-2">Live</div>
          <div className={`text-sm ${isDark ? 'text-pastel-lavender-300' : 'text-pastel-lavender-600'}`}>
            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </Card>
      </div>
    </motion.div>
  );
};