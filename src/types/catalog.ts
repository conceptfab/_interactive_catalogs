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

export type HeroDescriptionPosition =
  | 'bottom-center'
  | 'bottom-left'
  | 'bottom-right'
  | 'top-center'
  | 'top-left'
  | 'top-right';

export interface HeroDescriptionStyleConfig {
  /** Turn slide descriptions on/off for this catalog */
  enabled?: boolean;
  /** Placement preset for the description label */
  position?: HeroDescriptionPosition;
  /** Distance from top or bottom edge (in px) */
  offsetPx?: number;
  /** Text color (CSS color value) */
  textColor?: string;
  /** Label background (CSS color value) */
  backgroundColor?: string;
  /** Backdrop blur (in px) */
  backdropBlurPx?: number;
  /** Horizontal padding (in px) */
  paddingX?: number;
  /** Vertical padding (in px) */
  paddingY?: number;
  /** Corner radius (in px) */
  borderRadiusPx?: number;
  /** Font size (in px) */
  fontSizePx?: number;
  /** Font weight */
  fontWeight?: number;
  /** Letter spacing in em units */
  letterSpacingEm?: number;
  /** Max width, e.g. 90vw or 520px */
  maxWidth?: string;
  /** Text alignment */
  textAlign?: 'left' | 'center' | 'right';
  /** Uppercase transform toggle */
  uppercase?: boolean;
}

export interface HeroSlide {
  /** Resolved image URL */
  src: string;
  /** Accessible slide alt text */
  alt: string;
  /** Optional visible caption/description */
  description?: string;
}

export interface HeroSlideDefinition {
  /** Relative path inside hero folder, e.g. hero_00.jpg */
  image: string;
  /** Optional alt override for the slide */
  alt?: string;
  /** Optional visible caption/description for the slide */
  description?: string;
}

export interface HeroSliderFile {
  /** Slider settings stored in hero/slider.json */
  settings?: HeroSliderConfig;
  /** Description label style stored in hero/slider.json */
  descriptionStyle?: HeroDescriptionStyleConfig;
  /** Explicit list of slides for the hero carousel */
  slides?: HeroSlideDefinition[];
}

export interface HeroData {
  brandLabel: string;
  collectionName: string;
  tagline: string;
  taglineLine2?: string;
  ctaLabel: string;
  heroImage: string;
  heroImageAlt: string;
  /** Explicit hero slides resolved from hero/slider.json */
  heroSlides?: HeroSlide[];
  /** Auto-discovered hero_NN.jpg images for slider */
  heroImages?: string[];
  /** Slider options loaded from hero/slider.json (or legacy hero content) */
  slider?: HeroSliderConfig;
  /** Description label style loaded from hero/slider.json */
  descriptionStyle?: HeroDescriptionStyleConfig;
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
