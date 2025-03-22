import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLocation as useLocationContext } from '../../context/LocationContext';
import { sendSOS } from '../../services/auth';

const VoiceActivation = () => {
  const { user } = useAuth();
  const { currentLocation } = useLocationContext();
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState(null);
  const recognitionRef = useRef(null);
  const isListeningRef = useRef(false); // Add this ref to track current listening state
  
  // Simple SOS trigger function
  const triggerSOS = async () => {
    if (!user || !currentLocation) return;
    
    try {
      console.log("🔴 SOS TRIGGERED by voice!");
      await sendSOS(user.userId, currentLocation);
      alert('Voice-triggered SOS alert sent to your emergency contacts.');
    } catch (error) {
      console.error('Failed to send voice-triggered SOS:', error);
    }
  };

  // Check browser compatibility
  const checkBrowserCompatibility = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError('Speech recognition is not supported in your browser.');
      return false;
    }
    return true;
  };

  // Stop current recognition session
  const stopRecognition = () => {
    if (recognitionRef.current) {
      try {
        // Set ref to false BEFORE stopping to prevent restart
        isListeningRef.current = false;
        recognitionRef.current.stop();
        console.log('Voice recognition stopped');
      } catch (e) {
        console.error('Error stopping recognition:', e);
      }
    }
  };

  // Setup and start speech recognition
  const startRecognition = () => {
    if (!checkBrowserCompatibility()) return;
    
    stopRecognition();
    
    // Only start if we're supposed to be listening
    if (!isListeningRef.current) return;
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    
    recognition.onstart = () => {
      console.log('Voice recognition started');
    };
    
    recognition.onresult = (event) => {
      // Only process results if we're still listening
      if (!isListeningRef.current) return;
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript.toLowerCase();
        console.log('Heard:', transcript);
        
        // Simple keyword detection - just looking for "help"
        if (transcript.includes('help')) {
          console.log('Help keyword detected!');
          triggerSOS();
        }
      }
    };
    
    recognition.onend = () => {
      console.log('Voice recognition ended');
      // Check the ref value, not the state
      if (isListeningRef.current) {
        setTimeout(() => {
          // Double-check ref is still true before restarting
          if (isListeningRef.current) {
            startRecognition();
          }
        }, 1000);
      }
    };
    
    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      if (event.error === 'not-allowed') {
        setError('Microphone permission denied. Please enable it in your browser settings.');
      } else {
        setError(`Speech recognition error: ${event.error}`);
      }
    };
    
    // Start listening
    try {
      recognition.start();
      recognitionRef.current = recognition;
    } catch (e) {
      console.error('Failed to start speech recognition:', e);
      setError(`Failed to start speech recognition: ${e.message}`);
    }
  };

  // Update ref whenever state changes
  useEffect(() => {
    isListeningRef.current = isListening;
  }, [isListening]);
  
  // Manage recognition based on isListening state
  useEffect(() => {
    if (isListening) {
      startRecognition();
    } else {
      stopRecognition();
    }
    
    return () => {
      stopRecognition();
    };
  }, [isListening]);

  // Toggle listening mode
  const toggleListening = () => {
    setIsListening(prevState => !prevState);
    setError(null); // Clear any previous errors
  };

  return (
    <div className="fixed bottom-24 right-8 z-[9999]">
      {error && (
        <div className="absolute bottom-full right-0 mb-2 p-2 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600 w-48">
          {error}
        </div>
      )}
      <button
        onClick={toggleListening}
        className={`p-2.5 rounded-full shadow-lg transition-all ${
          isListening 
            ? 'bg-red-600 text-white' 
            : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
        }`}
        title={isListening ? "Listening for 'help'" : "Enable voice activation"}
      >
        {/* Microphone icon */}
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
          <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
          <line x1="12" y1="19" x2="12" y2="23"></line>
          <line x1="8" y1="23" x2="16" y2="23"></line>
        </svg>
        
        {isListening && (
          <span className="absolute top-0 right-0 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
        )}
      </button>
    </div>
  );
};

export default VoiceActivation;