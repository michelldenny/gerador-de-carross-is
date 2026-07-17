import { MOCK_UNSPLASH_IMAGES } from "@/mocks";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export interface SearchImageResult {
  url: string;
  photographer: string;
  category: string;
}

export async function searchImages(
  query: string,
  category?: string
): Promise<SearchImageResult[]> {
  await delay(800);

  let results = [...MOCK_UNSPLASH_IMAGES];

  if (category && category !== "all") {
    results = results.filter(
      (img) => img.category.toLowerCase() === category.toLowerCase()
    );
  }

  if (query) {
    const term = query.toLowerCase();
    results = results.filter(
      (img) =>
        img.category.toLowerCase().includes(term) ||
        img.photographer.toLowerCase().includes(term)
    );
  }

  return results;
}
