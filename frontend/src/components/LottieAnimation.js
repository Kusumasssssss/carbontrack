import React from 'react';
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const LottieAnimation = ({ 
  src, 
  autoplay = true, 
  loop = true, 
  style = { width: '100%', height: '100%' },
  className = '' 
}) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <DotLottieReact
        src={src}
        autoplay={autoplay}
        loop={loop}
        style={style}
      />
    </div>
  );
};

export default LottieAnimation;
