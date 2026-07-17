"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";

interface AutoFitTextProps {
  text: string;
  minSize?: number; // em px
  maxSize?: number; // em px
  className?: string;
  style?: React.CSSProperties;
  showOverflowIndicator?: boolean;
}

export function AutoFitText({
  text,
  minSize = 12,
  maxSize = 48,
  className = "",
  style = {},
  showOverflowIndicator = false,
}: AutoFitTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [fontSize, setFontSize] = useState<number>(maxSize);
  const [isOverflow, setIsOverflow] = useState<boolean>(false);

  const calculateSize = useCallback(() => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, minSize, maxSize]);

  // 1. Efeito principal e detecção por ResizeObserver
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    calculateSize();

    // Observar redimensionamentos reais do container
    const observer = new ResizeObserver(() => {
      calculateSize();
    });
    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, [calculateSize]);

  // 2. Observar carregamento de fontes
  useEffect(() => {
    if (typeof window !== "undefined" && "fonts" in document) {
      document.fonts.ready.then(() => {
        calculateSize();
      });
    }
  }, [calculateSize]);

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
      {isOverflow && showOverflowIndicator && (
        <div className="absolute top-1 right-1 bg-red-500 text-white text-[9px] px-1 rounded font-bold uppercase tracking-wider animate-pulse z-10 select-none pointer-events-none">
          Estouro
        </div>
      )}
    </div>
  );
}
