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
      x: Math.random() * window.innerWidth,
      y: -20,
      opacity: Math.random() * 0.6 + 0.2,
      speed: Math.random() * 2 + 1,
      size: Math.random() * 15 + 10,
      rotation: Math.random() * 360,
      rotationSpeed: Math.random() * 4 - 2,
    });

    const initBolts = () => {
      const initialBolts: Bolt[] = [];
      for (let i = 0; i < 15; i++) {
        initialBolts.push({
          ...createBolt(i),
          y: Math.random() * window.innerHeight,
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
          if (newY > window.innerHeight + 20) {
            return {
              ...createBolt(bolt.id),
              x: Math.random() * window.innerWidth,
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

    initBolts();
    const interval = setInterval(animateBolts, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {bolts.map(bolt => (
        <div
          key={bolt.id}
          className="absolute transition-all duration-75 ease-linear"
          style={{
            left: `${bolt.x}px`,
            top: `${bolt.y}px`,
            opacity: bolt.opacity,
            transform: `rotate(${bolt.rotation}deg)`,
            fontSize: `${bolt.size}px`,
            color: '#00cc6a',
            filter: 'drop-shadow(0 0 4px rgba(0, 204, 106, 0.3))',
          }}
        >
          ⚡
        </div>
      ))}
    </div>
  );
}