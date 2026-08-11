import { Platform } from "react-native";

const tintColorLight = "#5B4BFF";
const tintColorDark = "#FFFFFF";

export const Colors = {
  light: {
    text: "#111111",
    background: "#F7F7F8",
    card: "#FFFFFF",
    tint: tintColorLight,
    icon: "#737373",
    tabIconDefault: "#737373",
    tabIconSelected: tintColorLight,

    border: "#E5E5E5",
    secondaryText: "#737373",
    mutedText: "#999999",

    primary: "#5B4BFF",
    primaryPressed: "#4939E8",

    success: "#16A34A",
    warning: "#D97706",
    error: "#DC2626",
  },

  dark: {
    text: "#ECEDEE",
    background: "#151718",
    card: "#1E2022",
    tint: tintColorDark,
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,

    border: "#303337",
    secondaryText: "#9BA1A6",
    mutedText: "#73777C",

    primary: "#7C6CFF",
    primaryPressed: "#6B5BEF",

    success: "#22C55E",
    warning: "#F59E0B",
    error: "#EF4444",
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const radius = {
  small: 8,
  input: 12,
  button: 12,
  card: 16,
  pill: 999,
} as const;

export const typography = {
  screenTitle: {
    fontSize: 30,
    fontWeight: "800" as const,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "700" as const,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
  },

  body: {
    fontSize: 15,
    fontWeight: "400" as const,
  },

  secondary: {
    fontSize: 14,
    fontWeight: "400" as const,
  },

  caption: {
    fontSize: 12,
    fontWeight: "500" as const,
  },

  button: {
    fontSize: 16,
    fontWeight: "700" as const,
  },
} as const;

export const Fonts = Platform.select({
  ios: {
    sans: "system-ui",
    serif: "ui-serif",
    rounded: "ui-rounded",
    mono: "ui-monospace",
  },

  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },

  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono:
      "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});