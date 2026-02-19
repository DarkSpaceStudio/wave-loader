# WaveLoader

Skia-based animated wave loader for React Native. Can be used instead of ActivityIndicator.

Web docs/playground are in the repository root Expo app.

## Install

```bash
npm install wave-loader @shopify/react-native-skia
```

You also need `react` and `react-native` in your app.

## Usage

```tsx
import { WaveLoader } from "wave-loader";

export function Example() {
  return (
    <WaveLoader
      width={240}
      height={80}
      waves={4}
      color="#1F6FEB"
      durationMs={4200}
      pathVariant="tall"
      waveOverrides={[
        { color: "#0A3D62" },
        { pathVariant: "choppy", durationMs: 3600 },
        { color: "#00A8CC", pathVariant: "smooth" },
      ]}
    />
  );
}
```

`pathVariant` supports `"rounded" | "choppy" | "smooth" | "tall"`.
`opacity` scales all wave opacities proportionally (`0..1`), with default `0.5` preserving the current look.

Exported presets:
`auroraPreset`, `sunsetPreset`, `frostPreset`,
`stormPreset`, `miniPreset`, `bouncePreset`, `rotationPreset`, `nebulaPreset`, `lavaPreset`,
`toxicPreset`.
