"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Masthead } from "@/components/masthead/masthead";
import { Navigation } from "@/components/layout/navigation";
import { Footer } from "@/components/layout/footer";
import { FrontPageHero } from "@/components/newspaper/front-page-hero";
import { NewspaperSection } from "@/components/newspaper/newspaper-section";
import { EditorsDispatch } from "@/components/newspaper/editors-dispatch";
import { EditorialBox } from "@/components/newspaper/editorial-box";
import { DecorativeOrnament } from "@/components/newspaper/decorative-ornament";
import { DeferredRender } from "@/components/effects/deferred-render";
import { MarketPrices } from "@/components/newspaper/market-prices";
import { Classifieds } from "@/components/newspaper/classifieds";
import { WeatherWidget } from "@/components/widgets/weather";
import { DevQuoteWidget } from "@/components/widgets/dev-quote";
import { TriviaWidget } from "@/components/widgets/trivia";
import { SideNotes } from "@/components/newspaper/side-notes";
import { fetchNews, fetchWidgets, type Article, type WidgetsResponse } from "@/lib/api";
import { useLocation } from "@/hooks/use-location";
import { useArticleDate, formatDateLabel } from "@/hooks/use-article-date";

const INITIAL_PAGE_SIZE = 30;
const INCREMENTAL_PAGE_SIZE = 30;

export default function HomePage() {
  const location = useLocation();
  const { date: selectedDate } = useArticleDate();
  const [articles, setArticles] = useState<Article[]>([]);
  const [widgets, setWidgets] = useState<WidgetsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  // Initial fetch — only grab the first 30 articles
  useEffect(() => {
    setLoading(true);
    setArticles([]);
    setPage(1);
    setHasMore(true);
    Promise.all([
      fetchNews({
        category: "",
        page: 1,
        pageSize: INITIAL_PAGE_SIZE,
        region: location.region,
        timezone: location.timezone,
        date: selectedDate ?? undefined,
      }),
      fetchWidgets(),
    ])
      .then(([newsData, widgetsData]) => {
        setArticles(newsData.articles);
        setWidgets(widgetsData);
        setHasMore(newsData.articles.length >= INITIAL_PAGE_SIZE);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [location.region, location.timezone, selectedDate]);

  // Incremental loader — fetches more articles when user scrolls near the bottom
  const loadMore = useCallback(() => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    const nextPage = page + 1;
    fetchNews({
      category: "",
      page: nextPage,
      pageSize: INCREMENTAL_PAGE_SIZE,
      region: location.region,
      timezone: location.timezone,
      date: selectedDate ?? undefined,
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
  }, [page, loadingMore, hasMore, location.region, location.timezone, selectedDate]);

  // Derive section slices from the articles we have so far
  const featured = articles[0];
  const lateDispatches = articles.slice(1, 22);
  const theBulletin = articles.slice(22, 44);
  const aroundTheRealm = articles.slice(44, 70);
  const furtherAfield = articles.slice(70, 92);
  const opinionPieces = articles.slice(92, 108);
  const snippets = articles.slice(108, 120);

  return (
    <div className="min-h-screen paper-texture paper-edges">
      <Masthead />
      <Navigation />

      <main className="max-w-[95rem] mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-5 paper-crease">
        {loading ? (
          <div className="min-h-[50vh] flex items-center justify-center font-body text-ink-soft italic text-lg">
            <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 2, repeat: Infinity }}>
              The presses are running…
            </motion.div>
          </div>
        ) : (
          <>
            <div className="mb-2 flex items-center justify-between border-b border-[var(--border-color)] pb-1">
              <div className="font-sans text-[10px] uppercase tracking-[0.2em] text-ink-faded font-bold">
                Edition: <span className="text-gold">{formatDateLabel(selectedDate)}</span>
              </div>
              <div className="font-sans text-[10px] uppercase tracking-[0.2em] text-ink-faded">
                {articles.length} dispatches · Vol. CLXII No. 4,202
              </div>
            </div>

            {articles.length === 0 ? (
              <div className="min-h-[40vh] flex flex-col items-center justify-center text-center">
                <div className="font-display text-2xl text-ink mb-2">The presses are still</div>
                <div className="font-body italic text-ink-soft">
                  No dispatches were filed for {formatDateLabel(selectedDate)}.
                </div>
              </div>
            ) : (
              <>
                {featured && (
                  <FrontPageHero article={featured} />
                )}

                <DecorativeOrnament variant="double-rule" />

                <EditorsDispatch articles={articles} />

                <div className="newspaper-section-break" data-page="1" />

                {/* Above-the-fold section — renders immediately */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                  <div className="lg:col-span-9 space-y-3">
                    <NewspaperSection
                      title="Late Dispatches"
                      subtitle="All the news from the wizarding world of technology"
                      articles={lateDispatches}
                      columns={3}
                      showImages
                      variant="front"
                      pageNumber="1"
                      compact
                    />

                    <DecorativeOrnament variant="fleuron" withLines={true} />

                    {theBulletin.length > 0 && (
                      <NewspaperSection
                        title="The Bulletin"
                        subtitle="Briefings, launches, and breaking notices"
                        articles={theBulletin}
                        columns={3}
                        showImages={false}
                        pageNumber="2"
                        compact
                      />
                    )}
                  </div>

                  <div className="lg:col-span-3 space-y-3">
                    <EditorialBox />
                    <WeatherWidget />
                    <MarketPrices />
                    <Classifieds />
                  </div>
                </div>

                {/* Below-the-fold sections — deferred mount when scrolled near */}
                <DecorativeOrnament variant="stars" />

                <div className="newspaper-section-break" data-page="3" />

                {aroundTheRealm.length > 0 && (
                  <DeferredRender margin="400px" placeholderHeight="600px">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                      <div className="lg:col-span-9">
                        <NewspaperSection
                          title="Around the Realm"
                          subtitle="Reports from every corner of the tech kingdom"
                          articles={aroundTheRealm}
                          columns={4}
                          showImages
                          pageNumber="3"
                          compact
                        />
                      </div>

                      <div className="lg:col-span-3 space-y-3">
                        {snippets.length > 0 && <SideNotes articles={snippets} />}
                        {widgets && (
                          <>
                            <DevQuoteWidget quote={widgets.dev_quote} />
                            <TriviaWidget trivia={widgets.trivia} />
                          </>
                        )}
                      </div>
                    </div>
                  </DeferredRender>
                )}

                <DecorativeOrnament variant="diamond" />

                <div className="newspaper-section-break" data-page="4" />

                {furtherAfield.length > 0 && (
                  <DeferredRender margin="400px" placeholderHeight="500px">
                    <NewspaperSection
                      title="Further Afield"
                      subtitle="Laboratories, launchpads, and distant datacentres"
                      articles={furtherAfield}
                      columns={4}
                      showImages
                      pageNumber="4"
                      compact
                    />
                  </DeferredRender>
                )}

                <DecorativeOrnament variant="flourish" />

                <div className="newspaper-section-break" data-page="5" />

                {opinionPieces.length > 0 && (
                  <DeferredRender margin="400px" placeholderHeight="500px">
                    <NewspaperSection
                      title="Opinion & Commentary"
                      subtitle="Letters, editorials, and prophetic pronouncements"
                      articles={opinionPieces}
                      columns={4}
                      showImages={false}
                      variant="opinion"
                      pageNumber="5"
                      compact
                    />

                    <div className="mt-4 flex items-center justify-between page-marker">
                      <span>The Daily Tech Prophet</span>
                      <span>Continued on Page 6</span>
                      <span>Vol. CLXII No. 4,202</span>
                    </div>
                  </DeferredRender>
                )}

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
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
