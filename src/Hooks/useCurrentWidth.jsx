"use client"
import { useState, useEffect } from 'react';

const getWidth = () => {
  if (typeof window !== 'undefined') {
    return (
      window.innerWidth ||
      (document.documentElement && document.documentElement.clientWidth) ||
      (document.body && document.body.clientWidth)
    );
  }
  return 0; // Return a default value for the server-side rendering case
};

export default function useCurrentWidth() {
  const [width, setWidth] = useState(getWidth());

  useEffect(() => {
    let timeoutId = null;
    const resizeListener = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => setWidth(getWidth()), 150);
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', resizeListener);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', resizeListener);
      }
    };
  }, []);

  return width;
}
