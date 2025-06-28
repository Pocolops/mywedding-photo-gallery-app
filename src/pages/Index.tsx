
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const [animationPhase, setAnimationPhase] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // Phase 0: Initial state (D from top, S from bottom, hidden text and button)
    // Phase 1: Everything animates together smoothly (after 2000ms)
    
    const timer1 = setTimeout(() => {
      setAnimationPhase(1);
    }, 2000);

    return () => {
      clearTimeout(timer1);
    };
  }, []);

  const handleStartClick = () => {
    navigate('/menu');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-200 relative overflow-hidden font-serif">
      {/* Main Content Container */}
      <div className="flex flex-col items-center justify-center flex-1 relative">
        
        {/* DS Letters Container */}
        <div className="relative flex items-center justify-center">
          {/* D Letter */}
          <div 
            className={`text-[18rem] font-bold text-gray-900 leading-none transition-all duration-[6000ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] absolute z-10 ${
              animationPhase === 0 
                ? '-translate-y-[600px] opacity-0 scale-80' 
                : '-translate-x-12 -translate-y-4 opacity-100 scale-100'
            }`}
            style={{ 
              fontFamily: '"Giaza Senthil", Georgia, "Times New Roman", serif'
            }}
          >
            D
          </div>
          
          {/* S Letter */}
          <div 
            className={`text-[18rem] font-bold text-gray-900 leading-none transition-all duration-[6000ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] absolute z-0 ${
              animationPhase === 0 
                ? 'translate-y-[600px] opacity-0 scale-80' 
                : 'translate-x-16 translate-y-24 opacity-100 scale-100'
            }`}
            style={{ 
              fontFamily: '"Giaza Senthil", Georgia, "Times New Roman", serif'
            }}
          >
            S
          </div>
        </div>

        {/* Names Text - animates simultaneously with letters */}
        <div 
          className={`absolute top-[65%] -left-32 text-[0.9rem] tracking-[0.3em] text-gray-700 font-normal uppercase transition-all duration-[6000ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${
            animationPhase >= 1
              ? '-translate-x-8 opacity-100 blur-0' 
              : '-translate-x-96 opacity-0 blur-sm'
          }`}
          style={{ 
            letterSpacing: '0.3em',
            lineHeight: '1.6',
            fontFamily: 'Georgia, "Times New Roman", serif'
          }}
        >
          DANIAL &<br />SYAHIRAH
        </div>
      </div>

      {/* Start Button - animates with everything else */}
      <div 
        className={`pb-16 transform transition-all duration-[6000ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${
          animationPhase >= 1
            ? 'translate-y-0 opacity-100 scale-100' 
            : 'translate-y-16 opacity-0 scale-85'
        }`}
      >
        <Button 
          className="bg-gray-900 hover:bg-gray-800 text-white px-20 py-4 rounded-full text-[0.7rem] tracking-[0.4em] uppercase font-normal transition-all duration-300 hover:scale-105 hover:shadow-lg shadow-md"
          style={{ 
            letterSpacing: '0.4em',
            fontFamily: 'Georgia, "Times New Roman", serif'
          }}
          onClick={handleStartClick}
        >
          START
        </Button>
      </div>
    </div>
  );
};

export default Index;
