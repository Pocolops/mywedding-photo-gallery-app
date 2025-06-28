
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-200 relative overflow-hidden">
      {/* Main Content Container */}
      <div className="flex flex-col items-center justify-center flex-1 relative">
        
        {/* DS Letters Container */}
        <div className="relative">
          <svg 
            width="300" 
            height="400" 
            viewBox="0 0 300 400" 
            className="text-gray-900"
          >
            {/* D Letter */}
            <path 
              d="M30 60 L30 260 L110 260 C170 260 210 220 210 160 L210 160 C210 100 170 60 110 60 Z M70 100 L110 100 C140 100 170 130 170 160 L170 160 C170 190 140 220 110 220 L70 220 Z"
              fill="currentColor"
              className={`transition-all duration-2000 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${
                animationPhase === 0 
                  ? 'translate-y-[-200px] opacity-70' 
                  : 'translate-y-0 opacity-100'
              }`}
            />
            
            {/* S Letter - Sophisticated curved S */}
            <path 
              d="M150 200 C150 200 190 195 230 215 C250 225 265 245 265 270 C265 290 255 305 240 315 C255 325 265 340 265 365 C265 395 245 415 225 425 C190 440 150 440 150 440 C150 440 130 435 130 415 C130 415 150 410 170 410 C190 410 210 405 225 395 C225 385 225 375 210 370 L175 355 C155 350 135 335 135 315 C135 295 145 280 160 270 C145 260 135 245 135 220 C135 195 155 175 175 165 C195 155 215 155 230 165 C230 180 215 185 200 185 C180 185 165 190 150 200 Z"
              fill="currentColor"
              className={`transition-all duration-2000 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${
                animationPhase === 0 
                  ? 'translate-y-[200px] opacity-70' 
                  : 'translate-y-0 opacity-100'
              }`}
            />
          </svg>
        </div>

        {/* Names Text - positioned under D letter */}
        <div 
          className={`absolute top-[60%] left-[35%] text-[0.6rem] tracking-[0.2em] text-gray-700 font-normal uppercase transform transition-all duration-1500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${
            animationPhase >= 2
              ? 'translate-x-0 opacity-100 blur-0' 
              : '-translate-x-full opacity-0 blur-sm'
          }`}
          style={{ 
            letterSpacing: '0.2em',
            transitionDelay: animationPhase >= 2 ? '0ms' : '0ms',
            lineHeight: '1.4'
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
          className="bg-gray-900 hover:bg-gray-800 text-white px-20 py-4 rounded-full text-[0.65rem] tracking-[0.4em] uppercase font-normal transition-all duration-300 hover:scale-105 hover:shadow-lg shadow-md"
          style={{ 
            letterSpacing: '0.4em'
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
