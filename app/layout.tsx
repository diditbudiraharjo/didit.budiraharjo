import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Public_Sans, JetBrains_Mono } from "next/font/google";
import "@/styles/globals.css";
import { site } from "@/config/site";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo/jsonld";
import { AppProviders } from "@/components/providers/app-providers";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const display = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-display-src" });
const body = Public_Sans({ subsets: ["latin"], variable: "--font-body-src" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono-src" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "matte design — Creative Design, Brand Identities, Smart Development",
    template: "%s — matte design",
  },
  description: site.tagline,
  applicationName: site.name,
  alternates: { canonical: "/" },
  formatDetection: { telephone: false },
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: "en_US",
    url: "/",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: `${site.name} — ${site.tagline}` }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/opengraph-image"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0e0e0e",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body className="bg-bg font-body text-ink antialiased">
        <AppProviders>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-pill focus:bg-ink focus:px-4 focus:py-2 focus:text-bg"
          >
            Skip to content
          </a>
          <Header />
          <main id="main">
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }}
            />
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd()) }}
            />
            {children}
          </main>
          <Footer />
        </AppProviders>
      </body>
    </html>
  );
}
