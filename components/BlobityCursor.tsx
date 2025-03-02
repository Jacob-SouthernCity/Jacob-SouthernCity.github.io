'use client';

import { useEffect, useState } from 'react';
import { useTheme } from '@/context/theme-context';

interface BlobityCursorProps {
  opacity?: number;
  lightModeColor?: string;
  darkModeColor?: string;
  size?: number;
  zIndex?: number;
}

const BlobityCursor = ({
  opacity = 0.6,
  lightModeColor = 'rgb(150, 150, 170)',
  darkModeColor = 'rgb(100, 110, 140)',
  size = 40,
  zIndex = 999,
}: BlobityCursorProps) => {
  const { theme } = useTheme();
  const [blobityInstance, setBlobityInstance] = useState<any>(null);

  // Effect to initialize Blobity
  useEffect(() => {
    // Load the Blobity script
    const script = document.createElement('script');
    script.src = 'https://cdn.blobity.gmrchk.com/by.js';
    script.async = true;
    
    script.onload = () => {
      // Check if Blobity is available
      if (typeof window.Blobity === 'function') {
        // Initialize Blobity with custom options
        const blobity = new window.Blobity({
          color: theme === 'light' ? lightModeColor : darkModeColor,
          opacity: opacity,
          size: size,
          zIndex: zIndex, 
          // Set to a high zIndex to ensure it's above all other elements
          focusableElements: '[data-blobity], a:not([data-no-blobity]), button:not([data-no-blobity]), [data-blobity-tooltip]',
          // Make the cursor slightly transparent
          magnetic: true,
          dotColor: theme === 'light' ? 'rgba(100, 100, 110, 0.6)' : 'rgba(180, 180, 190, 0.6)',
          dotSize: 8,
          // Reduce magnetic pull strength a bit
          magnitudeMagneticForce: 0.5,
        });

        // Store the instance
        setBlobityInstance(blobity);
      }
    };
    
    document.body.appendChild(script);

    // Cleanup function
    return () => {
      // Clean up Blobity instance
      if (blobityInstance) {
        try {
          // Attempt to clean up Blobity (if it provides a destroy method)
          if (typeof blobityInstance.destroy === 'function') {
            blobityInstance.destroy();
          }
        } catch (error) {
          console.error('Error cleaning up Blobity:', error);
        }
      }
      
      // Remove the script
      document.querySelectorAll('script[src="https://cdn.blobity.gmrchk.com/by.js"]')
        .forEach(script => script.remove());
      
      // Clean up any Blobity canvas elements
      document.querySelectorAll('canvas.blobity')
        .forEach(canvas => canvas.remove());
    };
  }, [opacity, size, zIndex]); // Don't include color in dependencies as we handle it separately

  // Effect to update color when theme changes
  useEffect(() => {
    if (blobityInstance) {
      try {
        blobityInstance.updateOptions({
          color: theme === 'light' ? lightModeColor : darkModeColor,
          dotColor: theme === 'light' ? 'rgba(100, 100, 110, 0.6)' : 'rgba(180, 180, 190, 0.6)',
        });
      } catch (error) {
        console.error('Error updating Blobity options:', error);
      }
    }
  }, [theme, lightModeColor, darkModeColor, blobityInstance]);

  // This component doesn't render anything visible itself
  return null;
};

// Add TypeScript interface for the window object to recognize Blobity
declare global {
  interface Window {
    Blobity: any;
  }
}

export default BlobityCursor;
