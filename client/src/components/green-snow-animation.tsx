import { useEffect, useState } from 'react';

interface Snowflake {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  drift: number;
  opacity: number;
}

export default function GreenSnowAnimation() {
  const [snowflakes, setSnowflakes] = useState<Snowflake[]>([]);

  useEffect(() => {
    const createSnowflake = (id: number): Snowflake => ({
      id,
      x: Math.random() * (window.innerWidth || 1920),
      y: -10,
      size: Math.random() * 4 + 2,
      speed: Math.random() * 2 + 1,
      drift: Math.random() * 1 - 0.5,
      opacity: Math.random() * 0.6 + 0.4,
    });

    const initSnowflakes = () => {
      const initialFlakes: Snowflake[] = [];
      for (let i = 0; i < 50; i++) {
        initialFlakes.push({
          ...createSnowflake(i),
          y: Math.random() * (window.innerHeight || 1080),
        });
      }
      setSnowflakes(initialFlakes);
    };

    const animateSnowflakes = () => {
      setSnowflakes(currentFlakes => 
        currentFlakes.map(flake => {
          const newY = flake.y + flake.speed;
          const newX = flake.x + flake.drift;
          
          // Reset snowflake when it goes off screen
          if (newY > (window.innerHeight || 1080) + 10) {
            return {
              ...createSnowflake(flake.id),
              x: Math.random() * (window.innerWidth || 1920),
            };
          }
          
          // Wrap horizontally
          const wrappedX = newX < -10 
            ? (window.innerWidth || 1920) + 10 
            : newX > (window.innerWidth || 1920) + 10 
              ? -10 
              : newX;
          
          return {
            ...flake,
            x: wrappedX,
            y: newY,
          };
        })
      );
    };

    // Wait for window to be available
    const timer = setTimeout(() => {
      initSnowflakes();
      const interval = setInterval(animateSnowflakes, 50);
      return () => clearInterval(interval);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {snowflakes.map(flake => (
        <div
          key={flake.id}
          className="absolute rounded-full transition-all duration-75 ease-linear"
          style={{
            left: `${flake.x}px`,
            top: `${flake.y}px`,
            width: `${flake.size}px`,
            height: `${flake.size}px`,
            opacity: flake.opacity,
            backgroundColor: '#00cc6a',
            boxShadow: `0 0 ${flake.size * 2}px rgba(0, 204, 106, 0.5)`,
          }}
        />
      ))}
    </div>
  );
}