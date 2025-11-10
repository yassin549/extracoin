"use client";

import { useEffect, useState } from 'react';

type HapticType = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error';

/**
 * Hook for haptic feedback on mobile devices
 * Muted by default, can be enabled in user settings
 */
export function useHapticFeedback() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Check for vibration API support
    if (typeof window !== 'undefined' && 'navigator' in window) {
      const hasVibration = 'vibrate' in navigator;
      setIsSupported(hasVibration);
    }

    // Load preference from localStorage
    const savedPreference = localStorage.getItem('haptic-feedback-enabled');
    if (savedPreference !== null) {
      setIsEnabled(savedPreference === 'true');
    }
  }, []);

  const toggle = () => {
    const newValue = !isEnabled;
    setIsEnabled(newValue);
    localStorage.setItem('haptic-feedback-enabled', String(newValue));
  };

  const trigger = (type: HapticType = 'light') => {
    if (!isSupported || !isEnabled) return;

    // Vibration patterns (in milliseconds)
    const patterns: Record<HapticType, number | number[]> = {
      light: 10,
      medium: 20,
      heavy: 40,
      success: [10, 50, 10],
      warning: [20, 100, 20],
      error: [50, 100, 50],
    };

    const pattern = patterns[type];
    
    if (Array.isArray(pattern)) {
      navigator.vibrate(pattern);
    } else {
      navigator.vibrate(pattern);
    }
  };

  return {
    isSupported,
    isEnabled,
    toggle,
    trigger,
  };
}

/**
 * Haptic feedback for common UI interactions
 */
export function useUIHaptics() {
  const { trigger } = useHapticFeedback();

  return {
    onButtonPress: () => trigger('light'),
    onButtonRelease: () => trigger('medium'),
    onSuccess: () => trigger('success'),
    onError: () => trigger('error'),
    onWarning: () => trigger('warning'),
    onNavigation: () => trigger('light'),
    onToggle: () => trigger('medium'),
  };
}
