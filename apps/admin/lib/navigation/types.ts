import type { IconName } from "./navigation";

export interface NavigationItem {
  title: string;
  href: string;
  icon: IconName;
  permission: string;
}

export interface NavigationGroup {
  title: string;
  items: NavigationItem[];
}