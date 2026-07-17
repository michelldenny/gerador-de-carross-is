import React from "react";
import { Brand } from "@/types";

interface SlideLogoProps {
  brand?: Brand;
  className?: string;
  onClick?: () => void;
  selected?: boolean;
}

export function SlideLogo({ brand, className = "", onClick, selected = false }: SlideLogoProps) {
  if (!brand) return null;

  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-2 cursor-pointer transition-all ${
        selected ? "ring-2 ring-violet-500 rounded p-1" : "hover:opacity-85"
      } ${className}`}
    >
      {brand.logoUrl ? (
        <img
          src={brand.logoUrl}
          alt={brand.name}
          className="h-8 w-auto object-contain max-w-[120px]"
          onError={(e) => {
            // fallback para texto caso a imagem falhe
            (e.target as HTMLElement).style.display = "none";
          }}
        />
      ) : (
        <span
          className="font-bold tracking-tight text-sm"
          style={{ color: brand.primaryColor, fontFamily: brand.fontFamily }}
        >
          {brand.logoText || brand.name}
        </span>
      )}
      <span className="text-xs opacity-60 font-medium">{brand.instagramHandle}</span>
    </div>
  );
}
