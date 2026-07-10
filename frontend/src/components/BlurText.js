import React, { useRef, useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';

const BlurText = ({
  text = '',
  delay = 200,
  className = '',
  animationFrom = { filter: 'blur(10px)', opacity: 0, transform: 'translate3d(0,-50px,0)' },
  animationTo = { filter: 'blur(0px)', opacity: 1, transform: 'translate3d(0,0,0)' },
  easing = 'easeOut',
  threshold = 0.1,
}) => {
  const words = text.split(' ');
  const controls = useAnimation();
  const containerRef = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          controls.start('visible');
          setHasAnimated(true);
        }
      },
      { threshold }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, [controls, hasAnimated, threshold]);

  return (
    <h1 ref={containerRef} className={`inline-block ${className}`}>
      {words.map((word, index) => (
        <motion.span
          key={index}
          className="inline-block mr-[0.25em]"
          initial="hidden"
          animate={controls}
          variants={{
            hidden: animationFrom,
            visible: {
              ...animationTo,
              transition: {
                duration: 0.8,
                ease: easing,
                delay: index * (delay / 1000),
              },
            },
          }}
        >
          {word}
        </motion.span>
      ))}
    </h1>
  );
};

export default BlurText;
