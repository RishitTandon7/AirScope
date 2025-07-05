import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';

interface WeatherBackgroundProps {
  weatherCondition: 'sunny' | 'cloudy' | 'rainy' | 'stormy' | 'misty' | 'snowy' | 'windy';
  intensity?: 'light' | 'moderate' | 'heavy';
}

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  angle: number;
  delay: number;
  type: string;
  layer: number;
  windOffset: number;
  rotationSpeed: number;
}

const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1920,
    height: typeof window !== 'undefined' ? window.innerHeight : 1080,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
};

// Ultra-realistic rain drops with physics
const UltraRainDrop: React.FC<{ particle: Particle; windowSize: { width: number; height: number } }> = ({ particle, windowSize }) => {
  const windEffect = Math.sin(Date.now() * 0.001 + particle.id) * 15;
  
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        width: particle.size * 0.8,
        height: particle.size * 12,
        background: `linear-gradient(180deg, 
          rgba(59,130,246,${0.9 * particle.opacity}) 0%, 
          rgba(59,130,246,${0.7 * particle.opacity}) 20%, 
          rgba(59,130,246,${0.5 * particle.opacity}) 60%, 
          rgba(59,130,246,${0.2 * particle.opacity}) 85%, 
          transparent 100%)`,
        borderRadius: '50% 50% 50% 50% / 80% 80% 20% 20%',
        filter: 'blur(0.3px)',
        boxShadow: `0 0 ${particle.size}px rgba(59,130,246,${0.4 * particle.opacity})`,
        transformOrigin: 'center top',
      }}
      initial={{
        x: particle.x,
        y: -100,
        opacity: 0,
        rotate: particle.angle,
        scaleY: 0,
      }}
      animate={{
        x: [
          particle.x,
          particle.x + windEffect * 0.3,
          particle.x + windEffect * 0.7,
          particle.x + windEffect,
        ],
        y: windowSize.height + 100,
        opacity: [0, particle.opacity * 0.3, particle.opacity, particle.opacity * 0.8, 0],
        rotate: particle.angle + (windEffect * 0.1),
        scaleY: [0, 0.5, 1, 1, 0.8],
      }}
      transition={{
        duration: particle.speed,
        delay: particle.delay,
        repeat: Infinity,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    />
  );
};

// Cinematic snow flakes with realistic physics
const CinematicSnowFlake: React.FC<{ particle: Particle; windowSize: { width: number; height: number } }> = ({ particle, windowSize }) => {
  const swayAmplitude = 40 + particle.size * 0.5;
  const swayFrequency = 0.02 + (particle.size * 0.001);
  
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        width: particle.size,
        height: particle.size,
        background: `radial-gradient(circle, 
          rgba(255,255,255,${0.95 * particle.opacity}) 0%, 
          rgba(255,255,255,${0.8 * particle.opacity}) 30%, 
          rgba(255,255,255,${0.6 * particle.opacity}) 60%, 
          rgba(255,255,255,${0.3 * particle.opacity}) 80%, 
          transparent 100%)`,
        borderRadius: '50%',
        filter: `blur(${0.5 + particle.size * 0.05}px)`,
        boxShadow: `
          0 0 ${particle.size * 0.8}px rgba(255,255,255,${0.6 * particle.opacity}),
          inset 0 0 ${particle.size * 0.4}px rgba(255,255,255,${0.9 * particle.opacity}),
          0 0 ${particle.size * 1.5}px rgba(173,216,230,${0.3 * particle.opacity})
        `,
      }}
      initial={{
        x: particle.x,
        y: -50,
        opacity: 0,
        scale: 0,
        rotate: 0,
      }}
      animate={{
        x: [
          particle.x,
          particle.x + Math.sin(particle.angle * swayFrequency) * swayAmplitude,
          particle.x + Math.sin(particle.angle * swayFrequency + Math.PI) * swayAmplitude,
          particle.x + Math.sin(particle.angle * swayFrequency + Math.PI * 2) * swayAmplitude,
        ],
        y: windowSize.height + 50,
        opacity: [0, particle.opacity * 0.3, particle.opacity, particle.opacity * 0.9, 0],
        scale: [0, 0.6, 1, 1.1, 0.8],
        rotate: [0, particle.rotationSpeed * 90, particle.rotationSpeed * 180, particle.rotationSpeed * 270, particle.rotationSpeed * 360],
      }}
      transition={{
        duration: particle.speed,
        delay: particle.delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
};

// Volumetric clouds with depth
const VolumetricCloud: React.FC<{ particle: Particle; windowSize: { width: number; height: number } }> = ({ particle, windowSize }) => {
  const { isDark } = useTheme();
  const cloudLayers = 3;
  
  return (
    <div className="absolute pointer-events-none">
      {Array.from({ length: cloudLayers }, (_, layerIndex) => {
        const layerScale = 1 - (layerIndex * 0.15);
        const layerOpacity = particle.opacity * (1 - layerIndex * 0.3);
        const layerSpeed = particle.speed * (1 + layerIndex * 0.2);
        
        return (
          <motion.div
            key={layerIndex}
            className="absolute"
            style={{
              width: particle.size * layerScale,
              height: particle.size * 0.6 * layerScale,
              background: isDark 
                ? `radial-gradient(ellipse, 
                    rgba(148,163,184,${0.4 * layerOpacity}) 0%, 
                    rgba(148,163,184,${0.25 * layerOpacity}) 40%, 
                    rgba(148,163,184,${0.1 * layerOpacity}) 70%, 
                    transparent 100%)`
                : `radial-gradient(ellipse, 
                    rgba(255,255,255,${0.8 * layerOpacity}) 0%, 
                    rgba(255,255,255,${0.5 * layerOpacity}) 40%, 
                    rgba(255,255,255,${0.2 * layerOpacity}) 70%, 
                    transparent 100%)`,
              borderRadius: '50%',
              filter: `blur(${3 + layerIndex * 2}px)`,
              zIndex: cloudLayers - layerIndex,
            }}
            initial={{
              x: -particle.size * layerScale,
              y: particle.y + (layerIndex * 10),
              opacity: 0,
              scale: 0.8,
            }}
            animate={{
              x: windowSize.width + particle.size * layerScale,
              y: particle.y + (layerIndex * 10) + Math.sin(particle.angle * 0.01 + layerIndex) * 25,
              opacity: [0, layerOpacity * 0.5, layerOpacity, layerOpacity * 0.8, 0],
              scale: [0.8, 0.9, 1, 1.1, 0.95],
            }}
            transition={{
              duration: layerSpeed,
              delay: particle.delay + (layerIndex * 0.5),
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        );
      })}
    </div>
  );
};

// Realistic lightning with branching
const RealisticLightning: React.FC<{ particle: Particle; windowSize: { width: number; height: number } }> = ({ particle, windowSize }) => {
  const lightningBranches = useMemo(() => {
    const mainBranch = [];
    const sideBranches = [];
    
    // Main lightning bolt
    let currentX = particle.x;
    let currentY = 0;
    const segments = 12;
    
    for (let i = 0; i <= segments; i++) {
      const segmentHeight = (windowSize.height * 0.7) / segments;
      const nextY = currentY + segmentHeight;
      const nextX = currentX + (Math.random() - 0.5) * 80;
      
      mainBranch.push({ x: nextX, y: nextY });
      
      // Add side branches occasionally
      if (i > 2 && i < segments - 2 && Math.random() > 0.7) {
        const branchLength = 3 + Math.random() * 4;
        let branchX = nextX;
        let branchY = nextY;
        
        for (let j = 0; j < branchLength; j++) {
          branchX += (Math.random() - 0.5) * 60;
          branchY += segmentHeight * 0.5;
          sideBranches.push({ x: branchX, y: branchY, fromX: nextX, fromY: nextY });
        }
      }
      
      currentX = nextX;
      currentY = nextY;
    }
    
    return { mainBranch, sideBranches };
  }, [particle.x, windowSize.height]);

  const createPath = (points: any[]) => {
    if (points.length === 0) return '';
    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      path += ` L ${points[i].x} ${points[i].y}`;
    }
    return path;
  };

  return (
    <motion.svg
      className="absolute pointer-events-none"
      width={windowSize.width}
      height={windowSize.height}
      style={{ top: 0, left: 0 }}
      initial={{ opacity: 0 }}
      animate={{
        opacity: [0, 1, 1, 0, 1, 0],
        filter: [
          'brightness(1) contrast(1)',
          'brightness(3) contrast(2)',
          'brightness(4) contrast(3)',
          'brightness(1) contrast(1)',
          'brightness(2) contrast(1.5)',
          'brightness(1) contrast(1)',
        ],
      }}
      transition={{
        duration: 0.4,
        delay: particle.delay,
        repeat: Infinity,
        repeatDelay: 4 + Math.random() * 6,
      }}
    >
      <defs>
        <filter id={`lightning-glow-${particle.id}`}>
          <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
          <feGaussianBlur stdDeviation="8" result="bigBlur"/>
          <feMerge> 
            <feMergeNode in="bigBlur"/>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <linearGradient id={`lightning-gradient-${particle.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(255,255,255,1)" />
          <stop offset="30%" stopColor="rgba(147,197,253,0.9)" />
          <stop offset="70%" stopColor="rgba(99,102,241,0.8)" />
          <stop offset="100%" stopColor="rgba(79,70,229,0.6)" />
        </linearGradient>
      </defs>
      
      {/* Main lightning bolt */}
      <path
        d={createPath(lightningBranches.mainBranch)}
        stroke={`url(#lightning-gradient-${particle.id})`}
        strokeWidth="4"
        fill="none"
        filter={`url(#lightning-glow-${particle.id})`}
        strokeLinecap="round"
      />
      
      {/* Side branches */}
      {lightningBranches.sideBranches.map((branch, index) => (
        <path
          key={index}
          d={`M ${branch.fromX} ${branch.fromY} L ${branch.x} ${branch.y}`}
          stroke={`url(#lightning-gradient-${particle.id})`}
          strokeWidth="2"
          fill="none"
          filter={`url(#lightning-glow-${particle.id})`}
          strokeLinecap="round"
          opacity="0.7"
        />
      ))}
    </motion.svg>
  );
};

// Dynamic sun rays with atmospheric scattering
const AtmosphericSunRay: React.FC<{ particle: Particle; windowSize: { width: number; height: number } }> = ({ particle, windowSize }) => {
  const rayLength = particle.size + Math.sin(Date.now() * 0.001 + particle.id) * 20;
  
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        width: 3,
        height: rayLength,
        background: `linear-gradient(180deg, 
          rgba(251,191,36,${0.8 * particle.opacity}) 0%, 
          rgba(251,191,36,${0.6 * particle.opacity}) 30%, 
          rgba(252,211,77,${0.4 * particle.opacity}) 60%, 
          rgba(254,240,138,${0.2 * particle.opacity}) 80%, 
          transparent 100%)`,
        borderRadius: '2px',
        transformOrigin: 'center bottom',
        left: windowSize.width * 0.5,
        top: windowSize.height * 0.15,
        transform: `rotate(${particle.angle}deg)`,
        filter: `blur(${0.8 + Math.sin(Date.now() * 0.002 + particle.id) * 0.3}px)`,
        boxShadow: `0 0 ${particle.size * 0.3}px rgba(251,191,36,${0.4 * particle.opacity})`,
      }}
      animate={{
        opacity: [
          particle.opacity * 0.4, 
          particle.opacity * 0.8, 
          particle.opacity, 
          particle.opacity * 0.7, 
          particle.opacity * 0.4
        ],
        scaleY: [0.8, 1.1, 1.3, 1.0, 0.8],
        filter: [
          `blur(${0.8}px)`,
          `blur(${1.2}px)`,
          `blur(${0.6}px)`,
          `blur(${1.0}px)`,
          `blur(${0.8}px)`,
        ],
      }}
      transition={{
        duration: 6 + Math.random() * 4,
        delay: particle.delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
};

// Layered mist with depth
const LayeredMist: React.FC<{ particle: Particle; windowSize: { width: number; height: number } }> = ({ particle, windowSize }) => {
  const { isDark } = useTheme();
  const mistLayers = 4;
  
  return (
    <div className="absolute pointer-events-none">
      {Array.from({ length: mistLayers }, (_, layerIndex) => {
        const layerScale = 1 + (layerIndex * 0.3);
        const layerOpacity = particle.opacity * (1 - layerIndex * 0.2);
        const layerSpeed = particle.speed * (1 - layerIndex * 0.1);
        const layerHeight = particle.size * 0.4 * layerScale;
        
        return (
          <motion.div
            key={layerIndex}
            className="absolute"
            style={{
              width: particle.size * layerScale,
              height: layerHeight,
              background: isDark 
                ? `radial-gradient(ellipse, 
                    rgba(148,163,184,${0.3 * layerOpacity}) 0%, 
                    rgba(148,163,184,${0.15 * layerOpacity}) 50%, 
                    rgba(148,163,184,${0.05 * layerOpacity}) 80%, 
                    transparent 100%)`
                : `radial-gradient(ellipse, 
                    rgba(255,255,255,${0.6 * layerOpacity}) 0%, 
                    rgba(255,255,255,${0.3 * layerOpacity}) 50%, 
                    rgba(255,255,255,${0.1 * layerOpacity}) 80%, 
                    transparent 100%)`,
              borderRadius: '50%',
              filter: `blur(${6 + layerIndex * 3}px)`,
              zIndex: mistLayers - layerIndex,
            }}
            initial={{
              x: -particle.size * layerScale,
              y: particle.y + (layerIndex * 15),
              opacity: 0,
              scale: 0.6,
            }}
            animate={{
              x: windowSize.width + particle.size * layerScale,
              y: particle.y + (layerIndex * 15) + Math.sin(particle.angle * 0.003 + layerIndex) * 40,
              opacity: [0, layerOpacity * 0.3, layerOpacity, layerOpacity * 0.8, 0],
              scale: [0.6, 0.8, 1, 1.2, 0.9],
            }}
            transition={{
              duration: layerSpeed,
              delay: particle.delay + (layerIndex * 0.8),
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        );
      })}
    </div>
  );
};

// Dynamic wind streams
const DynamicWind: React.FC<{ particle: Particle; windowSize: { width: number; height: number } }> = ({ particle, windowSize }) => {
  const streamCount = 3;
  
  return (
    <div className="absolute pointer-events-none">
      {Array.from({ length: streamCount }, (_, streamIndex) => {
        const streamOffset = streamIndex * 8;
        const streamOpacity = particle.opacity * (1 - streamIndex * 0.2);
        const streamWidth = particle.size * (1 - streamIndex * 0.2);
        
        return (
          <motion.div
            key={streamIndex}
            className="absolute"
            style={{
              width: streamWidth,
              height: 3,
              background: `linear-gradient(90deg, 
                transparent 0%, 
                rgba(34,197,94,${0.7 * streamOpacity}) 20%, 
                rgba(34,197,94,${0.9 * streamOpacity}) 50%, 
                rgba(34,197,94,${0.7 * streamOpacity}) 80%, 
                transparent 100%)`,
              borderRadius: '2px',
              filter: `blur(${0.5 + streamIndex * 0.3}px)`,
            }}
            initial={{
              x: -streamWidth,
              y: particle.y + streamOffset,
              opacity: 0,
              scaleX: 0,
            }}
            animate={{
              x: windowSize.width + streamWidth,
              y: particle.y + streamOffset + Math.sin(particle.angle * 0.02 + streamIndex) * 50,
              opacity: [0, streamOpacity * 0.5, streamOpacity, streamOpacity * 0.8, 0],
              scaleX: [0, 0.5, 1, 1, 0],
            }}
            transition={{
              duration: particle.speed * (1 + streamIndex * 0.2),
              delay: particle.delay + (streamIndex * 0.3),
              repeat: Infinity,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          />
        );
      })}
    </div>
  );
};

export const WeatherBackground: React.FC<WeatherBackgroundProps> = ({ 
  weatherCondition, 
  intensity = 'moderate' 
}) => {
  const { isDark } = useTheme();
  const windowSize = useWindowSize();
  const [particles, setParticles] = useState<Particle[]>([]);

  const particleConfig = useMemo(() => {
    const configs = {
      light: { 
        rainy: { count: 40, speed: [2, 4], size: [1, 3] }, 
        snowy: { count: 25, speed: [6, 10], size: [4, 8] }, 
        cloudy: { count: 6, speed: [20, 30], size: [100, 180] }, 
        stormy: { count: 4, speed: [0.3, 0.5], size: [150, 250] }, 
        sunny: { count: 16, speed: [4, 6], size: [80, 120] }, 
        misty: { count: 12, speed: [25, 35], size: [120, 200] }, 
        windy: { count: 20, speed: [3, 5], size: [60, 100] } 
      },
      moderate: { 
        rainy: { count: 80, speed: [1.5, 3], size: [1, 4] }, 
        snowy: { count: 50, speed: [5, 8], size: [3, 10] }, 
        cloudy: { count: 10, speed: [18, 28], size: [120, 220] }, 
        stormy: { count: 6, speed: [0.3, 0.4], size: [180, 300] }, 
        sunny: { count: 20, speed: [4, 6], size: [90, 140] }, 
        misty: { count: 18, speed: [22, 32], size: [140, 240] }, 
        windy: { count: 35, speed: [2.5, 4], size: [70, 120] } 
      },
      heavy: { 
        rainy: { count: 150, speed: [1, 2.5], size: [1, 5] }, 
        snowy: { count: 100, speed: [4, 7], size: [3, 12] }, 
        cloudy: { count: 15, speed: [15, 25], size: [150, 280] }, 
        stormy: { count: 8, speed: [0.2, 0.4], size: [200, 350] }, 
        sunny: { count: 24, speed: [4, 6], size: [100, 160] }, 
        misty: { count: 25, speed: [20, 30], size: [160, 280] }, 
        windy: { count: 50, speed: [2, 3.5], size: [80, 140] } 
      },
    };
    return configs[intensity][weatherCondition] || configs.moderate.cloudy;
  }, [intensity, weatherCondition]);

  const generateParticles = useCallback((): Particle[] => {
    return Array.from({ length: particleConfig.count }, (_, i) => {
      const baseDelay = (i / particleConfig.count) * 3;
      const randomDelay = Math.random() * 8; // Slower, more spread out
      const size = particleConfig.size[0] + Math.random() * (particleConfig.size[1] - particleConfig.size[0]);
      const speed = particleConfig.speed[0] + Math.random() * (particleConfig.speed[1] - particleConfig.speed[0]);
      
      return {
        id: i,
        x: Math.random() * windowSize.width,
        y: weatherCondition === 'cloudy' || weatherCondition === 'misty' 
          ? Math.random() * windowSize.height * 0.7 
          : Math.random() * windowSize.height,
        size,
        speed,
        opacity: 0.6 + Math.random() * 0.4,
        opacity: 0.3 + Math.random() * 0.4, // Much softer opacity
        angle: weatherCondition === 'sunny' 
          ? (360 / particleConfig.count) * i 
          : Math.random() * 360,
        delay: baseDelay + randomDelay,
        type: weatherCondition,
        layer: Math.floor(Math.random() * 3),
        windOffset: Math.random() * 50 - 25,
        rotationSpeed: 0.5 + Math.random() * 1.5,
      };
    });
  }, [weatherCondition, particleConfig, windowSize]);

  useEffect(() => {
    setParticles(generateParticles());
  }, [generateParticles]);

  const renderParticle = (particle: Particle) => {
    switch (particle.type) {
      case 'rainy':
        return <UltraRainDrop key={particle.id} particle={particle} windowSize={windowSize} />;
      case 'snowy':
        return <CinematicSnowFlake key={particle.id} particle={particle} windowSize={windowSize} />;
      case 'cloudy':
        return <VolumetricCloud key={particle.id} particle={particle} windowSize={windowSize} />;
      case 'stormy':
        return <RealisticLightning key={particle.id} particle={particle} windowSize={windowSize} />;
      case 'sunny':
        return <AtmosphericSunRay key={particle.id} particle={particle} windowSize={windowSize} />;
      case 'misty':
        return <LayeredMist key={particle.id} particle={particle} windowSize={windowSize} />;
      case 'windy':
        return <DynamicWind key={particle.id} particle={particle} windowSize={windowSize} />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={`${weatherCondition}-${intensity}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 4, ease: 'easeInOut' }} // Much slower transitions
        >
          {particles.map(renderParticle)}
        </motion.div>
      </AnimatePresence>
      
      {/* Enhanced Atmospheric Effects */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: (() => {
            const baseOpacity = isDark ? 0.06 : 0.03; // Much more subtle
            const intensityMultiplier = intensity === 'heavy' ? 1.2 : intensity === 'light' ? 0.8 : 1; // Less dramatic
            
            switch (weatherCondition) {
              case 'stormy':
                return [
                  `radial-gradient(circle at 25% 30%, rgba(99,102,241,${baseOpacity * 2 * intensityMultiplier}) 0%, transparent 70%), 
                   radial-gradient(circle at 75% 70%, rgba(79,70,229,${baseOpacity * 1.5 * intensityMultiplier}) 0%, transparent 70%),
                   radial-gradient(circle at 50% 50%, rgba(67,56,202,${baseOpacity * 0.8 * intensityMultiplier}) 0%, transparent 80%)`,
                  `radial-gradient(circle at 70% 20%, rgba(67,56,202,${baseOpacity * 2.2 * intensityMultiplier}) 0%, transparent 70%), 
                   radial-gradient(circle at 30% 80%, rgba(99,102,241,${baseOpacity * 1.2 * intensityMultiplier}) 0%, transparent 70%),
                   radial-gradient(circle at 50% 50%, rgba(79,70,229,${baseOpacity * 0.9 * intensityMultiplier}) 0%, transparent 80%)`,
                ];
              case 'rainy':
                return [
                  `radial-gradient(circle at 20% 25%, rgba(59,130,246,${baseOpacity * 1.8 * intensityMultiplier}) 0%, transparent 70%), 
                   radial-gradient(circle at 80% 75%, rgba(14,165,233,${baseOpacity * 1.2 * intensityMultiplier}) 0%, transparent 70%),
                   linear-gradient(180deg, rgba(59,130,246,${baseOpacity * 0.3 * intensityMultiplier}) 0%, transparent 50%)`,
                  `radial-gradient(circle at 75% 15%, rgba(3,105,161,${baseOpacity * 1.5 * intensityMultiplier}) 0%, transparent 70%), 
                   radial-gradient(circle at 25% 85%, rgba(59,130,246,${baseOpacity * 1.1 * intensityMultiplier}) 0%, transparent 70%),
                   linear-gradient(180deg, rgba(14,165,233,${baseOpacity * 0.4 * intensityMultiplier}) 0%, transparent 50%)`,
                ];
              case 'sunny':
                return [
                  `radial-gradient(circle at 50% 20%, rgba(251,191,36,${baseOpacity * 2 * intensityMultiplier}) 0%, transparent 60%), 
                   radial-gradient(circle at 30% 70%, rgba(245,158,11,${baseOpacity * 1.2 * intensityMultiplier}) 0%, transparent 70%),
                   radial-gradient(circle at 70% 60%, rgba(252,211,77,${baseOpacity * 0.8 * intensityMultiplier}) 0%, transparent 80%)`,
                  `radial-gradient(circle at 40% 30%, rgba(252,211,77,${baseOpacity * 1.8 * intensityMultiplier}) 0%, transparent 60%), 
                   radial-gradient(circle at 60% 80%, rgba(251,191,36,${baseOpacity * 1.1 * intensityMultiplier}) 0%, transparent 70%),
                   radial-gradient(circle at 50% 50%, rgba(245,158,11,${baseOpacity * 0.9 * intensityMultiplier}) 0%, transparent 80%)`,
                ];
              case 'snowy':
                return [
                  `radial-gradient(circle at 35% 25%, rgba(255,255,255,${baseOpacity * 1.5 * intensityMultiplier}) 0%, transparent 70%), 
                   radial-gradient(circle at 65% 75%, rgba(241,245,249,${baseOpacity * 1.1 * intensityMultiplier}) 0%, transparent 70%),
                   linear-gradient(180deg, rgba(248,250,252,${baseOpacity * 0.5 * intensityMultiplier}) 0%, transparent 60%)`,
                  `radial-gradient(circle at 60% 35%, rgba(248,250,252,${baseOpacity * 1.3 * intensityMultiplier}) 0%, transparent 70%), 
                   radial-gradient(circle at 40% 85%, rgba(255,255,255,${baseOpacity * 1.0 * intensityMultiplier}) 0%, transparent 70%),
                   linear-gradient(180deg, rgba(241,245,249,${baseOpacity * 0.6 * intensityMultiplier}) 0%, transparent 60%)`,
                ];
              default:
                return [
                  `radial-gradient(circle at 40% 40%, rgba(148,163,184,${baseOpacity * 1.2 * intensityMultiplier}) 0%, transparent 70%), 
                   radial-gradient(circle at 60% 60%, rgba(203,213,225,${baseOpacity * 0.9 * intensityMultiplier}) 0%, transparent 70%)`,
                  `radial-gradient(circle at 55% 25%, rgba(241,245,249,${baseOpacity * 1.0 * intensityMultiplier}) 0%, transparent 70%), 
                   radial-gradient(circle at 45% 75%, rgba(148,163,184,${baseOpacity * 0.8 * intensityMultiplier}) 0%, transparent 70%)`,
                ];
            }
          })()
        }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }} // Much slower background changes
      />

      {/* Weather-specific lighting effects */}
      {weatherCondition === 'stormy' && (
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              'transparent',
              'rgba(255,255,255,0.03)', // Much more subtle lightning
              'transparent',
              'rgba(255,255,255,0.05)',
              'transparent',
            ],
          }}
          transition={{
            duration: 0.8, // Slower lightning
            repeat: Infinity,
            repeatDelay: 8 + Math.random() * 12, // Much longer delays
          }}
        />
      )}
    </div>
  );
};