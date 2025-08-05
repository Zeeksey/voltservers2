import { useEffect, useState } from 'react';
import SnowAnimation from './snow-animation';

interface HolidayEffectsProps {
  theme: 'none' | 'snow' | 'halloween' | 'easter' | 'christmas';
}

export default function HolidayEffects({ theme }: HolidayEffectsProps) {
  const [easterEggs, setEasterEggs] = useState<Array<{ id: number; x: number; y: number; emoji: string }>>([]);

  useEffect(() => {
    if (theme === 'easter') {
      // Create floating easter eggs
      const eggs: Array<{ id: number; x: number; y: number; emoji: string }> = [];
      const emojis = ['🥚', '🐰', '🌸', '🌷'];
      
      for (let i = 0; i < 20; i++) {
        eggs.push({
          id: i,
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          emoji: emojis[Math.floor(Math.random() * emojis.length)]
        });
      }
      setEasterEggs(eggs);
    }
  }, [theme]);

  if (theme === 'none') return null;

  return (
    <>
      {theme === 'snow' && <SnowAnimation />}
      
      {theme === 'halloween' && (
        <div className="holiday-halloween fixed inset-0 pointer-events-none z-10">
          <div className="absolute top-10 left-10 text-6xl animate-bounce">🎃</div>
          <div className="absolute top-20 right-20 text-4xl animate-pulse">👻</div>
          <div className="absolute bottom-20 left-20 text-5xl animate-bounce delay-500">🦇</div>
          <div className="absolute bottom-10 right-10 text-3xl animate-pulse delay-1000">🕷️</div>
        </div>
      )}
      
      {theme === 'easter' && (
        <div className="holiday-easter fixed inset-0 pointer-events-none z-10">
          {easterEggs.map(egg => (
            <div
              key={egg.id}
              className="absolute text-4xl animate-float"
              style={{
                left: `${egg.x}px`,
                top: `${egg.y}px`,
                animationDelay: `${Math.random() * 2}s`
              }}
            >
              {egg.emoji}
            </div>
          ))}
        </div>
      )}
      
      {theme === 'christmas' && (
        <div className="fixed inset-0 pointer-events-none z-10">
          <div className="absolute top-10 left-10 text-6xl animate-bounce">🎄</div>
          <div className="absolute top-20 right-20 text-4xl animate-pulse">⭐</div>
          <div className="absolute bottom-20 left-20 text-5xl animate-bounce delay-500">🎁</div>
          <div className="absolute bottom-10 right-10 text-3xl animate-pulse delay-1000">🔔</div>
          <SnowAnimation />
        </div>
      )}
    </>
  );
}