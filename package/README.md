# waveloader

Skia-based animated wave loader for React Native.

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
        { pathVariant: "classic", durationMs: 3600 },
        { color: "#00A8CC", pathVariant: "smooth" },
      ]}
    />
  );
}
```

`pathVariant` supports `"rounded" | "classic" | "smooth" | "tall"`.

Exported presets:
`auroraPreset`, `sunsetPreset`, `frostPreset`,
`stormPreset`, `mossPreset`, `nebulaPreset`, `neonPulsePreset`, `lavaPreset`,
`toxicPreset`.

## Development

```bash
npm install
npm run tsc
npm run build
npm test
```

## Publish

```bash
npm publish --access public
```
