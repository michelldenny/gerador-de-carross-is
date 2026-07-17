export interface ExportConfig {
  format: "png" | "jpg" | "pdf" | "zip";
  quality: number; // 10 to 100
  resolution: "1x" | "2x" | "3x";
  fileName: string;
  includeWatermark: boolean;
  transparentBackground: boolean;
}
