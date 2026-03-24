import { notFound } from 'next/navigation';
import {
  loadCatalog,
  getGlobalConfig,
  getCatalogList,
} from '@/lib/catalog-loader';
import type { Metadata } from 'next';
import CatalogNav from '@/components/catalog/CatalogNav';
import HeroSection from '@/components/catalog/HeroSection';
import MosaicHeroSection from '@/components/catalog/MosaicHeroSection';
import OverviewSection from '@/components/catalog/OverviewSection';
import GallerySection from '@/components/catalog/GallerySection';
import VariantsSection from '@/components/catalog/VariantsSection';
import DimensionsSection from '@/components/catalog/DimensionsSection';
import MaterialsSection from '@/components/catalog/MaterialsSection';
import FeaturesSection from '@/components/catalog/FeaturesSection';
import AssemblySection from '@/components/catalog/AssemblySection';
import PackshotsSection from '@/components/catalog/PackshotsSection';

export async function generateStaticParams() {
  const catalogs = await getCatalogList();
  return catalogs.map((catalog) => ({
    catalogId: catalog.id,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ catalogId: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const catalog = await loadCatalog(resolvedParams.catalogId);
  if (!catalog) return {};

  const variantName = resolvedParams.catalogId
    ? resolvedParams.catalogId.toUpperCase()
    : '';
  return {
    title: `${variantName} - ${catalog.meta.title}`,
  };
}

export default async function CatalogPage({
  params,
}: {
  params: Promise<{ catalogId: string }>;
}) {
  const resolvedParams = await params;
  const catalogId = resolvedParams.catalogId;
  const [catalog, globalConfig] = await Promise.all([
    loadCatalog(catalogId),
    getGlobalConfig(),
  ]);

  if (!catalog) {
    notFound();
  }

  const themeClassName = catalog.meta.theme
    ? `catalog-${catalog.meta.theme}`
    : undefined;
  const navVariant =
    catalog.meta.theme === 'qx2'
      ? 'qx2'
      : catalog.meta.theme === 'qx1'
        ? 'qx1'
        : catalog.meta.theme === 'qx3'
          ? 'qx3'
          : catalog.meta.theme === 'qx4'
            ? 'qx4'
            : catalog.meta.theme === 'qx5'
              ? 'qx5'
              : catalog.meta.theme === 'qx0'
                ? 'qx0'
                : 'default';
  const normalizedCatalogId = catalogId?.toUpperCase();
  const isQx0 = normalizedCatalogId === 'QX';
  const isQx1 = normalizedCatalogId === 'QX-1';
  const isQx2 = normalizedCatalogId === 'QX-2';
  const isQx3 = normalizedCatalogId === 'QX-3';
  const isQx4 = normalizedCatalogId === 'QX-4';
  const isQx5 = normalizedCatalogId === 'QX-5';
  const isMosaicTheme =
    catalog.meta.theme === 'qx3' || catalog.meta.theme === 'qx4';

  return (
    <div className={themeClassName}>
      <a href="#overview" className="skip-link">
        Skip to main content
      </a>

      <CatalogNav
        sections={catalog.sections}
        brandLabel={(
          globalConfig?.brandName ?? catalog.hero.brandLabel
        ).toUpperCase()}
        brandLogoSrc={
          isQx0
            ? '/catalogs/QX/metro_logo.svg'
            : isQx1
              ? '/catalogs/QX-1/metro_logo.svg'
              : isQx2
                ? '/catalogs/QX-2/metro_logo.svg'
                : isQx3
                  ? '/catalogs/QX-3/metro_logo.svg'
                  : isQx4
                    ? '/catalogs/QX-4/metro_logo.svg'
                    : isQx5
                      ? '/catalogs/QX-5/metro_logo.svg'
                      : undefined
        }
        variant={navVariant}
      />

      <main id="main-content" lang="en">
        {isMosaicTheme ? (
          <MosaicHeroSection
            data={catalog.hero}
            variant={catalog.meta.theme as 'qx3' | 'qx4'}
          />
        ) : (
          <HeroSection data={catalog.hero} catalogId={catalogId} />
        )}
        <OverviewSection data={catalog.overview} />
        <GallerySection data={catalog.gallery} catalogId={catalogId} />
        <VariantsSection data={catalog.variants} />
        {catalog.packshots && (
          <PackshotsSection
            data={catalog.packshots}
            theme={catalog.meta.theme}
            catalogId={catalogId}
          />
        )}
        <DimensionsSection data={catalog.dimensions} />
        <MaterialsSection data={catalog.materials} />
        <FeaturesSection data={catalog.features} />
        <AssemblySection data={catalog.assembly} />
      </main>
    </div>
  );
}
