# `<WaveLoader />`

Skia-based animated wave loader for React Native, Expo, and React Native Web.

WaveLoader is a polished alternative to `ActivityIndicator`, built for product surfaces that need a stronger visual identity than a generic spinner.

Playground: [wave-loader.darkspace.studio](https://wave-loader.darkspace.studio/)

## Why WaveLoader

- Skia-rendered animated waves instead of a standard spinner
- Works in React Native projects that already use Skia
- Supports layered waves, per-wave overrides, and multiple path variants
- Includes presets for quick drop-in styling
- Has a live web playground for easy customization

## Install

```bash
npm install wave-loader @shopify/react-native-skia
```

You also need `react` and `react-native` in your app.

## Compatibility

WaveLoader currently declares these peer dependencies:

- `react >= 18`
- `react-native >= 0.73`
- `@shopify/react-native-skia ^2.4.21`

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

## Presets

Included presets:

- `auroraPreset`
- `bouncePreset`
- `frostPreset`
- `lavaPreset`
- `mikrohistoriePreset`
- `miniPreset`
- `nebulaPreset`
- `stormPreset`
- `sunsetPreset`
- `toxicPreset`

Supported `pathVariant` values:

- `"rounded"`
- `"choppy"`
- `"smooth"`
- `"pulse"`
- `"square"`
- `"ripple"`
- `"travel"`

## API

| Prop            | Type                                                                               | Default     | Description                                                     |
| --------------- | ---------------------------------------------------------------------------------- | ----------- | --------------------------------------------------------------- |
| `width`         | `number`                                                                           | `240`       | Canvas width in pixels                                          |
| `height`        | `number`                                                                           | `80`        | Canvas height in pixels                                         |
| `waves`         | `number`                                                                           | `3`         | Number of wave layers, clamped to `1..5`                        |
| `color`         | `string`                                                                           | `#012D53`   | Global base color                                               |
| `durationMs`    | `number`                                                                           | `4000`      | Global animation cycle duration in milliseconds                 |
| `opacity`       | `number`                                                                           | `0.5`       | Global opacity modulator from `0..1`                            |
| `pathVariant`   | `"rounded" \| "choppy" \| "smooth" \| "pulse" \| "square" \| "ripple" \| "travel"` | `"rounded"` | Global wave path style                                          |
| `fadeOut`       | `number`                                                                           | `60`        | Edge fade intensity in percent                                  |
| `waveOverrides` | `WaveLoaderWaveOverride[]`                                                         | `[]`        | Per-wave overrides for `color`, `durationMs`, and `pathVariant` |

## Development

This repository has two parts:

- `package/`: the publishable `wave-loader` npm package
- `app/` and `components/`: the docs and playground app built with Expo and React Native Web

Run the docs app:

```bash
npm install
npm run web
```

Run the package build and tests:

```bash
npm run package:install
npm run package:build
npm run package:test
```

## Made by DarkSpace.Studio

<img src=".github/assets/darkspacestudio.png" alt="DarkSpace.Studio" style="width:100%;max-width:160; height:auto;">

## License

MIT
