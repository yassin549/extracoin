"use client";

import { useState, useEffect } from 'react';

interface DeviceOrientation {
  alpha: number | null; // Z-axis rotation (0-360)
  beta: number | null;  // X-axis rotation (-180 to 180)
  gamma: number | null; // Y-axis rotation (-90 to 90)
}

interface DeviceMotion {
  acceleration: {
    x: number | null;
    y: number | null;
    z: number | null;
  };
  rotationRate: {
    alpha: number | null;
    beta: number | null;
    gamma: number | null;
  };
}

/**
 * Hook for gyroscope/device orientation
 * Mobile-first: adds subtle parallax effects based on device tilt
 */
export function useDeviceOrientation() {
  const [orientation, setOrientation] = useState<DeviceOrientation>({
    alpha: null,
    beta: null,
    gamma: null,
  });
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');

  useEffect(() => {
    // Check if DeviceOrientation is supported
    if (typeof window !== 'undefined' && 'DeviceOrientationEvent' in window) {
      setIsSupported(true);
    }
  }, []);

  const requestPermission = async () => {
    if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      try {
        const permissionState = await (DeviceOrientationEvent as any).requestPermission();
        setPermission(permissionState);
        return permissionState === 'granted';
      } catch (error) {
        console.error('Error requesting device orientation permission:', error);
        return false;
      }
    } else {
      // Permission not required (non-iOS 13+ devices)
      setPermission('granted');
      return true;
    }
  };

  useEffect(() => {
    if (!isSupported || permission !== 'granted') return;

    const handleOrientation = (event: DeviceOrientationEvent) => {
      setOrientation({
        alpha: event.alpha,
        beta: event.beta,
        gamma: event.gamma,
      });
    };

    window.addEventListener('deviceorientation', handleOrientation, { passive: true });
    
    return () => window.removeEventListener('deviceorientation', handleOrientation);
  }, [isSupported, permission]);

  return { orientation, isSupported, permission, requestPermission };
}

/**
 * Hook for device motion (accelerometer)
 */
export function useDeviceMotion() {
  const [motion, setMotion] = useState<DeviceMotion>({
    acceleration: { x: null, y: null, z: null },
    rotationRate: { alpha: null, beta: null, gamma: null },
  });
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'DeviceMotionEvent' in window) {
      setIsSupported(true);
    }
  }, []);

  useEffect(() => {
    if (!isSupported) return;

    const handleMotion = (event: DeviceMotionEvent) => {
      setMotion({
        acceleration: {
          x: event.acceleration?.x ?? null,
          y: event.acceleration?.y ?? null,
          z: event.acceleration?.z ?? null,
        },
        rotationRate: {
          alpha: event.rotationRate?.alpha ?? null,
          beta: event.rotationRate?.beta ?? null,
          gamma: event.rotationRate?.gamma ?? null,
        },
      });
    };

    window.addEventListener('devicemotion', handleMotion, { passive: true });
    
    return () => window.removeEventListener('devicemotion', handleMotion);
  }, [isSupported]);

  return { motion, isSupported };
}

/**
 * Hook for parallax effect based on device tilt
 * Returns transform values for subtle 3D effects
 */
export function useGyroscopeParallax(intensity: number = 1) {
  const { orientation } = useDeviceOrientation();
  const [transform, setTransform] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (orientation.beta !== null && orientation.gamma !== null) {
      // Normalize and scale the tilt
      // Beta: -180 to 180 (forward/backward tilt)
      // Gamma: -90 to 90 (left/right tilt)
      const x = (orientation.gamma / 90) * 20 * intensity;
      const y = (orientation.beta / 180) * 20 * intensity;
      
      setTransform({ x, y });
    }
  }, [orientation, intensity]);

  return transform;
}
