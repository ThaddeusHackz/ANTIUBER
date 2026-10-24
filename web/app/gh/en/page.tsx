import type { Metadata } from "next";
import HomePage from "@/app/page";

export const metadata: Metadata = {
  title: "Earn Money by Driving or Get a Ride Now | Uber Ghana",
  alternates: { canonical: "/gh/en" },
};

// Locale-prefixed route matching https://www.uber.com/gh/en/
export default function GhanaEnglishHome() {
  return <HomePage />;
}
