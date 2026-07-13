import React from 'react';
import { motion } from 'framer-motion';

const AuroraBackground = ({ children, className = '' }) => {
  return (
    <div className={`relative flex flex-col min-h-screen bg-slate-900 overflow-hidden ${className}`}>
      {/* Background gradients container */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        
        <div className="absolute inset-0 bg-slate-900 opacity-90"></div>

        {/* Animated Aurora blobs */}
        <motion.div
          animate={{
            transform: [
              'translate(0%, 0%) scale(1)',
              'translate(5%, -5%) scale(1.05)',
              'translate(-5%, 5%) scale(0.95)',
              'translate(0%, 0%) scale(1)',
            ],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full mix-blend-screen filter blur-[100px] bg-emerald-500/20"
        />

        <motion.div
          animate={{
            transform: [
              'translate(0%, 0%) scale(1)',
              'translate(-5%, 10%) scale(1.1)',
              'translate(5%, -10%) scale(0.9)',
              'translate(0%, 0%) scale(1)',
            ],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          className="absolute top-[30%] -right-[10%] w-[40%] h-[60%] rounded-full mix-blend-screen filter blur-[120px] bg-teal-500/20"
        />

        <motion.div
          animate={{
            transform: [
              'translate(0%, 0%) scale(1)',
              'translate(10%, 5%) scale(1.1)',
              'translate(-10%, -5%) scale(0.95)',
              'translate(0%, 0%) scale(1)',
            ],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4,
          }}
          className="absolute -bottom-[20%] left-[20%] w-[60%] h-[50%] rounded-full mix-blend-screen filter blur-[100px] bg-emerald-700/20"
        />
        
        {/* Subtle noise texture overlay */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full h-full flex-grow">
        {children}
      </div>
    </div>
  );
};

export default AuroraBackground;
