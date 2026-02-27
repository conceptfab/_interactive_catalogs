'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { loadCatalog, getGlobalConfig } from '@/lib/catalog-loader';
import type { CatalogData } from '@/types/catalog';
import CatalogNav from '@/components/catalog/CatalogNav';
import HeroSection from '@/components/catalog/HeroSection';
import OverviewSection from '@/components/catalog/OverviewSection';
import GallerySection from '@/components/catalog/GallerySection';
import VariantsSection from '@/components/catalog/VariantsSection';
import DimensionsSection from '@/components/catalog/DimensionsSection';
import MaterialsSection from '@/components/catalog/MaterialsSection';
import FeaturesSection from '@/components/catalog/FeaturesSection';
import AssemblySection from '@/components/catalog/AssemblySection';

export default function CatalogPage() {
  const params = useParams();
  const router = useRouter();
  const catalogId = params?.catalogId as string | undefined;

  const [catalog, setCatalog] = useState<CatalogData | null | 'loading'>(
    'loading',
  );
  const [globalConfig, setGlobalConfig] = useState<{
    brandName: string;
  } | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    getGlobalConfig().then((cfg) => setGlobalConfig(cfg));
  }, []);

  useEffect(() => {
    if (!catalogId) {
      setNotFound(true);
      return;
    }
    setCatalog('loading');
    loadCatalog(catalogId)
      .then((data) => {
        setCatalog(data);
        if (!data) setNotFound(true);
      })
      .catch(() => {
        setCatalog(null);
        setNotFound(true);
      });
  }, [catalogId]);

  useEffect(() => {
    if (catalog && catalog !== 'loading') {
      const variantName = catalogId ? catalogId.toUpperCase() : '';
      document.title = `${variantName} - ${catalog.meta.title}`;
    }
  }, [catalog, catalogId]);

  useEffect(() => {
    if (notFound || catalog === null) {
      router.replace('/');
    }
  }, [notFound, catalog, router]);

  if (notFound || catalog === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Redirecting…</p>
      </div>
    );
  }

  if (catalog === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading catalogue…</p>
      </div>
    );
  }

  const themeClassName = catalog.meta.theme
    ? `catalog-${catalog.meta.theme}`
    : undefined;
  const navVariant =
    catalog.meta.theme === 'qx2'
      ? 'qx2'
      : catalog.meta.theme === 'qx1'
        ? 'qx1'
        : 'default';

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
        backToCatalogListHref="/"
        variant={navVariant}
      />

      <main id="main-content" lang="en">
        <HeroSection data={catalog.hero} />
        <OverviewSection data={catalog.overview} />
        <GallerySection data={catalog.gallery} />
        <VariantsSection data={catalog.variants} />
        <DimensionsSection data={catalog.dimensions} />
        <MaterialsSection data={catalog.materials} />
        <FeaturesSection data={catalog.features} />
        <AssemblySection data={catalog.assembly} />
      </main>
    </div>
  );
}
