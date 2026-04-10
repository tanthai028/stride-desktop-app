export const settingsSections = [
  {
    id: "display",
    title: "🖥️ Display",
    description: "Basic UI preferences stored in local storage.",
    items: [
      {
        id: "darkMode",
        type: "toggle",
        title: "🌙 Dark mode",
        description: "Switch between light mode and dark mode.",
      },
    ],
  },
  {
    id: "sound",
    title: "🔊 Sound",
    description: "Choose the hover sound feel for interactive UI elements.",
    items: [
      {
        id: "hoverSoundProfile",
        type: "choice",
        title: "🖱️ Hover sound",
        description: "Pick the hover feedback style you want across the app.",
        options: [
          { label: "Off", value: "off" },
          { label: "Thock", value: "thock" },
          { label: "Tactile", value: "tactile" },
          { label: "Click", value: "click" },
        ],
      },
    ],
  },
];
