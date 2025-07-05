/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],
        'mono': ['JetBrains Mono', 'Monaco', 'Consolas', 'monospace'],
      },
      colors: {
        // Weather-themed color palette
        weather: {
          // Sky colors
          sky: {
            50: '#f0f9ff',
            100: '#e0f2fe',
            200: '#bae6fd',
            300: '#7dd3fc',
            400: '#38bdf8',
            500: '#0ea5e9',
            600: '#0284c7',
            700: '#0369a1',
            800: '#075985',
            900: '#0c4a6e',
            950: '#082f49',
          },
          // Cloud colors
          cloud: {
            50: '#f8fafc',
            100: '#f1f5f9',
            200: '#e2e8f0',
            300: '#cbd5e1',
            400: '#94a3b8',
            500: '#64748b',
            600: '#475569',
            700: '#334155',
            800: '#1e293b',
            900: '#0f172a',
            950: '#020617',
          },
          // Sun colors
          sun: {
            50: '#fffbeb',
            100: '#fef3c7',
            200: '#fde68a',
            300: '#fcd34d',
            400: '#fbbf24',
            500: '#f59e0b',
            600: '#d97706',
            700: '#b45309',
            800: '#92400e',
            900: '#78350f',
            950: '#451a03',
          },
          // Rain colors
          rain: {
            50: '#eff6ff',
            100: '#dbeafe',
            200: '#bfdbfe',
            300: '#93c5fd',
            400: '#60a5fa',
            500: '#3b82f6',
            600: '#2563eb',
            700: '#1d4ed8',
            800: '#1e40af',
            900: '#1e3a8a',
            950: '#172554',
          },
          // Storm colors
          storm: {
            50: '#eef2ff',
            100: '#e0e7ff',
            200: '#c7d2fe',
            300: '#a5b4fc',
            400: '#818cf8',
            500: '#6366f1',
            600: '#4f46e5',
            700: '#4338ca',
            800: '#3730a3',
            900: '#312e81',
            950: '#1e1b4b',
          },
          // Wind colors
          wind: {
            50: '#f0fdf4',
            100: '#dcfce7',
            200: '#bbf7d0',
            300: '#86efac',
            400: '#4ade80',
            500: '#22c55e',
            600: '#16a34a',
            700: '#15803d',
            800: '#166534',
            900: '#14532d',
            950: '#052e16',
          },
          // Mist colors
          mist: {
            50: '#fafafa',
            100: '#f4f4f5',
            200: '#e4e4e7',
            300: '#d4d4d8',
            400: '#a1a1aa',
            500: '#71717a',
            600: '#52525b',
            700: '#3f3f46',
            800: '#27272a',
            900: '#18181b',
            950: '#09090b',
          },
          // Temperature colors
          hot: {
            50: '#fef2f2',
            100: '#fee2e2',
            200: '#fecaca',
            300: '#fca5a5',
            400: '#f87171',
            500: '#ef4444',
            600: '#dc2626',
            700: '#b91c1c',
            800: '#991b1b',
            900: '#7f1d1d',
            950: '#450a0a',
          },
          cold: {
            50: '#f0f9ff',
            100: '#e0f2fe',
            200: '#bae6fd',
            300: '#7dd3fc',
            400: '#38bdf8',
            500: '#0ea5e9',
            600: '#0284c7',
            700: '#0369a1',
            800: '#075985',
            900: '#0c4a6e',
            950: '#082f49',
          },
        },
        // Pastel theme colors for enhanced design
        pastel: {
          lavender: {
            50: '#f8f7ff',
            100: '#f1efff',
            200: '#e7e3ff',
            300: '#d2c9ff',
            400: '#b8a3ff',
            500: '#9b7dff',
            600: '#8b5fff',
            700: '#7c47f7',
            800: '#673de0',
            900: '#5631b8',
            950: '#3b1d80',
          },
          sky: {
            50: '#f0f9ff',
            100: '#e0f2fe',
            200: '#bae6fd',
            300: '#7dd3fc',
            400: '#38bdf8',
            500: '#0ea5e9',
            600: '#0284c7',
            700: '#0369a1',
            800: '#075985',
            900: '#0c4a6e',
            950: '#082f49',
          },
          mint: {
            50: '#f0fdf9',
            100: '#e6fffa',
            200: '#b3f5e0',
            300: '#66e6cc',
            400: '#1adab8',
            500: '#00c7a3',
            600: '#00a085',
            700: '#007a66',
            800: '#005c4d',
            900: '#003d33',
            950: '#001f1a',
          },
          peach: {
            50: '#fff7ed',
            100: '#ffedd5',
            200: '#fed7aa',
            300: '#fdba74',
            400: '#fb923c',
            500: '#f97316',
            600: '#ea580c',
            700: '#c2410c',
            800: '#9a3412',
            900: '#7c2d12',
            950: '#431407',
          },
          rose: {
            50: '#fff1f2',
            100: '#ffe4e6',
            200: '#fecdd3',
            300: '#fda4af',
            400: '#fb7185',
            500: '#f43f5e',
            600: '#e11d48',
            700: '#be123c',
            800: '#9f1239',
            900: '#881337',
            950: '#4c0519',
          },
        },
        // AQI colors remain the same
        aqi: {
          good: '#00E400',
          moderate: '#FFFF00',
          sensitive: '#FF7E00',
          unhealthy: '#FF0000',
          veryUnhealthy: '#8F3F97',
          hazardous: '#7E0023',
        }
      },
      backgroundImage: {
        // Weather-themed gradient backgrounds
        'gradient-sunny': 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 25%, #fde68a 50%, #fcd34d 75%, #fbbf24 100%)',
        'gradient-sunny-dark': 'linear-gradient(135deg, #451a03 0%, #78350f 25%, #92400e 50%, #b45309 75%, #d97706 100%)',
        
        'gradient-cloudy': 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 25%, #e2e8f0 50%, #cbd5e1 75%, #94a3b8 100%)',
        'gradient-cloudy-dark': 'linear-gradient(135deg, #020617 0%, #0f172a 25%, #1e293b 50%, #334155 75%, #475569 100%)',
        
        'gradient-rainy': 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 25%, #bfdbfe 50%, #93c5fd 75%, #60a5fa 100%)',
        'gradient-rainy-dark': 'linear-gradient(135deg, #172554 0%, #1e3a8a 25%, #1e40af 50%, #1d4ed8 75%, #2563eb 100%)',
        
        'gradient-stormy': 'linear-gradient(135deg, #eef2ff 0%, #e0e7ff 25%, #c7d2fe 50%, #a5b4fc 75%, #818cf8 100%)',
        'gradient-stormy-dark': 'linear-gradient(135deg, #1e1b4b 0%, #312e81 25%, #3730a3 50%, #4338ca 75%, #4f46e5 100%)',
        
        'gradient-misty': 'linear-gradient(135deg, #fafafa 0%, #f4f4f5 25%, #e4e4e7 50%, #d4d4d8 75%, #a1a1aa 100%)',
        'gradient-misty-dark': 'linear-gradient(135deg, #09090b 0%, #18181b 25%, #27272a 50%, #3f3f46 75%, #52525b 100%)',
        
        'gradient-clear': 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 25%, #bae6fd 50%, #7dd3fc 75%, #38bdf8 100%)',
        'gradient-clear-dark': 'linear-gradient(135deg, #082f49 0%, #0c4a6e 25%, #075985 50%, #0369a1 75%, #0284c7 100%)',
        
        // Dynamic weather gradients
        'gradient-weather-day': 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 20%, #bae6fd 40%, #fef3c7 60%, #fde68a 80%, #fcd34d 100%)',
        'gradient-weather-night': 'linear-gradient(135deg, #082f49 0%, #0c4a6e 20%, #1e293b 40%, #312e81 60%, #1e1b4b 80%, #020617 100%)',
        
        'gradient-weather-dawn': 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 25%, #fde68a 50%, #f0f9ff 75%, #e0f2fe 100%)',
        'gradient-weather-dusk': 'linear-gradient(135deg, #450a0a 0%, #78350f 25%, #312e81 50%, #0c4a6e 75%, #082f49 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'float': 'cloudDrift 3s ease-in-out infinite',
        'gradient-shift': 'gradientShift 8s ease-in-out infinite',
        'weather-glow': 'stormPulse 3s ease-in-out infinite',
        'weather-aurora': 'weatherAurora 15s ease-in-out infinite',
        'cloud-drift': 'cloudDrift 20s ease-in-out infinite',
        'rain-drop': 'rainDrop 3s ease-in-out infinite',
        'wind-flow': 'windFlow 8s ease-in-out infinite',
        'storm-pulse': 'stormPulse 4s ease-in-out infinite',
        'weather-shimmer': 'weatherShimmer 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        gradientShift: {
          '0%, 100%': { 
            backgroundPosition: '0% 50%',
            filter: 'hue-rotate(0deg)'
          },
          '25%': { 
            backgroundPosition: '100% 0%',
            filter: 'hue-rotate(90deg)'
          },
          '50%': { 
            backgroundPosition: '100% 100%',
            filter: 'hue-rotate(180deg)'
          },
          '75%': { 
            backgroundPosition: '0% 100%',
            filter: 'hue-rotate(270deg)'
          },
        },
      },
      backdropBlur: {
        'xs': '2px',
        'sm': '4px',
        'md': '12px',
        'lg': '16px',
        'xl': '24px',
        '2xl': '40px',
        '3xl': '64px',
      },
      boxShadow: {
        'weather-glow': '0 0 20px rgba(59, 130, 246, 0.3)',
        'weather-glow-lg': '0 0 40px rgba(59, 130, 246, 0.4)',
        'storm-shadow': '0 0 30px rgba(99, 102, 241, 0.5), 0 0 60px rgba(79, 70, 229, 0.3)',
        'sun-shadow': '0 0 25px rgba(251, 191, 36, 0.4), 0 0 50px rgba(245, 158, 11, 0.3)',
        'cloud-shadow': '0 0 35px rgba(148, 163, 184, 0.3), 0 10px 30px rgba(203, 213, 225, 0.2)',
        'rain-shadow': '0 0 20px rgba(59, 130, 246, 0.4), 0 5px 15px rgba(14, 165, 233, 0.3)',
      },
    },
  },
  plugins: [],
};
