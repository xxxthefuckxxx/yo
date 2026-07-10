// Design tokens for DzSwoopa
// Algerian-inspired palette: deep Sahara night + warm terracotta accents

export const theme = {
  // Backgrounds
  bg: "#0A0E1A",
  bgElevated: "#111728",
  card: "#161D31",
  cardHover: "#1C2440",

  // Accents — terracotta / Sahara
  accent: "#E8703A",
  accentBright: "#FF8550",
  accentDim: "#A85020",

  // Secondary — teal (Algerian flag green echo)
  teal: "#2EB392",
  tealDim: "#1A6B5A",

  // Text
  text: "#F0F2F8",
  textSecondary: "#8B92A8",
  textMuted: "#5C6378",

  // Borders & dividers
  border: "#1E2640",
  borderLight: "#2A3556",

  // Status
  success: "#2EB392",
  warning: "#F5A623",
  danger: "#E5484D",

  // Glass / blur overlays
  glass: "rgba(17, 23, 40, 0.85)",
  glassLight: "rgba(28, 36, 64, 0.6)",

  // Gradients
  gradientStart: "#0A0E1A",
  gradientMid: "#0F1626",
  gradientEnd: "#141C33",

  // Special
  gold: "#D4A547",
} as const;

export type Theme = typeof theme;
