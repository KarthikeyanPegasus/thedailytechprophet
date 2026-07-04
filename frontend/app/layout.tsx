import type { Metadata, Viewport } from "next";
import { Playfair_Display, EB_Garamond, Inter, JetBrains_Mono, UnifrakturCook, Old_Standard_TT, Crimson_Text } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { GlobalEffects } from "@/components/effects/global-effects";
import { KeyboardShortcuts } from "@/components/keyboard/keyboard-shortcuts";
import { SoundManager } from "@/components/effects/sound-manager";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const garamond = EB_Garamond({
  variable: "--font-garamond",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

const unifraktur = UnifrakturCook({
  variable: "--font-unifraktur",
  subsets: ["latin"],
  weight: ["700"],
  display: "swap",
});

const oldStandard = Old_Standard_TT({
  variable: "--font-old-standard",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

const crimson = Crimson_Text({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "The Daily Tech Prophet | All the Tech That's Fit to Print",
  description: "An immersive, cinematic technology newspaper. AI, programming, cybersecurity, space, and engineering news with a magical Victorian twist.",
  keywords: ["technology news", "AI", "programming", "cybersecurity", "space", "engineering", "startups", "open source"],
  authors: [{ name: "The Daily Tech Prophet" }],
  openGraph: {
    title: "The Daily Tech Prophet",
    description: "All the Tech That's Fit to Print",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Daily Tech Prophet",
    description: "All the Tech That's Fit to Print",
  },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#a67c2e",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${garamond.variable} ${inter.variable} ${jetbrains.variable} ${unifraktur.variable} ${oldStandard.variable} ${crimson.variable}`}
      suppressHydrationWarning
    >
      <body className="paper-texture paper-edges min-h-screen font-body antialiased">
        <ThemeProvider>
          <GlobalEffects />
          <KeyboardShortcuts />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
