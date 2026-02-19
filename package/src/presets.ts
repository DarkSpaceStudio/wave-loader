import type { WaveLoaderProps } from "./waveLoader";

export type WaveLoaderPreset = WaveLoaderProps;

export const auroraPreset: WaveLoaderPreset = {
  width: 400,
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
  pathVariant: "choppy",
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
  pathVariant: "choppy",
};

export const miniPreset: WaveLoaderPreset = {
  width: 32,
  height: 24,
  waves: 1,
  color: "#06D6A0",
  durationMs: 1400,
  pathVariant: "pulse",
  fadeOut: 50,
};

export const bouncePreset: WaveLoaderPreset = {
  width: 240,
  height: 100,
  waves: 2,
  color: "#000000",
  durationMs: 1400,
  pathVariant: "pulse",
};

export const rotationPreset: WaveLoaderPreset = {
  width: 200,
  height: 40,
  waves: 5,
  color: "#64C9EF",
  durationMs: 2000,
  opacity: 0.9,
  pathVariant: "pulse",
  fadeOut: 100,
};

export const nebulaPreset: WaveLoaderPreset = {
  width: 500,
  height: 160,
  waves: 5,
  color: "#3D0066",
  durationMs: 5500,
  opacity: 0.9,
  pathVariant: "smooth",
  waveOverrides: [
    { color: "#6A0DAD", pathVariant: "rounded", durationMs: 5000 },
    { color: "#8931b5", pathVariant: "smooth", durationMs: 6000 },
    { color: "#3D0066", pathVariant: "choppy", durationMs: 5200 },
    { color: "#ce5bff", pathVariant: "rounded", durationMs: 4800 },
    { color: "#7D3C98", pathVariant: "smooth", durationMs: 5700 },
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
  pathVariant: "choppy",
  waveOverrides: [{ color: "#9EFF00" }, { color: "#D2FF6B" }],
};
