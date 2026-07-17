import { ExportConfig } from "@/types";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export interface ExportProgressEvent {
  progress: number;
  status: string;
}

export async function exportProjectSlides(
  projectId: string,
  config: ExportConfig,
  onProgress?: (event: ExportProgressEvent) => void
): Promise<{ success: boolean; downloadUrl: string }> {
  const steps = [
    { progress: 20, status: "Renderizando slides..." },
    { progress: 50, status: "Comprimindo imagens..." },
    { progress: 80, status: "Empacotando arquivos..." },
    { progress: 100, status: "Concluído!" },
  ];

  for (const step of steps) {
    await delay(600);
    if (onProgress) {
      onProgress(step);
    }
  }

  return {
    success: true,
    downloadUrl: `/downloads/${config.fileName || "carrossel"}.${config.format}`,
  };
}
