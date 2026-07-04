"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Masthead } from "@/components/masthead/masthead";
import { Navigation } from "@/components/layout/navigation";
import { Footer } from "@/components/layout/footer";
import { FrontPageHero } from "@/components/newspaper/front-page-hero";
import { NewspaperSection } from "@/components/newspaper/newspaper-section";
import { EditorialBox } from "@/components/newspaper/editorial-box";
import { MarketPrices } from "@/components/newspaper/market-prices";
import { Classifieds } from "@/components/newspaper/classifieds";
import { SideNotes } from "@/components/newspaper/side-notes";
import { DeferredRender } from "@/components/effects/deferred-render";
import { fetchNews, fetchCategories, type Article, type Category } from "@/lib/api";
import { useLocation } from "@/hooks/use-location";

const INITIAL_PAGE_SIZE = 30;
const INCREMENTAL_PAGE_SIZE = 30;

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;
  const location = useLocation();
  const [category, setCategory] = useState<Category | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setLoading(true);
    setArticles([]);
    setPage(1);
    setHasMore(true);
    Promise.all([
      fetchCategories(),
      fetchNews({
        category: slug,
        page: 1,
        pageSize: INITIAL_PAGE_SIZE,
        region: location.region,
        timezone: location.timezone,
      }),
    ])
      .then(([catData, newsData]) => {
        const found = catData.categories.find((c) => c.slug === slug);
        setCategory(found || null);
        setArticles(newsData.articles);
        setHasMore(newsData.articles.length >= INITIAL_PAGE_SIZE);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug, location.region, location.timezone]);

  const loadMore = useCallback(() => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    const nextPage = page + 1;
    fetchNews({
      category: slug,
      page: nextPage,
      pageSize: INCREMENTAL_PAGE_SIZE,
      region: location.region,
      timezone: location.timezone,
    })
      .then((newsData) => {
        setArticles((prev) => [...prev, ...newsData.articles]);
        setPage(nextPage);
        setHasMore(newsData.articles.length >= INCREMENTAL_PAGE_SIZE);
        setLoadingMore(false);
      })
      .catch(() => {
        setHasMore(false);
        setLoadingMore(false);
      });
  }, [page, loadingMore, hasMore, slug, location.region, location.timezone]);

  const featured = articles[0];
  const lateDispatches = articles.slice(1, 17);
  const inDepth = articles.slice(17, 33);
  const furtherReports = articles.slice(33, 55);
  const fromTheCorrespondents = articles.slice(55, 70);
  const opinion = articles.slice(70, 80);

  const displayName = category?.name || slug.replace(/-/g, " ");

  return (
    <div className="min-h-screen paper-texture paper-edges">
      <Masthead />
      <Navigation />

      <main className="max-w-[95rem] mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-5 paper-crease">
        {loading ? (
          <div className="min-h-[40vh] flex items-center justify-center font-body text-ink-soft italic text-lg">
            <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 2, repeat: Infinity }}>
              Fetching dispatches from {displayName}…
            </motion.div>
          </div>
        ) : (
          <>
            <div className="page-header mb-4">
              <div className="text-xs uppercase tracking-[0.3em] text-gold font-sans font-bold mb-1">Section</div>
              <h1 className="headline-gothic text-3xl sm:text-5xl md:text-6xl text-ink">{displayName.toUpperCase()}</h1>
              <p className="font-body italic text-sm text-ink-soft max-w-2xl mx-auto">
                {category?.description || `The latest news, analysis, and commentary from the world of ${displayName}.`}
              </p>
            </div>

            {featured && <FrontPageHero article={featured} />}

            <div className="newspaper-section-break" data-page="1" />

            {/* Above-the-fold section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
              <div className="lg:col-span-9 space-y-3">
                <NewspaperSection
                  title="Late Dispatches"
                  subtitle={`All the latest from ${displayName}`}
                  articles={lateDispatches}
                  columns={3}
                  showImages
                  variant="front"
                  pageNumber="1"
                  compact
                />

                {inDepth.length > 0 && (
                  <NewspaperSection
                    title="In Depth"
                    subtitle={`Detailed reports and analysis from ${displayName}`}
                    articles={inDepth}
                    columns={3}
                    showImages
                    pageNumber="2"
                    compact
                  />
                )}
              </div>

              <div className="lg:col-span-3 space-y-3">
                <EditorialBox />
                <MarketPrices />
                <Classifieds />
                {fromTheCorrespondents.length > 0 && (
                  <SideNotes articles={fromTheCorrespondents.slice(0, 6)} />
                )}
              </div>
            </div>

            {/* Below-the-fold — deferred */}
            <div className="newspaper-section-break" data-page="3" />

            {furtherReports.length > 0 && (
              <DeferredRender margin="400px" placeholderHeight="500px">
                <NewspaperSection
                  title="Further Reports"
                  subtitle={`Continued coverage of ${displayName}`}
                  articles={furtherReports}
                  columns={4}
                  showImages
                  pageNumber="3"
                  compact
                />
              </DeferredRender>
            )}

            <div className="newspaper-section-break" data-page="4" />

            {fromTheCorrespondents.length > 0 && (
              <DeferredRender margin="400px" placeholderHeight="400px">
                <NewspaperSection
                  title="From the Correspondents"
                  subtitle={`Field notes and shorter dispatches from ${displayName}`}
                  articles={fromTheCorrespondents}
                  columns={4}
                  showImages={false}
                  pageNumber="4"
                  compact
                />
              </DeferredRender>
            )}

            <div className="newspaper-section-break" data-page="5" />

            {opinion.length > 0 && (
              <DeferredRender margin="400px" placeholderHeight="400px">
                <NewspaperSection
                  title="Opinion"
                  subtitle={`Editorials and letters on ${displayName}`}
                  articles={opinion}
                  columns={4}
                  showImages={false}
                  variant="opinion"
                  pageNumber="5"
                  compact
                />
              </DeferredRender>
            )}

            <div className="mt-4 flex items-center justify-between page-marker">
              <span>{displayName}</span>
              <span>The Daily Tech Prophet</span>
              <span>Page 5 · Continued on Page 6</span>
            </div>

            {/* Load more trigger */}
            {hasMore && (
              <DeferredRender margin="600px" placeholderHeight="100px">
                <div className="flex items-center justify-center py-8">
                  {loadingMore ? (
                    <motion.div
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="font-body italic text-ink-soft"
                    >
                      Fetching more dispatches…
                    </motion.div>
                  ) : (
                    <button
                      onClick={loadMore}
                      className="px-6 py-3 border-2 border-double border-[var(--border-color)] font-sans text-xs uppercase tracking-widest text-ink hover:bg-gold transition-colors touch-target"
                    >
                      Load More Dispatches
                    </button>
                  )}
                </div>
              </DeferredRender>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
