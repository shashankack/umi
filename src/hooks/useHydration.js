import { useState, useEffect } from 'react';

/**
 * Custom hook to handle hydration and prevent SSR mismatches
 * @returns {boolean} Whether the component has been hydrated
 */
export const useHydration = () => {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return isHydrated;
};

/**
 * Custom hook for responsive breakpoints that handles hydration
 * @param {number} breakpoint - The breakpoint in pixels
 * @returns {boolean} Whether the screen is below the breakpoint
 */
export const useResponsive = (breakpoint = 768) => {
  const [isMobile, setIsMobile] = useState(false);
  const isHydrated = useHydration();

  useEffect(() => {
    if (!isHydrated) return;

    const updateMobile = () => {
      setIsMobile(window.innerWidth <= breakpoint);
    };

    // Set initial state
    updateMobile();

    // Add resize listener
    window.addEventListener('resize', updateMobile);
    return () => window.removeEventListener('resize', updateMobile);
  }, [breakpoint, isHydrated]);

  return isMobile;
};

/**
 * Custom hook for viewport dimensions that handles hydration
 * @returns {object} Viewport width and height
 */
export const useViewport = () => {
  const [viewport, setViewport] = useState({ width: 0, height: 0 });
  const isHydrated = useHydration();

  useEffect(() => {
    if (!isHydrated) return;

    const updateViewport = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // Set initial state
    updateViewport();

    // Add resize listener
    window.addEventListener('resize', updateViewport);
    return () => window.removeEventListener('resize', updateViewport);
  }, [isHydrated]);

  return { ...viewport, isHydrated };
};
