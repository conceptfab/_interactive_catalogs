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
  MaterialsConfiguratorData,
  MaterialsConfiguratorOption,
  FeaturesData,
  AssemblyData,
  PackshotsData,
} from '@/types/catalog';
import fs from 'fs/promises';
import path from 'path';

/** Raw gallery from JSON - images use `image` not `src` */
interface RawGalleryData extends Omit<GalleryData, 'images'> {
  images: Array<{ image: string; alt: string; category: string }>;
}

interface RawPackshotsData extends Omit<PackshotsData, 'groups'> {
  groups: Array<{
    model: string;
    label: string;
    desc?: string;
    items: Array<{
      code: string;
      colorName: string;
      colorCode?: string;
      colorHex?: string;
      image: string;
    }>;
  }>;
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
  'packshots',
  'dimensions',
  'materials',
  'features',
  'assembly',
] as const;

const BASE = '/catalogs';

function catalogBase(catalogId: string): string {
  return `${BASE}/${catalogId}`;
}

const MAX_HERO_SLIDES = 20;
const IMAGE_EXTENSION_PRIORITY = ['.webp', '.jpg', '.jpeg', '.png'] as const;
const IMAGE_EXTENSION_PRIORITY_MAP = new Map<string, number>(
  IMAGE_EXTENSION_PRIORITY.map((ext, index) => [ext, index]),
);
const WEBP_SOURCE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png']);

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

function normalizeRelativeAssetPath(assetPath: string): string {
  return assetPath.replace(/\\/g, '/').replace(/^\/+/, '');
}

function trimSlashes(value: string): string {
  return value.replace(/^\/+|\/+$/g, '');
}

function resolveImageUrl(base: string, assetPath: string): string {
  const normalizedBase = base.replace(/\/+$/g, '');
  const normalizedAssetPath = normalizeRelativeAssetPath(assetPath);
  return `${normalizedBase}/${normalizedAssetPath}`;
}

function toPublicFilePath(...segments: string[]): string {
  const normalizedSegments = segments
    .flatMap((segment) => trimSlashes(segment).split('/'))
    .filter(Boolean);

  return path.join(PUBLIC_DIR, ...normalizedSegments);
}

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

function buildImageCandidates(assetPath: string): string[] {
  const normalizedAssetPath = normalizeRelativeAssetPath(assetPath);
  const ext = path.posix.extname(normalizedAssetPath).toLowerCase();
  const parsed = path.posix.parse(normalizedAssetPath);

  if (!ext) {
    return IMAGE_EXTENSION_PRIORITY.map((candidateExt) =>
      path.posix.join(parsed.dir, `${parsed.name}${candidateExt}`),
    );
  }

  if (!WEBP_SOURCE_EXTENSIONS.has(ext)) {
    return [normalizedAssetPath];
  }

  return [
    path.posix.join(parsed.dir, `${parsed.name}.webp`),
    normalizedAssetPath,
  ];
}

async function resolveImage(base: string, assetPath: string): Promise<string> {
  if (!assetPath) return '';
  if (assetPath.startsWith('http') || assetPath.startsWith('/')) return assetPath;

  const normalizedAssetPath = normalizeRelativeAssetPath(assetPath);
  const candidates = buildImageCandidates(normalizedAssetPath);

  for (const candidate of candidates) {
    if (await fileExists(toPublicFilePath(base, candidate))) {
      return resolveImageUrl(base, candidate);
    }
  }

  return resolveImageUrl(base, normalizedAssetPath);
}

/** Parallelized hero image discovery with limited batch size using fs */
async function discoverHeroImages(heroBaseUrl: string): Promise<string[]> {
  const heroDir = path.join(PUBLIC_DIR, heroBaseUrl);

  try {
    const files = await fs.readdir(heroDir);
    const heroFilesByName = new Map<string, string>();

    for (const file of files) {
      const normalizedFile = normalizeRelativeAssetPath(file);
      const parsed = path.posix.parse(normalizedFile);
      const ext = parsed.ext.toLowerCase();

      if (!parsed.name.startsWith('hero_')) continue;
      if (!IMAGE_EXTENSION_PRIORITY_MAP.has(ext)) continue;

      const current = heroFilesByName.get(parsed.name);
      const currentPriority = current
        ? (IMAGE_EXTENSION_PRIORITY_MAP.get(
            path.posix.extname(current).toLowerCase(),
          ) ?? Number.MAX_SAFE_INTEGER)
        : Number.MAX_SAFE_INTEGER;
      const nextPriority =
        IMAGE_EXTENSION_PRIORITY_MAP.get(ext) ?? Number.MAX_SAFE_INTEGER;

      if (!current || nextPriority < currentPriority) {
        heroFilesByName.set(parsed.name, normalizedFile);
      }
    }

    return [...heroFilesByName.entries()]
      .sort(([left], [right]) =>
        left.localeCompare(right, undefined, { numeric: true }),
      )
      .slice(0, MAX_HERO_SLIDES)
      .map(([, file]) => resolveImageUrl(heroBaseUrl, file));
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

function formatMaterialsOptionLabel(code: string): string {
  const normalizedCode = code.toUpperCase();
  if (normalizedCode.startsWith('RAL')) {
    return `RAL ${normalizedCode.slice(3)}`;
  }

  return normalizedCode;
}

function resolveMaterialsAssetType(
  code: string,
): 'frame' | 'desktop' | null {
  if (/^RAL\d+$/i.test(code)) return 'frame';
  if (/^[UW]\d+$/i.test(code)) return 'desktop';
  return null;
}

function compareMaterialsOptions(
  left: MaterialsConfiguratorOption,
  right: MaterialsConfiguratorOption,
): number {
  return left.code.localeCompare(right.code, undefined, {
    numeric: true,
    sensitivity: 'base',
  });
}

async function discoverMaterialsConfigurator(
  materialsBaseUrl: string,
): Promise<MaterialsConfiguratorData | undefined> {
  const materialsDir = toPublicFilePath(materialsBaseUrl);

  try {
    const files = await fs.readdir(materialsDir);
    const options = new Map<
      string,
      {
        code: string;
        type: 'frame' | 'desktop';
        image?: string;
        thumbnail?: string;
      }
    >();

    for (const file of files) {
      const normalizedFile = normalizeRelativeAssetPath(file);
      const parsed = path.posix.parse(normalizedFile);

      if (parsed.ext.toLowerCase() !== '.webp') continue;

      const isThumbnail = parsed.name.endsWith('_thumb');
      const baseName = isThumbnail
        ? parsed.name.slice(0, -'_thumb'.length)
        : parsed.name;
      const codeMatch = baseName.match(/(?:^|_)(RAL\d+|[UW]\d+)$/i);
      if (!codeMatch) continue;

      const code = codeMatch[1].toUpperCase();
      const type = resolveMaterialsAssetType(code);
      if (!type) continue;

      const option = options.get(baseName) ?? { code, type };
      if (isThumbnail) {
        option.thumbnail = normalizedFile;
      } else {
        option.image = normalizedFile;
      }
      options.set(baseName, option);
    }

    const frameOptions: MaterialsConfiguratorOption[] = [];
    const desktopOptions: MaterialsConfiguratorOption[] = [];

    for (const [id, option] of options.entries()) {
      if (!option.image) continue;
      const thumbnail = option.thumbnail ?? option.image;

      const normalizedOption: MaterialsConfiguratorOption = {
        id,
        code: option.code,
        label: formatMaterialsOptionLabel(option.code),
        image: resolveImageUrl(materialsBaseUrl, option.image),
        thumbnail: resolveImageUrl(materialsBaseUrl, thumbnail),
      };

      if (option.type === 'frame') {
        frameOptions.push(normalizedOption);
      } else {
        desktopOptions.push(normalizedOption);
      }
    }

    frameOptions.sort(compareMaterialsOptions);
    desktopOptions.sort(compareMaterialsOptions);

    if (frameOptions.length === 0 || desktopOptions.length === 0) {
      return undefined;
    }

    return {
      frameOptions,
      desktopOptions,
    };
  } catch {
    return undefined;
  }
}

async function discoverFeatureDemoVideo(
  featuresBaseUrl: string,
): Promise<string | undefined> {
  const preferredFiles = ['ani_test.mp4'];

  for (const file of preferredFiles) {
    if (await fileExists(toPublicFilePath(featuresBaseUrl, file))) {
      return resolveImageUrl(featuresBaseUrl, file);
    }
  }

  try {
    const files = await fs.readdir(toPublicFilePath(featuresBaseUrl));
    const fallbackVideo = files.find((file) =>
      file.toLowerCase().endsWith('.mp4'),
    );

    return fallbackVideo
      ? resolveImageUrl(featuresBaseUrl, normalizeRelativeAssetPath(fallbackVideo))
      : undefined;
  } catch {
    return undefined;
  }
}

async function normalizeHeroSlides(
  slides: HeroSliderFile['slides'] | undefined,
  heroBase: string,
  fallbackAlt: string,
): Promise<HeroSlide[] | undefined> {
  if (!slides || slides.length === 0) return undefined;

  const normalized = await Promise.all(
    slides.map(async (slide, index) => {
      const src = await resolveImage(heroBase, slide.image);
      if (!src) return null;

      return {
        src,
        alt:
          slide.alt?.trim() ||
          defaultHeroSlideAlt(fallbackAlt, index, slides.length),
        ...(slide.description ? { description: slide.description } : {}),
      };
    }),
  );

  const filtered = normalized.filter((slide): slide is HeroSlide => slide !== null);
  return filtered.length > 0 ? filtered : undefined;
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
    readPublicJson<RawPackshotsData>(`${base}/packshots/content.json`),
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
  const configuredSlides = await normalizeHeroSlides(
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
  const materialsBase = `${base}/materials`;
  const featuresBase = `${base}/features`;
  const packshotsBase = `${base}/packshots`;
  const [
    resolvedHeroImage,
    resolvedOverviewPackshot,
    resolvedPreviewImage,
    resolvedDetailImage,
    resolvedGalleryImages,
    resolvedPackshots,
    materialsConfigurator,
    featureDemoVideo,
  ] = await Promise.all([
    resolveImage(heroBase, hero.heroImage),
    resolveImage(`${base}/overview`, overview.packshotImage),
    resolveImage(`${base}/variants`, variants.previewImage),
    resolveImage(materialsBase, materials.detailImage),
    Promise.all(
      (gallery.images ?? []).map(async (img) => ({
        src: await resolveImage(`${base}/gallery`, img.image),
        alt: img.alt,
        category: img.category,
      })),
    ),
    packshots
      ? Promise.all(
          packshots.groups.map(async (group) => ({
            ...group,
            items: await Promise.all(
              group.items.map(async (item) => ({
                ...item,
                image: await resolveImage(packshotsBase, item.image),
              })),
            ),
          })),
        ).then((groups) => ({
          ...packshots,
          groups,
        }))
      : undefined,
    discoverMaterialsConfigurator(materialsBase),
    discoverFeatureDemoVideo(featuresBase),
  ]);

  return {
    id: catalogId,
    meta: config.meta,
    sections,
    hero: {
      ...hero,
      heroImage: resolvedHeroImage,
      heroSlides,
      heroImages: heroSlides?.map((slide) => slide.src),
      slider: Object.keys(sliderConfig).length > 0 ? sliderConfig : undefined,
      descriptionStyle:
        Object.keys(descriptionStyle).length > 0 ? descriptionStyle : undefined,
    },
    overview: {
      ...overview,
      packshotImage: resolvedOverviewPackshot,
    },
    gallery: {
      ...gallery,
      images: resolvedGalleryImages,
    },
    variants: {
      ...variants,
      previewImage: resolvedPreviewImage,
    },
    dimensions,
    materials: {
      ...materials,
      detailImage: resolvedDetailImage,
      ...(materialsConfigurator ? { configurator: materialsConfigurator } : {}),
    },
    features: {
      ...features,
      ...(featureDemoVideo ? { demoVideo: featureDemoVideo } : {}),
    },
    assembly,
    ...(resolvedPackshots ? { packshots: resolvedPackshots } : {}),
  };
}
