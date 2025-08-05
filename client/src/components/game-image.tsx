import { useState } from 'react';

interface GameImageProps {
  src: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  gameSlug?: string;
}

// Map of game slugs to local SVG images
const LOCAL_GAME_IMAGES: Record<string, string> = {
  'minecraft': '/images/games/minecraft.svg',
  'minecraft-java': '/images/games/minecraft.svg',
  'rust': '/images/games/rust.svg',
  'cs2': '/images/games/cs2.svg',
  'counter-strike-2': '/images/games/cs2.svg',
  'garrys-mod': '/images/games/gmod.svg',
  'gmod': '/images/games/gmod.svg',
  'ark': '/images/games/ark.svg',
  'ark-survival': '/images/games/ark.svg',
  'palworld': '/images/games/palworld.svg',
  'valheim': '/images/games/valheim.svg',
  'satisfactory': '/images/games/satisfactory.svg'
};

export default function GameImage({ src, alt, className, loading = 'lazy', gameSlug }: GameImageProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  // Prioritize external URLs, fallback to local images if needed
  const getImageSrc = () => {
    // If there's an error with the original src, use fallback logic
    if (imageError) {
      // Try to find a local image based on gameSlug
      if (gameSlug && LOCAL_GAME_IMAGES[gameSlug]) {
        return LOCAL_GAME_IMAGES[gameSlug];
      }
      
      // Try to find local image based on alt text
      const foundLocalImage = Object.entries(LOCAL_GAME_IMAGES).find(([slug]) => 
        alt.toLowerCase().includes(slug) || alt.toLowerCase().includes(slug.replace('-', ' '))
      );
      if (foundLocalImage) {
        return foundLocalImage[1];
      }
      
      // Final fallback
      return '/images/games/minecraft.svg';
    }
    
    // If original src is a placeholder API, try to find local image
    if (src.includes('/api/placeholder')) {
      if (gameSlug && LOCAL_GAME_IMAGES[gameSlug]) {
        return LOCAL_GAME_IMAGES[gameSlug];
      }
      
      const foundLocalImage = Object.entries(LOCAL_GAME_IMAGES).find(([slug]) => 
        alt.toLowerCase().includes(slug) || alt.toLowerCase().includes(slug.replace('-', ' '))
      );
      if (foundLocalImage) {
        return foundLocalImage[1];
      }
    }
    
    // Use the original src (external URLs will be used as-is)
    return src;
  };

  const handleImageError = () => {
    if (!imageError) {
      setImageError(true);
      setImageLoading(false);
    }
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  return (
    <div className="relative">
      {imageLoading && (
        <div className={`absolute inset-0 bg-gaming-black-lighter animate-pulse ${className}`} />
      )}
      <img
        src={getImageSrc()}
        alt={alt}
        className={className}
        loading={loading}
        onError={handleImageError}
        onLoad={handleImageLoad}
        style={{ display: imageLoading ? 'none' : 'block' }}
      />
    </div>
  );
}