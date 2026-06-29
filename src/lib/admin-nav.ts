import {
  LayoutDashboard,
  CalendarDays,
  UserPlus,
  Users,
  CalendarHeart,
  BookOpenCheck,
  Building2,
  Package,
  FileText,
  ReceiptText,
  CreditCard,
  ListChecks,
  MessagesSquare,
  FormInput,
  Workflow,
  Mail,
  BarChart3,
  FileBarChart,
  UsersRound,
  FolderClosed,
  Plug,
  Wallet,
  Settings,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string | number;
};

export type NavGroup = {
  title: string;
  items: NavItem[];
};

export const ADMIN_NAV: NavGroup[] = [
  {
    title: "Overview",
    items: [
      { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
      { label: "Calendar", href: "/admin/calendar", icon: CalendarDays },
    ],
  },
  {
    title: "Sales",
    items: [
      { label: "Leads", href: "/admin/leads", icon: UserPlus, badge: 12 },
      { label: "Customers", href: "/admin/customers", icon: Users },
      { label: "Quotes", href: "/admin/quotes", icon: FileText },
      { label: "Invoices", href: "/admin/invoices", icon: ReceiptText },
      { label: "Payments", href: "/admin/payments", icon: CreditCard },
    ],
  },
  {
    title: "Operations",
    items: [
      { label: "Events", href: "/admin/events", icon: CalendarHeart },
      { label: "Bookings", href: "/admin/bookings", icon: BookOpenCheck },
      { label: "Venues", href: "/admin/venues", icon: Building2 },
      { label: "Packages", href: "/admin/packages", icon: Package },
      { label: "Tasks", href: "/admin/tasks", icon: ListChecks, badge: 4 },
    ],
  },
  {
    title: "Engage",
    items: [
      { label: "Messages", href: "/admin/messages", icon: MessagesSquare, badge: 3 },
      { label: "Forms", href: "/admin/forms", icon: FormInput },
      { label: "Automations", href: "/admin/automations", icon: Workflow },
      { label: "Email Campaigns", href: "/admin/email-campaigns", icon: Mail },
    ],
  },
  {
    title: "Insights",
    items: [
      { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
      { label: "Reports", href: "/admin/reports", icon: FileBarChart },
    ],
  },
  {
    title: "Manage",
    items: [
      { label: "Team", href: "/admin/team", icon: UsersRound },
      { label: "Files", href: "/admin/files", icon: FolderClosed },
      { label: "Integrations", href: "/admin/integrations", icon: Plug },
      { label: "Billing", href: "/admin/billing", icon: Wallet },
      { label: "Settings", href: "/admin/settings/general", icon: Settings },
    ],
  },
];
