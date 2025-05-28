import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const HUDBar = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [systemModel] = useState('MARK-52');
  const [systemStatus] = useState('OPERATIONAL');
  const [powerLevel] = useState(94);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-md border-b border-jarvis-blue/30"
    >
      <div className="flex justify-between items-center px-6 py-3">
        {/* Left Section - Enhanced JARVIS Logo */}
        <div className="flex items-center space-x-4">
          {/* Sophisticated JARVIS Logo */}
          <motion.div
            className="relative w-16 h-16"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            {/* Outer rotating ring */}
            <motion.div
              className="absolute inset-0"
              animate={{ rotate: 360 }}
              transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            >
              <svg className="w-full h-full" viewBox="0 0 64 64">
                <circle cx="32" cy="32" r="30" fill="none" stroke="#14a7d0" strokeWidth="1" opacity="0.6" />
                <circle cx="32" cy="2" r="2" fill="#14a7d0" />
                <circle cx="32" cy="62" r="2" fill="#14a7d0" />
                <circle cx="2" cy="32" r="2" fill="#14a7d0" />
                <circle cx="62" cy="32" r="2" fill="#14a7d0" />
              </svg>
            </motion.div>

            {/* Inner counter-rotating ring */}
            <motion.div
              className="absolute inset-2"
              animate={{ rotate: -360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              <svg className="w-full h-full" viewBox="0 0 60 60">
                <polygon
                  points="30,5 50,20 50,40 30,55 10,40 10,20"
                  fill="none"
                  stroke="#39ff14"
                  strokeWidth="1"
                  opacity="0.8"
                />
              </svg>
            </motion.div>

            {/* Central JARVIS core */}
            <motion.div
              className="absolute inset-4 bg-jarvis-blue/20 border-2 border-jarvis-blue rounded-full flex items-center justify-center"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <svg className="w-8 h-8" viewBox="0 0 32 32">
                {/* J */}
                <motion.path
                  d="M8 4 L12 4 L12 18 Q12 22 8 22 Q4 22 4 18"
                  fill="none"
                  stroke="#14a7d0"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  animate={{ pathLength: [0, 1, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 0 }}
                />
                {/* A */}
                <motion.path
                  d="M14 22 L16 4 L18 22 M15 14 L17 14"
                  fill="none"
                  stroke="#14a7d0"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  animate={{ pathLength: [0, 1, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                />
                {/* R */}
                <motion.path
                  d="M20 22 L20 4 L26 4 Q28 4 28 8 Q28 12 26 12 L20 12 M26 12 L28 22"
                  fill="none"
                  stroke="#14a7d0"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  animate={{ pathLength: [0, 1, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                />
              </svg>
            </motion.div>
          </motion.div>

          {/* JARVIS Text and Description */}
          <div>
            <motion.h1 
              className="text-jarvis-blue font-bold text-2xl tracking-wider"
              animate={{ opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              J.A.R.V.I.S.
            </motion.h1>
            <p className="text-jarvis-blue-light text-xs tracking-wide">Just A Rather Very Intelligent System</p>
            <motion.div
              className="flex items-center space-x-2 mt-1"
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <div className="w-2 h-2 bg-neon-green rounded-full" />
              <span className="text-neon-green text-xs font-mono">AI CORE ACTIVE</span>
            </motion.div>
          </div>
        </div>

        {/* Center Section - Enhanced System Info */}
        <div className="flex items-center space-x-8">
          <motion.div 
            className="text-center bg-black/40 rounded-lg p-3 border border-jarvis-gold/30"
            whileHover={{ scale: 1.05 }}
          >
            <p className="text-jarvis-gold text-xs uppercase tracking-wider">Model</p>
            <p className="text-white font-mono text-lg font-bold">{systemModel}</p>
            <div className="w-8 h-1 bg-jarvis-gold/50 rounded-full mx-auto mt-1">
              <motion.div
                className="h-full bg-jarvis-gold rounded-full"
                animate={{ width: ["0%", "100%", "0%"] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            </div>
          </motion.div>

          <motion.div 
            className="text-center bg-black/40 rounded-lg p-3 border border-neon-green/30"
            whileHover={{ scale: 1.05 }}
          >
            <p className="text-neon-green text-xs uppercase tracking-wider">Status</p>
            <p className="text-neon-green font-mono text-lg font-bold">{systemStatus}</p>
            <motion.div
              className="flex justify-center space-x-1 mt-1"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <div className="w-1 h-1 bg-neon-green rounded-full" />
              <div className="w-1 h-1 bg-neon-green rounded-full" />
              <div className="w-1 h-1 bg-neon-green rounded-full" />
            </motion.div>
          </motion.div>

          <motion.div 
            className="text-center bg-black/40 rounded-lg p-3 border border-jarvis-red/30"
            whileHover={{ scale: 1.05 }}
          >
            <p className="text-jarvis-red text-xs uppercase tracking-wider">Power</p>
            <p className="text-jarvis-red font-mono text-lg font-bold">{powerLevel}%</p>
            <div className="w-8 h-1 bg-jarvis-red/30 rounded-full mx-auto mt-1">
              <div 
                className="h-full bg-jarvis-red rounded-full transition-all duration-1000"
                style={{ width: `${powerLevel}%` }}
              />
            </div>
          </motion.div>
        </div>

        {/* Right Section - Enhanced Time & Date */}
        <div className="text-right">
          <motion.div 
            className="text-jarvis-blue-light text-3xl font-mono tracking-wider"
            animate={{ textShadow: ["0 0 5px #14a7d0", "0 0 15px #14a7d0", "0 0 5px #14a7d0"] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {formatTime(currentTime)}
          </motion.div>
          <div className="text-jarvis-blue text-sm font-mono">
            {formatDate(currentTime)}
          </div>
          <motion.div
            className="flex justify-end space-x-1 mt-2"
            animate={{ opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, staggerChildren: 0.1 }}
          >
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="w-1 h-3 bg-jarvis-blue/50 rounded-full"
                animate={{ scaleY: [0.3, 1, 0.3] }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.1 }}
              />
            ))}
          </motion.div>
        </div>
      </div>

      {/* Enhanced animated border lines */}
      <div className="relative h-1">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-jarvis-blue to-transparent"
          animate={{ scaleX: [0, 1, 0], x: ["-100%", "0%", "100%"] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-neon-green to-transparent"
          animate={{ scaleX: [0, 1, 0], x: ["100%", "0%", "-100%"] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
      </div>
    </motion.div>
  );
};

export default HUDBar; 