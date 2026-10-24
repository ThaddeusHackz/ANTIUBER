import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteFrame } from "@/components/site-frame";
import { ArrowRight, Check } from "@/components/icons";

type Info = {
  title: string;
  eyebrow?: string;
  intro: string;
  bullets?: string[];
  body?: string[];
};

const PAGES: Record<string, Info> = {
  about: {
    title: "About Uber",
    eyebrow: "Company",
    intro:
      "We reimagine the way the world moves for the better. Uber connects riders with drivers across more than 70 countries, including Ghana.",
    bullets: [
      "Available in Accra, Kumasi and Sekondi-Takoradi",
      "Millions of trips every day worldwide",
      "Built around safety, reliability and fair earnings",
    ],
  },
  "about/uber-offerings": {
    title: "Our offerings",
    eyebrow: "Company",
    intro:
      "From everyday rides to business travel, rentals and delivery, Uber offers a range of products in Ghana.",
    bullets: [
      "Ride — on-demand trips across the city",
      "Reserve — schedule a ride up to 90 days ahead",
      "Uber for Business — managed travel for teams",
      "Uber Rent — rental cars booked in the app",
    ],
  },
  "about/how-does-uber-work": {
    title: "How Uber works",
    eyebrow: "Company",
    intro:
      "Tap a button, get a ride. Our platform matches riders with nearby drivers using real-time location and pricing.",
    bullets: [
      "Enter your destination and see the price upfront",
      "A nearby driver accepts your request",
      "Track the trip and pay automatically",
      "Rate your driver and tip in the app",
    ],
  },
  "about/sustainability": {
    title: "Sustainability",
    eyebrow: "Company",
    intro:
      "We're working to make every trip greener — from EV incentives for drivers to shared rides that cut emissions per passenger.",
    bullets: [
      "Support for electric vehicles in partner cities",
      "UberX Share reduces cars on the road",
      "Emissions reporting for business accounts",
    ],
  },
  "about/autonomous": {
    title: "Autonomous",
    eyebrow: "Company",
    intro:
      "We partner with the world's leading autonomous vehicle developers to bring self-driving rides to the Uber network.",
  },
  newsroom: {
    title: "Newsroom",
    eyebrow: "Company",
    intro:
      "The latest announcements from Uber in Ghana and around the world.",
    body: [
      "Uber expands Reserve to Kumasi and Takoradi — riders can now book trips up to 90 days in advance.",
      "Safety toolkit update brings live trip sharing to every ride in Ghana.",
      "Uber for Business adds meal programmes for teams in Accra.",
    ],
  },
  blog: {
    title: "Blog",
    eyebrow: "Company",
    intro: "Stories about the cities we serve, the people who drive, and the products we build.",
  },
  careers: {
    title: "Careers",
    eyebrow: "Company",
    intro:
      "Help us build the future of mobility. We hire across engineering, operations, policy and design.",
    bullets: ["Accra office and remote roles", "Competitive equity and benefits", "Work on products used across Africa"],
  },
  safety: {
    title: "Safety",
    eyebrow: "Global citizenship",
    intro:
      "Every ride includes a safety toolkit: emergency assistance, live trip sharing and 24/7 support.",
    bullets: [
      "Verify your driver's name, vehicle and plate before you get in",
      "Share your trip in real time with a trusted contact",
      "Use the in-app emergency button if you ever feel unsafe",
      "Report an incident and our team will follow up",
    ],
  },
  accessibility: {
    title: "Accessibility",
    eyebrow: "Global citizenship",
    intro:
      "We design products that work for everyone, including riders who use screen readers or need extra assistance.",
    bullets: [
      "Uber Assist for riders with accessibility needs",
      "Service animal friendly drivers",
      "Screen-reader optimised app experience",
    ],
  },
  eats: {
    title: "Uber Eats",
    eyebrow: "Products",
    intro:
      "Order food from local restaurants and get it delivered across Accra.",
    body: ["Uber Eats is available in Accra with hundreds of local restaurants."],
  },
  rent: {
    title: "Rental Cars",
    eyebrow: "Products",
    intro:
      "Your perfect rental car is a few clicks away. Learn more about Uber Rent.",
    bullets: [
      "Book a car by the hour, day or week",
      "Pick up in Accra or have it delivered",
      "Insurance and roadside assistance included",
    ],
  },
  "ride/teens": {
    title: "Teen accounts",
    eyebrow: "Ways to ride",
    intro:
      "Teen accounts offer top-rated drivers and built-in safety tools, so 13–17 year olds can get around safely.",
    bullets: [
      "Only highly rated, experienced drivers",
      "Teen PIN verification before every trip",
      "Live trip tracking for parents and guardians",
      "Trip limits and spending controls",
    ],
  },
  "ride/seniors": {
    title: "Senior accounts",
    eyebrow: "Ways to ride",
    intro:
      "Request a ride with extra assistance, from your door to your destination.",
    bullets: [
      "Drivers with extra training and patience",
      "Help getting in and out of the vehicle",
      "Larger text and simplified booking",
    ],
  },
  "legal/privacy": {
    title: "Privacy",
    eyebrow: "Legal",
    intro:
      "This reverse-engineered demonstration stores only the data you enter while exploring the rider experience, in a namespaced set of tables.",
    body: [
      "Account email, name and phone are stored in Supabase Auth.",
      "Trip history and saved places are stored in ride_* tables with row-level security.",
      "No analytics or third-party trackers are loaded on this site.",
    ],
  },
  "legal/terms": {
    title: "Terms",
    eyebrow: "Legal",
    intro:
      "This site is a reverse-engineered demo built for educational purposes. It is not affiliated with, endorsed by, or operated by Uber Technologies Inc.",
    body: [
      "Uber, Uber Eats and related marks are trademarks of Uber Technologies Inc.",
      "Rides booked here are simulations and never dispatch a real vehicle.",
      "No commercial use of this demonstration is permitted.",
    ],
  },
  "legal/accessibility": {
    title: "Accessibility statement",
    eyebrow: "Legal",
    intro:
      "This demo targets WCAG 2.2 AA: keyboard-operable controls, visible focus states, reduced-motion support and semantic landmarks.",
  },
};

export function generateStaticParams() {
  return Object.keys(PAGES).map((slug) => ({ slug: slug.split("/") }));
}

export default function InfoPage({ params }: { params: { slug: string[] } }) {
  const key = params.slug.join("/");
  const page = PAGES[key];
  if (!page) notFound();

  return (
    <SiteFrame>
      <div className="shell max-w-[820px] py-14">
        {page.eyebrow && (
          <p className="text-[13px] font-semibold uppercase tracking-[.12em] text-subtle">
            {page.eyebrow}
          </p>
        )}
        <h1 className="mt-2 text-[40px] font-semibold leading-tight tracking-[-0.035em]">
          {page.title}
        </h1>
        <p className="mt-4 text-[17px] leading-relaxed text-muted">{page.intro}</p>

        {page.bullets && (
          <ul className="mt-8 space-y-3 text-[15px]">
            {page.bullets.map((b) => (
              <li key={b} className="flex gap-3">
                <Check width={18} height={18} className="mt-0.5 shrink-0" />
                {b}
              </li>
            ))}
          </ul>
        )}

        {page.body && (
          <div className="mt-8 space-y-4">
            {page.body.map((p) => (
              <p key={p} className="text-[15px] leading-relaxed text-muted">
                {p}
              </p>
            ))}
          </div>
        )}

        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/ride" className="btn btn-primary">
            Request a ride <ArrowRight width={16} height={16} />
          </Link>
          <Link href="/" className="btn btn-secondary">
            Back to home
          </Link>
        </div>
      </div>
    </SiteFrame>
  );
}
