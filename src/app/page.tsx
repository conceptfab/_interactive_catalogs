'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getCatalogList, getGlobalConfig } from '@/lib/catalog-loader';
import type { GlobalConfig } from '@/lib/catalog-loader';
import { LayoutGrid } from 'lucide-react';

function formatCatalogHeading(catalogId: string): string {
  const match = catalogId.match(/^QX-(\d+)$/i);
  if (match) return `QX ${match[1]}`;
  return catalogId.toUpperCase();
}

export default function IndexPage() {
  const [catalogs, setCatalogs] = useState<
    Array<{
      id: string;
      meta: {
        title: string;
        description: string;
        brandName: string;
        collectionName: string;
      };
    }>
  >([]);
  const [globalConfig, setGlobalConfig] = useState<GlobalConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getCatalogList(), getGlobalConfig()]).then(
      ([list, config]) => {
        setCatalogs(list);
        setGlobalConfig(config);
        setLoading(false);
      },
    );
  }, []);

  return (
    <div className="min-h-screen bg-background">
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
            <span className="sr-only">{globalConfig?.siteTitle ?? 'METRO'}</span>
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

          {loading ? (
            <p className="text-muted-foreground">Loading catalogues…</p>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {catalogs.map(({ id }) => (
                  <Link
                    key={id}
                    href={`/catalog/${id}`}
                    className="group flex aspect-square flex-col p-4 rounded-lg border border-border bg-surface-elevated hover:border-accent hover:shadow-md transition-all min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
                  >
                    <h3 className="font-display font-semibold text-foreground group-hover:text-accent transition-colors">
                      {formatCatalogHeading(id)}
                    </h3>
                    <span className="inline-block mt-auto self-end text-sm font-medium text-accent group-hover:underline">
                      View →
                    </span>
                  </Link>
                ))}
              </div>

              {catalogs.length === 0 && (
                <p className="text-muted-foreground">
                  No catalogues available.
                </p>
              )}
            </>
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
