"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Masthead } from "@/components/masthead/masthead";
import { Navigation } from "@/components/layout/navigation";
import { Footer } from "@/components/layout/footer";
import { FrontPageHero } from "@/components/newspaper/front-page-hero";
import { NewspaperSection } from "@/components/newspaper/newspaper-section";
import { EditorsDispatch } from "@/components/newspaper/editors-dispatch";
import { EditorialBox } from "@/components/newspaper/editorial-box";
import { DecorativeOrnament } from "@/components/newspaper/decorative-ornament";
import { ScrollReveal } from "@/components/effects/scroll-reveal";
import { MarketPrices } from "@/components/newspaper/market-prices";
import { Classifieds } from "@/components/newspaper/classifieds";
import { WeatherWidget } from "@/components/widgets/weather";
import { DevQuoteWidget } from "@/components/widgets/dev-quote";
import { TriviaWidget } from "@/components/widgets/trivia";
import { SideNotes } from "@/components/newspaper/side-notes";
import { fetchNews, fetchWidgets, type Article, type WidgetsResponse } from "@/lib/api";
import { useLocation } from "@/hooks/use-location";
import { useArticleDate, formatDateLabel } from "@/hooks/use-article-date";

export default function HomePage() {
  const location = useLocation();
  const { date: selectedDate } = useArticleDate();
  const [articles, setArticles] = useState<Article[]>([]);
  const [widgets, setWidgets] = useState<WidgetsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchNews({
        category: "",
        page: 1,
        pageSize: 120,
        region: location.region,
        timezone: location.timezone,
        date: selectedDate ?? undefined,
      }),
      fetchWidgets(),
    ])
      .then(([newsData, widgetsData]) => {
        setArticles(newsData.articles);
        setWidgets(widgetsData);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [location.region, location.timezone, selectedDate]);

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
                  <ScrollReveal direction="up" duration={0.8} delay={0.1}>
                    <FrontPageHero article={featured} />
                  </ScrollReveal>
                )}

                <DecorativeOrnament variant="double-rule" />

                <ScrollReveal direction="up" duration={0.6} delay={0.05}>
                  <EditorsDispatch articles={articles} />
                </ScrollReveal>

                <div className="newspaper-section-break" data-page="1" />

                <ScrollReveal direction="up" duration={0.6} delay={0.05}>
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

                    <NewspaperSection
                      title="The Bulletin"
                      subtitle="Briefings, launches, and breaking notices"
                      articles={theBulletin}
                      columns={3}
                      showImages={false}
                      pageNumber="2"
                      compact
                    />
                  </div>

                  <div className="lg:col-span-3 space-y-3">
                    <EditorialBox />
                    <WeatherWidget />
                    <MarketPrices />
                    <Classifieds />
                  </div>
                </div>
                </ScrollReveal>

                <DecorativeOrnament variant="stars" />

                <div className="newspaper-section-break" data-page="3" />

                <ScrollReveal direction="up" duration={0.6} delay={0.05}>
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
                    <SideNotes articles={snippets} />
                    {widgets && (
                      <>
                        <DevQuoteWidget quote={widgets.dev_quote} />
                        <TriviaWidget trivia={widgets.trivia} />
                      </>
                    )}
                  </div>
                </div>
                </ScrollReveal>

                <DecorativeOrnament variant="diamond" />

                <div className="newspaper-section-break" data-page="4" />

                <ScrollReveal direction="up" duration={0.6} delay={0.05}>
                <NewspaperSection
                  title="Further Afield"
                  subtitle="Laboratories, launchpads, and distant datacentres"
                  articles={furtherAfield}
                  columns={4}
                  showImages
                  pageNumber="4"
                  compact
                />
                </ScrollReveal>

                <DecorativeOrnament variant="flourish" />

                <div className="newspaper-section-break" data-page="5" />

                <ScrollReveal direction="up" duration={0.6} delay={0.05}>
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
                </ScrollReveal>
              </>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
