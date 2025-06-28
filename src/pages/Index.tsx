
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

const Index = () => {
  const [animationPhase, setAnimationPhase] = useState(0);

  useEffect(() => {
    // Phase 0: Initial state (D at top, S at bottom, hidden text)
    // Phase 1: D and S animate to center and combine (after 500ms)
    // Phase 2: Names animate in from side (after 2000ms)
    
    const timer1 = setTimeout(() => {
      setAnimationPhase(1);
    }, 500);

    const timer2 = setTimeout(() => {
      setAnimationPhase(2);
    }, 2000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-200 relative overflow-hidden font-serif">
      {/* Main Content Container */}
      <div className="flex flex-col items-center justify-center flex-1 relative">
        
        {/* DS Letters Container */}
        <div className="relative flex items-center justify-center">
          {/* D Letter */}
          <div 
            className={`text-[16rem] font-bold text-gray-900 leading-none transition-all duration-2000 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${
              animationPhase === 0 
                ? '-translate-y-[500px] opacity-70' 
                : 'translate-y-0 opacity-100'
            }`}
            style={{ 
              fontFamily: 'Georgia, "Times New Roman", serif',
              marginRight: '-0.5em'
            }}
          >
            D
          </div>
          
          {/* S Letter */}
          <div 
            className={`text-[16rem] font-bold text-gray-900 leading-none transition-all duration-2000 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${
              animationPhase === 0 
                ? 'translate-y-[500px] opacity-70' 
                : 'translate-y-0 opacity-100'
            }`}
            style={{ 
              fontFamily: 'Georgia, "Times New Roman", serif',
              marginLeft: '-0.5em'
            }}
          >
            S
          </div>
        </div>

        {/* Names Text - positioned under D letter */}
        <div 
          className={`absolute top-[70%] left-[35%] text-[0.8rem] tracking-[0.3em] text-gray-700 font-normal uppercase transform transition-all duration-1500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${
            animationPhase >= 2
              ? 'translate-x-0 opacity-100 blur-0' 
              : '-translate-x-full opacity-0 blur-sm'
          }`}
          style={{ 
            letterSpacing: '0.3em',
            transitionDelay: animationPhase >= 2 ? '0ms' : '0ms',
            lineHeight: '1.6',
            fontFamily: 'Georgia, "Times New Roman", serif'
          }}
        >
          DANIAL &<br />SYAHIRAH
        </div>
      </div>

      {/* Start Button */}
      <div 
        className={`pb-16 transform transition-all duration-1500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${
          animationPhase >= 2
            ? 'translate-y-0 opacity-100 scale-100' 
            : 'translate-y-8 opacity-60 scale-95'
        }`}
        style={{ transitionDelay: animationPhase >= 2 ? '300ms' : '0ms' }}
      >
        <Button 
          className="bg-gray-900 hover:bg-gray-800 text-white px-20 py-4 rounded-full text-[0.7rem] tracking-[0.4em] uppercase font-normal transition-all duration-300 hover:scale-105 hover:shadow-lg shadow-md"
          style={{ 
            letterSpacing: '0.4em',
            fontFamily: 'Georgia, "Times New Roman", serif'
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
