"use client";

import { useState, useEffect } from 'react';

/**
 * Hook for scroll-linked progress tracking
 * Returns progress from 0 to 1 as user scrolls
 */
export function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      
      // Calculate progress (0 to 1)
      const maxScroll = documentHeight - windowHeight;
      const currentProgress = maxScroll > 0 ? scrollTop / maxScroll : 0;
      
      setProgress(currentProgress);
      setScrollY(scrollTop);
    };

    // Initial call
    handleScroll();

    // Passive listener for better performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return { progress, scrollY };
}

/**
 * Hook for element-specific scroll progress
 */
export function useElementScrollProgress(elementId: string) {
  const [progress, setProgress] = useState(0);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const element = document.getElementById(elementId);
    if (!element) return;

    const handleScroll = () => {
      const rect = element.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Check if element is in viewport
      const inView = rect.top < windowHeight && rect.bottom > 0;
      setIsInView(inView);
      
      if (inView) {
        // Calculate progress through the element
        const elementTop = rect.top;
        const elementHeight = rect.height;
        const visibleHeight = Math.min(
          windowHeight - Math.max(elementTop, 0),
          elementHeight
        );
        const elementProgress = visibleHeight / elementHeight;
        setProgress(Math.max(0, Math.min(1, elementProgress)));
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [elementId]);

  return { progress, isInView };
}
