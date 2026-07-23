import React from 'react';
import { motion } from 'framer-motion';

const SoundWave = ({ active = true, bars = 7, height = 32, color = 'from-neon-blue to-neon-cyan', className = '' }) => {
  return (
    <div className={`flex items-center gap-0.5 ${className}`} style={{ height }}>
      {Array.from({ length: bars }).map((_, i) => (
        <motion.div
          key={i}
          className={`w-1 rounded-full bg-gradient-to-t ${color}`}
          animate={active ? {
            scaleY: [0.2, 1, 0.4, 0.8, 0.2],
            opacity: [0.5, 1, 0.6, 0.9, 0.5],
          } : { scaleY: 0.2, opacity: 0.3 }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            delay: i * 0.1,
            ease: 'easeInOut',
          }}
          style={{ height: '100%', transformOrigin: 'bottom' }}
        />
      ))}
    </div>
  );
};

export default SoundWave;
