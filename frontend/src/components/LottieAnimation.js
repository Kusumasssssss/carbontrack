import React from 'react';
import { DotLottiePlayer } from '@dotlottie/react-player';
import '@dotlottie/react-player/dist/index.css';

const LottieAnimation = ({ 
  src, 
  autoplay = true, 
  loop = true, 
  style = { width: '100%', height: '100%' },
  className = '' 
}) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <DotLottiePlayer
        src={src}
        autoplay={autoplay}
        loop={loop}
        style={style}
      />
    </div>
  );
};

export default LottieAnimation;
