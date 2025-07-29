import { memo, useMemo, useCallback } from 'react';

// Higher-order component for memoization with custom comparison
export const withMemo = (Component, compareProps) => {
  return memo(Component, compareProps);
};

// Memoized component wrapper with shallow comparison
export const MemoizedComponent = ({ children, deps = [] }) => {
  return useMemo(() => children, deps);
};

// Custom hook for memoized callbacks
export const useMemoizedCallback = (callback, deps) => {
  return useCallback(callback, deps);
};

// Custom hook for expensive calculations
export const useMemoizedValue = (factory, deps) => {
  return useMemo(factory, deps);
};

// Stable reference hook - maintains same reference across renders
export const useStableCallback = (callback) => {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;
  
  return useCallback((...args) => {
    return callbackRef.current(...args);
  }, []);
};

// Virtual scrolling helper for large lists
export const useVirtualization = (items, itemHeight, containerHeight) => {
  const [scrollTop, setScrollTop] = useState(0);
  
  return useMemo(() => {
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(
      startIndex + Math.ceil(containerHeight / itemHeight) + 1,
      items.length - 1
    );
    
    return {
      startIndex,
      endIndex,
      visibleItems: items.slice(startIndex, endIndex + 1),
      totalHeight: items.length * itemHeight,
      offsetY: startIndex * itemHeight,
      setScrollTop,
    };
  }, [items, itemHeight, containerHeight, scrollTop]);
};

// Debounced state hook
export const useDebouncedState = (initialValue, delay = 300) => {
  const [value, setValue] = useState(initialValue);
  const [debouncedValue, setDebouncedValue] = useState(initialValue);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  
  return [debouncedValue, setValue];
};
