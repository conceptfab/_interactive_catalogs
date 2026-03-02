import type {
  CatalogData,
  HeroData,
  HeroSliderFile,
  HeroSlide,
  OverviewData,
  GalleryData,
  VariantsData,
  DimensionsData,
  MaterialsData,
  FeaturesData,
  AssemblyData,
  PackshotsData,
} from '@/types/catalog';

/** Raw gallery from JSON - images use `image` not `src` */
interface RawGalleryData extends Omit<GalleryData, 'images'> {
  images: Array<{ image: string; alt: string; category: string }>;
}

export interface GlobalConfig {
  brandName: string;
  siteTitle: string;
  siteSubtitle: string;
  footerText: string;
  catalogListTitle: string;
}

const DEFAULT_GLOBAL_CONFIG: GlobalConfig = {
  brandName: 'Metro',
  siteTitle: 'METRO',
  siteSubtitle: 'Product catalogues — browse by collection',
  footerText: 'CONCEPT / CREATION / EXECUTION BY CONCEPTFAB',
  catalogListTitle: 'Available catalogues',
};

export async function getGlobalConfig(): Promise<GlobalConfig> {
  const data = await readPublicJson<Partial<GlobalConfig>>('config.json');
  if (!data) return DEFAULT_GLOBAL_CONFIG;
  return { ...DEFAULT_GLOBAL_CONFIG, ...data };
}

const SECTION_ORDER = [
  'hero',
  'overview',
  'gallery',
  'variants',
  'dimensions',
  'materials',
  'features',
  'assembly',
] as const;

const BASE = '/catalogs';

function catalogBase(catalogId: string): string {
  return `${BASE}/${catalogId}`;
}

function resolveImage(base: string, path: string): string {
  if (!path) return '';
  if (path.startsWith('http') || path.startsWith('/')) return path;
  return `${base}/${path}`;
}

const MAX_HERO_SLIDES = 20;

import fs from 'fs/promises';
import path from 'path';

const PUBLIC_DIR = path.join(process.cwd(), 'public');

/** Helper to read JSON from public directory */
async function readPublicJson<T>(filePath: string): Promise<T | null> {
  try {
    const fullPath = path.join(PUBLIC_DIR, filePath);
    const content = await fs.readFile(fullPath, 'utf8');
    return JSON.parse(content) as T;
  } catch {
    return null;
  }
}

/** Parallelized hero image discovery with limited batch size using fs */
async function discoverHeroImages(heroBaseUrl: string): Promise<string[]> {
  const found: string[] = [];
  const heroDir = path.join(PUBLIC_DIR, heroBaseUrl);

  try {
    const files = await fs.readdir(heroDir);
    const heroFiles = files
      .filter((f) => f.startsWith('hero_') && f.endsWith('.jpg'))
      .sort();

    // Return URLs relative to public, exactly as the previous code did
    return heroFiles
      .slice(0, MAX_HERO_SLIDES)
      .map((f) => `${heroBaseUrl}/${f}`);
  } catch {
    return [];
  }
}

function defaultHeroSlideAlt(
  baseAlt: string,
  index: number,
  total: number,
): string {
  return index === 0 ? baseAlt : `${baseAlt} - slide ${index + 1} of ${total}`;
}

function normalizeHeroSlides(
  slides: HeroSliderFile['slides'] | undefined,
  heroBase: string,
  fallbackAlt: string,
): HeroSlide[] | undefined {
  if (!slides || slides.length === 0) return undefined;

  const normalized: HeroSlide[] = [];
  for (let index = 0; index < slides.length; index++) {
    const slide = slides[index];
    const src = resolveImage(heroBase, slide.image);
    if (!src) continue;

    normalized.push({
      src,
      alt:
        slide.alt?.trim() ||
        defaultHeroSlideAlt(fallbackAlt, index, slides.length),
      ...(slide.description ? { description: slide.description } : {}),
    });
  }

  return normalized.length > 0 ? normalized : undefined;
}

interface CatalogIndex {
  catalogs: string[];
}

interface CatalogConfig {
  meta: CatalogData['meta'];
  sections: CatalogData['sections'];
}

/** Lightweight loader for list view */
export async function loadCatalogMeta(
  catalogId: string,
): Promise<{ id: string; meta: CatalogData['meta'] } | null> {
  const base = catalogBase(catalogId);
  const config = await readPublicJson<CatalogConfig>(`${base}/config.json`);
  if (!config) return null;
  return { id: catalogId, meta: config.meta };
}

export async function getCatalogList(): Promise<
  Array<{ id: string; meta: CatalogData['meta'] }>
> {
  let catalogs: string[] = [];

  const data = await readPublicJson<CatalogIndex>(`${BASE}/index.json`);
  if (data) {
    catalogs = data.catalogs ?? [];
  }

  const results = await Promise.all(catalogs.map((id) => loadCatalogMeta(id)));
  return results.filter(
    (item): item is { id: string; meta: CatalogData['meta'] } => item !== null,
  );
}

export async function loadCatalog(
  catalogId: string,
): Promise<CatalogData | null> {
  const base = catalogBase(catalogId);

  const config = await readPublicJson<CatalogConfig>(`${base}/config.json`);
  if (!config) return null;

  const sections =
    config.sections ?? SECTION_ORDER.map((id) => ({ id, label: id }));

  const [
    hero,
    heroSliderFile,
    overview,
    gallery,
    variants,
    dimensions,
    materials,
    features,
    assembly,
    packshots,
  ] = await Promise.all([
    readPublicJson<HeroData>(`${base}/hero/content.json`),
    readPublicJson<HeroSliderFile>(`${base}/hero/slider.json`),
    readPublicJson<OverviewData>(`${base}/overview/content.json`),
    readPublicJson<RawGalleryData>(`${base}/gallery/content.json`),
    readPublicJson<VariantsData>(`${base}/variants/content.json`),
    readPublicJson<DimensionsData>(`${base}/dimensions/content.json`),
    readPublicJson<MaterialsData>(`${base}/materials/content.json`),
    readPublicJson<FeaturesData>(`${base}/features/content.json`),
    readPublicJson<AssemblyData>(`${base}/assembly/content.json`),
    readPublicJson<PackshotsData>('/shared/packshots/content.json'),
  ]);

  if (
    !hero ||
    !overview ||
    !gallery ||
    !variants ||
    !dimensions ||
    !materials ||
    !features ||
    !assembly
  ) {
    return null;
  }

  const heroBase = `${base}/hero`;
  const configuredSlides = normalizeHeroSlides(
    heroSliderFile?.slides,
    heroBase,
    hero.heroImageAlt,
  );

  let heroSlides = configuredSlides;
  if (!heroSlides || heroSlides.length === 0) {
    const discoveredImages = await discoverHeroImages(heroBase);
    if (discoveredImages.length > 0) {
      heroSlides = discoveredImages.map((src, index, all) => ({
        src,
        alt: defaultHeroSlideAlt(hero.heroImageAlt, index, all.length),
      }));
    }
  }

  const sliderConfig = {
    ...(hero.slider ?? {}),
    ...(heroSliderFile?.settings ?? {}),
  };
  const descriptionStyle = {
    ...(hero.descriptionStyle ?? {}),
    ...(heroSliderFile?.descriptionStyle ?? {}),
  };

  return {
    id: catalogId,
    meta: config.meta,
    sections,
    hero: {
      ...hero,
      heroImage: resolveImage(heroBase, hero.heroImage),
      heroSlides,
      heroImages: heroSlides?.map((slide) => slide.src),
      slider: Object.keys(sliderConfig).length > 0 ? sliderConfig : undefined,
      descriptionStyle:
        Object.keys(descriptionStyle).length > 0 ? descriptionStyle : undefined,
    },
    overview: {
      ...overview,
      packshotImage: resolveImage(`${base}/overview`, overview.packshotImage),
    },
    gallery: {
      ...gallery,
      images: (gallery.images ?? []).map((img) => ({
        src: resolveImage(`${base}/gallery`, img.image),
        alt: img.alt,
        category: img.category,
      })),
    },
    variants: {
      ...variants,
      previewImage: resolveImage(`${base}/variants`, variants.previewImage),
    },
    dimensions,
    materials: {
      ...materials,
      detailImage: resolveImage(`${base}/materials`, materials.detailImage),
    },
    features,
    assembly,
    ...(packshots ? { packshots } : {}),
  };
}
