import { useMemo, useState } from "react";
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import type { WaveLoaderProps, WaveLoaderWaveOverride } from "wave-loader";
import darkSpaceVerticalIMG from "@assets/vertical-wordmark.svg";
import { Nav } from "../components/nav";
import { DocsSection } from "../components/docsSection";
import { PreviewPanel } from "../components/previewPanel";
import { PropsPanel } from "../components/propsPanel";
import {
  buildUsageSnippet,
  copyPreset,
  DEFAULT_OPACITY,
  MAHALO_PRESET,
} from "../config/constants";
import type { PresetItem, PreviewBg } from "../types";
import { DARK, LIGHT, MID } from "../styles/theme";

if (Platform.OS === "web" && typeof document !== "undefined") {
  const id = "wave-loader-demo-css";
  if (!document.getElementById(id)) {
    const style = document.createElement("style");
    style.id = id;
    style.textContent = `
      input:focus, textarea:focus { outline: none !important; border-bottom-color: #5D748A !important; }
    `;
    document.head.appendChild(style);
  }
}

export default function WaveLoaderDemo() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;

  const [presetId, setPresetId] = useState<string>("mahalo");
  const [loaderProps, setLoaderProps] = useState<WaveLoaderProps>(
    copyPreset(MAHALO_PRESET),
  );
  const [copied, setCopied] = useState(false);
  const [previewBg, setPreviewBg] = useState<PreviewBg>("light");
  const [customBg, setCustomBg] = useState("#1A1A2E");
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const [overridePickerIndex, setOverridePickerIndex] = useState<number | null>(
    null,
  );

  const waves = loaderProps.waves ?? 3;
  const durationMs = loaderProps.durationMs ?? 4000;
  const opacity = loaderProps.opacity ?? DEFAULT_OPACITY;
  const pathVariant = loaderProps.pathVariant ?? "rounded";

  const currentConfig = useMemo(
    () => buildUsageSnippet(loaderProps),
    [loaderProps],
  );

  const setFromPreset = (preset: PresetItem) => {
    setPresetId(preset.id);
    setLoaderProps(copyPreset(preset.value));
    setPreviewBg(preset.bg);
  };

  const setPartial = (partial: Partial<WaveLoaderProps>) => {
    setPresetId("custom");
    setLoaderProps((current) => ({ ...current, ...partial }));
  };

  const setNumberField = (
    value: string,
    updater: (next: number | undefined) => Partial<WaveLoaderProps>,
  ) => {
    if (!value.trim()) {
      setPartial(updater(undefined));
      return;
    }
    const parsed = Number(value);
    if (!Number.isNaN(parsed)) {
      setPartial(updater(parsed));
    }
  };

  const adjustDuration = (delta: number) => {
    const next = Math.max(400, durationMs + delta);
    setPartial({ durationMs: next });
  };

  const ensureOverrides = () => {
    setPresetId("custom");
    setLoaderProps((current) => {
      if (current.waveOverrides) return current;
      return {
        ...current,
        waveOverrides: Array.from({ length: current.waves ?? 3 }, () => ({})),
      };
    });
  };

  const clearOverrides = () => {
    setPartial({ waveOverrides: undefined });
  };

  const updateWaveOverride = (
    index: number,
    partial: Partial<WaveLoaderWaveOverride>,
  ) => {
    setPresetId("custom");
    setLoaderProps((current) => {
      const total = current.waves ?? 3;
      const overrides = current.waveOverrides
        ? [...current.waveOverrides]
        : Array.from({ length: total }, () => ({}));
      overrides[index] = { ...(overrides[index] ?? {}), ...partial };
      return { ...current, waveOverrides: overrides };
    });
  };

  const copyCurrentConfig = async () => {
    if (Platform.OS !== "web" || !globalThis.navigator?.clipboard) return;
    await globalThis.navigator.clipboard.writeText(currentConfig);
    setCopied(true);
    setTimeout(() => setCopied(false), 1300);
  };

  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.pageContent}>
      <Nav />

      {/* Hero */}
      <View style={styles.hero}>
        <Text style={styles.heroEyebrow}>React Native + Skia</Text>
        <Text style={styles.heroTitle}>{"<WaveLoader />"}</Text>
        <Text style={styles.heroSub}>
          Animated wave activity indicator with global props{"\n"}and per-wave
          overrides.
        </Text>
      </View>

      {/* Playground */}
      <View style={styles.content}>
        <View
          style={[styles.playground, isDesktop && styles.playgroundDesktop]}
        >
          <PropsPanel
            isDesktop={isDesktop}
            loaderProps={loaderProps}
            waves={waves}
            durationMs={durationMs}
            opacity={opacity}
            pathVariant={pathVariant}
            colorPickerOpen={colorPickerOpen}
            overridePickerIndex={overridePickerIndex}
            setPartial={setPartial}
            setNumberField={setNumberField}
            adjustDuration={adjustDuration}
            setColorPickerOpen={setColorPickerOpen}
            setOverridePickerIndex={setOverridePickerIndex}
            ensureOverrides={ensureOverrides}
            clearOverrides={clearOverrides}
            updateWaveOverride={updateWaveOverride}
          />
          <PreviewPanel
            loaderProps={loaderProps}
            previewBg={previewBg}
            customBg={customBg}
            presetId={presetId}
            currentConfig={currentConfig}
            copied={copied}
            setPreviewBg={setPreviewBg}
            setCustomBg={setCustomBg}
            setFromPreset={setFromPreset}
            copyCurrentConfig={copyCurrentConfig}
          />
        </View>

        <DocsSection />
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Image
          style={styles.footerImage}
          alt="DarkSpace.Studio"
          source={darkSpaceVerticalIMG}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: LIGHT,
  },
  pageContent: {
    paddingBottom: 0,
  },
  hero: {
    maxWidth: 1080,
    width: "100%",
    alignSelf: "center",
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 80,
    alignItems: "center",
  },
  heroEyebrow: {
    color: MID,
    fontSize: 12,
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 16,
  },
  heroTitle: {
    color: DARK,
    fontSize: 48,
    fontWeight: "700",
    letterSpacing: -0.5,
    marginBottom: 16,
  },
  heroSub: {
    color: MID,
    fontSize: 16,
    lineHeight: 26,
    textAlign: "center",
    maxWidth: 480,
    marginBottom: 48,
  },
  heroWave: {
    alignItems: "center",
  },
  content: {
    maxWidth: 1080,
    width: "100%",
    alignSelf: "center",
    paddingHorizontal: 24,
  },
  playground: {
    flexDirection: "column",
    marginBottom: 64,
  },
  playgroundDesktop: {
    flexDirection: "row",
  },
  footer: {
    backgroundColor: DARK,
    paddingVertical: 28,
    alignItems: "center",
  },
  footerImage: {
    width: 170.67,
    height: 46,
  },
});
