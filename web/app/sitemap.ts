import type { MetadataRoute } from "next";

const BASE = process.env.NEXT_PUBLIC_SITE_URL || "https://antiuber-gh.vercel.app";

const ROUTES = [
  "",
  "gh/en",
  "ride",
  "reserve",
  "activity",
  "account",
  "payments",
  "drive",
  "business",
  "help",
  "login",
  "signup",
  "cities/accra",
  "cities/kumasi",
  "cities/sekondi-takoradi",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return ROUTES.map((route) => ({
    url: route ? `${BASE}/${route}` : BASE,
    lastModified,
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1 : route.startsWith("gh/") ? 0.9 : 0.7,
  }));
}
