
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
      <div className="flex flex-col items-center justify-center flex-1 space-y-12">
        {/* Stylized DS Logo - both letters animate together */}
        <div className="relative">
          {/* D and S Letters - animate together from center with slower transition */}
          <div 
            className={`text-[8rem] md:text-[12rem] lg:text-[16rem] font-bold text-gray-900 leading-none transform transition-all duration-2500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${
              isLoaded 
                ? 'translate-y-0 opacity-100 scale-100' 
                : 'translate-y-0 opacity-0 scale-75'
            }`}
            style={{ 
              fontFamily: "'Giaza Senthil', serif",
              letterSpacing: '-0.15em',
              transitionDelay: '500ms'
            }}
          >
            <span className="inline-block relative">
              D
            </span>
            <span 
              className="inline-block relative"
              style={{ 
                marginTop: '-0.3em',
                marginLeft: '0.1em'
              }}
            >
              S
            </span>
          </div>
        </div>

        {/* Names Text - animates from left side with slower transition */}
        <div 
          className={`text-xs md:text-sm lg:text-base tracking-[0.4em] text-gray-700 font-light uppercase transform transition-all duration-2000 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${
            isLoaded 
              ? 'translate-x-0 opacity-100 blur-0' 
              : '-translate-x-full opacity-0 blur-sm'
          }`}
          style={{ 
            letterSpacing: '0.4em',
            fontFamily: "'Giaza Senthil', serif",
            transitionDelay: '1200ms',
            fontSize: 'clamp(0.7rem, 2vw, 1rem)'
          }}
        >
          DANIAL & SYAHIRAH
        </div>
      </div>

      {/* Start Button with slower entrance */}
      <div 
        className={`pb-20 transform transition-all duration-1500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${
          isLoaded 
            ? 'translate-y-0 opacity-100 scale-100' 
            : 'translate-y-12 opacity-0 scale-95'
        }`}
        style={{ transitionDelay: '1800ms' }}
      >
        <Button 
          className="bg-gray-900 hover:bg-gray-800 text-white px-16 py-5 rounded-full text-sm tracking-[0.3em] uppercase font-light transition-all duration-500 hover:scale-105 hover:shadow-2xl shadow-xl border-2 border-gray-900 hover:border-gray-700"
          style={{ 
            fontFamily: "'Giaza Senthil', serif",
            backdropFilter: 'blur(10px)'
          }}
          onClick={() => {
            // Add your navigation logic here
            console.log('Start clicked - navigate to main site');
          }}
        >
          START
        </Button>
      </div>

      {/* Enhanced background with slower, more subtle movement */}
      <div 
        className={`absolute inset-0 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 opacity-60 transform transition-all duration-4000 ease-out ${
          isLoaded ? 'scale-110 rotate-1' : 'scale-100 rotate-0'
        }`}
        style={{ transitionDelay: '200ms' }}
      />
      
      {/* Additional subtle background layer with slower animation */}
      <div 
        className={`absolute inset-0 bg-gradient-radial from-transparent via-white/10 to-transparent transform transition-all duration-3500 ease-out ${
          isLoaded ? 'scale-125 opacity-30' : 'scale-100 opacity-0'
        }`}
        style={{ transitionDelay: '1000ms' }}
      />
    </div>
  );
};

export default Index;
