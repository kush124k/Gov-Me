import * as React from 'react';

export const DigiLockerIcon = ({ size = 24, className = "" }) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 100 100" 
      width={size} 
      height={size} 
      className={className}
      fill="none"
    >
      {/* Cloud Shape - Blue */}
      <path 
        fill="#39A7F5" 
        d="M23.1 35.7C24.4 22.8 35.3 12.8 48.6 12.8c12.2 0 22.4 8.5 25 20 9.2 1.2 16.3 9.1 16.3 18.6 0 10.4-8.4 18.8-18.8 18.8H25c-9.3 0-16.9-7.6-16.9-16.9 0-8.6 6.5-15.8 15-16.9z"
      />
      {/* Checkmark - White */}
      <path 
        fill="#FFFFFF" 
        d="M45 55.6l-8.5-8.5-4.2 4.2 12.7 12.7 21.2-21.2-4.2-4.2L45 55.6z"
      />
    </svg>
  )
}