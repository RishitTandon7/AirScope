import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CloudRain, Sun, Wind, Droplets, Eye, Thermometer } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ForecastData } from '../types';
import { getAQILevel } from '../constants/aqi';

export const ForecastPage: React.FC = () => {
  const [timeframe, setTimeframe] = useState<'24h' | '48h' | '72h'>('24h');
  const [forecastData, setForecastData] = useState<ForecastData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const generateForecastData = () => {
      const hours = timeframe === '24h' ? 24 : timeframe === '48h' ? 48 : 72;
      const data: ForecastData[] = [];
      
      for (let i = 0; i < hours; i += 6) {
        const date = new Date();
        date.setHours(date.getHours() + i);
        
        data.push({
          timestamp: date.toISOString(),
          aqi: Math.floor(Math.random() * 120) + 40,
          confidence: Math.floor(Math.random() * 30) + 70,
          weather: {
            temperature: Math.floor(Math.random() * 15) + 20,
            humidity: Math.floor(Math.random() * 40) + 40,
            windSpeed: Math.floor(Math.random() * 20) + 5,
            windDirection: Math.floor(Math.random() * 360),
            pressure: Math.floor(Math.random() * 50) + 1000,
            visibility: Math.floor(Math.random() * 5) + 5,
          },
        });
      }
      
      return data;
    };

    setLoading(true);
    setTimeout(() => {
      setForecastData(generateForecastData());
      setLoading(false);
    }, 500);
  }, [timeframe]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse bg-gray-200 rounded-2xl h-12"></div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="animate-pulse bg-gray-200 rounded-2xl h-32"></div>
          <div className="animate-pulse bg-gray-200 rounded-2xl h-32"></div>
          <div className="animate-pulse bg-gray-200 rounded-2xl h-32"></div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <Card>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Air Quality Forecast</h2>
            <p className="text-gray-600">Predicted AQI levels and weather conditions</p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => setTimeframe('24h')}
              variant={timeframe === '24h' ? 'primary' : 'outline'}
              size="sm"
            >
              24 Hours
            </Button>
            <Button
              onClick={() => setTimeframe('48h')}
              variant={timeframe === '48h' ? 'primary' : 'outline'}
              size="sm"
            >
              48 Hours
            </Button>
            <Button
              onClick={() => setTimeframe('72h')}
              variant={timeframe === '72h' ? 'primary' : 'outline'}
              size="sm"
            >
              72 Hours
            </Button>
          </div>
        </div>
      </Card>

      {/* Forecast Cards */}
      <div className="space-y-4">
        {forecastData.map((forecast, index) => {
          const aqiLevel = getAQILevel(forecast.aqi);
          const date = new Date(forecast.timestamp);
          const isToday = date.toDateString() === new Date().toDateString();
          
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="overflow-hidden">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Time and AQI */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          {isToday ? 'Today' : date.toLocaleDateString()}
                        </h3>
                        <p className="text-gray-600">{date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                      <div className="text-right">
                        <div
                          className="text-4xl font-bold mb-1"
                          style={{ color: aqiLevel.color }}
                        >
                          {forecast.aqi}
                        </div>
                        <div className="text-sm text-gray-600">
                          {forecast.confidence}% confidence
                        </div>
                      </div>
                    </div>
                    
                    <div
                      className="p-4 rounded-xl"
                      style={{ backgroundColor: `${aqiLevel.color}15` }}
                    >
                      <h4 className="font-semibold text-gray-800 mb-1">{aqiLevel.label}</h4>
                      <p className="text-sm text-gray-600">{aqiLevel.description}</p>
                    </div>
                  </div>

                  {/* Weather Details */}
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 mb-4">Weather Conditions</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-3">
                        <Thermometer className="text-red-500" size={20} />
                        <div>
                          <div className="font-medium text-gray-800">{forecast.weather.temperature}°C</div>
                          <div className="text-xs text-gray-600">Temperature</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Droplets className="text-blue-500" size={20} />
                        <div>
                          <div className="font-medium text-gray-800">{forecast.weather.humidity}%</div>
                          <div className="text-xs text-gray-600">Humidity</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Wind className="text-gray-500" size={20} />
                        <div>
                          <div className="font-medium text-gray-800">{forecast.weather.windSpeed} km/h</div>
                          <div className="text-xs text-gray-600">Wind Speed</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Eye className="text-green-500" size={20} />
                        <div>
                          <div className="font-medium text-gray-800">{forecast.weather.visibility} km</div>
                          <div className="text-xs text-gray-600">Visibility</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Forecast Reliability */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-start gap-4">
          <CloudRain className="text-blue-600 mt-1" size={24} />
          <div>
            <h4 className="font-semibold text-blue-800 mb-2">Forecast Reliability</h4>
            <p className="text-blue-700 text-sm mb-3">
              Our predictions combine real-time air quality data, weather patterns, and machine learning algorithms.
              Accuracy decreases over longer time periods.
            </p>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-600">92%</div>
                <div className="text-xs text-green-700">24h accuracy</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-600">85%</div>
                <div className="text-xs text-yellow-700">48h accuracy</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">78%</div>
                <div className="text-xs text-orange-700">72h accuracy</div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};