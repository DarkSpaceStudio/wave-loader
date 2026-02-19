import {
  Canvas,
  Group,
  LinearGradient,
  Path,
  Rect,
  Skia,
  useClock,
  usePathValue,
  vec,
} from "@shopify/react-native-skia";
import { useMemo } from "react";

const POINTS = 5;
const MIN_WAVES = 1;
const MAX_WAVES = 5;
const DEFAULT_WAVES = 3;
const DEFAULT_DURATION_MS = 4000;
const DEFAULT_COLOR = "#012D53";
const ROUNDNESS_MIN = 0.1;
const ROUNDNESS_MAX = 0.5;
const ROUNDNESS_CYCLE_RATIO = 0.6;
const MIN_ROUNDNESS_CYCLE_MS = 600;

const BASE_Y_ANCHORS = [0.35, 0.425, 0.5, 0.575, 0.65] as const;
const AMPLITUDE_ANCHORS = [0.12, 0.135, 0.15, 0.125, 0.1] as const;
const OPACITY_ANCHORS = [0.2, 0.275, 0.35, 0.425, 0.5] as const;
const GRADIENT_STOP_ANCHORS = [0.7, 0.75, 0.8, 0.85, 0.9] as const;
const PHASE_OFFSET_ANCHORS = [
  Math.PI * 0,
  Math.PI * 0.35,
  Math.PI * 0.7,
  Math.PI * 1.05,
  Math.PI * 1.4,
] as const;

export type WavePathVariant =
  | "rounded"
  | "choppy"
  | "smooth"
  | "pulse"
  | "square"
  | "ripple"
  | "travel";

export interface WaveLoaderWaveOverride {
  color?: string;
  durationMs?: number;
  pathVariant?: WavePathVariant;
}

export interface WaveLoaderProps {
  width?: number;
  height?: number;
  waves?: number;
  color?: string;
  durationMs?: number;
  pathVariant?: WavePathVariant;
  opacity?: number;
  fadeOut?: number;
  waveOverrides?: readonly WaveLoaderWaveOverride[];
}

interface WaveLayout {
  baseYRatio: number;
  amplitudeRatio: number;
  opacity: number;
  gradientStop: number;
  phaseOffsetRad: number;
}

interface WaveResolvedConfig {
  color: string;
  durationMs: number;
  pathVariant: WavePathVariant;
}

const EMPTY_WAVE_OVERRIDES: readonly WaveLoaderWaveOverride[] = [];
const TAU = Math.PI * 2;

function drawSmoothPath(
  path: ReturnType<typeof Skia.Path.Make>,
  xs: number[],
  ys: number[],
) {
  "worklet";
  const pointCount = xs.length;

  const get = (i: number) => {
    const bounded = Math.max(0, Math.min(pointCount - 1, i));
    return { x: xs[bounded], y: ys[bounded] };
  };

  for (let i = 0; i < pointCount - 1; i++) {
    const p0 = get(i - 1);
    const p1 = get(i);
    const p2 = get(i + 1);
    const p3 = get(i + 2);

    const c1x = p1.x + ((p2.x - p0.x) / 6) * 2;
    const c1y = p1.y + ((p2.y - p0.y) / 6) * 2;
    const c2x = p2.x - ((p3.x - p1.x) / 6) * 2;
    const c2y = p2.y - ((p3.y - p1.y) / 6) * 2;

    path.cubicTo(c1x, c1y, c2x, c2y, p2.x, p2.y);
  }
}

function getPointCount(pathVariant: WavePathVariant): number {
  "worklet";
  if (pathVariant === "travel" || pathVariant === "square") {
    return 7;
  }

  return POINTS;
}

function getAmplitudeMultiplier(pathVariant: WavePathVariant): number {
  "worklet";
  if (pathVariant === "square") return 0.8;
  if (pathVariant === "travel") return 1.05;
  return 1;
}

function squareWave(rad: number): number {
  "worklet";
  return Math.sin(rad) >= 0 ? 1 : -1;
}

function sampleWave(
  pathVariant: WavePathVariant,
  tRad: number,
  tContinuousRad: number,
  phaseOffsetRad: number,
  phaseProgress: number,
  xRatio: number,
): number {
  "worklet";
  const phase = tRad + phaseProgress * TAU + phaseOffsetRad;

  if (pathVariant === "square") {
    return squareWave(phase);
  }

  if (pathVariant === "ripple") {
    const envelope = 0.35 + 0.65 * (1 - Math.abs(xRatio - 0.5) * 2);
    return Math.sin(phase) * envelope;
  }

  if (pathVariant === "travel") {
    return Math.sin(xRatio * TAU * 1.75 + tContinuousRad * 1.4 + phaseOffsetRad);
  }

  return Math.sin(phase);
}

function getPhaseProgress(
  pathVariant: WavePathVariant,
  index: number,
  pointCount: number,
): number {
  "worklet";
  if (
    pathVariant === "rounded" ||
    pathVariant === "choppy" ||
    pathVariant === "smooth"
  ) {
    return index / pointCount;
  }

  return index / (pointCount - 1);
}

function buildWavePathByVariant(
  pathVariant: WavePathVariant,
  path: ReturnType<typeof Skia.Path.Make>,
  width: number,
  height: number,
  baseY: number,
  waveHeight: number,
  tRad: number,
  tContinuousRad: number,
  phaseOffsetRad: number,
  roundness: number,
) {
  "worklet";

  path.reset();

  if (pathVariant === "pulse") {
    // Single smooth bump — optimized for small sizes (e.g. 32x24 button loaders).
    // 3 points: left edge, center peak, right edge. One cubic arc.
    const amplitudeMultiplier = 1.8;
    const leftY = baseY + Math.sin(tRad + phaseOffsetRad) * waveHeight * 0.3;
    const peakY =
      baseY +
      Math.sin(tRad + phaseOffsetRad + Math.PI * 0.5) *
        waveHeight *
        amplitudeMultiplier;
    const rightY =
      baseY + Math.sin(tRad + phaseOffsetRad + Math.PI) * waveHeight * 0.3;

    path.moveTo(0, height);
    path.lineTo(0, leftY);
    path.cubicTo(width * 0.33, leftY, width * 0.25, peakY, width * 0.5, peakY);
    path.cubicTo(width * 0.75, peakY, width * 0.67, rightY, width, rightY);
    path.lineTo(width, height);
    path.close();
    return;
  }
  const pointCount = getPointCount(pathVariant);
  const segmentWidth = width / (pointCount - 1);
  const amplitudeMultiplier = getAmplitudeMultiplier(pathVariant);
  const xs = new Array<number>(pointCount);
  const ys = new Array<number>(pointCount);

  for (let i = 0; i < pointCount; i++) {
    const x = i * segmentWidth;
    const xRatio = i / (pointCount - 1);
    const phaseProgress = getPhaseProgress(pathVariant, i, pointCount);
    const sample = sampleWave(
      pathVariant,
      tRad,
      tContinuousRad,
      phaseOffsetRad,
      phaseProgress,
      xRatio,
    );
    xs[i] = x;
    ys[i] = baseY + sample * waveHeight * amplitudeMultiplier;
  }

  path.moveTo(0, height);
  path.lineTo(xs[0], ys[0]);

  if (pathVariant === "smooth") {
    drawSmoothPath(path, xs, ys);
    path.lineTo(width, height);
    path.close();
    return;
  }

  if (pathVariant === "ripple" || pathVariant === "travel") {
    drawSmoothPath(path, xs, ys);
    path.lineTo(width, height);
    path.close();
    return;
  }

  if (pathVariant === "square") {
    for (let i = 1; i < pointCount; i++) {
      const prevX = xs[i - 1];
      const prevY = ys[i - 1];
      const x = xs[i];
      const y = ys[i];
      const midX = (prevX + x) / 2;
      path.lineTo(midX, prevY);
      path.lineTo(midX, y);
      path.lineTo(x, y);
    }
    path.lineTo(width, height);
    path.close();
    return;
  }

  let prevX = xs[0];
  let prevY = ys[0];

  for (let i = 1; i < pointCount; i++) {
    const x = xs[i];
    const y = ys[i];

    if (pathVariant === "choppy") {
      const cpX = (prevX + x) / 2;
      path.quadTo(cpX, prevY, cpX, (prevY + y) / 2);
      path.quadTo(cpX, y, x, y);
    } else {
      const midX = (prevX + x) / 2;
      const midY = (prevY + y) / 2;
      const handle = segmentWidth * 0.5 * roundness;
      const c1x = midX - handle;
      const c2x = midX + handle;

      path.quadTo(c1x, prevY, midX, midY);
      path.quadTo(c2x, y, x, y);
    }

    prevX = x;
    prevY = y;
  }

  path.lineTo(width, height);
  path.close();
}

const DEFAULT_FADE_OUT = 60;
const DEFAULT_OPACITY = OPACITY_ANCHORS[OPACITY_ANCHORS.length - 1];

export const WaveLoader = ({
  width = 240,
  height = 80,
  waves = DEFAULT_WAVES,
  color = DEFAULT_COLOR,
  durationMs = DEFAULT_DURATION_MS,
  pathVariant = "rounded",
  opacity = DEFAULT_OPACITY,
  fadeOut = DEFAULT_FADE_OUT,
  waveOverrides,
}: WaveLoaderProps) => {
  const clock = useClock();
  const waveCount = clampWaveCount(waves);
  const resolvedOpacity = resolveOpacity(opacity);
  const opacityScale =
    DEFAULT_OPACITY > 0 ? resolvedOpacity / DEFAULT_OPACITY : 1;
  const clampedFadeOut = Math.min(100, Math.max(0, fadeOut));
  const fadePositions = useMemo<[number, number, number, number]>(
    () => [0, clampedFadeOut / 200, 1 - clampedFadeOut / 200, 1],
    [clampedFadeOut],
  );
  const resolvedWaveOverrides = waveOverrides ?? EMPTY_WAVE_OVERRIDES;

  const waveLayouts = useMemo(() => buildWaveLayouts(waveCount), [waveCount]);
  const waveConfigs = useMemo(
    () =>
      buildWaveConfigs(
        waveCount,
        color,
        durationMs,
        pathVariant,
        resolvedWaveOverrides,
      ),
    [waveCount, color, durationMs, pathVariant, resolvedWaveOverrides],
  );

  const wavePath0 = useAnimatedWavePath(
    clock,
    width,
    height,
    getWaveLayout(waveLayouts, 0),
    getWaveConfig(waveConfigs, 0),
  );
  const wavePath1 = useAnimatedWavePath(
    clock,
    width,
    height,
    getWaveLayout(waveLayouts, 1),
    getWaveConfig(waveConfigs, 1),
  );
  const wavePath2 = useAnimatedWavePath(
    clock,
    width,
    height,
    getWaveLayout(waveLayouts, 2),
    getWaveConfig(waveConfigs, 2),
  );
  const wavePath3 = useAnimatedWavePath(
    clock,
    width,
    height,
    getWaveLayout(waveLayouts, 3),
    getWaveConfig(waveConfigs, 3),
  );
  const wavePath4 = useAnimatedWavePath(
    clock,
    width,
    height,
    getWaveLayout(waveLayouts, 4),
    getWaveConfig(waveConfigs, 4),
  );

  const wavePaths = [wavePath0, wavePath1, wavePath2, wavePath3, wavePath4];

  return (
    <Canvas style={{ width, height }}>
      <Group>
        {waveLayouts.map((layout, index) => {
          const waveConfig = waveConfigs[index];

          return (
            <Path
              key={`wave-${index}`}
              path={wavePaths[index]}
              opacity={clampUnit(layout.opacity * opacityScale)}
            >
              <LinearGradient
                start={vec(0, 0)}
                end={vec(0, height)}
                colors={[
                  waveConfig.color,
                  toGradientEndColor(waveConfig.color),
                ]}
                positions={[0, layout.gradientStop]}
              />
            </Path>
          );
        })}

        <Group blendMode="dstIn">
          <Rect x={0} y={0} width={width} height={height}>
            <LinearGradient
              start={vec(0, height / 2)}
              end={vec(width, height / 2)}
              colors={["transparent", "black", "black", "transparent"]}
              positions={fadePositions}
            />
          </Rect>
        </Group>
      </Group>
    </Canvas>
  );
};

function useAnimatedWavePath(
  clock: ReturnType<typeof useClock>,
  width: number,
  height: number,
  layout: WaveLayout,
  waveConfig: WaveResolvedConfig,
) {
  const basePath = useMemo(() => Skia.Path.Make(), []);

  return usePathValue((path) => {
    "worklet";
    const resolvedDuration =
      waveConfig.durationMs > 0 ? waveConfig.durationMs : DEFAULT_DURATION_MS;
    const tWrapped =
      ((clock.value % resolvedDuration) / resolvedDuration) * Math.PI * 2;
    const tContinuous = (clock.value / resolvedDuration) * Math.PI * 2;
    const roundCycleMs = Math.max(
      MIN_ROUNDNESS_CYCLE_MS,
      resolvedDuration * ROUNDNESS_CYCLE_RATIO,
    );
    const roundPhase =
      ((clock.value % roundCycleMs) / roundCycleMs) * Math.PI * 2;
    const roundness =
      ROUNDNESS_MIN +
      (ROUNDNESS_MAX - ROUNDNESS_MIN) * (0.5 + 0.5 * Math.sin(roundPhase));

    buildWavePathByVariant(
      waveConfig.pathVariant,
      path,
      width,
      height,
      height * layout.baseYRatio,
      height * layout.amplitudeRatio,
      tWrapped,
      tContinuous,
      layout.phaseOffsetRad,
      roundness,
    );
  }, basePath);
}

function buildWaveLayouts(waveCount: number): WaveLayout[] {
  const layouts: WaveLayout[] = [];
  const singleWaveOpacity = DEFAULT_OPACITY;

  for (let index = 0; index < waveCount; index++) {
    layouts.push({
      baseYRatio: sampleAnchor(BASE_Y_ANCHORS, waveCount, index),
      amplitudeRatio: sampleAnchor(AMPLITUDE_ANCHORS, waveCount, index),
      opacity:
        waveCount === 1
          ? singleWaveOpacity
          : sampleAnchor(OPACITY_ANCHORS, waveCount, index),
      gradientStop: sampleAnchor(GRADIENT_STOP_ANCHORS, waveCount, index),
      phaseOffsetRad: sampleAnchor(PHASE_OFFSET_ANCHORS, waveCount, index),
    });
  }

  return layouts;
}

function buildWaveConfigs(
  waveCount: number,
  color: string,
  durationMs: number,
  pathVariant: WavePathVariant,
  waveOverrides: readonly WaveLoaderWaveOverride[],
): WaveResolvedConfig[] {
  const baseColor = resolveColor(color);
  const baseDuration = resolveDuration(durationMs);
  const basePathVariant = resolvePathVariant(pathVariant, "rounded");
  const configs: WaveResolvedConfig[] = [];

  for (let index = 0; index < waveCount; index++) {
    const override = waveOverrides[index];
    configs.push({
      color: resolveColor(override?.color, baseColor),
      durationMs: resolveDuration(override?.durationMs, baseDuration),
      pathVariant: resolvePathVariant(override?.pathVariant, basePathVariant),
    });
  }

  return configs;
}

function getWaveLayout(layouts: WaveLayout[], index: number): WaveLayout {
  return layouts[Math.min(index, layouts.length - 1)];
}

function getWaveConfig(
  configs: WaveResolvedConfig[],
  index: number,
): WaveResolvedConfig {
  return configs[Math.min(index, configs.length - 1)];
}

function clampWaveCount(waves: number): number {
  if (!Number.isFinite(waves)) {
    return DEFAULT_WAVES;
  }

  return Math.min(MAX_WAVES, Math.max(MIN_WAVES, Math.round(waves)));
}

function resolveColor(
  color: string | undefined,
  fallback = DEFAULT_COLOR,
): string {
  if (typeof color !== "string") {
    return fallback;
  }

  const trimmed = color.trim();
  return trimmed.length > 0 ? trimmed : fallback;
}

function resolveDuration(
  durationMs: number | undefined,
  fallback = DEFAULT_DURATION_MS,
): number {
  if (typeof durationMs !== "number") {
    return fallback;
  }

  if (!Number.isFinite(durationMs) || durationMs <= 0) {
    return fallback;
  }

  return durationMs;
}

function resolvePathVariant(
  pathVariant: WavePathVariant | undefined,
  fallback: WavePathVariant,
): WavePathVariant {
  if (
    pathVariant === "rounded" ||
    pathVariant === "choppy" ||
    pathVariant === "smooth" ||
    pathVariant === "pulse" ||
    pathVariant === "square" ||
    pathVariant === "ripple" ||
    pathVariant === "travel"
  ) {
    return pathVariant;
  }

  return fallback;
}

function resolveOpacity(
  opacity: number | undefined,
  fallback = DEFAULT_OPACITY,
) {
  if (typeof opacity !== "number" || !Number.isFinite(opacity)) {
    return fallback;
  }

  return clampUnit(opacity);
}

function clampUnit(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.min(1, Math.max(0, value));
}

function sampleAnchor(
  anchors: readonly number[],
  waveCount: number,
  index: number,
): number {
  if (waveCount <= 1) {
    return anchors[Math.floor((anchors.length - 1) / 2)];
  }

  const position = (index / (waveCount - 1)) * (anchors.length - 1);
  const lower = Math.floor(position);
  const upper = Math.ceil(position);

  if (lower === upper) {
    return anchors[lower];
  }

  const mix = position - lower;
  return anchors[lower] + (anchors[upper] - anchors[lower]) * mix;
}

function HexToHSL(hex: string): { h: number; s: number; l: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return { h: 0, s: 0, l: 0 };

  const r = parseInt(result[1], 16) / 255;
  const g = parseInt(result[2], 16) / 255;
  const b = parseInt(result[3], 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);

  let h = (max + min) / 2;
  let s = h;
  let l = h;

  if (max === min) {
    return { h: 0, s: 0, l: Math.round(l * 100) };
  }

  const d = max - min;
  s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  switch (max) {
    case r:
      h = (g - b) / d + (g < b ? 6 : 0);
      break;
    case g:
      h = (b - r) / d + 2;
      break;
    case b:
      h = (r - g) / d + 4;
      break;
  }
  h /= 6;

  return {
    h: Math.round(360 * h),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

function HSLToHex(hsl: { h: number; s: number; l: number }): string {
  const { h, s, l } = hsl;
  const hDecimal = l / 100;
  const a = (s * Math.min(hDecimal, 1 - hDecimal)) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = hDecimal - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function toGradientEndColor(color: string): string {
  const hsl = HexToHSL(color.trim());
  const shiftedHsl = {
    h: (((hsl.h - 20) % 360) + 360) % 360,
    s: hsl.s,
    l: Math.min(100, hsl.l + 20),
  };
  const shifted = HSLToHex(shiftedHsl);
  return `${shifted}00`;
}
