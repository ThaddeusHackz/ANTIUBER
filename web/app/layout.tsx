import type { Metadata, Viewport } from "next";
import "@fontsource-variable/inter";
import "./globals.css";

export const metadata: Metadata = {
  title: "Earn Money by Driving or Get a Ride Now | Uber Ghana",
  description:
    "Go anywhere with Uber. Request a ride, hop in, and go. Check prices, reserve a trip ahead, and explore ride options in Accra, Kumasi and Takoradi.",
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
  openGraph: {
    title: "Earn Money by Driving or Get a Ride Now | Uber Ghana",
    description:
      "Go anywhere with Uber. Request a ride, hop in, and go. Available in Accra, Kumasi and Sekondi-Takoradi.",
    type: "website",
    locale: "en_GH",
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://antiuber-gh.vercel.app";

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE}/#org`,
      name: "Uber Ghana",
      url: `${SITE}/gh/en`,
      areaServed: ["Accra", "Kumasi", "Sekondi-Takoradi"],
      sameAs: ["https://www.uber.com/gh/en/"],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE}/#site`,
      name: "Uber Ghana",
      url: SITE,
      inLanguage: "en-GH",
      publisher: { "@id": `${SITE}/#org` },
      potentialAction: {
        "@type": "SearchAction",
        target: `${SITE}/ride?destination={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-GH">
      <body className="min-h-screen bg-white font-sans antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[200] focus:rounded-lg focus:bg-black focus:px-4 focus:py-2 focus:text-[14px] focus:text-white"
        >
          Skip to content
        </a>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </body>
    </html>
  );
}
