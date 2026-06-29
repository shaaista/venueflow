export type CustomerStatus = "VIP" | "Active" | "Prospect" | "Inactive";

export type Customer = {
  id: string;
  name: string;
  company?: string;
  email: string;
  phone: string;
  location: string;
  avatar: string;
  status: CustomerStatus;
  totalSpent: number;
  events: number;
  since: string;
  lastEvent: string;
  tags: string[];
};

export const CUSTOMER_STATUS_VARIANT: Record<
  CustomerStatus,
  "espresso" | "success" | "amber" | "default"
> = {
  VIP: "espresso",
  Active: "success",
  Prospect: "amber",
  Inactive: "default",
};

export const CUSTOMERS: Customer[] = [
  { id: "C-101", name: "Priya Raman", company: "Lumen Capital", email: "priya@lumencap.com", phone: "+1 (555) 901-2245", location: "Seattle, WA", avatar: "https://i.pravatar.cc/80?img=32", status: "VIP", totalSpent: 186000, events: 4, since: "2023-03-12", lastEvent: "Annual Gala", tags: ["Corporate", "Repeat"] },
  { id: "C-102", name: "Eleanor Vance", email: "eleanor@vancemail.com", phone: "+1 (555) 234-8901", location: "Portland, OR", avatar: "https://i.pravatar.cc/80?img=5", status: "Active", totalSpent: 28500, events: 1, since: "2026-06-12", lastEvent: "Wedding Reception", tags: ["Wedding", "VIP"] },
  { id: "C-103", name: "Sam Okafor", company: "Brightline", email: "sam@brightline.dev", phone: "+1 (555) 712-0098", location: "Seattle, WA", avatar: "https://i.pravatar.cc/80?img=33", status: "Active", totalSpent: 33600, events: 3, since: "2024-09-01", lastEvent: "Team Offsite", tags: ["Corporate", "Repeat"] },
  { id: "C-104", name: "Marcus Webb", company: "Northwind Studios", email: "marcus@northwind.io", phone: "+1 (555) 778-1190", location: "Portland, OR", avatar: "https://i.pravatar.cc/80?img=12", status: "Prospect", totalSpent: 0, events: 0, since: "2026-06-18", lastEvent: "—", tags: ["Corporate"] },
  { id: "C-105", name: "Sofia Almeida", email: "sofia.almeida@gmail.com", phone: "+1 (555) 332-6612", location: "Bend, OR", avatar: "https://i.pravatar.cc/80?img=45", status: "Active", totalSpent: 12400, events: 1, since: "2025-08-16", lastEvent: "Anniversary", tags: ["Private"] },
  { id: "C-106", name: "Olivia Park", company: "Cedar Foundation", email: "opark@cedarfound.org", phone: "+1 (555) 145-9923", location: "Portland, OR", avatar: "https://i.pravatar.cc/80?img=16", status: "VIP", totalSpent: 98000, events: 3, since: "2022-11-05", lastEvent: "Fundraiser", tags: ["Corporate", "Non-profit"] },
  { id: "C-107", name: "Nina Cole", company: "Aster Records", email: "nina@asterrecords.com", phone: "+1 (555) 330-1148", location: "Portland, OR", avatar: "https://i.pravatar.cc/80?img=44", status: "Active", totalSpent: 38000, events: 2, since: "2024-02-20", lastEvent: "Showcase", tags: ["Corporate"] },
  { id: "C-108", name: "Daniel Harlow", email: "dharlow@pdxschools.org", phone: "+1 (555) 220-3349", location: "Portland, OR", avatar: "https://i.pravatar.cc/80?img=20", status: "Inactive", totalSpent: 9600, events: 1, since: "2023-06-30", lastEvent: "Graduation", tags: ["Private"] },
];

export const CUSTOMER_ACTIVITY = [
  { id: "ca1", title: "Signed proposal for Annual Gala", time: "12m ago" },
  { id: "ca2", title: "Paid deposit of $32,000", time: "2 days ago" },
  { id: "ca3", title: "Attended site visit", time: "1 week ago" },
  { id: "ca4", title: "Requested a quote for Q4 gala", time: "3 weeks ago" },
];
