import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { motion } from 'framer-motion';
import { Card } from '../ui/Card';
import { HistoricalData } from '../../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface AQIChartProps {
  data: HistoricalData[];
  title: string;
  timeframe: string;
}

export const AQIChart: React.FC<AQIChartProps> = ({ data, title, timeframe }) => {
  const chartData = {
    labels: data.map(item => new Date(item.date).toLocaleDateString()),
    datasets: [
      {
        label: 'AQI',
        data: data.map(item => item.aqi),
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#3B82F6',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        cornerRadius: 8,
        displayColors: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#6B7280',
          font: {
            family: 'Poppins',
          },
        },
      },
      y: {
        beginAtZero: true,
        max: 300,
        grid: {
          color: 'rgba(107, 114, 128, 0.1)',
        },
        ticks: {
          color: '#6B7280',
          font: {
            family: 'Poppins',
          },
        },
      },
    },
    interaction: {
      intersect: false,
    },
    elements: {
      point: {
        hoverBackgroundColor: '#3B82F6',
      },
    },
  };

  return (
    <Card>
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600">Air Quality Index over {timeframe}</p>
      </div>
      
      <motion.div
        className="h-80 relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <Line data={chartData} options={options} />
      </motion.div>

      {/* AQI Level Indicators */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="w-4 h-4 bg-green-500 rounded-full mx-auto mb-1"></div>
          <span className="text-xs text-gray-600">Good (0-50)</span>
        </div>
        <div className="text-center">
          <div className="w-4 h-4 bg-yellow-500 rounded-full mx-auto mb-1"></div>
          <span className="text-xs text-gray-600">Moderate (51-100)</span>
        </div>
        <div className="text-center">
          <div className="w-4 h-4 bg-red-500 rounded-full mx-auto mb-1"></div>
          <span className="text-xs text-gray-600">Unhealthy (151+)</span>
        </div>
      </div>
    </Card>
  );
};