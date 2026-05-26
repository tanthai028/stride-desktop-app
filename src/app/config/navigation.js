import { BookOpen, Compass, History, Settings } from "lucide-react";

export const navigationItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    iconSrc: "/stride_icon.png",
  },
  {
    id: "discover",
    label: "Discover",
    icon: Compass,
  },
  {
    id: "library",
    label: "Applications",
    icon: BookOpen,
  },
  {
    id: "sessions",
    label: "History",
    icon: History,
  },
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
  },
];
