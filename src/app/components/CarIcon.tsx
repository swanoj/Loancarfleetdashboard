import React from 'react';

interface CarIconProps {
  model: string;
  className?: string;
}

export function CarIcon({ model, className = "w-6 h-6" }: CarIconProps) {
  const getCarSVG = () => {
    // Determine car type based on model
    const modelLower = model.toLowerCase();
    
    if (modelLower.includes('hilux')) {
      // Pickup Truck
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
          <path d="M17,5H15V3H9V5H7A2,2 0 0,0 5,7V15A2,2 0 0,0 7,17H8.33A2.5,2.5 0 0,0 10.5,19A2.5,2.5 0 0,0 12.67,17H15.33A2.5,2.5 0 0,0 17.5,19A2.5,2.5 0 0,0 19.67,17H21A2,2 0 0,0 23,15V11.67C23,11.24 22.84,10.82 22.54,10.5L19.5,7.37C19.19,7.05 18.77,6.89 18.34,6.89H17V5M7,7H15V11H7V7M17,8.5H18.34L20.84,11H17V8.5M10.5,13.5A1.5,1.5 0 0,1 12,15A1.5,1.5 0 0,1 10.5,16.5A1.5,1.5 0 0,1 9,15A1.5,1.5 0 0,1 10.5,13.5M17.5,13.5A1.5,1.5 0 0,1 19,15A1.5,1.5 0 0,1 17.5,16.5A1.5,1.5 0 0,1 16,15A1.5,1.5 0 0,1 17.5,13.5Z" />
        </svg>
      );
    } else if (modelLower.includes('rav4') || modelLower.includes('kluger')) {
      // SUV
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
          <path d="M18.92,6.01C18.72,5.42 18.16,5 17.5,5H15V3H9V5H6.5C5.84,5 5.29,5.42 5.08,6.01L3,12V20C3,20.55 3.45,21 4,21H5C5.55,21 6,20.55 6,20V19H18V20C18,20.55 18.45,21 19,21H20C20.55,21 21,20.55 21,20V12L18.92,6.01M6.5,16C5.67,16 5,15.33 5,14.5C5,13.67 5.67,13 6.5,13C7.33,13 8,13.67 8,14.5C8,15.33 7.33,16 6.5,16M17.5,16C16.67,16 16,15.33 16,14.5C16,13.67 16.67,13 17.5,13C18.33,13 19,13.67 19,14.5C19,15.33 18.33,16 17.5,16M5,11L6.5,6.5H17.5L19,11H5Z" />
        </svg>
      );
    } else if (modelLower.includes('corolla')) {
      // Compact Car
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
          <path d="M5,11L6.5,6.5H17.5L19,11M17.5,16A1.5,1.5 0 0,1 16,14.5A1.5,1.5 0 0,1 17.5,13A1.5,1.5 0 0,1 19,14.5A1.5,1.5 0 0,1 17.5,16M6.5,16A1.5,1.5 0 0,1 5,14.5A1.5,1.5 0 0,1 6.5,13A1.5,1.5 0 0,1 8,14.5A1.5,1.5 0 0,1 6.5,16M18.92,6C18.72,5.42 18.16,5 17.5,5H6.5C5.84,5 5.29,5.42 5.08,6L3,12V20A1,1 0 0,0 4,21H5A1,1 0 0,0 6,20V19H18V20A1,1 0 0,0 19,21H20A1,1 0 0,0 21,20V12L18.92,6Z" />
        </svg>
      );
    } else {
      // Default Sedan (Camry)
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
          <path d="M5,11L6.5,6.5H17.5L19,11M17.5,16A1.5,1.5 0 0,1 16,14.5A1.5,1.5 0 0,1 17.5,13A1.5,1.5 0 0,1 19,14.5A1.5,1.5 0 0,1 17.5,16M6.5,16A1.5,1.5 0 0,1 5,14.5A1.5,1.5 0 0,1 6.5,13A1.5,1.5 0 0,1 8,14.5A1.5,1.5 0 0,1 6.5,16M18.92,6C18.72,5.42 18.16,5 17.5,5H6.5C5.84,5 5.29,5.42 5.08,6L3,12V20A1,1 0 0,0 4,21H5A1,1 0 0,0 6,20V19H18V20A1,1 0 0,0 19,21H20A1,1 0 0,0 21,20V12L18.92,6Z" />
        </svg>
      );
    }
  };

  return getCarSVG();
}
