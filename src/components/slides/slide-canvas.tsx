"use client";

import React from "react";
import { SlideSafeArea } from "./slide-safe-area";

interface SlideCanvasProps {
  width: number;
  height: number;
  scale: number;
  mode?: "editor" | "preview" | "thumbnail" | "render";
  showSafeArea?: boolean;
  children: React.ReactNode;
}

export function SlideCanvas({
  width,
  height,
  scale,
  mode = "preview",
  showSafeArea = false,
  children,
}: SlideCanvasProps) {
  // Estilo do wrapper externo para reservar o espaço físico escalado corretamento no layout HTML
  const containerStyle: React.CSSProperties = {
    width: `${width * scale}px`,
    height: `${height * scale}px`,
    position: "relative",
  };

  // Estilo do canvas interno que roda na resolução real de 1080px e sofre scale via transform
  const canvasStyle: React.CSSProperties = {
    width: `${width}px`,
    height: `${height}px`,
    transform: `scale(${scale})`,
    transformOrigin: "top left",
    position: "absolute",
    top: 0,
    left: 0,
    overflow: "hidden",
    boxShadow: mode !== "render" ? "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)" : undefined,
    userSelect: "none",
  };

  const isEditor = mode === "editor";

  return (
    <div style={containerStyle} className="select-none relative shrink-0">
      <div style={canvasStyle} className="bg-white text-slate-800">
        <SlideSafeArea showGrid={isEditor && showSafeArea}>
          {children}
        </SlideSafeArea>
      </div>
    </div>
  );
}
