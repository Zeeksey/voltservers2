import { useEffect, useState } from 'react';

interface Bolt {
  id: number;
  x: number;
  y: number;
  opacity: number;
  speed: number;
  size: number;
  rotation: number;
  rotationSpeed: number;
}

export default function BoltAnimation() {
  const [bolts, setBolts] = useState<Bolt[]>([]);

  useEffect(() => {
    const createBolt = (id: number): Bolt => ({
      id,
      x: Math.random() * (window.innerWidth || 1920),
      y: -30,
      opacity: Math.random() * 0.7 + 0.4,
      speed: Math.random() * 1.2 + 0.6,
      size: Math.random() * 18 + 12,
      rotation: Math.random() * 360,
      rotationSpeed: Math.random() * 2 - 1,
    });

    const initBolts = () => {
      const initialBolts: Bolt[] = [];
      for (let i = 0; i < 8; i++) {
        initialBolts.push({
          ...createBolt(i),
          y: Math.random() * (window.innerHeight || 1080),
        });
      }
      setBolts(initialBolts);
    };

    const animateBolts = () => {
      setBolts(currentBolts => 
        currentBolts.map(bolt => {
          const newY = bolt.y + bolt.speed;
          const newRotation = bolt.rotation + bolt.rotationSpeed;
          
          // Reset bolt when it goes off screen
          if (newY > (window.innerHeight || 1080) + 50) {
            return {
              ...createBolt(bolt.id),
              x: Math.random() * (window.innerWidth || 1920),
            };
          }
          
          return {
            ...bolt,
            y: newY,
            rotation: newRotation,
          };
        })
      );
    };

    // Wait for window to be available
    const timer = setTimeout(() => {
      initBolts();
      const interval = setInterval(animateBolts, 60);
      return () => clearInterval(interval);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {bolts.map(bolt => (
        <div
          key={bolt.id}
          className="absolute transition-all duration-75 ease-linear bolt-effect"
          style={{
            left: `${bolt.x}px`,
            top: `${bolt.y}px`,
            opacity: bolt.opacity,
            transform: `rotate(${bolt.rotation}deg)`,
            fontSize: `${bolt.size}px`,
            color: '#00cc6a',
            '--bolt-rotation': `${bolt.rotation}deg`,
            textShadow: '0 0 10px rgba(0, 204, 106, 0.8), 0 0 20px rgba(0, 204, 106, 0.4), 0 0 30px rgba(0, 204, 106, 0.2)',
          } as React.CSSProperties}
        >
          {/* Fallback to styled bolt if emoji doesn't render */}
          <span style={{ display: 'inline-block' }}>
            ⚡
          </span>
          {/* CSS-based bolt as backup */}
          <div 
            className="absolute inset-0 opacity-30"
            style={{
              width: '20px',
              height: '20px',
              background: 'linear-gradient(45deg, transparent 40%, #00cc6a 40%, #00cc6a 60%, transparent 60%)',
              clipPath: 'polygon(20% 0%, 60% 50%, 40% 50%, 80% 100%, 40% 50%, 60% 50%)',
              filter: 'blur(1px)',
            }}
          />
        </div>
      ))}
    </div>
  );
}