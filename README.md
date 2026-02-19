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
      pathVariant="smooth"
      waveOverrides={[
        { color: "#0A3D62" },
        { pathVariant: "choppy", durationMs: 3600 },
        { color: "#00A8CC", pathVariant: "smooth" },
      ]}
    />
  );
}
```

`pathVariant` supports `"rounded" | "choppy" | "smooth" | "pulse" | "square" | "ripple" | "travel"`.
`opacity` scales all wave opacities proportionally (`0..1`), with default `0.5` preserving the current look.

Exported presets:
`auroraPreset`, `sunsetPreset`, `frostPreset`,
`stormPreset`, `miniPreset`, `bouncePreset`, `mikrohistoriePreset`, `nebulaPreset`, `lavaPreset`,
`toxicPreset`.

## Development

This is a monorepo with two parts:

- `package/`: the publishable `wave-loader` npm package
- root app (`app/`, `components/`) with docs and playground, built with Expo and React Native Web

## Docs app (root)

```bash
npm install
npm run web
```

## Package (library)

```bash
npm run package:install
npm run package:build
npm run package:test
```
