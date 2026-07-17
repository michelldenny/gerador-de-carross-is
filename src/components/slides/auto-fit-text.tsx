"use client";

import React, { useState, useEffect, useRef } from "react";

interface AutoFitTextProps {
  text: string;
  minSize?: number; // em px
  maxSize?: number; // em px
  className?: string;
  style?: React.CSSProperties;
}

export function AutoFitText({
  text,
  minSize = 12,
  maxSize = 48,
  className = "",
  style = {},
}: AutoFitTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [fontSize, setFontSize] = useState<number>(maxSize);
  const [isOverflow, setIsOverflow] = useState<boolean>(false);

  useEffect(() => {
    const container = containerRef.current;
    const textEl = textRef.current;
    if (!container || !textEl) return;

    let low = minSize;
    let high = maxSize;
    let optimal = maxSize;

    // Busca binária para achar o tamanho ideal que caiba no container sem scroll
    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      textEl.style.fontSize = `${mid}px`;
      
      const isOverflowing = 
        textEl.scrollHeight > container.clientHeight || 
        textEl.scrollWidth > container.clientWidth;

      if (isOverflowing) {
        high = mid - 1;
      } else {
        optimal = mid;
        low = mid + 1;
      }
    }

    setFontSize(optimal);
    
    // Testar se mesmo com o tamanho mínimo ainda há estouro
    textEl.style.fontSize = `${minSize}px`;
    const stillOverflowing = 
      textEl.scrollHeight > container.clientHeight || 
      textEl.scrollWidth > container.clientWidth;
    setIsOverflow(stillOverflowing);

    // Definir para o tamanho ótimo final
    textEl.style.fontSize = `${optimal}px`;
  }, [text, minSize, maxSize]);

  return (
    <div
      ref={containerRef}
      className={`w-full h-full relative overflow-hidden flex items-center ${className}`}
      style={style}
    >
      <div 
        ref={textRef} 
        className="w-full break-words transition-all duration-100"
        style={{ fontSize: `${fontSize}px` }}
      >
        {text}
      </div>
      {isOverflow && (
        <div className="absolute top-1 right-1 bg-red-500 text-white text-[9px] px-1 rounded font-bold uppercase tracking-wider animate-pulse z-10">
          Estouro
        </div>
      )}
    </div>
  );
}
