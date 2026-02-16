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

const DURATION_MS = 4000;
const POINTS = 5;
const ROUND_MS = 2400;

interface WaveLoaderProps {
  width?: number;
  height?: number;
}

export const WaveLoader = ({ width = 240, height = 80 }: WaveLoaderProps) => {
  const clock = useClock();

  const backBase = useMemo(() => Skia.Path.Make(), []);
  const midBase = useMemo(() => Skia.Path.Make(), []);
  const frontBase = useMemo(() => Skia.Path.Make(), []);

  const roundMin = 0.1;
  const roundMax = 0.5;

  const backWavePath = usePathValue((path) => {
    "worklet";
    const t = ((clock.value % DURATION_MS) / DURATION_MS) * Math.PI * 2;
    const roundPhase = ((clock.value % ROUND_MS) / ROUND_MS) * Math.PI * 2;
    const roundness =
      roundMin + (roundMax - roundMin) * (0.5 + 0.5 * Math.sin(roundPhase));

    buildWavePathRounded(
      path,
      width,
      height,
      height * 0.35,
      height * 0.12,
      t,
      0,
      roundness,
    );
  }, backBase);

  const middleWavePath = usePathValue((path) => {
    "worklet";
    const t = ((clock.value % DURATION_MS) / DURATION_MS) * Math.PI * 2;
    const roundPhase = ((clock.value % ROUND_MS) / ROUND_MS) * Math.PI * 2;
    const roundness =
      roundMin + (roundMax - roundMin) * (0.5 + 0.5 * Math.sin(roundPhase));

    buildWavePathRounded(
      path,
      width,
      height,
      height * 0.5,
      height * 0.15,
      t,
      1,
      roundness,
    );
  }, midBase);

  const frontWavePath = usePathValue((path) => {
    "worklet";
    const t = ((clock.value % DURATION_MS) / DURATION_MS) * Math.PI * 2;
    const roundPhase = ((clock.value % ROUND_MS) / ROUND_MS) * Math.PI * 2;
    const roundness =
      roundMin + (roundMax - roundMin) * (0.5 + 0.5 * Math.sin(roundPhase));

    buildWavePathRounded(
      path,
      width,
      height,
      height * 0.65,
      height * 0.1,
      t,
      2,
      roundness,
    );
  }, frontBase);

  return (
    <Canvas style={{ width, height }}>
      <Group>
        <Path path={backWavePath} opacity={0.2}>
          <LinearGradient
            start={vec(0, 0)}
            end={vec(0, height)}
            colors={["#012D53", "#00BED100"]}
            positions={[0, 0.7]}
          />
        </Path>

        <Path path={middleWavePath} opacity={0.35}>
          <LinearGradient
            start={vec(0, 0)}
            end={vec(0, height)}
            colors={["#012D53", "#00BED100"]}
            positions={[0, 0.8]}
          />
        </Path>

        <Path path={frontWavePath} opacity={0.5}>
          <LinearGradient
            start={vec(0, 0)}
            end={vec(0, height)}
            colors={["#012D53", "#00BED100"]}
            positions={[0, 0.9]}
          />
        </Path>

        <Group blendMode="dstIn">
          <Rect x={0} y={0} width={width} height={height}>
            <LinearGradient
              start={vec(0, height / 2)}
              end={vec(width, height / 2)}
              colors={["transparent", "black", "black", "transparent"]}
              positions={[0, 0.3, 0.7, 1]}
            />
          </Rect>
        </Group>
      </Group>
    </Canvas>
  );
};

function buildWavePathRounded(
  path: ReturnType<typeof Skia.Path.Make>,
  width: number,
  height: number,
  baseY: number,
  waveHeight: number,
  tRad: number,
  waveIndex: number,
  roundness = 0.5, // 0 = original-ish, 1 = very round
) {
  "worklet";

  path.reset();

  const segmentWidth = width / (POINTS - 1);
  const phaseOffset = waveIndex * Math.PI * 0.7;

  path.moveTo(0, height);

  const y0 =
    baseY +
    Math.sin(tRad + (0 / POINTS) * Math.PI * 2 + phaseOffset) * waveHeight;

  path.lineTo(0, y0);

  let prevX = 0;
  let prevY = y0;

  for (let i = 1; i < POINTS; i++) {
    const x = i * segmentWidth;
    const y =
      baseY +
      Math.sin(tRad + (i / POINTS) * Math.PI * 2 + phaseOffset) * waveHeight;

    // Midpoint between points (join point)
    const midX = (prevX + x) / 2;
    const midY = (prevY + y) / 2;

    // Add "handle length" so control points are not all at the same X.
    // This spreads curvature more evenly and reduces kinks.
    const handle = segmentWidth * 0.5 * roundness; // 0..0.5*segmentWidth

    const c1x = midX - handle;
    const c2x = midX + handle;

    // Optional: bias the join Y a bit toward the average to keep it round
    // and reduce the "corner" feeling. Small effect, but helps.
    const joinY = midY; // keep simple; see alt below

    // First half: from prev -> join
    path.quadTo(c1x, prevY, midX, joinY);

    // Second half: from join -> next
    path.quadTo(c2x, y, x, y);

    prevX = x;
    prevY = y;
  }

  path.lineTo(width, height);
  path.close();
}

function buildWavePath(
  path: ReturnType<typeof Skia.Path.Make>,
  width: number,
  height: number,
  baseY: number,
  waveHeight: number,
  tRad: number, // already in radians (0..2π)
  waveIndex: number,
) {
  "worklet";

  path.reset();

  const segmentWidth = width / (POINTS - 1);
  const phaseOffset = waveIndex * Math.PI * 0.7;

  // bottom-left → first wave point
  path.moveTo(0, height);

  const y0 =
    baseY +
    Math.sin(tRad + (0 / POINTS) * Math.PI * 2 + phaseOffset) * waveHeight;

  path.lineTo(0, y0);

  let prevX = 0;
  let prevY = y0;

  for (let i = 1; i < POINTS; i++) {
    const x = i * segmentWidth;
    const y =
      baseY +
      Math.sin(tRad + (i / POINTS) * Math.PI * 2 + phaseOffset) * waveHeight;

    const cpX = (prevX + x) / 2;

    path.quadTo(cpX, prevY, cpX, (prevY + y) / 2);
    path.quadTo(cpX, y, x, y);

    prevX = x;
    prevY = y;
  }

  path.lineTo(width, height);
  path.close();
}

function buildWavePathSmooth(
  path: ReturnType<typeof Skia.Path.Make>,
  width: number,
  height: number,
  baseY: number,
  waveHeight: number,
  tRad: number,
  waveIndex: number,
  tension = 2, // 1 = classic Catmull-Rom; try 0.7–1.2
) {
  "worklet";

  path.reset();

  const segmentWidth = width / (POINTS - 1);
  const phaseOffset = waveIndex * Math.PI * 0.7;

  // Sample points
  // We'll spline through p1..p(n-2) and clamp endpoints by duplicating
  const xs = new Array<number>(POINTS);
  const ys = new Array<number>(POINTS);

  for (let i = 0; i < POINTS; i++) {
    const x = i * segmentWidth;
    const phase = (i / POINTS) * Math.PI * 2 + phaseOffset;
    const y = baseY + Math.sin(tRad + phase) * waveHeight;
    xs[i] = x;
    ys[i] = y;
  }

  // Start: bottom-left -> first point
  path.moveTo(0, height);
  path.lineTo(xs[0], ys[0]);

  // Helper to access clamped points
  const get = (i: number) => {
    const idx = Math.max(0, Math.min(POINTS - 1, i));
    return { x: xs[idx], y: ys[idx] };
  };

  // Catmull–Rom to cubic Bézier:
  // C1 = P1 + (P2 - P0) / 6 * tension
  // C2 = P2 - (P3 - P1) / 6 * tension
  for (let i = 0; i < POINTS - 1; i++) {
    const p0 = get(i - 1);
    const p1 = get(i);
    const p2 = get(i + 1);
    const p3 = get(i + 2);

    const c1x = p1.x + ((p2.x - p0.x) / 6) * tension;
    const c1y = p1.y + ((p2.y - p0.y) / 6) * tension;

    const c2x = p2.x - ((p3.x - p1.x) / 6) * tension;
    const c2y = p2.y - ((p3.y - p1.y) / 6) * tension;

    path.cubicTo(c1x, c1y, c2x, c2y, p2.x, p2.y);
  }

  // Close shape at bottom
  path.lineTo(width, height);
  path.close();
}
