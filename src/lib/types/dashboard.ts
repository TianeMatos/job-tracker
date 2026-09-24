// lib/metrics.ts
import { LucideIcon } from "lucide-react";
import { ApplicationStatus } from "@/schemas/application";

export type Metric = {
  label: string;
  value: string | number;
  detail: string;
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  iconFilled?: boolean
};

export type Summary = {
  label: string;
  value: string | number;
  icon: LucideIcon;
};

export type Application = {
  id: string;
  company: string;
  initials: string;
  role: string;
  date: string;
  status: ApplicationStatus;
};

export type SidebarUser = {
  id: string;
  name: string;
  email: string;
  image?: string | null;
};