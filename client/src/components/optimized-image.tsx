import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  loading?: "lazy" | "eager";
  priority?: boolean;
  placeholder?: string;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  loading = "lazy",
  priority = false,
  placeholder = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    // If priority is true, preload the image
    if (priority) {
      const preloadLink = document.createElement('link');
      preloadLink.rel = 'preload';
      preloadLink.as = 'image';
      preloadLink.href = src;
      document.head.appendChild(preloadLink);
    }

    // Intersection Observer for lazy loading
    if (loading === "lazy" && !priority) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              img.src = src;
              observer.unobserve(img);
            }
          });
        },
        { rootMargin: "50px" }
      );

      observer.observe(img);
      return () => observer.disconnect();
    }
  }, [src, loading, priority]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setError(true);
  };

  if (error) {
    return (
      <div 
        className={cn(
          "bg-gaming-black-light border border-gaming-black-lighter rounded flex items-center justify-center text-gaming-gray text-sm",
          className
        )}
        style={{ width, height }}
      >
        Image failed to load
      </div>
    );
  }

  return (
    <img
      ref={imgRef}
      src={priority || loading === "eager" ? src : placeholder}
      alt={alt}
      width={width}
      height={height}
      loading={loading}
      className={cn(
        "transition-opacity duration-300",
        isLoaded ? "opacity-100" : "opacity-0",
        className
      )}
      onLoad={handleLoad}
      onError={handleError}
      decoding="async"
    />
  );
}