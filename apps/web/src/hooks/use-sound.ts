"use client";

import { useEffect, useState, useCallback } from 'react';

type SoundType = 'click' | 'hover' | 'success' | 'error' | 'notification' | 'whoosh';

/**
 * Hook for UI sound effects
 * Muted by default, can be enabled in user settings
 */
export function useSound() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);

  useEffect(() => {
    // Initialize Web Audio API
    if (typeof window !== 'undefined' && 'AudioContext' in window) {
      const ctx = new AudioContext();
      setAudioContext(ctx);
    }

    // Load preferences from localStorage
    const savedEnabled = localStorage.getItem('sound-effects-enabled');
    const savedVolume = localStorage.getItem('sound-effects-volume');
    
    if (savedEnabled !== null) {
      setIsEnabled(savedEnabled === 'true');
    }
    
    if (savedVolume !== null) {
      setVolume(parseFloat(savedVolume));
    }

    return () => {
      audioContext?.close();
    };
  }, []);

  const toggle = () => {
    const newValue = !isEnabled;
    setIsEnabled(newValue);
    localStorage.setItem('sound-effects-enabled', String(newValue));
  };

  const setVolumeLevel = (level: number) => {
    const clampedVolume = Math.max(0, Math.min(1, level));
    setVolume(clampedVolume);
    localStorage.setItem('sound-effects-volume', String(clampedVolume));
  };

  const play = useCallback((type: SoundType) => {
    if (!isEnabled || !audioContext) return;

    // Generate simple tones using Web Audio API
    // In production, you'd load actual audio files
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Configure sound based on type
    const soundConfig: Record<SoundType, { frequency: number; duration: number; type: OscillatorType }> = {
      click: { frequency: 800, duration: 0.05, type: 'sine' },
      hover: { frequency: 600, duration: 0.03, type: 'sine' },
      success: { frequency: 1000, duration: 0.15, type: 'sine' },
      error: { frequency: 300, duration: 0.2, type: 'sawtooth' },
      notification: { frequency: 900, duration: 0.1, type: 'sine' },
      whoosh: { frequency: 500, duration: 0.2, type: 'sawtooth' },
    };

    const config = soundConfig[type];
    
    oscillator.frequency.value = config.frequency;
    oscillator.type = config.type;
    
    gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + config.duration);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + config.duration);
  }, [isEnabled, audioContext, volume]);

  return {
    isEnabled,
    volume,
    toggle,
    setVolume: setVolumeLevel,
    play,
  };
}

/**
 * UI sound effects for common interactions
 */
export function useUISounds() {
  const { play } = useSound();

  return {
    onClick: () => play('click'),
    onHover: () => play('hover'),
    onSuccess: () => play('success'),
    onError: () => play('error'),
    onNotification: () => play('notification'),
    onTransition: () => play('whoosh'),
  };
}
