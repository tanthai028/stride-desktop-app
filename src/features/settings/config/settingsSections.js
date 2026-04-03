export const settingsSections = [
  {
    id: "display",
    title: "🖥️ Display",
    description: "Basic UI preferences stored in local storage.",
    items: [
      {
        id: "animationsEnabled",
        type: "toggle",
        title: "✨ Animations",
        description: "Turn entrance animations on or off.",
      },
      {
        id: "darkMode",
        type: "toggle",
        title: "🌙 Dark mode",
        description: "Switch to a darker color theme for the app.",
      },
      {
        id: "glossyMode",
        type: "toggle",
        title: "🫧 Glossy mode",
        description: "Use a more translucent glass-style look across the app.",
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
          { label: "Thock", value: "thock" },
          { label: "Tactile", value: "tactile" },
          { label: "Click", value: "click" },
        ],
      },
    ],
  },
];
