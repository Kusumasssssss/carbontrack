import React, { useRef, useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';

const SplitText = ({
  text = '',
  delay = 50,
  className = '',
  animationFrom = { opacity: 0, y: 40 },
  animationTo = { opacity: 1, y: 0 },
  easing = [0.1, 0.82, 0.165, 1], // easeOutQuint
  threshold = 0.1,
}) => {
  const words = text.split(' ').map((word) => word.split(''));
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
    <div ref={containerRef} className={`inline-block ${className}`}>
      {words.map((word, wordIndex) => (
        <span key={wordIndex} className="inline-block whitespace-nowrap mr-[0.25em]">
          {word.map((letter, letterIndex) => {
            const index = words
              .slice(0, wordIndex)
              .reduce((acc, w) => acc + w.length, 0) + letterIndex;

            return (
              <motion.span
                key={index}
                className="inline-block"
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
                {letter}
              </motion.span>
            );
          })}
        </span>
      ))}
    </div>
  );
};

export default SplitText;
