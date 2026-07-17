export const CAROUSEL_FORMATS = {
  vertical: {
    width: 1080,
    height: 1350,
    label: "Retrato (4:5)",
  },
  square: {
    width: 1080,
    height: 1080,
    label: "Quadrado (1:1)",
  },
  story: {
    width: 1080,
    height: 1920,
    label: "Stories (9:16)",
  },
} as const;

export type CarouselFormatKey = keyof typeof CAROUSEL_FORMATS;
