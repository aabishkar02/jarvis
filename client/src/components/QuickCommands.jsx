import React from 'react';
import { motion } from 'framer-motion';

const QuickCommands = ({ onCommandSelect, disabled }) => {
  const commands = [
    { text: "Open Lights", icon: "💡", color: "jarvis-gold" },
    { text: "Scan Room", icon: "🔍", color: "jarvis-blue" },
    { text: "Security Status", icon: "🛡️", color: "jarvis-red" },
    { text: "Weather Report", icon: "🌤️", color: "jarvis-blue" },
    { text: "System Diagnostics", icon: "⚙️", color: "jarvis-gold" },
    { text: "Power Levels", icon: "⚡", color: "neon-green" }
  ];

  const handleCommandClick = (commandText) => {
    console.log('Quick command clicked:', commandText);
    console.log('onCommandSelect function:', onCommandSelect);
    console.log('disabled:', disabled);
    
    if (onCommandSelect && !disabled) {
      onCommandSelect(commandText);
    }
  };

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="mb-4"
    >
      <div className="flex flex-wrap gap-2 justify-center">
        {commands.map((command, index) => (
          <motion.button
            key={command.text}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleCommandClick(command.text)}
            disabled={disabled}
            className={`
              relative overflow-hidden px-4 py-2 rounded-lg border
              bg-black/30 backdrop-blur-sm
              border-${command.color}/30 text-${command.color}
              hover:border-${command.color} hover:bg-${command.color}/10
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-300 group
              text-sm font-mono tracking-wide
              cursor-pointer z-10
            `}
            style={{
              pointerEvents: disabled ? 'none' : 'auto'
            }}
          >
            {/* Animated background effect */}
            <motion.div
              className={`absolute inset-0 bg-${command.color}/20`}
              initial={{ x: '-100%' }}
              whileHover={{ x: '100%' }}
              transition={{ duration: 0.6 }}
            />
            
            <span className="relative z-10 flex items-center space-x-2">
              <span className="text-lg">{command.icon}</span>
              <span>{command.text}</span>
            </span>

            {/* Glow effect on hover */}
            <motion.div
              className={`absolute inset-0 border border-${command.color} rounded-lg opacity-0 group-hover:opacity-100`}
              style={{
                boxShadow: `0 0 10px var(--${command.color})`
              }}
              transition={{ duration: 0.3 }}
            />
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default QuickCommands; 