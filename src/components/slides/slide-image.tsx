import React from "react";
import { SlideImage as ISlideImage } from "@/types";

interface SlideImageProps {
  image?: ISlideImage;
  className?: string;
  onClick?: () => void;
  selected?: boolean;
}

export function SlideImage({ image, className = "", onClick, selected = false }: SlideImageProps) {
  if (!image || !image.url) return null;

  // Gerar filtros CSS dinamicamente com base nos sliders
  const filterString = `
    brightness(${image.brightness ?? 100}%) 
    contrast(${image.contrast ?? 100}%) 
    saturate(${image.saturation ?? 100}%)
  `.replace(/\s+/g, " ");

  // Estilo de posicionamento
  const objectPosition = `${image.positionX ?? 50}% ${image.positionY ?? 50}%`;
  const scale = (image.zoom ?? 100) / 100;

  return (
    <div
      onClick={(e) => {
        if (onClick) {
          e.stopPropagation();
          onClick();
        }
      }}
      className={`absolute inset-0 overflow-hidden cursor-pointer select-none transition-all ${
        selected ? "ring-4 ring-inset ring-violet-500 z-20" : ""
      } ${className}`}
    >
      <img
        src={image.url}
        alt={image.alt || "Imagem do Slide"}
        className="w-full h-full object-cover pointer-events-none"
        style={{
          filter: filterString,
          objectPosition: objectPosition,
          transform: `scale(${scale})`,
          transformOrigin: "center center",
        }}
      />
      {/* Overlay de cor e opacidade */}
      {image.overlayOpacity > 0 && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundColor: image.overlayColor || "#000000",
            opacity: image.overlayOpacity / 100,
          }}
        />
      )}
    </div>
  );
}
