import { BookOpen, History, Settings } from "lucide-react";

export const navigationItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    iconSrc: "/stride_icon.png",
  },
  {
    id: "library",
    label: "Applications",
    icon: BookOpen,
  },
  {
    id: "sessions",
    label: "Sessions",
    icon: History,
  },
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
  },
];
