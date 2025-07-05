import React from 'react';
import { motion } from 'framer-motion';

interface WeatherMetricCardProps {
  type: 'uv' | 'humidity' | 'wind' | 'dewpoint' | 'pressure' | 'visibility';
  value: number | string;
  unit?: string;
  label: string;
  description: string;
  trend?: 'up' | 'down' | 'stable';
  windDirection?: number;
  uvLevel?: string;
  pressureValue?: number;
}

export const WeatherMetricCard: React.FC<WeatherMetricCardProps> = ({
  type,
  value,
  unit = '',
  label,
  description,
  trend,
  windDirection = 0,
  uvLevel,
  pressureValue = 1013
}) => {

  const getUVColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'low': return '#22c55e';
      case 'moderate': return '#eab308';
      case 'high': return '#f97316';
      case 'very high': return '#ef4444';
      case 'extreme': return '#a855f7';
      default: return '#22c55e';
    }
  };

  const getUVPosition = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'low': return 15;
      case 'moderate': return 35;
      case 'high': return 55;
      case 'very high': return 75;
      case 'extreme': return 95;
      default: return 15;
    }
  };

  const renderUVCard = () => (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-2 text-white/70 text-xs md:text-sm font-light mb-2 md:mb-3">
        <div className="flex items-center gap-2 text-white/70 text-sm md:text-sm font-light mb-3 md:mb-3">
          <span>☀️</span>
          <span>{label}</span>
        </div>
      </div>
      
      <div className="text-white/80 text-sm md:text-sm mb-4 md:mb-4 font-extralight">{description}</div>
      
      <div className="text-white text-3xl md:text-4xl font-extralight mb-6 md:mb-6">{uvLevel}</div>
      
      {/* Soft UV Index Bar */}
      <div className="relative mt-auto">
        <div className="h-1.5 bg-white/15 rounded-full overflow-hidden">
          <div 
            className="h-full rounded-full"
            style={{
              background: 'linear-gradient(to right, #22c55e 0%, #eab308 25%, #f97316 50%, #ef4444 75%, #a855f7 100%)',
              width: '100%'
            }}
          />
        </div>
        <motion.div
          className="absolute top-0 w-3 h-3 bg-white rounded-full -mt-1 shadow-sm"
          style={{ left: `${getUVPosition(uvLevel || 'low')}%` }}
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    </div>
  );

  const renderHumidityCard = () => (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-2 text-white/70 text-xs md:text-sm font-light mb-2 md:mb-3">
        <div className="flex items-center gap-2 text-white/70 text-sm md:text-sm font-light mb-3 md:mb-3">
          <span>💧</span>
          <span>{label}</span>
        </div>
      </div>
      
      <div className="text-white/80 text-sm md:text-sm mb-4 md:mb-4 font-extralight">{description}</div>
      
      <div className="text-white text-3xl md:text-4xl font-extralight mb-6 md:mb-6">
        {value}<span className="text-2xl md:text-2xl font-extralight">{unit}</span>
      </div>
      
      {/* Soft Humidity Progress Bar */}
      <div className="relative mt-auto">
        <div className="h-1.5 bg-white/15 rounded-full overflow-hidden">
          <motion.div 
            className="h-full rounded-full bg-gradient-to-r from-cyan-300/80 to-blue-400/80"
            initial={{ width: 0 }}
            animate={{ width: `${value}%` }}
            transition={{ duration: 3, ease: 'easeOut' }}
          />
        </div>
        <div className="flex justify-between text-sm text-white/40 mt-2 font-light">
          <span>0%</span>
          <span>100%</span>
        </div>
      </div>
    </div>
  );

  const renderWindCard = () => (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-2 text-white/70 text-xs md:text-sm font-light mb-2 md:mb-3">
        <div className="flex items-center gap-2 text-white/70 text-sm md:text-sm font-light mb-3 md:mb-3">
          <span>💨</span>
          <span>{label}</span>
        </div>
      </div>
      
      <div className="text-white/80 text-sm md:text-sm mb-4 md:mb-4 font-extralight">{description}</div>
      
      <div className="flex-1 flex items-center justify-center">
        {/* Soft Wind Compass */}
        <div className="relative w-16 h-16 md:w-16 md:h-16">
          <svg className="w-full h-full" viewBox="0 0 64 64">
            {/* Outer Circle */}
            <circle
              cx="32"
              cy="32"
              r="28"
              fill="none"
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="0.5"
            />
            
            {/* Inner Circle */}
            <circle
              cx="32"
              cy="32"
              r="20"
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="0.5"
            />
            
            {/* Soft Cardinal Directions */}
            <text x="32" y="8" textAnchor="middle" className="fill-white/40 text-[8px] font-light">N</text>
            <text x="56" y="36" textAnchor="middle" className="fill-white/40 text-[8px] font-light">E</text>
            <text x="32" y="60" textAnchor="middle" className="fill-white/40 text-[8px] font-light">S</text>
            <text x="8" y="36" textAnchor="middle" className="fill-white/40 text-[8px] font-light">W</text>
            
            {/* Gentle Wind Direction Arrow */}
            <motion.g
              initial={{ rotate: 0 }}
              animate={{ rotate: windDirection }}
              style={{ transformOrigin: '32px 32px' }}
              transition={{ duration: 2, ease: 'easeInOut' }}
            >
              <polygon
                points="32,16 34,28 32,26 30,28"
                fill="white"
                opacity="0.9"
              />
              <circle cx="32" cy="32" r="2" fill="white" opacity="0.8" />
            </motion.g>
          </svg>
        </div>
      </div>
      
      {/* Wind Speed */}
      <div className="text-center mt-auto">
        <div className="text-white text-2xl md:text-2xl font-extralight">{value}</div>
        <div className="text-white/50 text-sm md:text-sm font-light">{unit}</div>
      </div>
    </div>
  );

  const renderDewPointCard = () => (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-2 text-white/70 text-xs md:text-sm font-light mb-2 md:mb-3">
        <div className="flex items-center gap-2 text-white/70 text-sm md:text-sm font-light mb-3 md:mb-3">
          <span>🌡️</span>
          <span>{label}</span>
        </div>
      </div>
      
      <div className="text-white/80 text-sm md:text-sm mb-4 md:mb-4 font-extralight">{description}</div>
      
      <div className="flex-1 flex items-center justify-center">
        <div className="text-white text-4xl md:text-5xl font-extralight">
          {value}<span className="text-3xl md:text-3xl">°</span>
        </div>
      </div>
    </div>
  );

  const renderPressureCard = () => (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-2 text-white/70 text-xs md:text-sm font-light mb-2 md:mb-3">
        <div className="flex items-center gap-2 text-white/70 text-sm md:text-sm font-light mb-3 md:mb-3">
          <span>🌡️</span>
          <span>{label}</span>
        </div>
      </div>
      
      <div className="text-white/80 text-sm md:text-sm mb-4 md:mb-4 font-extralight">{description}</div>
      
      <div className="flex-1 flex items-center justify-center">
        {/* Soft Pressure Gauge */}
        <div className="relative w-20 h-12 md:w-20 md:h-12">
          <svg className="w-full h-full" viewBox="0 0 80 48">
            {/* Gauge Background Arc */}
            <path
              d="M 10 40 A 30 30 0 0 1 70 40"
              fill="none"
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="1"
              strokeLinecap="round"
            />
            
            {/* Pressure Level Arc */}
            <motion.path
              d="M 10 40 A 30 30 0 0 1 70 40"
              fill="none"
              stroke="white"
              strokeWidth="1"
              strokeLinecap="round"
              strokeDasharray="94"
              strokeOpacity="0.8"
              initial={{ strokeDashoffset: 94 }}
              animate={{ 
                strokeDashoffset: 94 - (94 * Math.min(Math.max((pressureValue - 980) / 60, 0), 1))
              }}
              transition={{ duration: 3, ease: 'easeOut' }}
            />
            
            {/* Soft Gauge Marks */}
            {[0, 0.5, 1].map((position, index) => {
              const angle = -180 + (position * 180);
              const x1 = 40 + 26 * Math.cos((angle * Math.PI) / 180);
              const y1 = 40 + 26 * Math.sin((angle * Math.PI) / 180);
              const x2 = 40 + 23 * Math.cos((angle * Math.PI) / 180);
              const y2 = 40 + 23 * Math.sin((angle * Math.PI) / 180);
              
              return (
                <line
                  key={index}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth="1"
                />
              );
            })}
            
            {/* Center Dot */}
            <circle cx="40" cy="40" r="1.5" fill="white" opacity="0.6" />
          </svg>
        </div>
      </div>
      
      {/* Pressure Value */}
      <div className="text-center mt-auto">
        <div className="text-white text-2xl md:text-2xl font-extralight">{value}</div>
        <div className="text-white/50 text-sm md:text-sm font-light">{unit}</div>
      </div>
    </div>
  );

  const renderVisibilityCard = () => (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-2 text-white/70 text-xs md:text-sm font-light mb-2 md:mb-3">
        <div className="flex items-center gap-2 text-white/70 text-sm md:text-sm font-light mb-3 md:mb-3">
          <span>👁️</span>
          <span>{label}</span>
        </div>
      </div>
      
      <div className="text-white/80 text-sm md:text-sm mb-4 md:mb-4 font-extralight">{description}</div>
      
      <div className="flex-1 flex items-center justify-center">
        <div className="text-white text-4xl md:text-5xl font-extralight">
          {value}<span className="text-xl md:text-xl font-light ml-1">{unit}</span>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (type) {
      case 'uv': return renderUVCard();
      case 'humidity': return renderHumidityCard();
      case 'wind': return renderWindCard();
      case 'dewpoint': return renderDewPointCard();
      case 'pressure': return renderPressureCard();
      case 'visibility': return renderVisibilityCard();
      default: return renderHumidityCard();
    }
  };

  return (
    <motion.div
      className="relative overflow-hidden rounded-3xl md:rounded-3xl p-6 md:p-6 h-48 md:h-48"
      style={{
        background: 'rgba(255, 255, 255, 0.12)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
      }}
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, type: 'spring', stiffness: 80, damping: 20 }}
      whileHover={{ 
        scale: 1.01,
        y: -2,
        transition: { duration: 0.3, ease: 'easeOut' }
      }}
    >
      <div className="relative z-10 h-full">
        {renderContent()}
      </div>

      {/* Gentle trend indicator */}
      {trend && (
        <motion.div
          className="absolute top-3 right-3 md:top-4 md:right-4"
          animate={{ 
            y: trend === 'up' ? [-0.5, 0.5, -0.5] : trend === 'down' ? [0.5, -0.5, 0.5] : [0] 
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          {trend === 'up' && (
            <div className="w-0 h-0 border-l-[2px] border-r-[2px] border-b-[4px] border-transparent border-b-green-300/60" />
          )}
          {trend === 'down' && (
            <div className="w-0 h-0 border-l-[2px] border-r-[2px] border-t-[4px] border-transparent border-t-red-300/60" />
          )}
          {trend === 'stable' && (
            <div className="w-2 h-0.5 bg-white/40 rounded" />
          )}
        </motion.div>
      )}
    </motion.div>
  );
};