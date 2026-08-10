import React from 'react';
import { motion } from 'framer-motion';

const AuroraBackground = ({ children, className = '' }) => {
  return (
    <div className={`relative flex flex-col min-h-screen bg-surface-base overflow-hidden ${className}`}>
      {/* Background gradients container */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">

        {/* Animated Aurora blobs — multiply blend so they read as soft tints on white */}
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
          className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full mix-blend-multiply filter blur-[100px] bg-brand-200/40"
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
          className="absolute top-[30%] -right-[10%] w-[40%] h-[60%] rounded-full mix-blend-multiply filter blur-[120px] bg-teal-200/40"
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
          className="absolute -bottom-[20%] left-[20%] w-[60%] h-[50%] rounded-full mix-blend-multiply filter blur-[100px] bg-brand-100/40"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full h-full flex-grow">
        {children}
      </div>
    </div>
  );
};

export default AuroraBackground;
