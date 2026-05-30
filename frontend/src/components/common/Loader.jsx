import React from 'react';

const Loader = ({ text = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen" data-testid="loader">
      <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-700"></div>
      <p className="mt-4 text-gray-600">{text}</p>
    </div>
  );
};

export default Loader;
