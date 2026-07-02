import { SiteChrome } from "@/components/layout/SiteChrome";
import { createMetadata, createRootSchemaGraph } from "@/lib/seo";
import { seoConfig } from "@/lib/seo-config";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  preload: true,
});

export const metadata = createMetadata({
  title: seoConfig.pages.home.title,
  description: seoConfig.pages.home.description,
  path: "/",
  rawTitle: `${seoConfig.pages.home.title} | ${seoConfig.brandSuffix}`,
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const schema = createRootSchemaGraph();

  return (
    <html lang="en-AU" className={inter.variable}>
      <head>
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <meta name="theme-color" content="#111111" />
        <meta name="format-detection" content="telephone=yes" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      </head>
      <body className="min-h-screen font-sans antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-accent focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to main content
        </a>
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
