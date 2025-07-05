import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface PWAState {
  isInstallable: boolean;
  isInstalled: boolean;
  isStandalone: boolean;
  installPrompt: BeforeInstallPromptEvent | null;
  canInstall: boolean;
}

export const usePWA = () => {
  const [pwaState, setPWAState] = useState<PWAState>({
    isInstallable: false,
    isInstalled: false,
    isStandalone: false,
    installPrompt: null,
    canInstall: false,
  });

  useEffect(() => {
    // Check if running in standalone mode (already installed)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                        (window.navigator as any).standalone === true;

    // Check if already installed
    const isInstalled = isStandalone || 
                       localStorage.getItem('airscope-pwa-installed') === 'true';

    // Check if PWA can be installed (general capability)
    const canInstall = 'serviceWorker' in navigator && 
                      'PushManager' in window &&
                      'Notification' in window;

    setPWAState(prev => ({
      ...prev,
      isStandalone,
      isInstalled,
      canInstall,
    }));

    console.log('🔍 PWA State:', { isStandalone, isInstalled, canInstall });

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      console.log('🎯 PWA: Native install prompt available');
      e.preventDefault(); // Prevent the default install prompt
      
      const installEvent = e as BeforeInstallPromptEvent;
      setPWAState(prev => ({
        ...prev,
        isInstallable: true,
        installPrompt: installEvent,
      }));
    };

    // Listen for app installation
    const handleAppInstalled = () => {
      console.log('✅ PWA: App installed successfully');
      localStorage.setItem('airscope-pwa-installed', 'true');
      
      // Show success notification
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('AirScope Installed!', {
          body: 'AirScope is now installed on your device. Check your home screen!',
          icon: '/icons/icon-192x192.png',
        });
      }
      
      setPWAState(prev => ({
        ...prev,
        isInstalled: true,
        isInstallable: false,
        installPrompt: null,
      }));
    };

    // Listen for display mode changes (when app is installed)
    const displayModeQuery = window.matchMedia('(display-mode: standalone)');
    const handleDisplayModeChange = (e: MediaQueryListEvent) => {
      console.log('📱 PWA: Display mode changed to standalone:', e.matches);
      if (e.matches && !pwaState.isInstalled) {
        handleAppInstalled();
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    displayModeQuery.addEventListener('change', handleDisplayModeChange);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      displayModeQuery.removeEventListener('change', handleDisplayModeChange);
    };
  }, []);

  const installApp = async (): Promise<boolean> => {
    if (!pwaState.installPrompt) {
      console.warn('⚠️ PWA: No native install prompt available - will show manual instructions');
      return false;
    }

    try {
      console.log('🚀 PWA: Triggering native install prompt');
      await pwaState.installPrompt.prompt();
      
      const { outcome } = await pwaState.installPrompt.userChoice;
      console.log('🎯 PWA: Install outcome:', outcome);
      
      if (outcome === 'accepted') {
        setPWAState(prev => ({
          ...prev,
          isInstallable: false,
          installPrompt: null,
        }));
        
        // The 'appinstalled' event will handle the rest
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('❌ PWA: Install failed:', error);
      return false;
    }
  };

  const shareApp = async (): Promise<boolean> => {
    const shareData = {
      title: 'AirScope - Air Quality Monitoring',
      text: 'Monitor real-time air quality and protect your health with AirScope!',
      url: window.location.origin,
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        console.log('📤 PWA: Using native share');
        await navigator.share(shareData);
        return true;
      } catch (error) {
        console.log('Share cancelled or failed:', error);
        return false;
      }
    } else {
      // Fallback: copy to clipboard
      try {
        console.log('📋 PWA: Falling back to clipboard');
        const textToShare = `${shareData.title}\n${shareData.text}\n${shareData.url}`;
        await navigator.clipboard.writeText(textToShare);
        return true;
      } catch (error) {
        console.error('Failed to copy to clipboard:', error);
        // Final fallback: manual copy
        const textArea = document.createElement('textarea');
        textArea.value = shareData.url;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        return true;
      }
    }
  };

  const requestNotificationPermission = async (): Promise<boolean> => {
    if (!('Notification' in window)) {
      console.warn('⚠️ Notifications not supported');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission === 'denied') {
      return false;
    }

    const permission = await Notification.requestPermission();
    return permission === 'granted';
  };

  return {
    ...pwaState,
    installApp,
    shareApp,
    requestNotificationPermission,
  };
};