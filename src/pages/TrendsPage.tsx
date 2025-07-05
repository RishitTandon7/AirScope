import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Download, Filter } from 'lucide-react';
import { AQIChart } from '../components/Charts/AQIChart';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { HistoricalData } from '../types';

export const TrendsPage: React.FC = () => {
  const [timeframe, setTimeframe] = useState<'7d' | '30d'>('7d');
  const [data, setData] = useState<HistoricalData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Generate mock historical data
    const generateMockData = () => {
      const days = timeframe === '7d' ? 7 : 30;
      const mockData: HistoricalData[] = [];
      
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        
        mockData.push({
          date: date.toISOString(),
          aqi: Math.floor(Math.random() * 150) + 30,
          pollutants: {
            pm25: Math.floor(Math.random() * 80) + 10,
            pm10: Math.floor(Math.random() * 120) + 20,
            no2: Math.floor(Math.random() * 40) + 5,
          },
        });
      }
      
      return mockData;
    };

    setLoading(true);
    setTimeout(() => {
      setData(generateMockData());
      setLoading(false);
    }, 500);
  }, [timeframe]);

  const averageAQI = data.length > 0 ? Math.round(data.reduce((sum, item) => sum + item.aqi, 0) / data.length) : 0;
  const maxAQI = data.length > 0 ? Math.max(...data.map(item => item.aqi)) : 0;
  const minAQI = data.length > 0 ? Math.min(...data.map(item => item.aqi)) : 0;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse bg-gray-200 rounded-2xl h-12"></div>
        <div className="grid grid-cols-3 gap-4">
          <div className="animate-pulse bg-gray-200 rounded-2xl h-24"></div>
          <div className="animate-pulse bg-gray-200 rounded-2xl h-24"></div>
          <div className="animate-pulse bg-gray-200 rounded-2xl h-24"></div>
        </div>
        <div className="animate-pulse bg-gray-200 rounded-2xl h-96"></div>
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
      {/* Header Controls */}
      <Card>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Historical Trends</h2>
            <p className="text-gray-600">Air quality patterns over time</p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => setTimeframe('7d')}
              variant={timeframe === '7d' ? 'primary' : 'outline'}
              size="sm"
            >
              7 Days
            </Button>
            <Button
              onClick={() => setTimeframe('30d')}
              variant={timeframe === '30d' ? 'primary' : 'outline'}
              size="sm"
            >
              30 Days
            </Button>
            <Button icon={Download} variant="outline" size="sm">
              Export
            </Button>
          </div>
        </div>
      </Card>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="text-center bg-gradient-to-br from-blue-50 to-blue-100">
          <div className="text-3xl font-bold text-blue-600 mb-2">{averageAQI}</div>
          <div className="text-blue-800 font-medium">Average AQI</div>
          <div className="text-blue-600 text-sm">Last {timeframe === '7d' ? '7' : '30'} days</div>
        </Card>
        
        <Card className="text-center bg-gradient-to-br from-red-50 to-red-100">
          <div className="text-3xl font-bold text-red-600 mb-2">{maxAQI}</div>
          <div className="text-red-800 font-medium">Peak AQI</div>
          <div className="text-red-600 text-sm">Highest recorded</div>
        </Card>
        
        <Card className="text-center bg-gradient-to-br from-green-50 to-green-100">
          <div className="text-3xl font-bold text-green-600 mb-2">{minAQI}</div>
          <div className="text-green-800 font-medium">Best AQI</div>
          <div className="text-green-600 text-sm">Lowest recorded</div>
        </Card>
      </div>

      {/* Main Chart */}
      <AQIChart
        data={data}
        title="AQI Trend Analysis"
        timeframe={timeframe === '7d' ? '7 days' : '30 days'}
      />

      {/* Pollutant Breakdown */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800">Pollutant Analysis</h3>
          <Button icon={Filter} variant="outline" size="sm">
            Compare
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-700">PM2.5 Levels</h4>
            {data.slice(-7).map((item, index) => (
              <motion.div
                key={index}
                className="flex items-center justify-between p-3 bg-red-50 rounded-lg"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <span className="text-sm text-gray-600">
                  {new Date(item.date).toLocaleDateString()}
                </span>
                <span className="font-medium text-red-700">
                  {item.pollutants.pm25} μg/m³
                </span>
              </motion.div>
            ))}
          </div>
          
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-700">PM10 Levels</h4>
            {data.slice(-7).map((item, index) => (
              <motion.div
                key={index}
                className="flex items-center justify-between p-3 bg-orange-50 rounded-lg"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <span className="text-sm text-gray-600">
                  {new Date(item.date).toLocaleDateString()}
                </span>
                <span className="font-medium text-orange-700">
                  {item.pollutants.pm10} μg/m³
                </span>
              </motion.div>
            ))}
          </div>
          
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-700">NO₂ Levels</h4>
            {data.slice(-7).map((item, index) => (
              <motion.div
                key={index}
                className="flex items-center justify-between p-3 bg-purple-50 rounded-lg"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <span className="text-sm text-gray-600">
                  {new Date(item.date).toLocaleDateString()}
                </span>
                <span className="font-medium text-purple-700">
                  {item.pollutants.no2} ppb
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};