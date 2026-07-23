import React from 'react';
import { motion } from 'framer-motion';

const AIAvatar = ({ speaking = false, listening = false, size = 200 }) => {
  const ringSize = size * 1.2;
  const outerRingSize = size * 1.45;

  return (
    <div className="relative flex items-center justify-center" style={{ width: outerRingSize, height: outerRingSize }}>
      {/* Outer pulsing ring */}
      {(speaking || listening) && (
        <>
          <motion.div
            className="absolute rounded-full border"
            style={{
              width: outerRingSize,
              height: outerRingSize,
              borderColor: speaking ? 'rgba(0,245,255,0.3)' : 'rgba(123,47,255,0.3)',
            }}
            animate={{ scale: [1, 1.08, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute rounded-full border"
            style={{
              width: ringSize,
              height: ringSize,
              borderColor: speaking ? 'rgba(0,245,255,0.5)' : 'rgba(123,47,255,0.5)',
            }}
            animate={{ scale: [1, 1.06, 1], opacity: [0.8, 0.2, 0.8] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
          />
        </>
      )}

      {/* Main avatar circle */}
      <motion.div
        className="relative rounded-full overflow-hidden"
        style={{ width: size, height: size }}
        animate={speaking ? { scale: [1, 1.02, 1] } : {}}
        transition={{ duration: 0.8, repeat: Infinity }}
      >
        {/* Gradient background */}
        <div className="absolute inset-0 rounded-full"
          style={{
            background: 'radial-gradient(circle at 40% 35%, #0a1f4e, #030a1a)',
            border: speaking
              ? '2px solid rgba(0,245,255,0.6)'
              : listening
              ? '2px solid rgba(123,47,255,0.6)'
              : '2px solid rgba(255,255,255,0.1)',
            boxShadow: speaking
              ? '0 0 30px rgba(0,245,255,0.4), inset 0 0 30px rgba(0,102,255,0.1)'
              : listening
              ? '0 0 30px rgba(123,47,255,0.4)'
              : '0 0 10px rgba(0,0,0,0.5)',
            transition: 'all 0.5s ease',
          }}
        />

        {/* Scan line */}
        <div className="scan-line" />

        {/* AI face - geometric representation */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
          {/* Eyes */}
          <div className="flex gap-6">
            {[0, 1].map((eye) => (
              <motion.div
                key={eye}
                className="relative"
                style={{ width: size * 0.12, height: size * 0.06 }}
              >
                <div className="absolute inset-0 rounded-full"
                  style={{ background: 'rgba(0,245,255,0.15)', border: '1px solid rgba(0,245,255,0.4)' }} />
                <motion.div
                  className="absolute inset-1 rounded-full"
                  style={{ background: '#00f5ff', boxShadow: '0 0 10px #00f5ff' }}
                  animate={speaking ? { opacity: [0.8, 1, 0.8] } : { opacity: 1 }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: eye * 0.1 }}
                />
              </motion.div>
            ))}
          </div>

          {/* Mouth / sound indicator */}
          <div className="flex items-center gap-0.5" style={{ height: size * 0.08 }}>
            {Array.from({ length: 9 }).map((_, i) => (
              <motion.div
                key={i}
                className="rounded-full"
                style={{
                  width: 3,
                  background: 'linear-gradient(to top, #0066ff, #00f5ff)',
                  height: '100%',
                  transformOrigin: 'center',
                }}
                animate={speaking ? {
                  scaleY: [0.2, Math.random() * 0.8 + 0.2, 0.2],
                  opacity: [0.4, 1, 0.4],
                } : { scaleY: 0.15, opacity: 0.3 }}
                transition={{
                  duration: 0.5 + Math.random() * 0.3,
                  repeat: Infinity,
                  delay: i * 0.08,
                }}
              />
            ))}
          </div>

          {/* Status text */}
          <div className="text-center">
            <span
              className="font-mono"
              style={{
                fontSize: size * 0.06,
                color: speaking ? '#00f5ff' : listening ? '#7b2fff' : 'rgba(255,255,255,0.2)',
                textShadow: speaking ? '0 0 10px rgba(0,245,255,0.8)' : '',
              }}
            >
              {speaking ? 'SPEAKING' : listening ? 'LISTENING' : 'STANDBY'}
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AIAvatar;
