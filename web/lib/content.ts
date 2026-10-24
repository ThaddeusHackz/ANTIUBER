// Content model reverse-engineered from https://www.uber.com/gh/en/
// Section order, headings, CTA labels and footer taxonomy mirror the public page.

export type NavLink = { label: string; href: string };
export type NavColumn = { title: string; links: NavLink[] };
export type NavGroup = {
  label: string;
  href: string;
  columns: NavColumn[];
  promo?: { title: string; body: string; cta: string; href: string };
};

export const HEADER_NAV: NavLink[] = [
  { label: "Ride", href: "/ride" },
  { label: "Drive", href: "/drive" },
  { label: "Business", href: "/business" },
];

export const MEGA_MENUS: Record<string, NavGroup> = {
  Ride: {
    label: "Ride",
    href: "/ride",
    columns: [
      {
        title: "Ways to ride",
        links: [
          { label: "Request a ride", href: "/ride" },
          { label: "Reserve a ride", href: "/reserve" },
          { label: "Ride to the airport", href: "/ride?destination=Kotoka%20International%20Airport" },
          { label: "Teen accounts", href: "/ride/teens" },
          { label: "Senior accounts", href: "/ride/seniors" },
          { label: "Rental cars", href: "/rent" },
        ],
      },
      {
        title: "Explore",
        links: [
          { label: "Ride options", href: "/ride" },
          { label: "Cities", href: "/cities" },
          { label: "How Uber works", href: "/about/how-does-uber-work" },
          { label: "Safety", href: "/safety" },
        ],
      },
    ],
    promo: {
      title: "Go anywhere in Accra",
      body: "Request a ride, hop in, and go. Available across Greater Accra, Kumasi and Sekondi-Takoradi.",
      cta: "See prices",
      href: "/ride",
    },
  },
  Drive: {
    label: "Drive",
    href: "/drive",
    columns: [
      {
        title: "Drive with Uber",
        links: [
          { label: "Sign up to drive", href: "/drive" },
          { label: "Requirements", href: "/drive#requirements" },
          { label: "Earnings", href: "/drive#earnings" },
          { label: "Driver app", href: "/drive#app" },
        ],
      },
      {
        title: "Support",
        links: [
          { label: "Driver help", href: "/help" },
          { label: "Vehicle solutions", href: "/drive#vehicles" },
          { label: "Safety toolkit", href: "/safety" },
        ],
      },
    ],
    promo: {
      title: "Drive and earn on your schedule",
      body: "Make money with rides. Use your car or rent one, and cash out whenever you like.",
      cta: "Sign up to drive",
      href: "/drive",
    },
  },
  Business: {
    label: "Business",
    href: "/business",
    columns: [
      {
        title: "Uber for Business",
        links: [
          { label: "Overview", href: "/business" },
          { label: "Business travel", href: "/business#travel" },
          { label: "Meal programs", href: "/business#meals" },
          { label: "Vouchers", href: "/business#vouchers" },
        ],
      },
      {
        title: "For organizations",
        links: [
          { label: "Get started", href: "/business#start" },
          { label: "Admin dashboard", href: "/business#dashboard" },
          { label: "Contact sales", href: "/business#contact" },
        ],
      },
    ],
    promo: {
      title: "All the benefits of Uber, reimagined for business",
      body: "More control, deeper insights and features built for enterprise users.",
      cta: "Learn more",
      href: "/business",
    },
  },
};

export const ABOUT_MENU: NavColumn[] = [
  {
    title: "About",
    links: [
      { label: "About us", href: "/about" },
      { label: "Our offerings", href: "/about/uber-offerings" },
      { label: "How Uber works", href: "/about/how-does-uber-work" },
      { label: "Sustainability", href: "/about/sustainability" },
      { label: "Newsroom", href: "/newsroom" },
      { label: "Investor relations", href: "/newsroom#investors" },
      { label: "Autonomous", href: "/about/autonomous" },
      { label: "Blog", href: "/blog" },
      { label: "Careers", href: "/careers" },
    ],
  },
  {
    title: "Explore",
    links: [
      { label: "Cities", href: "/cities" },
      { label: "Getting around Accra", href: "/cities/accra" },
      { label: "Getting around Kumasi", href: "/cities/kumasi" },
      { label: "Getting around Sekondi-Takoradi", href: "/cities/takoradi" },
    ],
  },
];

export type ExploreTile = {
  slug: string;
  title: string;
  body: string;
  icon: "car" | "calendar" | "plane" | "key" | "teen" | "senior";
  href: string;
};

export const EXPLORE_TILES: ExploreTile[] = [
  {
    slug: "ride",
    title: "Ride",
    body: "Go anywhere with Uber. Request a ride, hop in, and go.",
    icon: "car",
    href: "/ride",
  },
  {
    slug: "reserve",
    title: "Reserve",
    body: "Reserve your ride in advance so you can relax on the day of your trip.",
    icon: "calendar",
    href: "/reserve",
  },
  {
    slug: "airport",
    title: "Airport",
    body: "Request a ride to or from the airport with room for your luggage.",
    icon: "plane",
    href: "/ride?destination=Kotoka%20International%20Airport",
  },
  {
    slug: "rental",
    title: "Rental Cars",
    body: "Your perfect rental car is a few clicks away. Learn more about Uber Rent.",
    icon: "key",
    href: "/rent",
  },
  {
    slug: "teens",
    title: "Teens",
    body: "Teen accounts offer top-rated drivers and built-in safety tools.",
    icon: "teen",
    href: "/ride/teens",
  },
  {
    slug: "seniors",
    title: "Seniors",
    body: "Request a ride with extra assistance, from your door to your destination.",
    icon: "senior",
    href: "/ride/seniors",
  },
];

export const HOW_TO_STEPS = [
  {
    n: "01",
    title: "Get started",
    body: "Enter your destination on Uber.com or in the Uber app. Choose a ride and confirm.",
  },
  {
    n: "02",
    title: "Get matched with a driver",
    body: "A nearby driver accepts your request. You'll be notified when they're close.",
  },
  {
    n: "03",
    title: "Meet your driver",
    body: "Verify your driver's name, vehicle details and your destination, then enter the vehicle.",
  },
  {
    n: "04",
    title: "Enjoy the ride",
    body: "Your driver has turn-by-turn directions for the fastest route.",
  },
  {
    n: "05",
    title: "Rate and tip",
    body: "Please leave feedback about your trip, and you'll also be able to tip your driver.",
  },
];

export const MORE_WAYS = [
  {
    title: "Plan your trip in advance",
    body: "Book your ride up to 90 days ahead by choosing Reserve on Uber.com or in the app.",
    cta: "Reserve now",
    href: "/reserve",
    icon: "calendar" as const,
  },
  {
    title: "Send items within the day",
    body: "Get same-day local delivery of forgotten keys, care packages, and much more.",
    cta: "Send a package",
    href: "/ride?mode=package",
    icon: "package" as const,
  },
];

export const CITIES = [
  { name: "Accra", region: "Greater Accra, GH", slug: "accra", live: true },
  { name: "Kumasi", region: "Ashanti, GH", slug: "kumasi", live: true },
  { name: "Sekondi-Takoradi", region: "Western, GH", slug: "takoradi", live: true },
  { name: "Cape Coast", region: "Central, GH", slug: "cape-coast", live: true },
  { name: "Tamale", region: "Northern, GH", slug: "tamale", live: false },
  { name: "Wichita", region: "Greater Accra, GH", slug: "wichita", live: false },
];

export const FOOTER_COLUMNS = [
  {
    title: "Company",
    links: [
      { label: "About us", href: "/about" },
      { label: "Our offerings", href: "/about/uber-offerings" },
      { label: "Newsroom", href: "/newsroom" },
      { label: "Investors", href: "/newsroom#investors" },
      { label: "Blog", href: "/blog" },
      { label: "Careers", href: "/careers" },
    ],
  },
  {
    title: "Products",
    links: [
      { label: "Ride", href: "/ride" },
      { label: "Drive", href: "/drive" },
      { label: "Business", href: "/business" },
      { label: "Uber Eats", href: "/eats" },
      { label: "Reserve", href: "/reserve" },
      { label: "Rent", href: "/rent" },
    ],
  },
  {
    title: "Global citizenship",
    links: [
      { label: "Safety", href: "/safety" },
      { label: "Sustainability", href: "/about/sustainability" },
      { label: "Accessibility", href: "/accessibility" },
    ],
  },
  {
    title: "Travel",
    links: [
      { label: "Cities", href: "/cities" },
      { label: "Getting around Accra", href: "/cities/accra" },
      { label: "Getting around Kumasi", href: "/cities/kumasi" },
      { label: "Getting around Sekondi-Takoradi", href: "/cities/takoradi" },
      { label: "Help", href: "/help" },
    ],
  },
];

export const LANGUAGES = [
  { code: "en-GH", label: "English (Ghana)", href: "/gh/en" },
  { code: "en", label: "English", href: "/gh/en" },
  { code: "fr", label: "Français", href: "/gh/fr" },
];

// Rider-side content (authenticated experience)
export const SAVED_PLACES = [
  { label: "Home", address: "12 Independence Ave, Accra", icon: "home" as const },
  { label: "Work", address: "Stanbic Heights, Airport City", icon: "work" as const },
];

export const SUGGESTED_PLACES = [
  { label: "Kotoka International Airport", address: "Airport Rd, Accra", kind: "suggestion" as const },
  { label: "Accra Mall", address: "Spintex Rd, Accra", kind: "suggestion" as const },
  { label: "Osu Oxford Street", address: "Oxford St, Osu, Accra", kind: "suggestion" as const },
  { label: "Labadi Beach", address: "La Rd, Accra", kind: "suggestion" as const },
  { label: "Jamestown Lighthouse", address: "High St, Jamestown, Accra", kind: "suggestion" as const },
  { label: "Kwame Nkrumah Circle", address: "Nkrumah Circle, Accra", kind: "suggestion" as const },
  { label: "University of Ghana", address: "Legon, Accra", kind: "suggestion" as const },
  { label: "Tema Community 1", address: "Tema, Greater Accra", kind: "suggestion" as const },
];

export const RECENT_DESTINATIONS = [
  { label: "Accra Mall", address: "Spintex Rd, Accra", kind: "recent" as const },
  { label: "Kotoka International Airport", address: "Airport Rd, Accra", kind: "recent" as const },
];

export const QUICK_HELP = [
  { title: "I lost an item", body: "Contact your driver about a left-behind item." },
  { title: "My fare changed", body: "Understand what can affect the price of a trip." },
  { title: "Account & payment", body: "Manage your account, receipts and payment methods." },
  { title: "Safety", body: "How to get help during a trip and report an incident." },
];
