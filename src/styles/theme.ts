import { Platform } from "react-native";

export const MONO = Platform.select({
  ios: "Menlo",
  android: "monospace",
  default: "monospace",
});

export const DARK = "#0C161F";
export const LIGHT = "#FFFFED";
export const MID = "#6B7D8D";
export const BORDER = "#D8D4C0";
