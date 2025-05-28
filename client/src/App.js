import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

// Components
import HUDBar from './components/HUDBar';
import RadarUI from './components/RadarUI';
import QuickCommands from './components/QuickCommands';
import CommandInput from './components/CommandInput';
import ConversationLog from './components/ConversationLog';
import StatusTicker from './components/StatusTicker';

function App() {
  const [messages, setMessages] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showConversation, setShowConversation] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Initializing JARVIS...');
  const [showAudioPrompt, setShowAudioPrompt] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(false);
  
  const recognitionRef = useRef(null);
  const synth = window.speechSynthesis;

  // Enable audio function
  const enableAudio = async () => {
    try {
      // Create audio context to enable audio
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      await audioContext.resume();
      setAudioEnabled(true);
      setShowAudioPrompt(false);
    } catch (error) {
      console.log('Audio not supported');
      setShowAudioPrompt(false);
    }
  };

  // Initialize speech recognition
  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';
      
      recognitionRef.current.onstart = () => {
        console.log('🎤 Voice recognition started');
      };
      
      recognitionRef.current.onresult = (event) => {
        const current = event.resultIndex;
        const transcriptText = event.results[current][0].transcript;
        console.log('🗣️ Heard:', transcriptText);
        setTranscript(transcriptText);
        
        // Auto-process final results
        if (event.results[current].isFinal) {
          console.log('✅ Final transcript:', transcriptText);
          if (transcriptText.trim()) {
            processCommand(transcriptText);
            setTranscript('');
            setIsListening(false);
          }
        }
      };
      
      recognitionRef.current.onerror = (event) => {
        console.error('❌ Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          alert('Microphone access denied. Please allow microphone access and refresh the page.');
        } else if (event.error === 'no-speech') {
          console.log('No speech detected, continuing to listen...');
        }
      };
      
      recognitionRef.current.onend = () => {
        console.log('🛑 Voice recognition ended');
        if (isListening) {
          console.log('🔄 Restarting voice recognition...');
          try {
            recognitionRef.current.start();
          } catch (error) {
            console.error('Failed to restart recognition:', error);
            setIsListening(false);
          }
        }
      };
      
      recognitionRef.current.onnomatch = () => {
        console.log('🤷 No speech match found');
      };
      
      recognitionRef.current.onspeechstart = () => {
        console.log('🎙️ Speech detected');
      };
      
      recognitionRef.current.onspeechend = () => {
        console.log('🔇 Speech ended');
      };
    } else {
      console.error('❌ Speech Recognition not supported in this browser');
      alert('Speech Recognition is not supported in your browser. Please use Chrome or Edge.');
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [isListening]);

  // Loading sequence
  useEffect(() => {
    if (!audioEnabled) return;

    const loadingSteps = [
      { text: 'Initializing JARVIS...', duration: 800 },
      { text: 'Loading Neural Networks...', duration: 1000 },
      { text: 'Calibrating Voice Recognition...', duration: 900 },
      { text: 'Establishing Secure Connection...', duration: 700 },
      { text: 'Loading HUD Interface...', duration: 600 },
      { text: 'Synchronizing System Components...', duration: 800 },
      { text: 'JARVIS Online - Ready for Commands', duration: 500 }
    ];

    let currentStep = 0;
    let currentProgress = 0;

    const runLoadingSequence = () => {
      if (currentStep < loadingSteps.length) {
        const step = loadingSteps[currentStep];
        setLoadingText(step.text);
        
        const progressIncrement = 100 / loadingSteps.length;
        const targetProgress = (currentStep + 1) * progressIncrement;
        
        // Animate progress bar
        const progressInterval = setInterval(() => {
          currentProgress += 2;
          if (currentProgress >= targetProgress) {
            currentProgress = targetProgress;
            clearInterval(progressInterval);
          }
          setLoadingProgress(currentProgress);
        }, 20);
        
        // Speak the loading text and wait for it to finish
        speakLoadingText(step.text, () => {
          // This callback runs when speech is finished
          setTimeout(() => {
            currentStep++;
            if (currentStep >= loadingSteps.length) {
              // After all loading steps, greet Iron Man and play cinematic music
              setTimeout(() => {
                greetIronMan(() => {
                  // Play cinematic music and show main interface
                  playCinematicMusic();
                  setTimeout(() => setIsLoading(false), 1000);
                });
              }, 500);
            } else {
              runLoadingSequence();
            }
          }, 300); // Small pause after speech finishes
        });
      }
    };

    const startTimer = setTimeout(runLoadingSequence, 500);
    return () => clearTimeout(startTimer);
  }, [audioEnabled]);

  // Toggle voice recognition
  const toggleMicrophone = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not available. Please use Chrome or Edge browser.');
      return;
    }

    if (!audioEnabled) {
      alert('Please enable audio first by clicking the "Enable Audio" button.');
      return;
    }

    if (isListening) {
      console.log('🛑 Stopping microphone...');
      recognitionRef.current.stop();
      if (transcript.trim()) {
        processCommand(transcript);
        setTranscript('');
      }
      setIsListening(false);
    } else {
      console.log('🎤 Starting microphone...');
      setTranscript('');
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (error) {
        console.error('Failed to start recognition:', error);
        alert('Failed to start voice recognition. Please check microphone permissions.');
      }
    }
  };

  // Process commands (voice or text)
  const processCommand = async (command) => {
    if (!command.trim() || isProcessing) return;

    try {
      setIsProcessing(true);
      
      // Add user message
      const userMessage = {
        type: 'user',
        text: command,
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, userMessage]);

      // Play processing sound effect
      playProcessingSound();

      // Call backend API
      const response = await axios.post('http://localhost:5000/api/chat', {
        message: command
      });

      // Add AI response
      const aiMessage = {
        type: 'ai',
        text: response.data.text,
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, aiMessage]);

      // Speak the response
      speakText(response.data.text);

    } catch (error) {
      console.error('Error processing command:', error);
      const errorMessage = {
        type: 'ai',
        text: 'I apologize, but I encountered an error processing your request. Please try again.',
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, errorMessage]);
      speakText(errorMessage.text);
    } finally {
      setIsProcessing(false);
    }
  };

  // Text-to-speech with JARVIS-style voice
  const speakText = (text) => {
    if (!audioEnabled) return;
    if (synth.speaking) {
      synth.cancel();
    }

    // Play JARVIS sound effect before speaking
    playJarvisSound();

    // Process text for better pronunciation
    const processedText = text
      .replace(/\*/g, ' ')
      .replace(/[_~`]/g, ' ')
      .replace(/\s+/g, ' ')
      .replace(/J\.A\.R\.V\.I\.S/g, 'JARVIS')
      .replace(/(\d+)%/g, '$1 percent')
      .trim();

    const utterance = new SpeechSynthesisUtterance(processedText);
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    // Try to find a British male voice
    const voices = synth.getVoices();
    const preferredVoice = voices.find(voice => 
      voice.name.includes('Daniel') || 
      (voice.lang.includes('en-GB') && voice.name.includes('Male'))
    ) || voices.find(voice => voice.lang.includes('en'));

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    synth.speak(utterance);
  };

  // Sound effects
  const playProcessingSound = () => {
    if (!audioEnabled) return;
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      // Create processing beep sequence
      const createBeep = (freq, start, duration) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + start + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + start + duration);
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.start(audioContext.currentTime + start);
        oscillator.stop(audioContext.currentTime + start + duration);
      };

      createBeep(800, 0, 0.1);
      createBeep(1000, 0.15, 0.1);
      createBeep(1200, 0.3, 0.1);
    } catch (error) {
      console.log('Audio not supported');
    }
  };

  const playJarvisSound = () => {
    if (!audioEnabled) return;
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      // Create JARVIS-style sound
      const createTone = (freq, start, duration, type = 'sine') => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
        oscillator.type = type;
        
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.05, audioContext.currentTime + start + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + start + duration);
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.start(audioContext.currentTime + start);
        oscillator.stop(audioContext.currentTime + start + duration);
      };

      createTone(1800, 0, 0.08);
      createTone(900, 0.08, 0.05, 'square');
      createTone(2200, 0.15, 0.1);
    } catch (error) {
      console.log('Audio not supported');
    }
  };

  // Text-to-speech for loading screen
  const speakLoadingText = (text, onComplete) => {
    if (!audioEnabled) {
      if (onComplete) onComplete();
      return;
    }
    
    if (synth.speaking) {
      synth.cancel();
    }

    // Play a subtle beep before speaking
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.frequency.setValueAtTime(1200, audioContext.currentTime);
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.03, audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.1);
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    } catch (error) {
      console.log('Audio not supported');
    }

    // Process text for better pronunciation
    const processedText = text
      .replace(/JARVIS/g, 'JARVIS')
      .replace(/HUD/g, 'H U D')
      .replace(/Neural Networks/g, 'Neural Networks')
      .replace(/\.\.\./g, '')
      .trim();

    const utterance = new SpeechSynthesisUtterance(processedText);
    utterance.rate = 0.85;
    utterance.pitch = 0.9;
    utterance.volume = 0.8;

    // Try to find a British male voice for JARVIS
    const voices = synth.getVoices();
    const preferredVoice = voices.find(voice => 
      voice.name.includes('Daniel') || 
      (voice.lang.includes('en-GB') && voice.name.includes('Male'))
    ) || voices.find(voice => voice.lang.includes('en'));

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    // Set up callback for when speech ends
    const fallbackTimeout = setTimeout(() => {
      if (onComplete) {
        onComplete();
      }
    }, processedText.length * 100 + 2000); // Estimate speech duration + buffer

    utterance.onend = () => {
      clearTimeout(fallbackTimeout);
      if (onComplete) {
        onComplete();
      }
    };

    // Small delay to let the beep finish
    setTimeout(() => {
      synth.speak(utterance);
    }, 150);
  };

  // Greet Iron Man after loading
  const greetIronMan = (onComplete) => {
    if (!audioEnabled) {
      if (onComplete) onComplete();
      return;
    }
    
    if (synth.speaking) {
      synth.cancel();
    }

    // Play a special greeting sound
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      // Create a more elaborate greeting sound sequence
      const createTone = (freq, start, duration, type = 'sine') => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
        oscillator.type = type;
        
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.08, audioContext.currentTime + start + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + start + duration);
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.start(audioContext.currentTime + start);
        oscillator.stop(audioContext.currentTime + start + duration);
      };

      // JARVIS greeting sound sequence
      createTone(1800, 0, 0.15);
      createTone(1400, 0.1, 0.15);
      createTone(2200, 0.2, 0.2);
    } catch (error) {
      console.log('Audio not supported');
    }

    const greetingMessages = [
      "Good morning, Mr. Stark. All systems are operational.",
      "Welcome back, Mr. Stark. I trust you slept well.",
      "Good day, Mr. Stark. How may I assist you today?",
      "Systems online and ready, Mr. Stark.",
      "Welcome, Mr. Stark. All protocols are active and standing by."
    ];

    // Select a random greeting
    const greeting = greetingMessages[Math.floor(Math.random() * greetingMessages.length)];

    const utterance = new SpeechSynthesisUtterance(greeting);
    utterance.rate = 0.9;
    utterance.pitch = 0.95;
    utterance.volume = 0.9;

    // Try to find a British male voice for JARVIS
    const voices = synth.getVoices();
    const preferredVoice = voices.find(voice => 
      voice.name.includes('Daniel') || 
      (voice.lang.includes('en-GB') && voice.name.includes('Male'))
    ) || voices.find(voice => voice.lang.includes('en'));

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    // Set up callback for when greeting ends
    const fallbackTimeout = setTimeout(() => {
      if (onComplete) {
        onComplete();
      }
    }, greeting.length * 100 + 3000);

    utterance.onend = () => {
      clearTimeout(fallbackTimeout);
      if (onComplete) {
        onComplete();
      }
    };

    // Delay to let the greeting sound finish
    setTimeout(() => {
      synth.speak(utterance);
    }, 400);
  };

  // Play cinematic music when main screen loads
  const playCinematicMusic = () => {
    if (!audioEnabled) return;
    
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      // Create dramatic cinematic chord progression
      const createChord = (frequencies, start, duration, volume = 0.1) => {
        frequencies.forEach((freq, index) => {
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();
          
          oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
          oscillator.type = 'sawtooth';
          
          gainNode.gain.setValueAtTime(0, audioContext.currentTime);
          gainNode.gain.linearRampToValueAtTime(volume, audioContext.currentTime + start + 0.1);
          gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + start + duration);
          
          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);
          
          oscillator.start(audioContext.currentTime + start);
          oscillator.stop(audioContext.currentTime + start + duration);
        });
      };

      // Epic Iron Man style chord progression
      createChord([130.81, 164.81, 196.00], 0, 2.0, 0.08);      // C major
      createChord([146.83, 185.00, 220.00], 2.0, 2.0, 0.08);   // D major  
      createChord([164.81, 207.65, 246.94], 4.0, 2.0, 0.08);   // E major
      createChord([174.61, 220.00, 261.63], 6.0, 3.0, 0.1);    // F major (climax)
      
      // Add some high frequency sparkle
      const createSparkle = (freq, start, duration) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.03, audioContext.currentTime + start + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + start + duration);
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.start(audioContext.currentTime + start);
        oscillator.stop(audioContext.currentTime + start + duration);
      };

      // Add sparkle effects
      createSparkle(1760, 1.0, 0.5);
      createSparkle(2093, 3.0, 0.5);
      createSparkle(2637, 5.0, 0.5);
      createSparkle(3136, 7.0, 1.0);
      
    } catch (error) {
      console.log('Audio not supported');
    }
  };

  // Audio Prompt Screen
  if (showAudioPrompt) {
    return (
      <div className="min-h-screen bg-jarvis-dark relative overflow-hidden flex items-center justify-center">
        {/* Background Grid */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="promptGrid" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#14a7d0" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#promptGrid)" />
          </svg>
        </div>

        {/* Audio Prompt */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center bg-jarvis-blue/10 border border-jarvis-blue/30 rounded-2xl p-12 backdrop-blur-sm"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-24 h-24 mx-auto mb-6 bg-jarvis-blue/20 border-2 border-jarvis-blue rounded-full flex items-center justify-center"
          >
            <span className="text-4xl">🔊</span>
          </motion.div>
          
          <h1 className="text-3xl font-mono font-bold text-jarvis-blue mb-4">
            JARVIS Audio System
          </h1>
          
          <p className="text-jarvis-blue-light font-mono text-lg mb-8 max-w-md">
            Enable audio to experience the full JARVIS interface with voice feedback and cinematic sounds.
          </p>
          
          <motion.button
            onClick={enableAudio}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-jarvis-blue/20 border-2 border-jarvis-blue text-jarvis-blue font-mono font-bold px-8 py-4 rounded-lg hover:bg-jarvis-blue/30 transition-all duration-300"
          >
            Enable Audio & Continue
          </motion.button>
          
          <p className="text-jarvis-blue-light/60 font-mono text-sm mt-4">
            Click to activate audio and start the JARVIS experience
          </p>
        </motion.div>

        {/* Corner HUD Elements */}
        <div className="hud-corner hud-corner-tl"></div>
        <div className="hud-corner hud-corner-tr"></div>
        <div className="hud-corner hud-corner-bl"></div>
        <div className="hud-corner hud-corner-br"></div>
      </div>
    );
  }

  // Loading Screen Component
  if (isLoading) {
    return (
      <div className="min-h-screen bg-jarvis-dark relative overflow-hidden flex items-center justify-center">
        {/* Animated Background Grid */}
        <motion.div
          className="absolute inset-0 opacity-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2 }}
          transition={{ duration: 1 }}
        >
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="loadingGrid" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#14a7d0" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#loadingGrid)" />
          </svg>
        </motion.div>

        {/* Central Loading Interface */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 text-center"
        >
          {/* JARVIS Logo */}
          <motion.div
            className="mb-8"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <motion.div
              className="relative w-32 h-32 mx-auto"
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              <svg className="w-full h-full" viewBox="0 0 128 128">
                <circle cx="64" cy="64" r="60" fill="none" stroke="#14a7d0" strokeWidth="2" opacity="0.6" />
                <circle cx="64" cy="4" r="3" fill="#14a7d0" />
                <circle cx="64" cy="124" r="3" fill="#14a7d0" />
                <circle cx="4" cy="64" r="3" fill="#14a7d0" />
                <circle cx="124" cy="64" r="3" fill="#14a7d0" />
              </svg>
              
              <motion.div
                className="absolute inset-4"
                animate={{ rotate: -360 }}
                transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
              >
                <svg className="w-full h-full" viewBox="0 0 120 120">
                  <polygon
                    points="60,10 100,40 100,80 60,110 20,80 20,40"
                    fill="none"
                    stroke="#39ff14"
                    strokeWidth="2"
                    opacity="0.8"
                  />
                </svg>
              </motion.div>

              <div className="absolute inset-8 bg-jarvis-blue/20 border-2 border-jarvis-blue rounded-full flex items-center justify-center">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-4 h-4 bg-jarvis-blue rounded-full"
                />
              </div>
            </motion.div>
          </motion.div>

          {/* Loading Text */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-mono font-bold text-jarvis-blue mb-2">
              J.A.R.V.I.S
            </h1>
            <p className="text-jarvis-blue-light font-mono text-lg">
              Just A Rather Very Intelligent System
            </p>
          </motion.div>

          {/* Progress Bar */}
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "100%", opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="w-96 mx-auto mb-6"
          >
            <div className="bg-jarvis-blue/20 border border-jarvis-blue/50 rounded-full h-3 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-jarvis-blue to-neon-green rounded-full relative"
                style={{ width: `${loadingProgress}%` }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className="absolute inset-0 bg-white/20"
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                />
              </motion.div>
            </div>
            <div className="flex justify-between mt-2 text-jarvis-blue-light font-mono text-sm">
              <span>0%</span>
              <span>{Math.round(loadingProgress)}%</span>
              <span>100%</span>
            </div>
          </motion.div>

          {/* Loading Status */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.2 }}
            className="text-center"
          >
            <motion.p
              key={loadingText}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-jarvis-blue font-mono text-lg mb-2"
            >
              {loadingText}
            </motion.p>
            
            {/* Loading Dots */}
            <div className="flex justify-center space-x-1">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 bg-jarvis-blue rounded-full"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.2
                  }}
                />
              ))}
            </div>
          </motion.div>

          {/* System Status Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.5 }}
            className="mt-12 grid grid-cols-2 gap-4 text-jarvis-blue-light font-mono text-sm"
          >
            <div className="flex items-center space-x-2">
              <motion.div
                className="w-2 h-2 bg-neon-green rounded-full"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
              <span>Neural Network: Online</span>
            </div>
            <div className="flex items-center space-x-2">
              <motion.div
                className="w-2 h-2 bg-neon-green rounded-full"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.3 }}
              />
              <span>Voice Recognition: Active</span>
            </div>
            <div className="flex items-center space-x-2">
              <motion.div
                className="w-2 h-2 bg-neon-green rounded-full"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.6 }}
              />
              <span>HUD Interface: Ready</span>
            </div>
            <div className="flex items-center space-x-2">
              <motion.div
                className="w-2 h-2 bg-neon-green rounded-full"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.9 }}
              />
              <span>Security Protocols: Enabled</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Corner HUD Elements */}
        <div className="hud-corner hud-corner-tl"></div>
        <div className="hud-corner hud-corner-tr"></div>
        <div className="hud-corner hud-corner-bl"></div>
        <div className="hud-corner hud-corner-br"></div>

        {/* Scanning Line */}
        <div className="scan-line"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-jarvis-dark relative overflow-hidden">
      {/* HUD Corner Elements */}
      <div className="hud-corner hud-corner-tl"></div>
      <div className="hud-corner hud-corner-tr"></div>
      <div className="hud-corner hud-corner-bl"></div>
      <div className="hud-corner hud-corner-br"></div>

      {/* Scanning Line */}
      <div className="scan-line"></div>

      {/* Top HUD Bar */}
      <HUDBar />

      {/* Main Content Area */}
      <div className="pt-20 pb-8 px-4 h-screen flex flex-col">
        {/* Central Radar Display */}
        <RadarUI />

        {/* Bottom Section */}
        <div className="mt-auto space-y-6">
          {/* Quick Commands */}
          <div className="flex justify-center">
            <QuickCommands 
              onCommandSelect={processCommand}
              disabled={isProcessing}
            />
          </div>

          {/* Command Input */}
          <div className="flex justify-center">
            <div className="w-full max-w-2xl">
              <CommandInput
                onSendCommand={processCommand}
                isProcessing={isProcessing}
                onToggleMic={toggleMicrophone}
                isListening={isListening}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Status Ticker - Bottom Left */}
      <StatusTicker />

      {/* Conversation Log Toggle Button */}
      <motion.button
        onClick={() => setShowConversation(!showConversation)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed top-24 right-4 z-50 bg-jarvis-blue/20 border border-jarvis-blue/50 rounded-full p-3 text-jarvis-blue hover:bg-jarvis-blue/30 transition-all duration-300"
      >
        <motion.div
          animate={{ rotate: showConversation ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          💬
        </motion.div>
      </motion.button>

      {/* Conversation Log Panel */}
      <ConversationLog
        isVisible={showConversation}
        messages={messages}
        onToggle={() => setShowConversation(false)}
      />

      {/* Loading Overlay */}
      {isProcessing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
        >
          <div className="bg-jarvis-blue/20 border border-jarvis-blue rounded-2xl p-8 text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 border-4 border-jarvis-blue border-t-transparent rounded-full mx-auto mb-4"
            />
            <p className="text-jarvis-blue font-mono text-lg">Processing Command...</p>
            <p className="text-jarvis-blue-light font-mono text-sm mt-2">Please wait</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default App;
