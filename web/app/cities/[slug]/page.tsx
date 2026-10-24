import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteFrame } from "@/components/site-frame";
import { CITIES } from "@/lib/content";
import { Clock, Car, Star, Shield, ArrowRight } from "@/components/icons";

const LOCAL: Record<
  string,
  { intro: string; areas: string[]; headline: string; eta: string }
> = {
  accra: {
    headline: "Getting around Accra",
    intro:
      "From Osu to Airport City, Uber makes it easy to move across Greater Accra. Request a ride in minutes, or reserve ahead for airport runs.",
    areas: ["Osu", "East Legon", "Airport Residential", "Labone", "Cantonments", "Tema"],
    eta: "4 min",
  },
  kumasi: {
    headline: "Getting around Kumasi",
    intro:
      "Ride across the Garden City — from Adum and Kejetia to KNUST and Asokwa — with upfront prices.",
    areas: ["Adum", "Kejetia", "KNUST", "Asokwa", "Bantama", "Ahodwo"],
    eta: "5 min",
  },
  takoradi: {
    headline: "Getting around Sekondi-Takoradi",
    intro:
      "Move between Sekondi, Takoradi and the harbour district with reliable rides, day or night.",
    areas: ["Takoradi Market Circle", "Sekondi", "Beach Road", "Airport Ridge", "Effia"],
    eta: "6 min",
  },
  "cape-coast": {
    headline: "Getting around Cape Coast",
    intro:
      "Explore the Central Region — from Cape Coast Castle to UCC campus — with rides on demand.",
    areas: ["Cape Coast Castle", "UCC", "Pedu", "Abura", "Elmina"],
    eta: "7 min",
  },
  tamale: {
    headline: "Getting around Tamale",
    intro:
      "Uber is preparing to launch in Tamale. Check back soon for coverage in the Northern Region.",
    areas: ["Tamale Central", "Lamashegu", "Sagnarigu"],
    eta: "—",
  },
  wichita: {
    headline: "Getting around Wichita",
    intro:
      "This city profile was auto-detected from your location. Change your city in the header to see live coverage.",
    areas: ["Central"],
    eta: "—",
  },
};

export function generateStaticParams() {
  return CITIES.map((c) => ({ slug: c.slug }));
}

export default function CityPage({ params }: { params: { slug: string } }) {
  const city = CITIES.find((c) => c.slug === params.slug);
  if (!city) notFound();
  const local = LOCAL[city.slug] ?? LOCAL.accra;

  return (
    <SiteFrame>
      <div className="shell py-12">
        <nav className="flex items-center gap-2 text-[13px] text-muted">
          <Link href="/cities" className="hover:text-black">
            Cities
          </Link>
          <span>/</span>
          <span className="text-black">{city.name}</span>
        </nav>

        <div className="mt-6 grid gap-10 lg:grid-cols-[1.1fr_.9fr]">
          <div>
            <h1 className="text-[40px] font-semibold leading-tight tracking-[-0.035em]">
              {local.headline}
            </h1>
            <p className="mt-4 max-w-[540px] text-[16px] leading-relaxed text-muted">
              {local.intro}
            </p>

            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
              {[
                { icon: <Clock />, v: local.eta, l: "Average pickup" },
                { icon: <Car />, v: "4", l: "Ride options" },
                { icon: <Star />, v: "4.9", l: "Driver rating" },
              ].map((s) => (
                <div key={s.l} className="rounded-lg bg-surface p-4">
                  <span className="text-black/70">{s.icon}</span>
                  <p className="mt-2 text-[20px] font-semibold">{s.v}</p>
                  <p className="text-[12px] text-muted">{s.l}</p>
                </div>
              ))}
            </div>

            <h2 className="mt-10 text-[20px] font-semibold">Neighbourhoods covered</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {local.areas.map((a) => (
                <span
                  key={a}
                  className="rounded-full border border-hair px-3.5 py-2 text-[13px]"
                >
                  {a}
                </span>
              ))}
            </div>

            <Link href="/ride" className="btn btn-primary mt-8 px-6">
              Request a ride <ArrowRight width={16} height={16} />
            </Link>
          </div>

          <div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-surface">
              <Image
                src="/images/city-hub.jpg"
                alt={`${city.name} at golden hour`}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
            </div>
            <div className="mt-5 rounded-lg border border-hair p-5">
              <p className="flex items-center gap-2 text-[15px] font-semibold">
                <Shield width={17} height={17} /> Safe rides, every trip
              </p>
              <p className="mt-1.5 text-[13px] leading-relaxed text-muted">
                Live trip sharing, an in-app emergency button and 24/7 support are
                available on every ride in {city.name}.
              </p>
            </div>
          </div>
        </div>
      </div>
    </SiteFrame>
  );
}
