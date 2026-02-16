# waveloader

Skia-based animated wave loader for React Native.

## Install

```bash
npm install waveloader @shopify/react-native-skia
```

You also need `react` and `react-native` in your app.

## Usage

```tsx
import { WaveLoader } from "waveloader";

export function Example() {
  return <WaveLoader width={240} height={80} />;
}
```

## Development

```bash
npm install
npm run typecheck
npm run build
```

## Publish

```bash
npm publish --access public
```

