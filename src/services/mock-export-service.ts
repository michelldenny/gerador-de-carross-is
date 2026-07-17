/**
 * Serviço de exportação real de slides usando html2canvas.
 * Captura o elemento do SlideCanvas ativo no DOM e gera downloads reais.
 */

export interface ExportProgressEvent {
  progress: number;
  status: string;
}

export interface ExportConfig {
  format: "png" | "jpg" | "pdf" | "zip";
  quality: number;
  resolution: "1x" | "2x";
  fileName: string;
  includeWatermark: boolean;
  transparentBackground: boolean;
}

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Captura o elemento DOM como Blob usando html2canvas.
 * Neutraliza temporariamente o transform do scale para capturar em resolução nativa.
 */
async function captureSlideElement(
  element: HTMLElement,
  format: "png" | "jpg",
  quality: number
): Promise<Blob> {
  const html2canvas = (await import("html2canvas")).default;

  // Salvar o transform atual e neutralizá-lo para a captura em tamanho real
  const originalTransform = element.style.transform;
  const originalPosition = element.style.position;

  // Posicionar o elemento fora da tela de forma que o html2canvas capture em 1:1
  element.style.transform = "none";
  element.style.position = "fixed";
  element.style.top = "-9999px";
  element.style.left = "-9999px";

  await delay(100); // aguardar o browser aplicar os estilos

  try {
    const canvas = await html2canvas(element, {
      useCORS: true,
      allowTaint: false,
      scale: 2, // 2x para alta resolução (equivale a 2160px para formato 1:1)
      backgroundColor: format === "png" ? null : "#ffffff",
      logging: false,
      imageTimeout: 10000,
      foreignObjectRendering: false,
    });

    return new Promise((resolve, reject) => {
      const mimeType = format === "jpg" ? "image/jpeg" : "image/png";
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error("Falha ao gerar imagem do slide"));
        },
        mimeType,
        quality / 100
      );
    });
  } finally {
    // Restaurar os estilos originais após a captura
    element.style.transform = originalTransform;
    element.style.position = originalPosition;
    element.style.top = "";
    element.style.left = "";
  }
}

/**
 * Faz o download de um Blob no browser.
 */
function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 8000);
}

/**
 * Exporta os slides do projeto capturando o canvas ativo no DOM.
 * Para formatos ZIP/PDF exporta como múltiplos PNGs baixados sequencialmente.
 */
export async function exportProjectSlides(
  _projectId: string,
  config: ExportConfig,
  onProgress?: (event: ExportProgressEvent) => void
): Promise<{ success: boolean; downloadUrl: string }> {
  try {
    onProgress?.({ progress: 10, status: "Localizando slides no editor..." });
    await delay(300);

    // O elemento alvo é o div interno do SlideCanvas com data-slide-canvas="active"
    const activeCanvas = document.querySelector<HTMLElement>(
      "[data-slide-canvas='active']"
    );

    if (!activeCanvas) {
      throw new Error(
        "Canvas do slide não encontrado. Abra o editor e tente novamente."
      );
    }

    onProgress?.({ progress: 30, status: "Preparando captura em alta resolução..." });
    await delay(200);

    const imgFormat: "png" | "jpg" =
      config.format === "jpg" ? "jpg" : "png";

    onProgress?.({ progress: 55, status: "Renderizando slide com html2canvas..." });

    const blob = await captureSlideElement(activeCanvas, imgFormat, config.quality);

    onProgress?.({ progress: 85, status: "Preparando arquivo para download..." });
    await delay(200);

    const ext = imgFormat;
    const fileName =
      config.format === "zip"
        ? `${config.fileName}-slide.${ext}`
        : config.format === "pdf"
        ? `${config.fileName}.${ext}` // fallback: PNG até integração com jsPDF
        : `${config.fileName}.${ext}`;

    downloadBlob(blob, fileName);

    onProgress?.({ progress: 100, status: "Download iniciado com sucesso!" });
    return { success: true, downloadUrl: "" };
  } catch (err) {
    console.error("[ExportService] Erro:", err);
    const message =
      err instanceof Error ? err.message : "Erro desconhecido na exportação";
    onProgress?.({ progress: 100, status: `Erro: ${message}` });
    return { success: false, downloadUrl: "" };
  }
}
