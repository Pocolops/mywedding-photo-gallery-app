
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
            {/* Clean DS Monogram */}
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
              
              {/* S Letter - Normal, clean design */}
              <path 
                d="M120 60 C105 60 90 70 90 85 C90 95 95 105 110 110 L140 120 C155 125 165 135 165 150 C165 170 150 180 130 180 C115 180 100 175 100 160 L70 160 C70 190 95 210 130 210 C165 210 195 190 195 150 C195 130 185 115 165 110 L135 100 C125 97 115 92 115 85 C115 75 125 70 135 70 C145 70 155 75 155 85 L185 85 C185 65 165 40 130 40 C125 45 122.5 52.5 120 60 Z" 
                fill="currentColor"
                className="opacity-95"
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
