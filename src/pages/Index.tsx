
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
      {/* Main Logo Container */}
      <div className="flex flex-col items-center justify-center flex-1 space-y-8">
        {/* Stylized DS Logo */}
        <div 
          className={`text-9xl md:text-[12rem] font-bold text-gray-800 leading-none transform transition-all duration-1000 ease-out ${
            isLoaded 
              ? 'translate-y-0 opacity-100 scale-100' 
              : 'translate-y-12 opacity-0 scale-95'
          }`}
          style={{ 
            fontFamily: 'serif',
            letterSpacing: '-0.1em'
          }}
        >
          <span className="inline-block transform transition-all duration-1200 delay-200">D</span>
          <span 
            className="inline-block transform transition-all duration-1200 delay-400"
            style={{ marginLeft: '-0.2em' }}
          >
            S
          </span>
        </div>

        {/* Names Text */}
        <div 
          className={`text-sm md:text-base tracking-[0.3em] text-gray-600 font-light uppercase transform transition-all duration-800 delay-600 ${
            isLoaded 
              ? 'translate-y-0 opacity-100' 
              : 'translate-y-8 opacity-0'
          }`}
          style={{ letterSpacing: '0.3em' }}
        >
          DANIAL & SYAHIRAH
        </div>
      </div>

      {/* Start Button */}
      <div 
        className={`pb-16 transform transition-all duration-800 delay-1000 ${
          isLoaded 
            ? 'translate-y-0 opacity-100' 
            : 'translate-y-8 opacity-0'
        }`}
      >
        <Button 
          className="bg-gray-800 hover:bg-gray-700 text-white px-12 py-4 rounded-full text-sm tracking-wider uppercase font-light transition-all duration-300 hover:scale-105 shadow-lg"
          onClick={() => {
            // Add your navigation logic here
            console.log('Start clicked - navigate to main site');
          }}
        >
          START
        </Button>
      </div>

      {/* Subtle background animation */}
      <div 
        className={`absolute inset-0 bg-gradient-to-br from-transparent via-gray-50 to-transparent opacity-30 transform transition-all duration-2000 ${
          isLoaded ? 'scale-110' : 'scale-100'
        }`}
      />
    </div>
  );
};

export default Index;
