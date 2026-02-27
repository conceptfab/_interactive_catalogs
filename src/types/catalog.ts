/** Types for catalog template - content management */

export interface CatalogData {
  id: string;
  meta: CatalogMeta;
  hero: HeroData;
  overview: OverviewData;
  gallery: GalleryData;
  variants: VariantsData;
  dimensions: DimensionsData;
  materials: MaterialsData;
  features: FeaturesData;
  assembly: AssemblyData;
  sections?: SectionConfig[];
}

export interface CatalogMeta {
  title: string;
  description: string;
  brandName: string;
  collectionName: string;
  theme?: string;
}

export interface HeroSliderConfig {
  /** Enable auto-advance to next slide */
  autoAdvance?: boolean;
  /** Interval in milliseconds between slides */
  interval?: number;
  /** Pause auto-advance when user hovers over slider */
  pauseOnHover?: boolean;
  /** Transition duration in milliseconds */
  transitionMs?: number;
  /** Show prev/next arrow buttons */
  showArrows?: boolean;
  /** Show dot indicators */
  showDots?: boolean;
  /** Initial slide index (0-based) */
  initialSlide?: number;
}

export interface HeroData {
  brandLabel: string;
  collectionName: string;
  tagline: string;
  taglineLine2?: string;
  ctaLabel: string;
  heroImage: string;
  heroImageAlt: string;
  /** Auto-discovered hero_NN.jpg images for slider */
  heroImages?: string[];
  /** Slider options (applies when heroImages is used) */
  slider?: HeroSliderConfig;
}

export interface OverviewFeature {
  icon: string;
  title: string;
  desc: string;
}

export interface OverviewData {
  sectionLabel: string;
  title: string;
  titleLine2?: string;
  paragraphs: string[];
  packshotImage: string;
  packshotImageAlt: string;
  packshotCaption: string;
  features: OverviewFeature[];
  quickLinkLabels: string[];
}

export interface GalleryImage {
  src: string;
  alt: string;
  category: string;
}

export interface GalleryData {
  sectionLabel: string;
  title: string;
  images: GalleryImage[];
}

export interface ColorOption {
  name: string;
  code: string;
  ral?: string;
}

export interface SizeOption {
  label: string;
  desc: string;
}

export interface ComparisonRow {
  feature: string;
  basic: string;
  premium: string;
}

export interface VariantsData {
  sectionLabel: string;
  title: string;
  desktopColors: ColorOption[];
  frameColors: ColorOption[];
  sizes: SizeOption[];
  previewImage: string;
  comparisonTable: ComparisonRow[];
  comparisonBasicLabel?: string;
  comparisonPremiumLabel?: string;
}

export interface SpecItem {
  label: string;
  value: string;
}

export interface DimensionsData {
  sectionLabel: string;
  title: string;
  specs: SpecItem[];
  certifications: string[];
  dimensionDiagram?: {
    width: string;
    depth: string;
    heightRange: string;
  };
}

export interface MaterialItem {
  name: string;
  desc: string;
  specs: string;
}

export interface ColorSwatch {
  name: string;
  hex: string;
}

export interface MaterialsData {
  sectionLabel: string;
  title: string;
  materials: MaterialItem[];
  swatches: ColorSwatch[];
  detailImage: string;
  detailImageAlt: string;
  detailImageCaption: string;
}

export interface FeatureItem {
  icon: string;
  title: string;
  desc: string;
  badge: string;
}

export interface FeaturesData {
  sectionLabel: string;
  title: string;
  items: FeatureItem[];
}

export interface AssemblyStep {
  step: number;
  title: string;
  desc: string;
}

export interface OrderCode {
  code: string;
  desc: string;
}

export interface AssemblyData {
  sectionLabel: string;
  title: string;
  steps: AssemblyStep[];
  orderCodes: OrderCode[];
  ctaLabels: {
    quote: string;
    pdf: string;
    contact: string;
  };
  footerText: string;
  versionInfo: string;
}

export interface SectionConfig {
  id: string;
  label: string;
  enabled?: boolean;
}
