import React, { useState } from "react";

interface ImageWithPlaceholderProps {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  aspectRatio?: string;
  width?: number | string;
  height?: number | string;
  overlay?: boolean;
}

export const ImageWithPlaceholder: React.FC<ImageWithPlaceholderProps> = ({
  src,
  alt,
  className = "",
  containerClassName = "",
  aspectRatio = "aspect-[16/10]",
  width = 600,
  height = 375,
  overlay = true,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={`relative overflow-hidden bg-[#0E1F38] ${aspectRatio} ${containerClassName}`}>
      {/* Blurred / Skeleton Placeholder */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-[#0E1F38] animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-[#C9A961]/20 border-t-[#C9A961] animate-spin" />
        </div>
      )}

      {/* Actual Image with smooth scaling and fade */}
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        decoding="async"
        onLoad={() => setIsLoaded(true)}
        className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04] ${
          isLoaded ? "opacity-100" : "opacity-0"
        } ${className}`}
      />

      {/* Bottom Dark Gradient Overlay for legible text */}
      {overlay && (
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-[#07111F] via-[#07111F]/45 to-transparent pointer-events-none"
        />
      )}
    </div>
  );
};
