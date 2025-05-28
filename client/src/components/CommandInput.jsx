import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

const CommandInput = ({ onSendCommand, isProcessing, onToggleMic, isListening }) => {
  const [command, setCommand] = useState('');
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (command.trim() && !isProcessing) {
      onSendCommand(command);
      setCommand('');
    }
  };

  const handleInputClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  useEffect(() => {
    // Auto-focus the input when component mounts
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.5 }}
      className="bg-black/20 backdrop-blur-md border border-jarvis-blue/30 rounded-2xl p-6 relative z-40"
    >
      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex items-center space-x-4">
        {/* Microphone Button */}
        <motion.button
          type="button"
          onClick={onToggleMic}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className={`
            relative w-12 h-12 rounded-full border-2 transition-all duration-300 z-10
            ${isListening 
              ? 'border-jarvis-red bg-jarvis-red/20 text-jarvis-red animate-pulse' 
              : 'border-jarvis-blue/50 bg-jarvis-blue/10 text-jarvis-blue hover:border-jarvis-blue'
            }
          `}
        >
          <motion.div
            animate={isListening ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 1, repeat: isListening ? Infinity : 0 }}
          >
            🎤
          </motion.div>
          
          {/* Listening indicator */}
          {isListening && (
            <motion.div
              className="absolute inset-0 border-2 border-jarvis-red rounded-full"
              animate={{ scale: [1, 1.5], opacity: [1, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          )}
        </motion.button>

        {/* Text Input */}
        <div className="flex-1 relative z-10">
          <input
            ref={inputRef}
            type="text"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            onClick={handleInputClick}
            placeholder="Enter command or use voice..."
            disabled={isProcessing}
            autoComplete="off"
            spellCheck="false"
            className="
              w-full px-4 py-3 bg-black/30 border border-jarvis-blue/30 rounded-xl
              text-white placeholder-gray-400 font-mono relative z-10
              focus:outline-none focus:border-jarvis-blue focus:bg-black/40
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-300
            "
          />
          
          {/* Input glow effect */}
          <motion.div
            className="absolute inset-0 border border-jarvis-blue rounded-xl opacity-0 pointer-events-none z-0"
            animate={{ opacity: command ? 0.5 : 0 }}
            style={{ boxShadow: '0 0 10px #14a7d0' }}
          />
        </div>

        {/* Send Button */}
        <motion.button
          type="submit"
          disabled={!command.trim() || isProcessing}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="
            relative px-6 py-3 bg-jarvis-blue/20 border border-jarvis-blue/50 rounded-xl
            text-jarvis-blue font-mono font-bold tracking-wide z-10
            hover:bg-jarvis-blue/30 hover:border-jarvis-blue
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-all duration-300 overflow-hidden group
          "
        >
          {/* Button background animation */}
          <motion.div
            className="absolute inset-0 bg-jarvis-blue/20"
            initial={{ x: '-100%' }}
            whileHover={{ x: '100%' }}
            transition={{ duration: 0.6 }}
          />
          
          <span className="relative z-10">
            {isProcessing ? (
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="inline-block"
              >
                ⚙️
              </motion.span>
            ) : (
              'EXECUTE'
            )}
          </span>

          {/* Glow effect */}
          <motion.div
            className="absolute inset-0 border border-jarvis-blue rounded-xl opacity-0 group-hover:opacity-100"
            style={{ boxShadow: '0 0 15px #14a7d0' }}
            transition={{ duration: 0.3 }}
          />
        </motion.button>
      </form>

      {/* Status Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-4 flex items-center justify-center space-x-4 text-sm font-mono"
      >
        <div className="flex items-center space-x-2">
          <motion.div
            className={`w-2 h-2 rounded-full ${
              isProcessing ? 'bg-jarvis-gold' : 
              isListening ? 'bg-jarvis-red' : 'bg-jarvis-blue'
            }`}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
          <span className="text-gray-400">
            {isProcessing ? 'Processing...' : 
             isListening ? 'Listening...' : 'Ready'}
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CommandInput; 