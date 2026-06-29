export type EventStatus = "Confirmed" | "Tentative" | "In Progress" | "Completed";

export type VenueEvent = {
  id: string;
  title: string;
  client: string;
  clientAvatar: string;
  type: string;
  space: string;
  date: string;
  start: string;
  end: string;
  guests: number;
  value: number;
  paid: number;
  status: EventStatus;
  coordinator: string;
};

export const EVENT_STATUS_VARIANT: Record<
  EventStatus,
  "success" | "amber" | "espresso" | "default"
> = {
  Confirmed: "success",
  Tentative: "amber",
  "In Progress": "espresso",
  Completed: "default",
};

export const EVENTS: VenueEvent[] = [
  { id: "E-5012", title: "Eleanor & James Wedding", client: "Eleanor Vance", clientAvatar: "https://i.pravatar.cc/80?img=5", type: "Wedding Reception", space: "The Grand Atrium", date: "2026-09-14", start: "4:00 PM", end: "11:00 PM", guests: 220, value: 28500, paid: 14250, status: "Confirmed", coordinator: "Mara Quinn" },
  { id: "E-5011", title: "Lumen Capital Annual Gala", client: "Priya Raman", clientAvatar: "https://i.pravatar.cc/80?img=32", type: "Corporate Gala", space: "The Entire Collection", date: "2026-11-02", start: "7:00 PM", end: "12:00 AM", guests: 320, value: 64000, paid: 32000, status: "Confirmed", coordinator: "Alex Rivera" },
  { id: "E-5010", title: "Northwind Launch Party", client: "Marcus Webb", clientAvatar: "https://i.pravatar.cc/80?img=12", type: "Product Launch", space: "The Cellar Lounge", date: "2026-07-29", start: "6:30 PM", end: "10:30 PM", guests: 140, value: 18200, paid: 4550, status: "Tentative", coordinator: "Theo Sandoval" },
  { id: "E-5009", title: "Founders Dinner", client: "Grace Bloom", clientAvatar: "https://i.pravatar.cc/80?img=9", type: "Private Dining", space: "The Reserve", date: "2026-08-02", start: "7:30 PM", end: "11:00 PM", guests: 36, value: 7800, paid: 7800, status: "Confirmed", coordinator: "Mara Quinn" },
  { id: "E-5008", title: "Cedar Foundation Fundraiser", client: "Olivia Park", clientAvatar: "https://i.pravatar.cc/80?img=16", type: "Charity Gala", space: "The Grand Atrium", date: "2026-09-27", start: "6:00 PM", end: "11:00 PM", guests: 260, value: 42000, paid: 10500, status: "Confirmed", coordinator: "Alex Rivera" },
  { id: "E-5007", title: "Brightline Team Offsite", client: "Sam Okafor", clientAvatar: "https://i.pravatar.cc/80?img=33", type: "Team Building", space: "The Terrace Gardens", date: "2026-07-19", start: "10:00 AM", end: "4:00 PM", guests: 80, value: 11200, paid: 11200, status: "Confirmed", coordinator: "Theo Sandoval" },
  { id: "E-5006", title: "Aster Records Showcase", client: "Nina Cole", clientAvatar: "https://i.pravatar.cc/80?img=44", type: "Live Music", space: "The Grand Atrium", date: "2026-10-25", start: "8:00 PM", end: "1:00 AM", guests: 400, value: 38000, paid: 9500, status: "Tentative", coordinator: "Mara Quinn" },
  { id: "E-5005", title: "Rivera Quinceañera", client: "Camila Rivera", clientAvatar: "https://i.pravatar.cc/80?img=31", type: "Birthday Party", space: "The Cellar Lounge", date: "2026-06-21", start: "5:00 PM", end: "11:00 PM", guests: 150, value: 16500, paid: 16500, status: "Completed", coordinator: "Alex Rivera" },
];

export const EVENT_SCHEDULE = [
  { time: "2:00 PM", title: "Vendor & supplier load-in", note: "Florist, band, and caterer access via loading bay." },
  { time: "3:00 PM", title: "Styling & final setup", note: "Tables, linens, floral installations, lighting check." },
  { time: "4:00 PM", title: "Ceremony — The Grand Atrium", note: "Guest seating from 3:40 PM. String quartet." },
  { time: "4:45 PM", title: "Cocktail hour — Terrace Gardens", note: "Canapés & signature cocktails." },
  { time: "6:00 PM", title: "Reception & plated dinner", note: "Five-course tasting menu with wine pairing." },
  { time: "8:30 PM", title: "Speeches & first dance", note: "Live band begins at 9:00 PM." },
  { time: "11:00 PM", title: "Carriages & breakdown", note: "Guest departure, vendor load-out." },
];

export const EVENT_GUESTS = [
  { name: "Eleanor Vance", role: "Bride", rsvp: "Confirmed", meal: "Tasting menu" },
  { name: "James Whitfield", role: "Groom", rsvp: "Confirmed", meal: "Tasting menu" },
  { name: "Margaret Vance", role: "Mother of bride", rsvp: "Confirmed", meal: "Vegetarian" },
  { name: "Robert Whitfield", role: "Father of groom", rsvp: "Confirmed", meal: "Tasting menu" },
  { name: "Priya Raman", role: "Guest", rsvp: "Pending", meal: "—" },
  { name: "Marcus Webb", role: "Guest", rsvp: "Declined", meal: "—" },
];

export const EVENT_CATERING = [
  { course: "Canapés", items: "Heirloom tomato tartlet · Seared scallop · Wild mushroom arancini", diet: "V option" },
  { course: "Starter", items: "Burrata, peach & basil", diet: "Vegetarian" },
  { course: "Fish", items: "Pan-roasted halibut, brown butter", diet: "GF" },
  { course: "Main", items: "Herb-crusted lamb rack, spring vegetables", diet: "—" },
  { course: "Dessert", items: "Vanilla & elderflower entremet", diet: "V" },
];

export const EVENT_PAYMENTS = [
  { id: "P-1", label: "Booking deposit (25%)", date: "2026-06-26", amount: 7125, status: "Paid" },
  { id: "P-2", label: "Second instalment (25%)", date: "2026-07-26", amount: 7125, status: "Paid" },
  { id: "P-3", label: "Balance (50%)", date: "2026-08-31", amount: 14250, status: "Due" },
];
