import type { WaveLoaderProps } from "wave-loader";

export type PreviewBg = "light" | "dark" | "custom";

export type PresetItem = {
  id: string;
  label: string;
  description: string;
  note?: string;
  noteUrl?: string;
  value: WaveLoaderProps;
  bg: PreviewBg;
};

export type ApiRow = {
  name: string;
  type: string;
  defaultValue: string;
  description: string;
};
