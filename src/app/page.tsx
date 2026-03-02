import Link from 'next/link';
import Image from 'next/image';
import { getCatalogList, getGlobalConfig } from '@/lib/catalog-loader';
import { LayoutGrid } from 'lucide-react';

type VariantKey = 'qx0' | 'qx1' | 'qx2' | 'qx3' | 'qx4' | 'qx5';

function formatCatalogHeading(catalogId: string): string {
  const match = catalogId.match(/^QX-(\d+)$/i);
  if (match) return `QX ${match[1]}`;
  return catalogId.toUpperCase();
}

function resolveVariantKey(catalogId: string, theme?: string): VariantKey {
  const normalizedTheme = theme?.toLowerCase().replace(/[^a-z0-9]/g, '');
  if (
    normalizedTheme === 'qx0' ||
    normalizedTheme === 'qx1' ||
    normalizedTheme === 'qx2' ||
    normalizedTheme === 'qx3' ||
    normalizedTheme === 'qx4' ||
    normalizedTheme === 'qx5'
  ) {
    return normalizedTheme;
  }

  const idMatch = catalogId.match(/^QX-(\d+)$/i);
  const number = idMatch?.[1] ?? '0';
  if (number === '1') return 'qx1';
  if (number === '2') return 'qx2';
  if (number === '3') return 'qx3';
  if (number === '4') return 'qx4';
  if (number === '5') return 'qx5';
  return 'qx0';
}

export default async function IndexPage() {
  const catalogs = await getCatalogList();
  const globalConfig = await getGlobalConfig();

  return (
    <div className="variant-list-page min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-foreground">
            <Image
              src="/metro_logo.svg"
              alt="METRO"
              width={220}
              height={52}
              className="h-8 w-auto"
              priority
            />
            <span className="sr-only">
              {globalConfig?.siteTitle ?? 'METRO'}
            </span>
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {globalConfig?.siteSubtitle ??
              'Product catalogues — browse by collection'}
          </p>
        </div>
      </header>

      <main
        id="main-content"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
        lang="en"
      >
        <section aria-labelledby="catalog-list-title">
          <h2
            id="catalog-list-title"
            className="font-display font-semibold text-lg text-foreground mb-6 flex items-center gap-2"
          >
            <LayoutGrid size={22} className="text-accent" aria-hidden />
            {globalConfig?.catalogListTitle ?? 'Available catalogues'}
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {catalogs.map(({ id, meta }) => {
              const variant = resolveVariantKey(id, meta.theme);
              return (
                <Link
                  key={id}
                  href={`/catalog/${id}`}
                  className={`variant-tile variant-tile-${variant} group flex aspect-square flex-col border p-4 transition-all min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2`}
                >
                  <h3 className="variant-tile-title">
                    {formatCatalogHeading(id)}
                  </h3>
                  <span className="variant-tile-cta inline-block mt-auto self-end text-sm">
                    View →
                  </span>
                </Link>
              );
            })}
          </div>

          {catalogs.length === 0 && (
            <p className="text-muted-foreground">No catalogues available.</p>
          )}
        </section>
      </main>

      <footer className="mt-16 py-8 border-t border-border text-center">
        <p className="text-muted-foreground text-sm">
          {globalConfig?.footerText ??
            'CONCEPT / CREATION / EXECUTION BY CONCEPTFAB'}
        </p>
      </footer>
    </div>
  );
}
