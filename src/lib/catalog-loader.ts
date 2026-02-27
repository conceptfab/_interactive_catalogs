import type {
  CatalogData,
  HeroData,
  OverviewData,
  GalleryData,
  VariantsData,
  DimensionsData,
  MaterialsData,
  FeaturesData,
  AssemblyData,
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
  const res = await fetch('/config.json', { cache: 'no-store' });
  if (!res.ok) return DEFAULT_GLOBAL_CONFIG;
  try {
    const data = (await res.json()) as Partial<GlobalConfig>;
    return { ...DEFAULT_GLOBAL_CONFIG, ...data };
  } catch {
    return DEFAULT_GLOBAL_CONFIG;
  }
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

/** Discovers hero_NN.jpg files in hero folder by trying sequential fetches. */
async function discoverHeroImages(heroBaseUrl: string): Promise<string[]> {
  const found: string[] = [];
  for (let i = 0; i < MAX_HERO_SLIDES; i++) {
    const filename = `hero_${String(i).padStart(2, '0')}.jpg`;
    const url = `${heroBaseUrl}/${filename}`;
    try {
      const res = await fetch(url, { method: 'HEAD' });
      const contentType = res.headers.get('content-type') ?? '';
      const isImage = res.ok && contentType.startsWith('image/');
      if (isImage) found.push(url);
      else break;
    } catch {
      break;
    }
  }
  return found;
}

interface CatalogIndex {
  catalogs: string[];
}

interface CatalogConfig {
  meta: CatalogData['meta'];
  sections: CatalogData['sections'];
}

export async function getCatalogList(): Promise<
  Array<{ id: string; meta: CatalogData['meta'] }>
> {
  let catalogs: string[] = [];

  try {
    const apiRes = await fetch('/api/catalogs', { cache: 'no-store' });
    if (apiRes.ok) {
      const data = (await apiRes.json()) as CatalogIndex;
      catalogs = data.catalogs ?? [];
    }
  } catch {
    // Fallback below for environments without API routes.
  }

  if (catalogs.length === 0) {
    const res = await fetch(`${BASE}/index.json`, { cache: 'no-store' });
    if (!res.ok) return [];
    const data = (await res.json()) as CatalogIndex;
    catalogs = data.catalogs ?? [];
  }

  const list: Array<{ id: string; meta: CatalogData['meta'] }> = [];
  for (const id of catalogs) {
    const catalog = await loadCatalog(id);
    if (catalog) list.push({ id, meta: catalog.meta });
  }
  return list;
}

export async function loadCatalog(
  catalogId: string,
): Promise<CatalogData | null> {
  const base = catalogBase(catalogId);

  const configRes = await fetch(`${base}/config.json`, { cache: 'no-store' });
  if (!configRes.ok) return null;

  const config = (await configRes.json()) as CatalogConfig;
  const sections =
    config.sections ?? SECTION_ORDER.map((id) => ({ id, label: id }));

  const [
    hero,
    overview,
    gallery,
    variants,
    dimensions,
    materials,
    features,
    assembly,
  ] = await Promise.all([
    fetchJson<HeroData>(`${base}/hero/content.json`),
    fetchJson<OverviewData>(`${base}/overview/content.json`),
    fetchJson<RawGalleryData>(`${base}/gallery/content.json`),
    fetchJson<VariantsData>(`${base}/variants/content.json`),
    fetchJson<DimensionsData>(`${base}/dimensions/content.json`),
    fetchJson<MaterialsData>(`${base}/materials/content.json`),
    fetchJson<FeaturesData>(`${base}/features/content.json`),
    fetchJson<AssemblyData>(`${base}/assembly/content.json`),
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
  const heroImages = await discoverHeroImages(heroBase);

  return {
    id: catalogId,
    meta: config.meta,
    sections,
    hero: {
      ...hero,
      heroImage: resolveImage(heroBase, hero.heroImage),
      heroImages: heroImages.length > 0 ? heroImages : undefined,
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
  };
}

async function fetchJson<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, { cache: 'no-store' });
    return res.ok ? ((await res.json()) as T) : null;
  } catch {
    return null;
  }
}
