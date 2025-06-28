
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

const Index = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Trigger animations after component mounts
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 relative overflow-hidden">
      {/* Main Logo Container */}
      <div className="flex flex-col items-center justify-center flex-1 space-y-8">
        {/* Sophisticated DS Logo */}
        <div className="relative">
          <div 
            className={`relative transform transition-all duration-3000 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${
              isLoaded 
                ? 'translate-y-0 opacity-100 scale-100' 
                : 'translate-y-0 opacity-0 scale-75'
            }`}
            style={{ 
              transitionDelay: '500ms'
            }}
          >
            {/* Intertwined DS Logo */}
            <svg 
              width="280" 
              height="320" 
              viewBox="0 0 280 320" 
              className="text-gray-900"
              style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.1))' }}
            >
              {/* D Letter */}
              <path 
                d="M20 40 L20 280 L120 280 C180 280 220 240 220 180 L220 140 C220 80 180 40 120 40 Z M60 80 L120 80 C150 80 180 110 180 140 L180 180 C180 210 150 240 120 240 L60 240 Z" 
                fill="currentColor"
                className="opacity-95"
              />
              
              {/* S Letter - Intertwined */}
              <path 
                d="M160 60 C160 60 200 60 240 80 C260 90 280 110 280 140 C280 160 270 175 250 185 C270 195 280 210 280 240 C280 270 260 290 240 300 C200 320 160 320 160 320 C160 320 140 310 140 290 C140 290 160 280 180 280 C200 280 220 270 240 260 C240 250 240 240 220 235 L180 220 C160 215 140 200 140 180 C140 160 150 145 170 135 C150 125 140 110 140 80 C140 50 160 30 180 20 C200 10 220 10 240 20 C240 40 220 50 200 50 C180 50 160 60 160 60 Z" 
                fill="currentColor"
                className="opacity-95"
              />
              
              {/* Connecting curve element */}
              <path 
                d="M140 160 Q160 140 180 160 Q200 180 220 160" 
                stroke="currentColor" 
                strokeWidth="3" 
                fill="none"
                className="opacity-40"
              />
            </svg>
          </div>
        </div>

        {/* Names Text - animates from left side */}
        <div 
          className={`text-xs tracking-[0.3em] text-gray-600 font-medium uppercase transform transition-all duration-2500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${
            isLoaded 
              ? 'translate-x-0 opacity-100 blur-0' 
              : '-translate-x-full opacity-0 blur-sm'
          }`}
          style={{ 
            letterSpacing: '0.3em',
            fontFamily: "'Giaza Senthil', serif",
            transitionDelay: '1200ms',
            fontSize: 'clamp(0.65rem, 1.8vw, 0.9rem)'
          }}
        >
          DANIAL & SYAHIRAH
        </div>
      </div>

      {/* Start Button with refined styling */}
      <div 
        className={`pb-16 transform transition-all duration-2000 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${
          isLoaded 
            ? 'translate-y-0 opacity-100 scale-100' 
            : 'translate-y-12 opacity-0 scale-95'
        }`}
        style={{ transitionDelay: '1800ms' }}
      >
        <Button 
          className="bg-gray-900 hover:bg-gray-800 text-white px-20 py-4 rounded-full text-xs tracking-[0.4em] uppercase font-medium transition-all duration-500 hover:scale-105 hover:shadow-xl shadow-lg border border-gray-900"
          style={{ 
            fontFamily: "'Giaza Senthil', serif",
            letterSpacing: '0.4em'
          }}
          onClick={() => {
            console.log('Start clicked - navigate to main site');
          }}
        >
          START
        </Button>
      </div>

      {/* Subtle background gradient */}
      <div 
        className={`absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-100 opacity-80 transform transition-all duration-4000 ease-out ${
          isLoaded ? 'scale-105 rotate-0.5' : 'scale-100 rotate-0'
        }`}
        style={{ transitionDelay: '200ms' }}
      />
    </div>
  );
};

export default Index;
