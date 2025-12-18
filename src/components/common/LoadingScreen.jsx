import React from 'react';
import { Loader } from 'lucide-react';
import './LoadingScreen.css';

const LoadingScreen = () => {
  return (
    <div className="loading-screen">
      <Loader className="spin-icon" size={48} />
    </div>
  );
};

export default LoadingScreen;
