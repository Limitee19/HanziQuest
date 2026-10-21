import { useState, useEffect } from 'react';

export interface ResponsiveState {
  width: number;
  height: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

export function useResponsive(): ResponsiveState {
  const [state, setState] = useState<ResponsiveState>(() => {
    const width = typeof window !== 'undefined' ? window.innerWidth : 1200;
    const height = typeof window !== 'undefined' ? window.innerHeight : 800;
    return {
      width,
      height,
      isMobile: width < 600,
      isTablet: width >= 600 && width < 1024,
      isDesktop: width >= 1024,
    };
  });

  useEffect(() => {
    function handleResize() {
      const width = window.innerWidth;
      const height = window.innerHeight;
      setState({
        width,
        height,
        isMobile: width < 600,
        isTablet: width >= 600 && width < 1024,
        isDesktop: width >= 1024,
      });
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return state;
}
