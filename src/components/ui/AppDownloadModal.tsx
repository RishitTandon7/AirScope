import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Smartphone, Download, QrCode, Share2, CheckCircle, 
  Wifi, Bell, Zap, Shield, ArrowRight, Plus, Home,
  Monitor, Tablet, HelpCircle, Star, Gift
} from 'lucide-react';
import { Card } from './Card';
import { InteractiveButton } from './InteractiveButton';
import { useTheme } from '../../contexts/ThemeContext';
import { usePWA } from '../../hooks/usePWA';

interface AppDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AppDownloadModal: React.FC<AppDownloadModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'install' | 'instructions' | 'share'>('install');
  const [isInstalling, setIsInstalling] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [deviceType, setDeviceType] = useState<'mobile' | 'desktop' | 'tablet'>('mobile');
  const { isDark } = useTheme();
  const { isInstallable, isInstalled, installApp, shareApp } = usePWA();

  useEffect(() => {
    // Detect device type
    const detectDevice = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
      const isTablet = /ipad|tablet/i.test(userAgent);
      
      if (isTablet) return 'tablet';
      if (isMobile) return 'mobile';
      return 'desktop';
    };

    setDeviceType(detectDevice());
  }, []);

  const handleInstall = async () => {
    if (!isInstallable) {
      // Show manual instructions instead
      setActiveTab('instructions');
      return;
    }

    setIsInstalling(true);
    try {
      const success = await installApp();
      if (success) {
        setShowSuccess(true);
        setTimeout(() => {
          onClose();
        }, 3000);
      }
    } catch (error) {
      console.error('Installation failed:', error);
      // Fallback to instructions
      setActiveTab('instructions');
    } finally {
      setIsInstalling(false);
    }
  };

  const handleShare = async () => {
    const success = await shareApp();
    if (success && !navigator.share) {
      // Show copied to clipboard message
      const toast = document.createElement('div');
      toast.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} border`;
      toast.innerHTML = `
        <div class="flex items-center gap-3">
          <div class="w-4 h-4 text-green-500">✓</div>
          <span>Link copied to clipboard!</span>
        </div>
      `;
      document.body.appendChild(toast);
      
      setTimeout(() => {
        toast.remove();
      }, 3000);
    }
  };

  const getDeviceIcon = () => {
    switch (deviceType) {
      case 'tablet': return Tablet;
      case 'desktop': return Monitor;
      default: return Smartphone;
    }
  };

  const getInstallInstructions = () => {
    switch (deviceType) {
      case 'mobile':
        return {
          title: '📱 Install on Mobile',
          steps: [
            'Tap the Share button in your browser',
            'Select "Add to Home Screen"',
            'Tap "Add" to confirm installation',
            'Find AirScope on your home screen!'
          ],
          note: 'Works on iOS Safari, Chrome, Edge, and Firefox'
        };
      case 'desktop':
        return {
          title: '💻 Install on Desktop',
          steps: [
            'Look for the install icon ⊕ in your address bar',
            'Click it and select "Install AirScope"',
            'Or use browser menu → "Install AirScope"',
            'Access from desktop or start menu!'
          ],
          note: 'Works on Chrome, Edge, and other modern browsers'
        };
      case 'tablet':
        return {
          title: '📟 Install on Tablet',
          steps: [
            'Tap the browser menu (⋮)',
            'Select "Add to Home Screen" or "Install"',
            'Confirm the installation',
            'Launch from your tablet home screen!'
          ],
          note: 'Available on iPad, Android tablets, and Surface'
        };
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
            className="relative max-w-md w-full"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <Card variant="premium" className="shadow-2xl overflow-hidden">
              {/* Success State */}
              <AnimatePresence>
                {showSuccess && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-600 z-20 flex items-center justify-center"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                  >
                    <div className="text-center text-white">
                      <motion.div
                        animate={{ scale: [1, 1.2, 1], rotate: [0, 360] }}
                        transition={{ duration: 1 }}
                      >
                        <CheckCircle size={64} />
                      </motion.div>
                      <h3 className="text-2xl font-bold mt-4">Successfully Installed!</h3>
                      <p className="mt-2">AirScope is now on your device</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <motion.div
                    className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center"
                    animate={{
                      boxShadow: [
                        '0 0 20px rgba(59,130,246,0.3)',
                        '0 0 30px rgba(59,130,246,0.5)',
                        '0 0 20px rgba(59,130,246,0.3)'
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Smartphone className="text-white" size={24} />
                  </motion.div>
                  <div>
                    <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                      {isInstalled ? 'App Ready!' : 'Get AirScope App'}
                    </h3>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {isInstalled ? 'Already installed' : 'Progressive Web App'}
                    </p>
                  </div>
                </div>
                
                <motion.button
                  onClick={onClose}
                  className={`p-2 rounded-full transition-colors ${isDark ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X size={20} />
                </motion.button>
              </div>

              {/* Already Installed State */}
              {isInstalled ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center space-y-6"
                >
                  <motion.div
                    className="w-20 h-20 mx-auto bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center"
                    animate={{
                      scale: [1, 1.05, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <CheckCircle className="text-white" size={40} />
                  </motion.div>
                  
                  <div>
                    <h4 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>AirScope is Ready!</h4>
                    <p className={`text-sm mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      The app is installed on your device. Look for the AirScope icon on your home screen.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <InteractiveButton
                      onClick={handleShare}
                      variant="secondary"
                      size="lg"
                      icon={Share2}
                      className="w-full"
                    >
                      Share with Friends
                    </InteractiveButton>
                    
                    <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      ✨ Enjoying AirScope? Share it with others!
                    </div>
                  </div>
                </motion.div>
              ) : (
                /* Installation Flow */
                <>
                  {/* Tab Navigation */}
                  <div className={`flex gap-2 mb-6 p-1 rounded-xl ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    {[
                      { id: 'install', label: 'Install', icon: Download },
                      { id: 'instructions', label: 'How To', icon: HelpCircle },
                      { id: 'share', label: 'Share', icon: Share2 }
                    ].map((tab) => (
                      <motion.button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`
                          flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-300
                          ${activeTab === tab.id 
                            ? `${isDark ? 'bg-gray-600 text-white' : 'bg-white text-blue-600'} shadow-sm` 
                            : `${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-800'}`
                          }
                        `}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <tab.icon size={16} />
                        {tab.label}
                      </motion.button>
                    ))}
                  </div>

                  {/* Tab Content */}
                  <AnimatePresence mode="wait">
                    {activeTab === 'install' && (
                      <motion.div
                        key="install"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-6"
                      >
                        {/* Why Install Section */}
                        <div className={`p-4 rounded-2xl ${isDark ? 'bg-blue-900/30' : 'bg-blue-50'} border ${isDark ? 'border-blue-700' : 'border-blue-200'}`}>
                          <div className="flex items-center gap-2 mb-3">
                            <Gift className={`${isDark ? 'text-blue-400' : 'text-blue-600'}`} size={20} />
                            <span className={`font-bold ${isDark ? 'text-blue-400' : 'text-blue-700'}`}>Why Install?</span>
                          </div>
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div className={`flex items-center gap-2 ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>
                              <Wifi size={16} />
                              <span>Works offline</span>
                            </div>
                            <div className={`flex items-center gap-2 ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>
                              <Bell size={16} />
                              <span>Push alerts</span>
                            </div>
                            <div className={`flex items-center gap-2 ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>
                              <Zap size={16} />
                              <span>Faster loading</span>
                            </div>
                            <div className={`flex items-center gap-2 ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>
                              <Home size={16} />
                              <span>Home screen</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Install Button */}
                        <InteractiveButton
                          onClick={handleInstall}
                          variant="primary"
                          size="lg"
                          icon={isInstallable ? Download : Plus}
                          loading={isInstalling}
                          className="w-full"
                        >
                          {isInstalling ? 'Installing...' : 
                           isInstallable ? 'Install Now (1-Click)' : 
                           'Add to Home Screen'}
                        </InteractiveButton>

                        {/* Additional Info */}
                        <div className={`text-center space-y-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          <div className="flex items-center justify-center gap-2 text-sm">
                            <Shield size={16} className="text-green-500" />
                            <span>100% Safe & Secure</span>
                          </div>
                          <div className="text-xs space-y-1">
                            <p>• No app store required • Updates automatically</p>
                            <p>• Works on all devices • Free forever</p>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {activeTab === 'instructions' && (
                      <motion.div
                        key="instructions"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-6"
                      >
                        {(() => {
                          const instructions = getInstallInstructions();
                          const DeviceIcon = getDeviceIcon();
                          
                          return (
                            <>
                              <div className="text-center">
                                <motion.div
                                  className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}
                                  animate={{
                                    scale: [1, 1.05, 1],
                                  }}
                                  transition={{ duration: 2, repeat: Infinity }}
                                >
                                  <DeviceIcon size={32} className={isDark ? 'text-gray-400' : 'text-gray-600'} />
                                </motion.div>
                                <h4 className={`font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                                  {instructions.title}
                                </h4>
                              </div>

                              <div className="space-y-3">
                                {instructions.steps.map((step, index) => (
                                  <motion.div
                                    key={index}
                                    className={`flex items-start gap-3 p-3 rounded-xl ${isDark ? 'bg-gray-700/50' : 'bg-gray-50'}`}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                  >
                                    <div className="w-6 h-6 rounded-full bg-blue-500 text-white text-sm flex items-center justify-center font-bold flex-shrink-0">
                                      {index + 1}
                                    </div>
                                    <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                      {step}
                                    </span>
                                  </motion.div>
                                ))}
                              </div>

                              <div className={`p-3 rounded-xl text-xs text-center ${isDark ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-50 text-blue-700'}`}>
                                {instructions.note}
                              </div>

                              <InteractiveButton
                                onClick={() => setActiveTab('install')}
                                variant="secondary"
                                size="lg"
                                icon={ArrowRight}
                                className="w-full"
                              >
                                Try Auto-Install First
                              </InteractiveButton>
                            </>
                          );
                        })()}
                      </motion.div>
                    )}

                    {activeTab === 'share' && (
                      <motion.div
                        key="share"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="text-center space-y-6"
                      >
                        <motion.div
                          className="w-20 h-20 mx-auto bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center"
                          animate={{
                            scale: [1, 1.05, 1],
                            rotate: [0, 5, -5, 0]
                          }}
                          transition={{ duration: 3, repeat: Infinity }}
                        >
                          <Share2 className="text-white" size={40} />
                        </motion.div>
                        
                        <div>
                          <h4 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>Share AirScope</h4>
                          <p className={`text-sm mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            Help others discover clean air monitoring and protect their health
                          </p>
                        </div>

                        <div className="space-y-4">
                          <InteractiveButton
                            onClick={handleShare}
                            variant="secondary"
                            size="lg"
                            icon={Share2}
                            className="w-full"
                          >
                            Share AirScope
                          </InteractiveButton>

                          <div className={`text-xs space-y-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            <div className="flex items-center justify-center gap-2">
                              <Star size={12} className="text-yellow-500" />
                              <span>Help others breathe cleaner air</span>
                            </div>
                            <p>Share with family, friends, and communities</p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              )}
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};