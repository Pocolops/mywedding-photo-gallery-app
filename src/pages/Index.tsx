
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 relative overflow-hidden">
      {/* Main Content Container */}
      <div className="flex flex-col items-center justify-center flex-1 space-y-6">
        {/* Elegant DS Monogram */}
        <div className="relative">
          <div 
            className={`relative transform transition-all duration-3000 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${
              isLoaded 
                ? 'translate-y-0 opacity-100 scale-100' 
                : 'translate-y-0 opacity-0 scale-90'
            }`}
            style={{ 
              transitionDelay: '300ms'
            }}
          >
            {/* Sophisticated DS Monogram */}
            <svg 
              width="200" 
              height="280" 
              viewBox="0 0 200 280" 
              className="text-gray-900"
              style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.1))' }}
            >
              {/* D Letter - Left side */}
              <path 
                d="M20 40 L20 240 L80 240 C130 240 160 210 160 160 L160 120 C160 70 130 40 80 40 Z M50 70 L80 70 C110 70 130 90 130 120 L130 160 C130 190 110 210 80 210 L50 210 Z" 
                fill="currentColor"
                className="opacity-95"
              />
              
              {/* S Letter - Intertwined and flowing */}
              <path 
                d="M110 60 C110 60 140 55 170 70 C185 78 195 90 195 110 C195 125 190 135 180 142 C190 150 195 162 195 180 C195 205 180 220 165 228 C140 240 110 240 110 240 C110 240 95 235 95 220 C95 220 110 215 125 215 C140 215 155 210 165 202 C165 195 165 188 155 185 L130 175 C115 172 100 162 100 145 C100 130 108 120 120 115 C108 108 100 98 100 80 C100 60 115 45 130 38 C145 30 160 30 170 38 C170 50 160 55 150 55 C135 55 125 60 110 60 Z" 
                fill="currentColor"
                className="opacity-95"
              />
              
              {/* Elegant connecting flourish */}
              <circle 
                cx="120" 
                cy="200" 
                r="12" 
                fill="currentColor"
                className="opacity-90"
              />
            </svg>
          </div>
        </div>

        {/* Names Text - slides in from left */}
        <div 
          className={`text-[0.65rem] tracking-[0.25em] text-gray-600 font-normal uppercase transform transition-all duration-2500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${
            isLoaded 
              ? 'translate-x-0 opacity-100 blur-0' 
              : '-translate-x-full opacity-0 blur-sm'
          }`}
          style={{ 
            letterSpacing: '0.25em',
            transitionDelay: '800ms'
          }}
        >
          DANIAL &<br />SYAHIRAH
        </div>
      </div>

      {/* Start Button */}
      <div 
        className={`pb-20 transform transition-all duration-2000 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${
          isLoaded 
            ? 'translate-y-0 opacity-100 scale-100' 
            : 'translate-y-12 opacity-0 scale-95'
        }`}
        style={{ transitionDelay: '1200ms' }}
      >
        <Button 
          className="bg-gray-900 hover:bg-gray-800 text-white px-16 py-3 rounded-full text-[0.7rem] tracking-[0.3em] uppercase font-normal transition-all duration-300 hover:scale-105 hover:shadow-lg shadow-md"
          style={{ 
            letterSpacing: '0.3em'
          }}
          onClick={() => {
            console.log('Start clicked - navigate to main site');
          }}
        >
          START
        </Button>
      </div>
    </div>
  );
};

export default Index;
