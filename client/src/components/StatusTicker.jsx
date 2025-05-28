import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const StatusTicker = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const statusMessages = [
    { text: "System diagnostics complete - All systems nominal", type: "success" },
    { text: "Network connectivity: Optimal", type: "info" },
    { text: "Power levels: 94% and stable", type: "success" },
    { text: "Security protocols: Active", type: "warning" },
    { text: "Voice recognition: Online", type: "success" },
    { text: "AI processing: Ready", type: "info" },
    { text: "Environmental sensors: Monitoring", type: "info" },
    { text: "Command buffer: Clear", type: "success" },
    { text: "Backup systems: Standby", type: "warning" },
    { text: "Data encryption: Enabled", type: "success" }
  ];

  const commandSuggestions = [
    "Try: 'Open Lights'",
    "Try: 'Scan Room'", 
    "Try: 'Security Status'"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % statusMessages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [statusMessages.length]);

  const getStatusColor = (type) => {
    switch (type) {
      case 'success': return 'text-neon-green';
      case 'warning': return 'text-jarvis-gold';
      case 'error': return 'text-jarvis-red';
      default: return 'text-jarvis-blue';
    }
  };

  const getStatusIcon = (type) => {
    switch (type) {
      case 'success': return '✓';
      case 'warning': return '⚠';
      case 'error': return '✗';
      default: return 'ℹ';
    }
  };

  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.6 }}
      className="fixed bottom-4 left-4 w-64 z-30"
    >
      <div className="bg-black/20 backdrop-blur-md border border-jarvis-blue/30 rounded-xl overflow-hidden">
        {/* Header */}
        <div className="bg-jarvis-blue/10 border-b border-jarvis-blue/30 px-3 py-2">
          <div className="flex items-center space-x-2">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="w-3 h-3 border border-jarvis-blue rounded-full relative"
            >
              <div className="absolute inset-1 bg-jarvis-blue/50 rounded-full"></div>
            </motion.div>
            <h3 className="text-jarvis-blue font-bold text-xs tracking-wide">SYSTEM STATUS</h3>
          </div>
        </div>

        {/* Status Messages */}
        <div className="p-3 space-y-2">
          {/* Current Status */}
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
            className="flex items-center space-x-2"
          >
            <motion.span
              className={`text-sm ${getStatusColor(statusMessages[currentIndex].type)}`}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              {getStatusIcon(statusMessages[currentIndex].type)}
            </motion.span>
            <p className={`text-xs font-mono ${getStatusColor(statusMessages[currentIndex].type)}`}>
              {statusMessages[currentIndex].text}
            </p>
          </motion.div>

          {/* Divider */}
          <motion.div
            className="h-px bg-gradient-to-r from-transparent via-jarvis-blue/50 to-transparent"
            animate={{ scaleX: [0, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />

          {/* Command Suggestions */}
          <div className="space-y-1">
            <p className="text-jarvis-gold text-xs uppercase tracking-wider font-bold">
              Quick Commands
            </p>
            <div className="space-y-1">
              {commandSuggestions.map((suggestion, index) => (
                <motion.div
                  key={suggestion}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center space-x-1 text-xs font-mono text-gray-400 hover:text-jarvis-blue transition-colors duration-300 cursor-pointer"
                >
                  <motion.span
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                    className="text-jarvis-blue text-xs"
                  >
                    ▶
                  </motion.span>
                  <span className="text-xs">{suggestion}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer with scrolling indicator */}
        <div className="bg-jarvis-blue/5 border-t border-jarvis-blue/30 px-2 py-1">
          <div className="flex items-center justify-between">
            <div className="flex space-x-1">
              {statusMessages.map((_, index) => (
                <motion.div
                  key={index}
                  className={`w-1 h-1 rounded-full ${
                    index === currentIndex ? 'bg-jarvis-blue' : 'bg-jarvis-blue/30'
                  }`}
                  animate={index === currentIndex ? { scale: [1, 1.3, 1] } : {}}
                  transition={{ duration: 0.5 }}
                />
              ))}
            </div>
            <motion.div
              className="text-xs font-mono text-gray-500"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Live
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default StatusTicker; 