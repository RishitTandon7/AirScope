import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, X, Navigation, Star, Clock, Globe, Loader } from 'lucide-react';
import { Card } from '../ui/Card';
import { InteractiveButton } from '../ui/InteractiveButton';
import { useTheme } from '../../contexts/ThemeContext';
import { tomtomService } from '../../services/tomtomService';

interface LocationSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  currentLocation: string;
  onLocationSelect: (location: { lat: number; lng: number; name: string }) => void;
}

interface LocationResult {
  name: string;
  fullAddress: string;
  lat: number;
  lng: number;
  type: 'search' | 'popular' | 'recent';
}

const popularLocations: LocationResult[] = [
  { name: 'Delhi', fullAddress: 'Delhi, India', lat: 28.6139, lng: 77.2090, type: 'popular' },
  { name: 'Mumbai', fullAddress: 'Mumbai, Maharashtra, India', lat: 19.0760, lng: 72.8777, type: 'popular' },
  { name: 'Bangalore', fullAddress: 'Bangalore, Karnataka, India', lat: 12.9716, lng: 77.5946, type: 'popular' },
  { name: 'Chennai', fullAddress: 'Chennai, Tamil Nadu, India', lat: 13.0827, lng: 80.2707, type: 'popular' },
  { name: 'Kolkata', fullAddress: 'Kolkata, West Bengal, India', lat: 22.5726, lng: 88.3639, type: 'popular' },
  { name: 'Hyderabad', fullAddress: 'Hyderabad, Telangana, India', lat: 17.3850, lng: 78.4867, type: 'popular' },
  { name: 'Pune', fullAddress: 'Pune, Maharashtra, India', lat: 18.5204, lng: 73.8567, type: 'popular' },
  { name: 'Ahmedabad', fullAddress: 'Ahmedabad, Gujarat, India', lat: 23.0225, lng: 72.5714, type: 'popular' },
];

export const LocationSelector: React.FC<LocationSelectorProps> = ({
  isOpen,
  onClose,
  currentLocation,
  onLocationSelect
}) => {
  const { isDark } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<LocationResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [recentLocations, setRecentLocations] = useState<LocationResult[]>([]);
  const [activeTab, setActiveTab] = useState<'search' | 'popular' | 'recent'>('popular');

  useEffect(() => {
    // Load recent locations from localStorage
    const saved = localStorage.getItem('airscope-recent-locations');
    if (saved) {
      try {
        setRecentLocations(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading recent locations:', error);
      }
    }
  }, []);

  useEffect(() => {
    if (searchQuery.length > 2) {
      setActiveTab('search');
      searchLocations();
    } else {
      setSearchResults([]);
      if (activeTab === 'search') {
        setActiveTab('popular');
      }
    }
  }, [searchQuery]);

  const searchLocations = async () => {
    setLoading(true);
    try {
      const results = await tomtomService.searchLocation(searchQuery);
      const formattedResults: LocationResult[] = results.map(result => ({
        name: result.address.municipality || result.address.freeformAddress.split(',')[0],
        fullAddress: result.address.freeformAddress,
        lat: result.position.lat,
        lng: result.position.lon,
        type: 'search'
      }));
      setSearchResults(formattedResults);
    } catch (error) {
      console.error('Location search error:', error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLocationSelect = (location: LocationResult) => {
    // Add to recent locations
    const updatedRecent = [
      { ...location, type: 'recent' as const },
      ...recentLocations.filter(loc => loc.name !== location.name)
    ].slice(0, 5);
    
    setRecentLocations(updatedRecent);
    localStorage.setItem('airscope-recent-locations', JSON.stringify(updatedRecent));
    
    onLocationSelect({
      lat: location.lat,
      lng: location.lng,
      name: location.name
    });
    
    onClose();
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const locationName = await tomtomService.reverseGeocode(latitude, longitude);
            onLocationSelect({
              lat: latitude,
              lng: longitude,
              name: locationName
            });
            onClose();
          } catch (error) {
            console.error('Reverse geocoding error:', error);
          } finally {
            setLoading(false);
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
          setLoading(false);
        }
      );
    }
  };

  const getDisplayLocations = () => {
    switch (activeTab) {
      case 'search':
        return searchResults;
      case 'popular':
        return popularLocations;
      case 'recent':
        return recentLocations;
      default:
        return popularLocations;
    }
  };

  const getTabIcon = (tab: string) => {
    switch (tab) {
      case 'search':
        return Search;
      case 'popular':
        return Star;
      case 'recent':
        return Clock;
      default:
        return Star;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className={`absolute inset-0 backdrop-blur-md ${isDark ? 'bg-black/60' : 'bg-black/40'}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="relative max-w-lg w-full max-h-[80vh] overflow-hidden"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <Card variant="premium" className="h-full">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <motion.div
                    className="w-12 h-12 bg-gradient-to-br from-pastel-lavender-400 to-pastel-sky-500 rounded-2xl flex items-center justify-center"
                    animate={{
                      boxShadow: [
                        '0 0 20px rgba(168,85,247,0.4)',
                        '0 0 30px rgba(168,85,247,0.6)',
                        '0 0 20px rgba(168,85,247,0.4)'
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <MapPin className="text-white" size={24} />
                  </motion.div>
                  <div>
                    <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-pastel-lavender-800'}`}>
                      Select Location
                    </h3>
                    <p className={`text-sm ${isDark ? 'text-pastel-lavender-300' : 'text-pastel-lavender-600'}`}>
                      Current: {currentLocation}
                    </p>
                  </div>
                </div>
                
                <motion.button
                  onClick={onClose}
                  className={`p-2 rounded-full transition-colors ${isDark ? 'hover:bg-pastel-lavender-800/50 text-pastel-lavender-300' : 'hover:bg-pastel-lavender-100 text-pastel-lavender-600'}`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X size={20} />
                </motion.button>
              </div>

              {/* Search Bar */}
              <div className="relative mb-4">
                <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${isDark ? 'text-pastel-lavender-400' : 'text-pastel-lavender-500'}`} size={20} />
                <input
                  type="text"
                  placeholder="Search for a city or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`
                    w-full pl-10 pr-4 py-3 rounded-xl border transition-all duration-300 font-poppins
                    ${isDark 
                      ? 'bg-pastel-lavender-800/50 border-pastel-lavender-700/50 text-white placeholder-pastel-lavender-400 focus:ring-2 focus:ring-pastel-lavender-500 focus:border-transparent' 
                      : 'bg-white/80 border-pastel-lavender-200 text-pastel-lavender-800 placeholder-pastel-lavender-500 focus:ring-2 focus:ring-pastel-lavender-400 focus:border-transparent'
                    }
                  `}
                />
                {loading && (
                  <motion.div
                    className={`absolute right-3 top-1/2 transform -translate-y-1/2`}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  >
                    <Loader size={16} className={isDark ? 'text-pastel-lavender-400' : 'text-pastel-lavender-500'} />
                  </motion.div>
                )}
              </div>

              {/* Current Location Button */}
              <InteractiveButton
                onClick={getCurrentLocation}
                variant="pastel"
                size="md"
                icon={Navigation}
                className="w-full mb-6"
                loading={loading && !searchQuery}
              >
                Use Current Location
              </InteractiveButton>

              {/* Tabs */}
              <div className={`flex gap-2 mb-4 p-1 rounded-xl ${isDark ? 'bg-pastel-lavender-800/30' : 'bg-pastel-lavender-100/50'}`}>
                {[
                  { id: 'popular', label: 'Popular' },
                  { id: 'recent', label: 'Recent' },
                  ...(searchQuery.length > 2 ? [{ id: 'search', label: 'Search' }] : [])
                ].map((tab) => {
                  const Icon = getTabIcon(tab.id);
                  return (
                    <motion.button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`
                        flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-300
                        ${activeTab === tab.id 
                          ? `${isDark ? 'bg-pastel-lavender-600 text-white' : 'bg-white text-pastel-lavender-700'} shadow-lg` 
                          : `${isDark ? 'text-pastel-lavender-300 hover:text-white' : 'text-pastel-lavender-600 hover:text-pastel-lavender-800'}`
                        }
                      `}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Icon size={16} />
                      {tab.label}
                    </motion.button>
                  );
                })}
              </div>

              {/* Locations List */}
              <div className="max-h-80 overflow-y-auto space-y-2">
                <AnimatePresence mode="wait">
                  {getDisplayLocations().length === 0 ? (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className={`text-center py-8 ${isDark ? 'text-pastel-lavender-400' : 'text-pastel-lavender-600'}`}
                    >
                      <Globe size={48} className="mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium mb-2">
                        {activeTab === 'search' ? 'No results found' : 
                         activeTab === 'recent' ? 'No recent locations' : 'No locations available'}
                      </p>
                      <p className="text-sm opacity-75">
                        {activeTab === 'search' ? 'Try a different search term' : 
                         activeTab === 'recent' ? 'Your recent searches will appear here' : 'Popular locations are not available'}
                      </p>
                    </motion.div>
                  ) : (
                    getDisplayLocations().map((location, index) => (
                      <motion.button
                        key={`${location.name}-${location.lat}-${location.lng}`}
                        onClick={() => handleLocationSelect(location)}
                        className={`
                          w-full p-4 rounded-xl text-left transition-all duration-300 group
                          ${isDark 
                            ? 'bg-pastel-lavender-800/40 hover:bg-pastel-lavender-700/60 border border-pastel-lavender-700/30' 
                            : 'bg-white/60 hover:bg-white/80 border border-pastel-lavender-200/40'
                          }
                          hover:scale-[1.02] hover:shadow-lg
                        `}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center gap-3">
                          <motion.div
                            className={`
                              p-2 rounded-lg 
                              ${location.type === 'popular' ? 'bg-pastel-lavender-500/20' :
                                location.type === 'recent' ? 'bg-pastel-mint-500/20' :
                                'bg-pastel-sky-500/20'
                              }
                            `}
                            whileHover={{ scale: 1.1 }}
                          >
                            {location.type === 'popular' ? <Star size={16} className="text-pastel-lavender-500" /> :
                             location.type === 'recent' ? <Clock size={16} className="text-pastel-mint-500" /> :
                             <Search size={16} className="text-pastel-sky-500" />}
                          </motion.div>
                          <div className="flex-1 min-w-0">
                            <h4 className={`font-semibold truncate ${isDark ? 'text-white' : 'text-pastel-lavender-800'}`}>
                              {location.name}
                            </h4>
                            <p className={`text-sm truncate ${isDark ? 'text-pastel-lavender-400' : 'text-pastel-lavender-600'}`}>
                              {location.fullAddress}
                            </p>
                          </div>
                          <motion.div
                            className={`opacity-0 group-hover:opacity-100 transition-opacity ${isDark ? 'text-pastel-lavender-400' : 'text-pastel-lavender-500'}`}
                            initial={{ x: -10 }}
                            whileHover={{ x: 0 }}
                          >
                            <MapPin size={16} />
                          </motion.div>
                        </div>
                      </motion.button>
                    ))
                  )}
                </AnimatePresence>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};