import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const RadarUI = () => {
  const [systemStats, setSystemStats] = useState({
    cpu: 45,
    memory: 67,
    network: 89,
    power: 94
  });

  const [radarBlips, setRadarBlips] = useState([]);

  useEffect(() => {
    // Update system stats periodically
    const statsInterval = setInterval(() => {
      setSystemStats(prev => ({
        cpu: Math.max(20, Math.min(95, prev.cpu + (Math.random() - 0.5) * 10)),
        memory: Math.max(30, Math.min(90, prev.memory + (Math.random() - 0.5) * 8)),
        network: Math.max(50, Math.min(100, prev.network + (Math.random() - 0.5) * 6)),
        power: Math.max(80, Math.min(100, prev.power + (Math.random() - 0.5) * 4))
      }));
    }, 2000);

    // Generate radar blips
    const blipInterval = setInterval(() => {
      const newBlip = {
        id: Date.now(),
        angle: Math.random() * 360,
        distance: Math.random() * 80 + 20,
        size: Math.random() * 4 + 2
      };
      setRadarBlips(prev => [...prev.slice(-8), newBlip]);
    }, 1500);

    return () => {
      clearInterval(statsInterval);
      clearInterval(blipInterval);
    };
  }, []);

  // Enhanced HUD System Status Panel Component
  const HUDStatusPanel = ({ label, value, icon, index }) => {
    const [displayValue, setDisplayValue] = useState(value);
    const [targetValue, setTargetValue] = useState(value);

    // Smooth interpolation effect
    useEffect(() => {
      setTargetValue(value);
      
      // Gradual interpolation over 1.5 seconds
      const startValue = displayValue;
      const difference = value - startValue;
      const duration = 1500; // 1.5 seconds
      const startTime = Date.now();

      const interpolate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Smooth easing function
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        const currentValue = startValue + (difference * easeProgress);
        
        setDisplayValue(currentValue);
        
        if (progress < 1) {
          requestAnimationFrame(interpolate);
        }
      };

      requestAnimationFrame(interpolate);
    }, [value]);

    return (
      <div className="flex-1 mx-2">
        {/* Horizontal HUD Panel */}
        <div className="relative h-16 bg-black/20 backdrop-blur-sm border border-neon-green/30 rounded-lg overflow-hidden">
          {/* Static background scanning effect */}
          <div 
            className="absolute inset-0 bg-gradient-to-r from-transparent via-neon-green/5 to-transparent opacity-50"
            style={{
              animation: `scan-${index} 6s linear infinite`,
              animationDelay: `${index * 1.5}s`
            }}
          />

          {/* Content */}
          <div className="relative z-10 h-full flex items-center justify-between px-4">
            {/* Left side - Icon and Label */}
            <div className="flex items-center space-x-3">
              <div className="text-neon-green text-xl">
                {icon}
              </div>
              <div>
                <div className="text-neon-green text-sm font-mono uppercase tracking-wider">
                  {label}
                </div>
                <div className="text-neon-green/70 text-xs font-mono">
                  SYSTEM
                </div>
              </div>
            </div>

            {/* Right side - Value and Progress */}
            <div className="flex items-center space-x-4">
              {/* Value Display - no animation, just smooth number change */}
              <div className="text-neon-green text-xl font-mono font-bold">
                {Math.round(displayValue)}%
              </div>

              {/* Vertical Progress Bar - smooth CSS transition */}
              <div className="w-2 h-10 bg-neon-green/20 rounded-full overflow-hidden">
                <div
                  className="w-full bg-neon-green rounded-full transition-all duration-1000 ease-out"
                  style={{ 
                    height: `${Math.max(0, Math.min(100, displayValue))}%`,
                    transformOrigin: 'bottom'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Corner indicators - static */}
          <div className="absolute top-1 left-1 w-2 h-2 border-l border-t border-neon-green/50"></div>
          <div className="absolute top-1 right-1 w-2 h-2 border-r border-t border-neon-green/50"></div>
          <div className="absolute bottom-1 left-1 w-2 h-2 border-l border-b border-neon-green/50"></div>
          <div className="absolute bottom-1 right-1 w-2 h-2 border-r border-b border-neon-green/50"></div>
        </div>

        {/* CSS animations for scanning effect */}
        <style jsx>{`
          @keyframes scan-0 {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
          @keyframes scan-1 {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
          @keyframes scan-2 {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
          @keyframes scan-3 {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
        `}</style>
      </div>
    );
  };



  return (
    <div className="flex-1 flex flex-col">
      {/* System Status Bar - Always Visible */}
      <div className="flex items-center justify-center px-6 py-4 mt-20">
        <div className="flex w-full max-w-4xl">
          <HUDStatusPanel label="CPU" value={systemStats.cpu} icon="⚡" index={0} />
          <HUDStatusPanel label="MEM" value={systemStats.memory} icon="💾" index={1} />
          <HUDStatusPanel label="NET" value={systemStats.network} icon="📡" index={2} />
          <HUDStatusPanel label="PWR" value={systemStats.power} icon="🔋" index={3} />
        </div>
      </div>

      {/* Big Animated JARVIS Text */}
      <div className="flex-1 flex items-center justify-center relative z-20 py-8">
        <motion.div
          className="relative"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <svg className="w-96 h-32" viewBox="0 0 400 80">
            {/* J */}
            <motion.path
              d="M20 10 L40 10 L40 50 Q40 70 20 70 Q0 70 0 50"
              fill="none"
              stroke="#14a7d0"
              strokeWidth="3"
              strokeLinecap="round"
              animate={{ pathLength: [0, 1, 0] }}
              transition={{ duration: 4, repeat: Infinity, delay: 0 }}
            />
            
            {/* A */}
            <motion.path
              d="M60 70 L70 10 L80 70 M65 45 L75 45"
              fill="none"
              stroke="#14a7d0"
              strokeWidth="3"
              strokeLinecap="round"
              animate={{ pathLength: [0, 1, 0] }}
              transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
            />
            
            {/* R */}
            <motion.path
              d="M100 70 L100 10 L130 10 Q140 10 140 25 Q140 40 130 40 L100 40 M130 40 L140 70"
              fill="none"
              stroke="#14a7d0"
              strokeWidth="3"
              strokeLinecap="round"
              animate={{ pathLength: [0, 1, 0] }}
              transition={{ duration: 4, repeat: Infinity, delay: 1 }}
            />
            
            {/* V */}
            <motion.path
              d="M160 10 L180 70 L200 10"
              fill="none"
              stroke="#14a7d0"
              strokeWidth="3"
              strokeLinecap="round"
              animate={{ pathLength: [0, 1, 0] }}
              transition={{ duration: 4, repeat: Infinity, delay: 1.5 }}
            />
            
            {/* I */}
            <motion.path
              d="M220 10 L240 10 M230 10 L230 70 M220 70 L240 70"
              fill="none"
              stroke="#14a7d0"
              strokeWidth="3"
              strokeLinecap="round"
              animate={{ pathLength: [0, 1, 0] }}
              transition={{ duration: 4, repeat: Infinity, delay: 2 }}
            />
            
            {/* S */}
            <motion.path
              d="M280 25 Q260 10 260 25 Q260 40 280 40 Q300 40 300 55 Q300 70 280 55"
              fill="none"
              stroke="#14a7d0"
              strokeWidth="3"
              strokeLinecap="round"
              animate={{ pathLength: [0, 1, 0] }}
              transition={{ duration: 4, repeat: Infinity, delay: 2.5 }}
            />
          </svg>
          
          {/* Glowing effect */}
          <motion.div
            className="absolute inset-0 bg-jarvis-blue/10 blur-xl rounded-lg"
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
      </div>

      {/* Background Elements - Circle and Polygon */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10" style={{ top: '120px' }}>
        {/* Large Background Circle */}
        <motion.div
          className="absolute"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.3 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <svg className="w-96 h-96" viewBox="0 0 400 400">
              <circle cx="200" cy="200" r="180" fill="none" stroke="#14a7d0" strokeWidth="2" opacity="0.4" />
              <circle cx="200" cy="20" r="4" fill="#14a7d0" opacity="0.6" />
              <circle cx="200" cy="380" r="4" fill="#14a7d0" opacity="0.6" />
              <circle cx="20" cy="200" r="4" fill="#14a7d0" opacity="0.6" />
              <circle cx="380" cy="200" r="4" fill="#14a7d0" opacity="0.6" />
            </svg>
          </motion.div>
        </motion.div>

        {/* Large Background Polygon */}
        <motion.div
          className="absolute"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.2 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
        >
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          >
            <svg className="w-80 h-80" viewBox="0 0 320 320">
              <polygon
                points="160,20 280,80 280,240 160,300 40,240 40,80"
                fill="none"
                stroke="#39ff14"
                strokeWidth="2"
                opacity="0.5"
              />
            </svg>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default RadarUI; 