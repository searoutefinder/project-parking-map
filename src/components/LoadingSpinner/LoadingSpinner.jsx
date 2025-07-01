import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 bg-[#000000]/50 bg-opacity-50 flex items-center justify-center z-50">
      <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
};

export default LoadingSpinner;
