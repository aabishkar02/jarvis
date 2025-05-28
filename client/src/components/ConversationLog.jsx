import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ConversationLog = ({ isVisible, messages, onToggle }) => {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed top-20 right-4 bottom-4 w-96 z-40"
        >
          <div className="h-full bg-black/20 backdrop-blur-md border border-jarvis-blue/30 rounded-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-jarvis-blue/10 border-b border-jarvis-blue/30 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-jarvis-blue font-bold text-lg tracking-wide">CONVERSATION LOG</h3>
                  <p className="text-jarvis-blue-light text-sm font-mono">
                    {messages.length} messages
                  </p>
                </div>
                <motion.button
                  onClick={onToggle}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-8 h-8 bg-jarvis-red/20 border border-jarvis-red/50 rounded-lg text-jarvis-red hover:bg-jarvis-red/30 transition-all duration-300"
                >
                  ✕
                </motion.button>
              </div>
            </div>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 h-full">
              {messages.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center text-gray-400 font-mono text-sm mt-8"
                >
                  <div className="mb-4">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                      className="w-12 h-12 border-2 border-jarvis-blue/30 rounded-full mx-auto mb-4 relative"
                    >
                      <div className="absolute inset-2 bg-jarvis-blue/20 rounded-full animate-pulse"></div>
                    </motion.div>
                  </div>
                  <p>No conversations yet.</p>
                  <p className="text-xs mt-2">Start by sending a command!</p>
                </motion.div>
              ) : (
                messages.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`
                      p-3 rounded-lg border backdrop-blur-sm
                      ${message.type === 'user' 
                        ? 'bg-jarvis-red/10 border-jarvis-red/30 ml-8' 
                        : 'bg-jarvis-blue/10 border-jarvis-blue/30 mr-8'
                      }
                    `}
                  >
                    <div className="flex items-start space-x-2">
                      <div className={`
                        w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                        ${message.type === 'user' 
                          ? 'bg-jarvis-red/20 text-jarvis-red' 
                          : 'bg-jarvis-blue/20 text-jarvis-blue'
                        }
                      `}>
                        {message.type === 'user' ? 'U' : 'J'}
                      </div>
                      <div className="flex-1">
                        <div className={`
                          text-xs font-mono uppercase tracking-wider mb-1
                          ${message.type === 'user' ? 'text-jarvis-red' : 'text-jarvis-blue'}
                        `}>
                          {message.type === 'user' ? 'USER' : 'JARVIS'}
                        </div>
                        <p className="text-white text-sm leading-relaxed font-mono">
                          {message.text}
                        </p>
                        <div className="text-xs text-gray-500 mt-2 font-mono">
                          {message.timestamp || new Date().toLocaleTimeString()}
                        </div>
                      </div>
                    </div>

                    {/* Message glow effect */}
                    <motion.div
                      className={`
                        absolute inset-0 border rounded-lg opacity-0
                        ${message.type === 'user' ? 'border-jarvis-red' : 'border-jarvis-blue'}
                      `}
                      animate={{ opacity: [0, 0.3, 0] }}
                      transition={{ duration: 2, delay: index * 0.1 }}
                      style={{
                        boxShadow: `0 0 10px ${message.type === 'user' ? '#c62828' : '#14a7d0'}`
                      }}
                    />
                  </motion.div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Footer */}
            <div className="bg-jarvis-blue/5 border-t border-jarvis-blue/30 p-3">
              <div className="flex items-center justify-between text-xs font-mono text-gray-400">
                <span>Real-time logging</span>
                <motion.div
                  className="w-2 h-2 bg-neon-green rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConversationLog; 