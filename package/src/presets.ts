import type { WaveLoaderProps } from "./waveLoader";

export type WaveLoaderPreset = WaveLoaderProps;

export const auroraPreset: WaveLoaderPreset = {
  width: 320,
  height: 200,
  waves: 4,
  pathVariant: "smooth",
  waveOverrides: [
    { color: "#890082", durationMs: 10200 },
    { color: "#890082", durationMs: 8600 },
    { color: "#00D00B", durationMs: 5800 },
    { color: "#5BC800", durationMs: 6200 },
  ],
};

export const sunsetPreset: WaveLoaderPreset = {
  width: 400,
  height: 70,
  waves: 3,
  color: "#C2694F",
  durationMs: 3500,
  pathVariant: "classic",
  waveOverrides: [
    { color: "#E8A87C" },
    { color: "#C2694F" },
    { color: "#8B3A3A" },
  ],
};

export const frostPreset: WaveLoaderPreset = {
  width: 260,
  height: 60,
  waves: 1,
  color: "#A8DADC",
  durationMs: 7000,
  pathVariant: "smooth",
};

export const stormPreset: WaveLoaderPreset = {
  width: 320,
  height: 70,
  waves: 5,
  color: "#2B3A4A",
  durationMs: 2000,
  pathVariant: "classic",
};

export const mossPreset: WaveLoaderPreset = {
  width: 180,
  height: 90,
  waves: 2,
  color: "#1B4332",
  durationMs: 4800,
  pathVariant: "rounded",
};

export const nebulaPreset: WaveLoaderPreset = {
  width: 300,
  height: 100,
  waves: 5,
  color: "#3D0066",
  durationMs: 5500,
  pathVariant: "smooth",
  waveOverrides: [
    { color: "#6A0DAD", pathVariant: "rounded", durationMs: 5000 },
    { color: "#9B59B6", pathVariant: "smooth", durationMs: 6000 },
    { color: "#3D0066", pathVariant: "classic", durationMs: 5200 },
    { color: "#BB8FCE", pathVariant: "rounded", durationMs: 4800 },
    { color: "#7D3C98", pathVariant: "smooth", durationMs: 5700 },
  ],
};

export const neonPulsePreset: WaveLoaderPreset = {
  width: 260,
  height: 90,
  waves: 4,
  color: "#0B1020",
  durationMs: 2800,
  pathVariant: "smooth",
  waveOverrides: [
    { color: "#00F5FF" },
    { color: "#7B2CFF" },
    { color: "#FF2D95" },
    { color: "#00FFA3" },
  ],
};

export const lavaPreset: WaveLoaderPreset = {
  width: 260,
  height: 88,
  waves: 3,
  color: "#2A0E05",
  durationMs: 3200,
  pathVariant: "rounded",
  waveOverrides: [
    { color: "#FF0000" },
    { color: "#FF2E00" },
    { color: "#FF0000" },
  ],
};

export const toxicPreset: WaveLoaderPreset = {
  width: 240,
  height: 84,
  waves: 2,
  color: "#1B2B00",
  durationMs: 2300,
  pathVariant: "classic",
  waveOverrides: [{ color: "#9EFF00" }, { color: "#D2FF6B" }],
};
