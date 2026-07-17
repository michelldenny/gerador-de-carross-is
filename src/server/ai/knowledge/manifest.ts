import type { EditorialMode } from "@/types";

export interface KnowledgeDocumentManifest {
  id: string;
  version: string;
  path: string;
  category: "editorial" | "design" | "examples";
  modes: EditorialMode[];
  priority: number;
  sha256: string;
}

export const KNOWLEDGE_MANIFEST_VERSION = "brandsdecoded-knowledge@1.0.0";

const hashes = {
  designSystem: "a4a01edb" + "7b7a67c9" + "2416e60c" + "8969767d" + "5e5e5fce" + "948f0b3c" + "c439c507" + "de066a2b",
  designPrinciples: "bf4d53c5" + "f9be7518" + "12f459df" + "9bb8e4ea" + "e86061c7" + "a55a4233" + "9c6c10be" + "604337e6",
  headlines: "d4580fd8" + "03a435a7" + "4ac31b43" + "e68f82f4" + "e5b3102a" + "5de13b41" + "fb5b5281" + "a6bd524a",
  editorialFilter: "482bf141" + "801cfbd8" + "9da8c135" + "ad5df784" + "2e826c79" + "89d03cf9" + "50f217ad" + "4f79aa37",
  qualityManual: "d21ae484" + "53a6c727" + "6cc51d46" + "dd38ff35" + "0b60c45b" + "4d1b1697" + "e210bd7d" + "c2af618a",
  references: "550833c7" + "fe89e543" + "1d441f88" + "8dc31711" + "6e4ebf6d" + "a1d5a564" + "43a68159" + "9e586ee6",
} as const;

export const KNOWLEDGE_DOCUMENTS: KnowledgeDocumentManifest[] = [
  { id: "brandsdecoded-headlines", version: "1.0.0", path: "knowledge/sources/editorial/brandsdecoded-banco-de-headlines.md", category: "editorial", modes: ["custom", "editorial"], priority: 70, sha256: hashes.headlines },
  { id: "brandsdecoded-editorial-filter", version: "1.0.0", path: "knowledge/sources/editorial/brandsdecoded-filtro-editorial.md", category: "editorial", modes: ["quick", "custom", "editorial"], priority: 100, sha256: hashes.editorialFilter },
  { id: "brandsdecoded-quality-manual", version: "1.0.0", path: "knowledge/sources/editorial/brandsdecoded-manual-de-qualidade.md", category: "editorial", modes: ["editorial"], priority: 95, sha256: hashes.qualityManual },
  { id: "brandsdecoded-design-system", version: "1.0.0", path: "knowledge/sources/design/brandsdecoded-design-system.md", category: "design", modes: ["editorial"], priority: 75, sha256: hashes.designSystem },
  { id: "brandsdecoded-design-principles", version: "1.0.0", path: "knowledge/sources/design/brandsdecoded-principios-design.md", category: "design", modes: ["custom", "editorial"], priority: 80, sha256: hashes.designPrinciples },
  { id: "brandsdecoded-approved-examples", version: "1.0.0", path: "knowledge/sources/examples/brandsdecoded-referencias.md", category: "examples", modes: ["editorial"], priority: 50, sha256: hashes.references },
];
