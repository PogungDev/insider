'use client';

import { useEffect, useState } from 'react';

export default function AppLoading() {
  const [loadingText, setLoadingText] = useState('Loading application...');
  const [loadingDots, setLoadingDots] = useState('');

  useEffect(() => {
    // Animate loading dots
    const interval = setInterval(() => {
      setLoadingDots(prev => {
        if (prev.length >= 3) return '';
        return prev + '.';
      });
    }, 500);

    // Update loading message after delay
    const timeout = setTimeout(() => {
      setLoadingText('Initializing web3');
    }, 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center space-y-6 p-8 max-w-md text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <p className="text-lg font-medium">{loadingText}{loadingDots}</p>
      </div>
    </div>
  );
}
