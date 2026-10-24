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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-GH">
      <body className="min-h-screen bg-white font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
