export const SITE = {
  name: "VenueFlow",
  tagline: "Where extraordinary events begin.",
  // The marketing site is presented as a luxury venue brand using VenueFlow.
  venueName: "The Atrium Collection",
};

export const MARKETING_NAV: { label: string; href: string }[] = [
  { label: "Spaces", href: "/event-spaces" },
  { label: "Events", href: "/event-types" },
  { label: "Gallery", href: "/gallery" },
  { label: "Packages", href: "/packages" },
  { label: "Stories", href: "/blog" },
  { label: "About", href: "/about" },
];

export const FOOTER_NAV: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Venue",
    links: [
      { label: "Event Spaces", href: "/event-spaces" },
      { label: "Event Types", href: "/event-types" },
      { label: "Gallery", href: "/gallery" },
      { label: "Upcoming Events", href: "/upcoming-events" },
    ],
  },
  {
    title: "Plan",
    links: [
      { label: "Packages & Pricing", href: "/packages" },
      { label: "Book an Event", href: "/book-event" },
      { label: "Request a Quote", href: "/request-quote" },
      { label: "Check Availability", href: "/check-availability" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Testimonials", href: "/testimonials" },
      { label: "FAQs", href: "/faqs" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms & Conditions", href: "/terms" },
      { label: "Customer Login", href: "/login" },
    ],
  },
];
