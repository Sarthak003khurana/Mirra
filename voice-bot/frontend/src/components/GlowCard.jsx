import React from 'react';
import { motion } from 'framer-motion';

const GlowCard = ({ children, className = '', glowColor = 'cyan', delay = 0, onClick }) => {
  const glowMap = {
    cyan: 'hover:shadow-neon-cyan hover:border-neon-cyan/40',
    purple: 'hover:shadow-neon-purple hover:border-neon-purple/40',
    blue: 'hover:shadow-neon-blue hover:border-neon-blue/40',
    green: 'hover:shadow-neon-green hover:border-neon-green/40',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -4, scale: 1.01 }}
      onClick={onClick}
      className={`glass-card transition-all duration-300 ${glowMap[glowColor] || glowMap.cyan} ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default GlowCard;
