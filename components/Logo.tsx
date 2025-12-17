import React, { useState } from 'react';

interface LogoProps {
  className?: string;
  large?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = "", large = false }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div className={`flex items-center justify-center ${className}`}>
      {!imageError ? (
        <img 
          src="/logo.png" 
          alt="King Burguer" 
          className={`${large ? 'h-32' : 'h-16'} w-auto object-contain transition-transform hover:scale-105`}
          onError={() => setImageError(true)}
        />
      ) : (
        /* CSS Fallback that matches the brand identity if image is missing */
        <div className="flex flex-col items-center leading-none select-none">
            <div className={`relative z-10 ${large ? 'text-6xl mb-2' : 'text-3xl'}`}>
                <span className="absolute -top-1 left-1/2 -translate-x-1/2 animate-pulse opacity-80">🔥</span>
                <span>🍔</span>
            </div>
            <h1 
                className={`font-display text-secondary tracking-wider ${large ? 'text-4xl' : 'text-2xl'}`}
                style={{ 
                    textShadow: '2px 2px 0px #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000',
                    color: '#FFD700'
                }}
            >
                KING BURGUER
            </h1>
        </div>
      )}
    </div>
  );
};