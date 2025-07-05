import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Smartphone, Zap } from 'lucide-react';
import { usePWA } from '../../hooks/usePWA';
import { useTheme } from '../../contexts/ThemeContext';
import { InteractiveButton } from './InteractiveButton';

export const PWAInstallBanner: React.FC = () => {
  const { isDark } = useTheme();
  const { isInstallable, isInstalled, installApp } = usePWA();
  const [isVisible, setIsVisible] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  useEffect(() => {
    // Only show in production and if conditions are met
    const isProd = window.location.hostname !== 'localhost' && 
                   !window.location.hostname.includes('stackblitz') &&
                   !window.location.hostname.includes('webcontainer');
    
    if (isProd && isInstallable && !isInstalled) {
      // Delay showing to avoid immediate popup
      const timer = setTimeout(() => {
        const dismissed = localStorage.getItem('airscope-install-banner-dismissed');
        if (!dismissed) {
          setIsVisible(true);
        }
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isInstallable, isInstalled]);

  const handleInstall = async () => {
    setIsInstalling(true);
    try {
      const success = await installApp();
      if (success) {
        setIsVisible(false);
      }
    } catch (error) {
      console.error('Install failed:', error);
    } finally {
      setIsInstalling(false);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('airscope-install-banner-dismissed', 'true');
  };

  if (!isVisible) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed bottom-24 left-4 right-4 z-40 md:left-auto md:right-4 md:max-w-sm"
        initial={{ opacity: 0, y: 100, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 100, scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <div className={`
          rounded-3xl p-6 shadow-2xl border backdrop-blur-xl transition-all duration-500
          ${isDark 
            ? 'bg-gradient-to-br from-pastel-lavender-800/95 via-pastel-sky-800/90 to-pastel-mint-800/95 border-pastel-lavender-700/40' 
            : 'bg-gradient-to-br from-white/95 via-pastel-lavender-50/90 to-pastel-sky-50/95 border-pastel-lavender-200/40'
          }
        `}>
          {/* Close button */}
          <motion.button
            onClick={handleDismiss}
            className={`
              absolute top-3 right-3 p-2 rounded-full transition-colors
              ${isDark ? 'hover:bg-pastel-lavender-700/50 text-pastel-lavender-300' : 'hover:bg-pastel-lavender-100 text-pastel-lavender-600'}
            `}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <X size={16} />
          </motion.button>

          <div className="flex items-start gap-4">
            {/* App icon */}
            <motion.div
              className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pastel-lavender-500 to-pastel-sky-600 flex items-center justify-center flex-shrink-0 shadow-lg"
              animate={{
                boxShadow: [
                  '0 0 20px rgba(168,85,247,0.4)',
                  '0 0 30px rgba(168,85,247,0.6)',
                  '0 0 20px rgba(168,85,247,0.4)'
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Smartphone className="text-white" size={32} />
            </motion.div>

            <div className="flex-1 min-w-0">
              <h4 className={`font-bold text-lg mb-2 transition-colors duration-500 ${isDark ? 'text-white' : 'text-pastel-lavender-800'}`}>
                Install AirScope
              </h4>
              <p className={`text-sm mb-4 leading-relaxed transition-colors duration-500 ${isDark ? 'text-pastel-lavender-300' : 'text-pastel-lavender-600'}`}>
                Get instant access, offline support, and native app experience
              </p>

              {/* Features */}
              <div className="space-y-2 mb-4">
                <div className={`flex items-center gap-2 text-xs transition-colors duration-500 ${isDark ? 'text-pastel-lavender-200' : 'text-pastel-lavender-700'}`}>
                  <Zap size={12} className="text-pastel-mint-500" />
                  <span>Works offline</span>
                </div>
                <div className={`flex items-center gap-2 text-xs transition-colors duration-500 ${isDark ? 'text-pastel-lavender-200' : 'text-pastel-lavender-700'}`}>
                  <Zap size={12} className="text-pastel-mint-500" />
                  <span>Home screen access</span>
                </div>
              </div>

              <InteractiveButton
                onClick={handleInstall}
                variant="pastel"
                size="md"
                icon={Download}
                loading={isInstalling}
                className="w-full"
              >
                {isInstalling ? 'Installing...' : 'Install App'}
              </InteractiveButton>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};