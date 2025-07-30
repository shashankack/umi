import { useCallback, useRef } from 'react';

/**
 * Custom hook for throttling function calls
 * @param {Function} callback - Function to throttle
 * @param {number} delay - Throttle delay in milliseconds
 * @returns {Function} Throttled function
 */
export const useThrottled = (callback, delay = 100) => {
  const lastCallTime = useRef(0);
  const timeoutRef = useRef(null);

  return useCallback((...args) => {
    const now = Date.now();
    
    if (now - lastCallTime.current >= delay) {
      lastCallTime.current = now;
      callback(...args);
    } else {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        lastCallTime.current = Date.now();
        callback(...args);
      }, delay - (now - lastCallTime.current));
    }
  }, [callback, delay]);
};

/**
 * Custom hook for debouncing function calls
 * @param {Function} callback - Function to debounce
 * @param {number} delay - Debounce delay in milliseconds
 * @returns {Function} Debounced function
 */
export const useDebounced = (callback, delay = 300) => {
  const timeoutRef = useRef(null);

  return useCallback((...args) => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  }, [callback, delay]);
};

/**
 * Custom hook for request animation frame throttling
 * @param {Function} callback - Function to throttle with RAF
 * @returns {Function} RAF throttled function
 */
export const useRAFThrottle = (callback) => {
  const rafRef = useRef(null);
  const isScheduled = useRef(false);

  return useCallback((...args) => {
    if (!isScheduled.current) {
      isScheduled.current = true;
      rafRef.current = requestAnimationFrame(() => {
        callback(...args);
        isScheduled.current = false;
      });
    }
  }, [callback]);
};
