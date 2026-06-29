// Shared mock content for the public luxury-venue marketing site.

export type EventType = {
  slug: string;
  name: string;
  blurb: string;
  guests: string;
  image: string;
};

export const EVENT_TYPES: EventType[] = [
  { slug: "wedding-reception", name: "Wedding Reception", blurb: "Timeless celebrations beneath the atrium glass.", guests: "Up to 320", image: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=1200&q=80" },
  { slug: "corporate-events", name: "Corporate Events", blurb: "Conferences, galas, and product launches with poise.", guests: "Up to 450", image: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80" },
  { slug: "private-dining", name: "Private Dining", blurb: "Intimate chef's-table experiences and tasting menus.", guests: "Up to 40", image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=80" },
  { slug: "birthday-parties", name: "Birthday Parties", blurb: "Milestone moments styled to perfection.", guests: "Up to 180", image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1200&q=80" },
  { slug: "baby-shower", name: "Baby Shower", blurb: "Soft, luminous gatherings for new beginnings.", guests: "Up to 80", image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=80" },
  { slug: "networking-event", name: "Networking Event", blurb: "Curated mixers with cocktail service.", guests: "Up to 250", image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1200&q=80" },
  { slug: "team-building", name: "Team Building", blurb: "Away-days and workshops in flexible spaces.", guests: "Up to 120", image: "https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=1200&q=80" },
  { slug: "anniversary", name: "Anniversary", blurb: "Romantic evenings worth remembering.", guests: "Up to 150", image: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=1200&q=80" },
  { slug: "graduation", name: "Graduation", blurb: "Honour the achievement in grand style.", guests: "Up to 200", image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80" },
  { slug: "live-music", name: "Live Music", blurb: "Acoustic sessions to full-stage productions.", guests: "Up to 400", image: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=80" },
  { slug: "community-events", name: "Community Events", blurb: "Markets, fairs, and cultural gatherings.", guests: "Up to 500", image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80" },
  { slug: "custom-event", name: "Custom Event", blurb: "If you can dream it, we can stage it.", guests: "Flexible", image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1200&q=80" },
];

export type Space = {
  slug: string;
  name: string;
  tagline: string;
  capacity: number;
  size: string;
  priceFrom: number;
  amenities: string[];
  image: string;
  availability: "High" | "Limited" | "Booked";
};

export const SPACES: Space[] = [
  {
    slug: "main-hall",
    name: "The Grand Atrium",
    tagline: "Our signature hall beneath a cathedral of glass.",
    capacity: 320,
    size: "6,400 sq ft",
    priceFrom: 8500,
    amenities: ["Glass ceiling", "Stage & rigging", "Bridal suite", "Valet"],
    image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1400&q=80",
    availability: "Limited",
  },
  {
    slug: "private-room",
    name: "The Reserve",
    tagline: "An intimate panelled room for private dining.",
    capacity: 40,
    size: "900 sq ft",
    priceFrom: 2200,
    amenities: ["Chef's table", "Wine cellar", "Fireplace", "Sommelier"],
    image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1400&q=80",
    availability: "High",
  },
  {
    slug: "outdoor-area",
    name: "The Terrace Gardens",
    tagline: "Open-air celebrations framed by olive trees.",
    capacity: 220,
    size: "5,000 sq ft",
    priceFrom: 6400,
    amenities: ["Pergola", "Festoon lighting", "Fire pits", "Heaters"],
    image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1400&q=80",
    availability: "High",
  },
  {
    slug: "basement",
    name: "The Cellar Lounge",
    tagline: "A moody, candlelit space for after-dark events.",
    capacity: 140,
    size: "2,800 sq ft",
    priceFrom: 3800,
    amenities: ["DJ booth", "Cocktail bar", "Lounge seating", "Sound system"],
    image: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=1400&q=80",
    availability: "Booked",
  },
  {
    slug: "entire-venue",
    name: "The Entire Collection",
    tagline: "Exclusive use of every space, inside and out.",
    capacity: 600,
    size: "18,000 sq ft",
    priceFrom: 24000,
    amenities: ["Full exclusivity", "Dedicated team", "All spaces", "Overnight suites"],
    image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1400&q=80",
    availability: "Limited",
  },
];

export type Package = {
  name: string;
  tier: "Bronze" | "Silver" | "Gold" | "Custom";
  priceFrom: number | null;
  perGuest: boolean;
  highlight: boolean;
  description: string;
  features: string[];
};

export const PACKAGES: Package[] = [
  {
    name: "Bronze", tier: "Bronze", priceFrom: 95, perGuest: true, highlight: false,
    description: "Everything you need for a beautifully simple celebration.",
    features: ["Venue hire (5 hours)", "Tables, linens & seating", "Welcome drink on arrival", "Dedicated event host", "Standard lighting & sound"],
  },
  {
    name: "Silver", tier: "Silver", priceFrom: 145, perGuest: true, highlight: false,
    description: "An elevated experience with curated dining and styling.",
    features: ["Venue hire (7 hours)", "Three-course plated dinner", "Half-day styling consultation", "Premium bar package", "Ambient lighting design", "On-site coordinator"],
  },
  {
    name: "Gold", tier: "Gold", priceFrom: 225, perGuest: true, highlight: true,
    description: "The full signature experience, white-glove from start to finish.",
    features: ["Exclusive venue hire (full day)", "Five-course tasting menu", "Full styling & florals", "Top-shelf open bar", "Live entertainment slot", "Bridal / VIP suite", "Dedicated planning team"],
  },
  {
    name: "Custom", tier: "Custom", priceFrom: null, perGuest: false, highlight: false,
    description: "A bespoke proposal designed entirely around your vision.",
    features: ["Tailored space configuration", "Bespoke menu design", "Multi-day events welcome", "Production & AV at scale", "International guest services", "Personal account director"],
  },
];

export type Testimonial = {
  name: string;
  role: string;
  quote: string;
  avatar: string;
  rating: number;
};

export const TESTIMONIALS: Testimonial[] = [
  { name: "Eleanor & James", role: "Wedding, The Grand Atrium", rating: 5, avatar: "https://i.pravatar.cc/120?img=5", quote: "Every detail was anticipated before we even thought of it. Our guests still talk about the evening under the glass roof." },
  { name: "Priya Raman", role: "Director, Lumen Capital", rating: 5, avatar: "https://i.pravatar.cc/120?img=32", quote: "We host our annual gala here every year. The team operates with the precision of a five-star hotel and the warmth of a family." },
  { name: "Marcus Webb", role: "Founder, Northwind Studios", rating: 5, avatar: "https://i.pravatar.cc/120?img=12", quote: "From the first enquiry to the last dance, it was effortless. The quote, the planning, the night — all flawless." },
  { name: "Sofia Almeida", role: "50th Anniversary", rating: 5, avatar: "https://i.pravatar.cc/120?img=45", quote: "They turned a milestone into a memory we'll keep forever. The terrace at golden hour was simply breathtaking." },
];

export const GALLERY: { src: string; tall?: boolean; label: string }[] = [
  { src: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=900&q=80", label: "Atrium Wedding", tall: true },
  { src: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=900&q=80", label: "Celebration" },
  { src: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=900&q=80", label: "Private Dining" },
  { src: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=900&q=80", label: "Terrace", tall: true },
  { src: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=900&q=80", label: "Gala" },
  { src: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=900&q=80", label: "Live Stage" },
  { src: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=900&q=80", label: "Evening" },
  { src: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=900&q=80", label: "Reception" },
];

export const FAQS: { q: string; a: string }[] = [
  { q: "How far in advance should I book?", a: "For weddings and large galas we recommend 9–12 months ahead. Corporate and private events can often be accommodated within 4–8 weeks, subject to availability." },
  { q: "Can we bring our own caterer?", a: "Our in-house culinary team handles most events, but for cultural or specialist menus we welcome approved external caterers with a kitchen-use arrangement." },
  { q: "Is the venue accessible?", a: "Yes. All event spaces are fully wheelchair accessible, with step-free routes, accessible restrooms, and dedicated parking." },
  { q: "What is included in venue hire?", a: "Hire includes tables, seating, linens, base lighting and sound, a dedicated event host, set-up and breakdown, and on-site security." },
  { q: "Do you offer overnight accommodation?", a: "The Entire Collection package includes access to boutique suites on-site. We also partner with nearby luxury hotels for guest stays." },
  { q: "How do deposits and payments work?", a: "A 25% deposit secures your date. The balance is split across two milestone payments, with the final due 14 days before your event." },
];

export const UPCOMING_EVENTS: { date: string; title: string; type: string; image: string; status: string }[] = [
  { date: "2026-07-12", title: "Midsummer Garden Gala", type: "Charity Gala", image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=900&q=80", status: "Few tickets" },
  { date: "2026-07-19", title: "An Evening of Jazz", type: "Live Music", image: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=900&q=80", status: "On sale" },
  { date: "2026-08-02", title: "The Founders Dinner", type: "Networking", image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=900&q=80", status: "On sale" },
];

export const STATS = [
  { label: "Events hosted", value: 2400, suffix: "+" },
  { label: "Guest satisfaction", value: 99, suffix: "%" },
  { label: "Years of craft", value: 18, suffix: "" },
  { label: "Awards won", value: 27, suffix: "" },
];

export const BLOG_POSTS: { slug: string; title: string; excerpt: string; category: string; date: string; readTime: string; image: string }[] = [
  { slug: "atrium-wedding-trends-2026", title: "Wedding Trends Defining 2026", excerpt: "From living florals to candlelit dinners under glass — the looks shaping next season's celebrations.", category: "Weddings", date: "2026-06-10", readTime: "6 min", image: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=1000&q=80" },
  { slug: "planning-a-corporate-gala", title: "The Art of the Corporate Gala", excerpt: "How to balance brand, hospitality, and a flawless guest experience at scale.", category: "Corporate", date: "2026-05-28", readTime: "8 min", image: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1000&q=80" },
  { slug: "seasonal-tasting-menu", title: "Behind Our Seasonal Tasting Menu", excerpt: "A conversation with our executive chef on sourcing, story, and the craft of the plate.", category: "Culinary", date: "2026-05-14", readTime: "5 min", image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1000&q=80" },
];
