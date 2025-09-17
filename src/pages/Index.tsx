import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const [animationPhase, setAnimationPhase] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // Phase 0: Initial state (D from top, S from bottom, hidden text and button)
    // Phase 1: Everything animates together smoothly (after 1200ms for dramatic pause)
    
    const timer1 = setTimeout(() => {
      setAnimationPhase(1);
    }, 1200);

    return () => {
      clearTimeout(timer1);
    };
  }, []);

  const handleStartClick = () => {
    navigate('/menu');
  };

  return (
    <div className="h-[100svh] flex flex-col items-center justify-center bg-gray-200 relative overflow-hidden font-serif">
      {/* Main Content Container - moved up for mobile */}
      <div className="flex flex-col items-center justify-center h-full w-full relative -translate-y-8 md:-translate-y-4">
        
        {/* DS Letters Container */}
        <div className="relative flex items-center justify-center">
          {/* D Letter */}
          <div 
            className={`text-[12rem] md:text-[16rem] lg:text-[18rem] font-bold text-gray-900 leading-none absolute z-10 ${
              animationPhase === 0 
                ? '-translate-y-[600px] opacity-0 scale-75' 
                : '-translate-x-8 md:-translate-x-12 -translate-y-2 md:-translate-y-4 opacity-100 scale-100'
            }`}
            style={{ 
              fontFamily: '"Giaza Senthil", Georgia, "Times New Roman", serif',
              filter: animationPhase === 0 ? 'blur(8px)' : 'blur(0px)',
              transition: 'all 4000ms cubic-bezier(0.19,1,0.22,1), filter 4000ms cubic-bezier(0.19,1,0.22,1)'
            }}
          >
            D
          </div>
          
          {/* S Letter */}
          <div 
            className={`text-[12rem] md:text-[16rem] lg:text-[18rem] font-bold text-gray-900 leading-none absolute z-0 ${
              animationPhase === 0 
                ? 'translate-y-[600px] opacity-0 scale-75' 
                : 'translate-x-12 md:translate-x-16 translate-y-16 md:translate-y-24 opacity-100 scale-100'
            }`}
            style={{ 
              fontFamily: '"Giaza Senthil", Georgia, "Times New Roman", serif',
              filter: animationPhase === 0 ? 'blur(8px)' : 'blur(0px)',
              transition: 'all 4200ms cubic-bezier(0.19,1,0.22,1), filter 4200ms cubic-bezier(0.19,1,0.22,1)',
              transitionDelay: '200ms'
            }}
          >
            S
          </div>
        </div>

        {/* Names Text - positioned below the D letter */}
        <div 
          className={`absolute top-[68%] md:top-[60%] lg:top-[65%] left-1/2 transform -translate-x-1/2 -translate-x-36 text-[0.8rem] md:text-[0.9rem] tracking-[0.3em] text-gray-700 font-normal uppercase ${
            animationPhase >= 1
              ? 'opacity-100 blur-0 scale-100' 
              : 'opacity-0 blur-sm scale-75'
          }`}
          style={{ 
            letterSpacing: '0.3em',
            lineHeight: '1.6',
            fontFamily: 'Georgia, "Times New Roman", serif',
            filter: animationPhase === 0 ? 'blur(8px)' : 'blur(0px)',
            transition: 'all 4000ms cubic-bezier(0.19,1,0.22,1), filter 4000ms cubic-bezier(0.19,1,0.22,1)',
            transitionDelay: '800ms'
          }}
        >
          DANIAL &<br />SYAHIRAH
        </div>
      </div>

      {/* Start Button - moved up for mobile visibility */}
      <div 
        className={`absolute bottom-8 md:bottom-16 lg:bottom-20 transform ${
          animationPhase >= 1
            ? 'translate-y-0 opacity-100 scale-100 blur-0' 
            : 'translate-y-32 opacity-0 scale-75 blur-sm'
        }`}
        style={{
          filter: animationPhase === 0 ? 'blur(8px)' : 'blur(0px)',
          transition: 'all 4000ms cubic-bezier(0.19,1,0.22,1), filter 4000ms cubic-bezier(0.19,1,0.22,1)',
          transitionDelay: '1500ms'
        }}
      >
        <Button 
          className={`relative overflow-hidden text-white px-20 py-4 rounded-full text-[0.7rem] tracking-[0.4em] uppercase font-normal transition-all duration-500 hover:scale-105 shadow-2xl ${
            animationPhase >= 1 ? 'animate-pulse' : ''
          }`}
          style={{ 
            letterSpacing: '0.4em',
            fontFamily: 'Georgia, "Times New Roman", serif',
            background: 'linear-gradient(135deg, #1f2937 0%, #374151 25%, #1f2937 50%, #4b5563 75%, #1f2937 100%)',
            backgroundSize: '200% 200%',
            animation: animationPhase >= 1 ? 'gradient-shift 3s ease-in-out infinite, subtle-glow 2s ease-in-out infinite alternate' : 'none',
            boxShadow: animationPhase >= 1 
              ? '0 0 30px rgba(75, 85, 99, 0.4), 0 0 60px rgba(75, 85, 99, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)' 
              : '0 10px 25px rgba(0, 0, 0, 0.3)'
          }}
          onClick={handleStartClick}
        >
          <span className="relative z-10">START</span>
          {/* Gradient overlay for lighting effect */}
          <div 
            className="absolute inset-0 rounded-full opacity-30 pointer-events-none"
            style={{
              background: 'linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%)',
              animation: animationPhase >= 1 ? 'shine 4s ease-in-out infinite' : 'none'
            }}
          />
        </Button>
      </div>
      
      <style>{`
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes subtle-glow {
          0% { box-shadow: 0 0 30px rgba(75, 85, 99, 0.4), 0 0 60px rgba(75, 85, 99, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1); }
          100% { box-shadow: 0 0 40px rgba(75, 85, 99, 0.6), 0 0 80px rgba(75, 85, 99, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2); }
        }
        
        @keyframes shine {
          0% { transform: translateX(-100%) rotate(45deg); }
          50% { transform: translateX(100%) rotate(45deg); }
          100% { transform: translateX(-100%) rotate(45deg); }
        }
      `}</style>
    </div>
  );
};

export default Index;
