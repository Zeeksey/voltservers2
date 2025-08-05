import { useEffect, useState } from 'react';

interface Snowflake {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
}

export default function SnowAnimation() {
  const [snowflakes, setSnowflakes] = useState<Snowflake[]>([]);

  useEffect(() => {
    // Create initial snowflakes
    const initialSnowflakes: Snowflake[] = [];
    for (let i = 0; i < 50; i++) {
      initialSnowflakes.push({
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 4 + 1,
        speed: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.6 + 0.4
      });
    }
    setSnowflakes(initialSnowflakes);

    const animateSnow = () => {
      setSnowflakes(prev => prev.map(flake => ({
        ...flake,
        y: flake.y + flake.speed,
        x: flake.x + Math.sin(flake.y / 100) * 0.5,
        // Reset snowflake at top when it goes off screen
        ...(flake.y > window.innerHeight ? {
          y: -10,
          x: Math.random() * window.innerWidth
        } : {})
      })));
    };

    const interval = setInterval(animateSnow, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="holiday-snow">
      {snowflakes.map(flake => (
        <div
          key={flake.id}
          className="absolute text-white pointer-events-none"
          style={{
            left: `${flake.x}px`,
            top: `${flake.y}px`,
            fontSize: `${flake.size}px`,
            opacity: flake.opacity,
            transform: 'translateZ(0)'
          }}
        >
          ❄
        </div>
      ))}
    </div>
  );
}