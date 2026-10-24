/**
 * Deterministic fare engine shared by the marketing hero and the trip receipt.
 *
 * Prices are quoted from the same tier table that seeds `ride_fares` in Supabase,
 * and the distance/duration estimate is a pure function of the two place names —
 * so the same route always quotes the same price, on every render and in both
 * the public and the signed-in surface.
 */

export type FareTier = {
  id: "uberx" | "comfort" | "uberxl" | "share";
  name: string;
  seats: number;
  blurb: string;
  base: number;
  perKm: number;
  perMin: number;
  eta: string;
};

export const FARE_TIERS: FareTier[] = [
  {
    id: "uberx",
    name: "UberX",
    seats: 4,
    blurb: "Affordable everyday rides",
    base: 5.5,
    perKm: 3.2,
    perMin: 0.45,
    eta: "3 min",
  },
  {
    id: "comfort",
    name: "Comfort",
    seats: 4,
    blurb: "Newer cars with extra legroom",
    base: 8,
    perKm: 4.1,
    perMin: 0.6,
    eta: "5 min",
  },
  {
    id: "uberxl",
    name: "UberXL",
    seats: 6,
    blurb: "Affordable rides for groups up to 6",
    base: 11,
    perKm: 5.2,
    perMin: 0.75,
    eta: "7 min",
  },
  {
    id: "share",
    name: "UberX Share",
    seats: 2,
    blurb: "Share your ride and save",
    base: 3.8,
    perKm: 2.3,
    perMin: 0.32,
    eta: "6 min",
  },
];

export type Estimate = { distance: number; duration: number };

function fnv1a(input: string) {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

/** 3.2 – 14.9 km, 12 – 40 min, stable for a given origin/destination pair. */
export function estimateRoute(from: string, to: string): Estimate {
  const h = fnv1a(`${from.trim().toLowerCase()}→${to.trim().toLowerCase()}`);
  const distance = 3.2 + (h % 118) / 10;
  const duration = Math.round(distance * 2.4 + 4 + (h % 7));
  return { distance: Math.round(distance * 10) / 10, duration };
}

export function quote(tier: FareTier, est: Estimate) {
  const raw = tier.base + tier.perKm * est.distance + tier.perMin * est.duration;
  return Math.round(raw * 100) / 100;
}

export function quotesFor(from: string, to: string) {
  const est = estimateRoute(from, to);
  return FARE_TIERS.map((tier) => ({ tier, price: quote(tier, est) })).sort(
    (a, b) => a.price - b.price
  );
}

/** Split a settled fare into the lines a receipt shows. */
export function breakdownFor(fare: number, distanceKm: number) {
  const bookingFee = Math.round(Math.min(3.5, Math.max(1.6, distanceKm * 0.12)) * 100) / 100;
  const service = Math.round(fare * 0.06 * 100) / 100;
  const time = Math.round(fare * 0.18 * 100) / 100;
  const base = Math.round((fare - bookingFee - service - time) * 100) / 100;
  return [
    { label: "Base fare", value: Math.max(0, base) },
    { label: "Distance", value: Math.round(fare * 0.52 * 100) / 100 },
    { label: "Time", value: time },
    { label: "Booking fee", value: bookingFee },
    { label: "Service fee", value: service },
  ].filter((line) => line.value > 0);
}

export const POPULAR_ROUTES: { from: string; to: string; note: string }[] = [
  { from: "Osu, Oxford Street", to: "Kotoka International Airport", note: "Airport run" },
  { from: "East Legon", to: "Accra Mall", note: "12 min" },
  { from: "Labone", to: "Ridge, Accra", note: "Commute" },
  { from: "Circle", to: "University of Ghana, Legon", note: "Campus" },
];
