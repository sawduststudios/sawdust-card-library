import { motion, useAnimation } from 'framer-motion';
import { useEffect, forwardRef } from 'react';
import { Link } from 'react-router-dom';

const MotionLink = motion(Link);

export default function WiggleLink({ to, baseRot = 0, style, className, children }) {
  const controls = useAnimation();

  useEffect(() => {
    let timeoutId;
    let isMounted = true;
    
    const triggerWiggle = async () => {
      // Random delay between 6 and 14 seconds
      const delay = 6000 + Math.random() * 8000; 
      timeoutId = setTimeout(async () => {
        if (!isMounted) return;
        await controls.start({
          rotate: [baseRot, baseRot + 5, baseRot - 5, baseRot + 5, baseRot - 5, baseRot],
          scale: [1, 1.05, 1.05, 1.05, 1.05, 1],
          transition: { duration: 0.4, ease: "easeInOut" }
        });
        if (isMounted) triggerWiggle();
      }, delay);
    };

    triggerWiggle();

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [baseRot, controls]);

  // Framer motion uses numbers for rotate (mapped to degrees)
  return (
    <MotionLink 
      to={to} 
      className={className}
      animate={controls}
      initial={{ rotate: baseRot, scale: 1 }}
      style={style}
    >
      {children}
    </MotionLink>
  );
}
