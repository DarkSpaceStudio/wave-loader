import type { ComponentProps } from "react";
import {
  auroraPreset,
  bouncePreset,
  frostPreset,
  lavaPreset,
  mikrohistoriePreset,
  miniPreset,
  nebulaPreset,
  stormPreset,
  sunsetPreset,
  toxicPreset,
  WaveLoader,
  type WaveLoaderProps,
  type WavePathVariant,
} from "wave-loader";
import type { PresetItem, ApiRow } from "../types";

export const MAHALO_PRESET: WaveLoaderProps = {
  width: 240,
  height: 80,
  waves: 3,
  color: "#012D53",
  durationMs: 4000,
  pathVariant: "rounded",
};

export const PRESETS: PresetItem[] = [
  {
    id: "mahaloPreset",
    label: "Mahalo",
    description: "The OG that started it all.",
    note: "Used in Mahalo app",
    noteUrl: "https://mahalo.finance/",
    value: MAHALO_PRESET,
    bg: "light",
  },
  {
    id: "mikrohistoriePreset",
    label: "Mikrohistorie",
    description: "Pulse path, 5 waves, high opacity.",
    note: "Used in Mikrohistorie app",
    noteUrl: "https://mikrohistorie.com",
    value: mikrohistoriePreset,
    bg: "dark",
  },
  {
    id: "miniPreset",
    label: "Mini",
    description: "Tiny inline loader, no fade",
    value: miniPreset,
    bg: "dark",
  },
  {
    id: "nebulaPreset",
    label: "Nebula",
    description: "Deep purple, mixed paths",
    value: nebulaPreset,
    bg: "dark",
  },
  {
    id: "bouncePreset",
    label: "Bounce",
    description: "Dual pulse, fast bounce",
    value: bouncePreset,
    bg: "light",
  },
  {
    id: "lavaPreset",
    label: "Lava",
    description: "Molten orange heat",
    value: lavaPreset,
    bg: "light",
  },
  {
    id: "toxicPreset",
    label: "Toxic",
    description: "Acid green contrast, 2 waves",
    value: toxicPreset,
    bg: "dark",
  },
  {
    id: "auroraPreset",
    label: "Aurora",
    description: "Multi-color northern lights",
    value: auroraPreset,
    bg: "dark",
  },
  {
    id: "sunsetPreset",
    label: "Sunset",
    description: "Warm corals, smooth path",
    value: sunsetPreset,
    bg: "light",
  },
  {
    id: "frostPreset",
    label: "Frost",
    description: "Single icy wave, smooth",
    value: frostPreset,
    bg: "dark",
  },
  {
    id: "stormPreset",
    label: "Storm",
    description: "Fast dark, 5 waves",
    value: stormPreset,
    bg: "light",
  },
];

export const COLOR_SWATCHES: string[] = [
  "#1A1A2E",
  "#2B3A4A",
  "#334155",
  "#5D748A",
  "#94A3B8",
  "#E2E8F0",
  "#F0E6D3",
  "#012D53",
  "#0A3D62",
  "#1F6FEB",
  "#0077B6",
  "#0096C7",
  "#00B4D8",
  "#48CAE4",
  "#8EF7FF",
  "#90E0EF",
  "#00F5FF",
  "#77E3FF",
  "#65D7FF",
  "#A8DADC",
  "#5FFFD2",
  "#66FFCC",
  "#06D6A0",
  "#00C97A",
  "#52B788",
  "#B7E4C7",
  "#7AE582",
  "#7DFFA7",
  "#00FFA3",
  "#39FF9C",
  "#39FF14",
  "#9EFF00",
  "#D2FF6B",
  "#1B4332",
  "#2D6A4F",
  "#2D1B69",
  "#3D0066",
  "#6A0DAD",
  "#7B2CFF",
  "#9B59B6",
  "#A78BFA",
  "#AD8CFF",
  "#C4B5FD",
  "#C490FF",
  "#FF2D95",
  "#8B3A3A",
  "#C2694F",
  "#D4A373",
  "#E8A87C",
  "#F4A261",
  "#FF8A3D",
  "#FF6B00",
  "#FF2E00",
  "#FFC300",
];

export const PATH_VARIANTS: WavePathVariant[] = [
  "choppy",
  "rounded",
  "ripple",
  "smooth",
  "travel",
  "pulse",
  "square",
];

export const DEFAULT_OPACITY = 0.5;

export const API_ROWS: ApiRow[] = [
  {
    name: "width?",
    type: "number",
    defaultValue: "240",
    description: "Canvas width in px",
  },
  {
    name: "height?",
    type: "number",
    defaultValue: "80",
    description: "Canvas height in px",
  },
  {
    name: "waves?",
    type: "number",
    defaultValue: "3 (clamped 1-5)",
    description: "Number of wave layers",
  },
  {
    name: "color?",
    type: "string",
    defaultValue: "#012D53",
    description: "Global base color",
  },
  {
    name: "durationMs?",
    type: "number",
    defaultValue: "4000",
    description: "Global animation cycle duration in ms",
  },
  {
    name: "opacity?",
    type: "number",
    defaultValue: "0.5",
    description: "Global opacity modulator (0-1), proportional across waves",
  },
  {
    name: "pathVariant?",
    type: '"rounded" | "choppy" | "smooth" | "pulse" | "square" | "ripple" | "travel"',
    defaultValue: "rounded",
    description: "Global wave path style",
  },
  {
    name: "fadeOut?",
    type: "number",
    defaultValue: "60",
    description: "Edge fade intensity in % (0 = none, 100 = max)",
  },
  {
    name: "waveOverrides?",
    type: "WaveLoaderWaveOverride[]",
    defaultValue: "undefined",
    description: "Per-wave overrides for color/duration/path",
  },
];

export const OVERRIDE_ROWS: ApiRow[] = [
  {
    name: "color?",
    type: "string",
    defaultValue: "inherits global color",
    description: "Wave-specific color override",
  },
  {
    name: "durationMs?",
    type: "number",
    defaultValue: "inherits global durationMs",
    description: "Wave-specific speed override",
  },
  {
    name: "pathVariant?",
    type: '"rounded" | "choppy" | "smooth" | "pulse" | "square" | "ripple" | "travel"',
    defaultValue: "inherits global pathVariant",
    description: "Wave-specific path style",
  },
];

export const copyPreset = (preset: WaveLoaderProps | undefined): WaveLoaderProps => {
  const safePreset =
    preset && typeof preset === "object" ? preset : MAHALO_PRESET;
  return {
    ...safePreset,
    waveOverrides: safePreset.waveOverrides?.map((o) => ({ ...o })),
  };
};

export type ExternalWaveLoaderProps = ComponentProps<typeof WaveLoader>;

export function asExternalWaveLoaderProps(
  props: WaveLoaderProps,
): ExternalWaveLoaderProps {
  return props as unknown as ExternalWaveLoaderProps;
}

const INDENT_L2 = "    ";
const INDENT_L3 = "      ";
const INDENT_L4 = "        ";

export function buildUsageSnippet(props: WaveLoaderProps): string {
  const attrs: string[] = [];

  if (props.width !== undefined)
    attrs.push(`${INDENT_L3}width={${props.width}}`);
  if (props.height !== undefined)
    attrs.push(`${INDENT_L3}height={${props.height}}`);
  if (props.waves !== undefined)
    attrs.push(`${INDENT_L3}waves={${props.waves}}`);
  if (props.color !== undefined)
    attrs.push(`${INDENT_L3}color="${props.color}"`);
  if (props.durationMs !== undefined)
    attrs.push(`${INDENT_L3}durationMs={${props.durationMs}}`);
  if (props.opacity !== undefined && props.opacity !== DEFAULT_OPACITY)
    attrs.push(`${INDENT_L3}opacity={${props.opacity}}`);
  if (props.pathVariant !== undefined)
    attrs.push(`${INDENT_L3}pathVariant="${props.pathVariant}"`);
  if (props.fadeOut !== undefined && props.fadeOut !== 60)
    attrs.push(`${INDENT_L3}fadeOut={${props.fadeOut}}`);

  if (props.waveOverrides && props.waveOverrides.length > 0) {
    const overrideLines = props.waveOverrides.map((override) => {
      const fields: string[] = [];
      if (override.color !== undefined)
        fields.push(`color: "${override.color}"`);
      if (override.durationMs !== undefined)
        fields.push(`durationMs: ${override.durationMs}`);
      if (override.pathVariant !== undefined)
        fields.push(`pathVariant: "${override.pathVariant}"`);
      return fields.length > 0
        ? `${INDENT_L4}{ ${fields.join(", ")} },`
        : `${INDENT_L4}{},`;
    });

    attrs.push(
      `${INDENT_L3}waveOverrides={[\n${overrideLines.join("\n")}\n${INDENT_L3}]}`,
    );
  }

  const loaderJsx =
    attrs.length === 0
      ? `${INDENT_L2}<WaveLoader />`
      : `${INDENT_L2}<WaveLoader\n${attrs.join("\n")}\n${INDENT_L2}/>`;

  return `import { WaveLoader } from "wave-loader";

export function MyLoader() {
  return (
${loaderJsx}
  );
}`;
}
