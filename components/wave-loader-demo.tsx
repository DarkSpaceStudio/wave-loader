import { useMemo, useState, type ComponentProps, type ReactNode } from "react";
import {
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from "react-native";
import {
  auroraPreset,
  bouncePreset,
  frostPreset,
  lavaPreset,
  miniPreset,
  nebulaPreset,
  rotationPreset,
  stormPreset,
  sunsetPreset,
  toxicPreset,
  WaveLoader,
  type WaveLoaderProps,
  type WaveLoaderWaveOverride,
  type WavePathVariant,
} from "wave-loader";

type PreviewBg = "light" | "dark" | "custom";

type PresetItem = {
  id: string;
  label: string;
  description: string;
  note?: string;
  noteUrl?: string;
  value: WaveLoaderProps;
  bg: PreviewBg;
};

type ApiRow = {
  name: string;
  type: string;
  defaultValue: string;
  description: string;
};

const MAHALO_PRESET: WaveLoaderProps = {
  width: 240,
  height: 80,
  waves: 3,
  color: "#012D53",
  durationMs: 4000,
  pathVariant: "rounded",
};

const PRESETS: PresetItem[] = [
  {
    id: "mahaloPreset",
    label: "Mahalo",
    description: "The original",
    note: "Used on darkspacestudio.com",
    noteUrl: "https://darkspacestudio.com",
    value: MAHALO_PRESET,
    bg: "light",
  },
  {
    id: "miniPreset",
    label: "Mini",
    description: "Tiny inline loader, no fade",
    value: miniPreset,
    bg: "dark",
  },
  {
    id: "nebulaPreset",
    label: "Nebula",
    description: "Deep purple, mixed paths",
    value: nebulaPreset,
    bg: "dark",
  },
  {
    id: "bouncePreset",
    label: "Bounce",
    description: "Dual pulse, fast bounce",
    value: bouncePreset,
    bg: "light",
  },
  {
    id: "rotationPreset",
    label: "Rotation",
    description: "Pulse path, 5 waves, high opacity",
    value: rotationPreset,
    bg: "dark",
  },
  {
    id: "lavaPreset",
    label: "Lava",
    description: "Molten orange heat",
    value: lavaPreset,
    bg: "light",
  },
  {
    id: "toxicPreset",
    label: "Toxic",
    description: "Acid green contrast, 2 waves",
    value: toxicPreset,
    bg: "dark",
  },
  {
    id: "auroraPreset",
    label: "Aurora",
    description: "Multi-color northern lights",
    value: auroraPreset,
    bg: "dark",
  },
  {
    id: "sunsetPreset",
    label: "Sunset",
    description: "Warm corals, choppy path",
    value: sunsetPreset,
    bg: "light",
  },

  {
    id: "frostPreset",
    label: "Frost",
    description: "Single icy wave, smooth",
    value: frostPreset,
    bg: "dark",
  },
  {
    id: "stormPreset",
    label: "Storm",
    description: "Fast dark, 5 waves",
    value: stormPreset,
    bg: "light",
  },
];

const COLOR_SWATCHES = [
  // Blues
  "#012D53",
  "#0A3D62",
  "#1F6FEB",
  "#0096C7",
  "#00B4D8",
  "#48CAE4",
  // Greens & teals
  "#06D6A0",
  "#1B4332",
  "#2D6A4F",
  "#A8DADC",
  // Purples
  "#2D1B69",
  "#6A0DAD",
  "#9B59B6",
  "#3D0066",
  "#7B2CFF",
  "#FF2D95",
  // Warm
  "#C2694F",
  "#E8A87C",
  "#8B3A3A",
  "#D4A373",
  "#FF6B00",
  "#FF2E00",
  "#FFC300",
  // Neon & acid
  "#00F5FF",
  "#00FFA3",
  "#9EFF00",
  "#D2FF6B",
  // Neutrals
  "#2B3A4A",
  "#5D748A",
  "#1A1A2E",
  "#F0E6D3",
];

const PATH_VARIANTS: WavePathVariant[] = [
  "rounded",
  "choppy",
  "smooth",
  "tall",
  "pulse",
];
const DEFAULT_OPACITY = 0.5;

const API_ROWS: ApiRow[] = [
  {
    name: "width?",
    type: "number",
    defaultValue: "240",
    description: "Canvas width in px",
  },
  {
    name: "height?",
    type: "number",
    defaultValue: "80",
    description: "Canvas height in px",
  },
  {
    name: "waves?",
    type: "number",
    defaultValue: "3 (clamped 1-5)",
    description: "Number of wave layers",
  },
  {
    name: "color?",
    type: "string",
    defaultValue: "#012D53",
    description: "Global base color",
  },
  {
    name: "durationMs?",
    type: "number",
    defaultValue: "4000",
    description: "Global animation cycle duration in ms",
  },
  {
    name: "opacity?",
    type: "number",
    defaultValue: "0.5",
    description: "Global opacity modulator (0-1), proportional across waves",
  },
  {
    name: "pathVariant?",
    type: '"rounded" | "choppy" | "smooth" | "tall" | "pulse"',
    defaultValue: "rounded",
    description: "Global wave path style",
  },
  {
    name: "fadeOut?",
    type: "number",
    defaultValue: "60",
    description: "Edge fade intensity in % (0 = none, 100 = max)",
  },
  {
    name: "waveOverrides?",
    type: "WaveLoaderWaveOverride[]",
    defaultValue: "undefined",
    description: "Per-wave overrides for color/duration/path",
  },
];

const OVERRIDE_ROWS: ApiRow[] = [
  {
    name: "color?",
    type: "string",
    defaultValue: "inherits global color",
    description: "Wave-specific color override",
  },
  {
    name: "durationMs?",
    type: "number",
    defaultValue: "inherits global durationMs",
    description: "Wave-specific speed override",
  },
  {
    name: "pathVariant?",
    type: '"rounded" | "choppy" | "smooth" | "tall"',
    defaultValue: "inherits global pathVariant",
    description: "Wave-specific path style",
  },
];

const copyPreset = (preset: WaveLoaderProps | undefined): WaveLoaderProps => {
  const safePreset =
    preset && typeof preset === "object" ? preset : MAHALO_PRESET;
  return {
    ...safePreset,
    waveOverrides: safePreset.waveOverrides?.map((o) => ({ ...o })),
  };
};

type ExternalWaveLoaderProps = ComponentProps<typeof WaveLoader>;

function asExternalWaveLoaderProps(
  props: WaveLoaderProps,
): ExternalWaveLoaderProps {
  return props as unknown as ExternalWaveLoaderProps;
}

const INDENT_L2 = "    ";
const INDENT_L3 = "      ";
const INDENT_L4 = "        ";

function buildUsageSnippet(props: WaveLoaderProps): string {
  const attrs: string[] = [];

  if (props.width !== undefined)
    attrs.push(`${INDENT_L3}width={${props.width}}`);
  if (props.height !== undefined)
    attrs.push(`${INDENT_L3}height={${props.height}}`);
  if (props.waves !== undefined)
    attrs.push(`${INDENT_L3}waves={${props.waves}}`);
  if (props.color !== undefined)
    attrs.push(`${INDENT_L3}color="${props.color}"`);
  if (props.durationMs !== undefined)
    attrs.push(`${INDENT_L3}durationMs={${props.durationMs}}`);
  if (props.opacity !== undefined && props.opacity !== DEFAULT_OPACITY)
    attrs.push(`${INDENT_L3}opacity={${props.opacity}}`);
  if (props.pathVariant !== undefined)
    attrs.push(`${INDENT_L3}pathVariant="${props.pathVariant}"`);
  if (props.fadeOut !== undefined && props.fadeOut !== 60)
    attrs.push(`${INDENT_L3}fadeOut={${props.fadeOut}}`);

  if (props.waveOverrides && props.waveOverrides.length > 0) {
    const overrideLines = props.waveOverrides.map((override) => {
      const fields: string[] = [];
      if (override.color !== undefined)
        fields.push(`color: "${override.color}"`);
      if (override.durationMs !== undefined)
        fields.push(`durationMs: ${override.durationMs}`);
      if (override.pathVariant !== undefined)
        fields.push(`pathVariant: "${override.pathVariant}"`);
      return fields.length > 0
        ? `${INDENT_L4}{ ${fields.join(", ")} },`
        : `${INDENT_L4}{},`;
    });

    attrs.push(
      `${INDENT_L3}waveOverrides={[\n${overrideLines.join("\n")}\n${INDENT_L3}]}`,
    );
  }

  const loaderJsx =
    attrs.length === 0
      ? `${INDENT_L2}<WaveLoader />`
      : `${INDENT_L2}<WaveLoader\n${attrs.join("\n")}\n${INDENT_L2}/>`;

  return `import { WaveLoader } from "wave-loader";

export function MyLoader() {
  return (
${loaderJsx}
  );
}`;
}

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

  const previewBgColor =
    previewBg === "light" ? LIGHT : previewBg === "dark" ? DARK : customBg;

  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.pageContent}>
      {/* Nav */}
      <View style={styles.nav}>
        <View style={styles.navInner}>
          <View style={styles.navLeft}>
            <Text style={styles.navBrand}>wave-loader</Text>
            <View style={styles.navDot} />
            <Text style={styles.navStudio}>Dark Space Studio</Text>
          </View>
          <View style={styles.navRight}>
            <Pressable
              onPress={() =>
                Linking.openURL("https://www.npmjs.com/package/wave-loader")
              }
            >
              <Text style={styles.navLink}>npm</Text>
            </Pressable>
            <Pressable
              onPress={() =>
                Linking.openURL("https://github.com/nicksrandall/wave-loader")
              }
            >
              <Text style={styles.navLink}>GitHub</Text>
            </Pressable>
          </View>
        </View>
      </View>

      {/* Hero */}
      <View style={styles.hero}>
        <Text style={styles.heroEyebrow}>React Native + Skia</Text>
        <Text style={styles.heroTitle}>WaveLoader</Text>
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
          {/* Props — dark panel */}
          <View style={[styles.props, isDesktop && styles.propsDesktop]}>
            <Text style={styles.propsTitle}>Props</Text>

            <Field label="width">
              <TextInput
                style={styles.input}
                value={String(loaderProps.width ?? 240)}
                onChangeText={(t) => setNumberField(t, (n) => ({ width: n }))}
                keyboardType="numeric"
                placeholderTextColor={MID}
              />
            </Field>

            <Field label="height">
              <TextInput
                style={styles.input}
                value={String(loaderProps.height ?? 80)}
                onChangeText={(t) => setNumberField(t, (n) => ({ height: n }))}
                keyboardType="numeric"
                placeholderTextColor={MID}
              />
            </Field>

            {/* Waves */}
            <Field label="waves">
              <View style={styles.chipRow}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <Pressable
                    key={n}
                    style={[styles.chip, n === waves && styles.chipOn]}
                    onPress={() => {
                      const nextOverrides = loaderProps.waveOverrides?.slice(
                        0,
                        n,
                      );
                      setPartial({ waves: n, waveOverrides: nextOverrides });
                    }}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        n === waves && styles.chipTextOn,
                      ]}
                    >
                      {n}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </Field>

            {/* Color with picker */}
            <Field label="color">
              <View style={styles.colorInputRow}>
                <TextInput
                  style={[styles.input, styles.colorInput]}
                  value={loaderProps.color ?? "#012D53"}
                  onChangeText={(t) => setPartial({ color: t })}
                  autoCapitalize="none"
                  autoCorrect={false}
                  placeholder="#012D53"
                  placeholderTextColor={MID}
                />
                <Pressable
                  style={styles.colorBtn}
                  onPress={() => setColorPickerOpen(!colorPickerOpen)}
                >
                  <View
                    style={[
                      styles.colorBtnSwatch,
                      { backgroundColor: loaderProps.color ?? "#012D53" },
                    ]}
                  />
                </Pressable>
              </View>
              {colorPickerOpen && (
                <View style={styles.pickerDropdown}>
                  <View style={styles.pickerSwatches}>
                    {COLOR_SWATCHES.map((c) => (
                      <Pressable
                        key={c}
                        style={[
                          styles.pickerSwatch,
                          { backgroundColor: c },
                          loaderProps.color === c && styles.pickerSwatchOn,
                        ]}
                        onPress={() => {
                          setPartial({ color: c });
                          setColorPickerOpen(false);
                        }}
                      />
                    ))}
                  </View>
                </View>
              )}
            </Field>

            {/* Duration with +/- */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>durationMs</Text>
              <View style={styles.stepperRow}>
                <TextInput
                  style={styles.stepperInput}
                  value={String(durationMs)}
                  onChangeText={(t) =>
                    setNumberField(t, (n) => ({ durationMs: n }))
                  }
                  keyboardType="numeric"
                  placeholderTextColor={MID}
                />
                <Pressable
                  style={styles.stepperBtn}
                  onPress={() => adjustDuration(-400)}
                >
                  <Text style={styles.stepperBtnText}>-</Text>
                </Pressable>
                <Pressable
                  style={styles.stepperBtn}
                  onPress={() => adjustDuration(400)}
                >
                  <Text style={styles.stepperBtnText}>+</Text>
                </Pressable>
              </View>
            </View>

            {/* Opacity with +/- */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>opacity</Text>
              <View style={styles.stepperRow}>
                <TextInput
                  style={styles.stepperInput}
                  value={String(opacity)}
                  onChangeText={(t) =>
                    setNumberField(t, (n) => ({
                      opacity:
                        n !== undefined
                          ? Math.min(1, Math.max(0, n))
                          : undefined,
                    }))
                  }
                  keyboardType="numeric"
                  placeholderTextColor={MID}
                />
                <Pressable
                  style={styles.stepperBtn}
                  onPress={() => {
                    const next = Math.max(0, opacity - 0.1);
                    setPartial({ opacity: Number(next.toFixed(2)) });
                  }}
                >
                  <Text style={styles.stepperBtnText}>-</Text>
                </Pressable>
                <Pressable
                  style={styles.stepperBtn}
                  onPress={() => {
                    const next = Math.min(1, opacity + 0.1);
                    setPartial({ opacity: Number(next.toFixed(2)) });
                  }}
                >
                  <Text style={styles.stepperBtnText}>+</Text>
                </Pressable>
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>pathVariant</Text>
              <View style={styles.chipRow}>
                {PATH_VARIANTS.map((v) => (
                  <Pressable
                    key={v}
                    style={[styles.chip, pathVariant === v && styles.chipOn]}
                    onPress={() => setPartial({ pathVariant: v })}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        pathVariant === v && styles.chipTextOn,
                      ]}
                    >
                      {v}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Fade out */}
            <Field label="fadeOut">
              <View style={styles.stepperRow}>
                <TextInput
                  style={styles.stepperInput}
                  value={String(loaderProps.fadeOut ?? 60)}
                  onChangeText={(t) =>
                    setNumberField(t, (n) => ({
                      fadeOut:
                        n !== undefined
                          ? Math.min(100, Math.max(0, n))
                          : undefined,
                    }))
                  }
                  keyboardType="numeric"
                  placeholderTextColor={MID}
                />
                <Pressable
                  style={styles.stepperBtn}
                  onPress={() => {
                    const current = loaderProps.fadeOut ?? 60;
                    setPartial({ fadeOut: Math.max(0, current - 10) });
                  }}
                >
                  <Text style={styles.stepperBtnText}>-</Text>
                </Pressable>
                <Pressable
                  style={styles.stepperBtn}
                  onPress={() => {
                    const current = loaderProps.fadeOut ?? 60;
                    setPartial({ fadeOut: Math.min(100, current + 10) });
                  }}
                >
                  <Text style={styles.stepperBtnText}>+</Text>
                </Pressable>
              </View>
            </Field>

            <View style={styles.fieldGroup}>
              <View style={styles.overridesRow}>
                <Text style={styles.fieldLabel}>waveOverrides</Text>
                {!loaderProps.waveOverrides ? (
                  <Pressable style={styles.smallBtn} onPress={ensureOverrides}>
                    <Text style={styles.smallBtnText}>add</Text>
                  </Pressable>
                ) : (
                  <Pressable style={styles.smallBtn} onPress={clearOverrides}>
                    <Text style={styles.smallBtnText}>clear</Text>
                  </Pressable>
                )}
              </View>

              {!!loaderProps.waveOverrides &&
                loaderProps.waveOverrides
                  .slice(0, waves)
                  .map((override, index) => (
                    <View key={`wave-${index}`} style={styles.overrideGroup}>
                      <Text style={styles.overrideLabel}>wave {index + 1}</Text>
                      <View style={styles.overrideColorRow}>
                        <TextInput
                          style={[styles.inputSm, { flex: 1 }]}
                          value={override.color ?? ""}
                          onChangeText={(t) =>
                            updateWaveOverride(index, {
                              color: t.trim() ? t : undefined,
                            })
                          }
                          autoCapitalize="none"
                          autoCorrect={false}
                          placeholder="color #RRGGBB"
                          placeholderTextColor={MID}
                        />
                        <Pressable
                          style={styles.overrideSwatchBtn}
                          onPress={() =>
                            setOverridePickerIndex(
                              overridePickerIndex === index ? null : index,
                            )
                          }
                        >
                          <View
                            style={[
                              styles.overrideSwatch,
                              {
                                backgroundColor:
                                  override.color ||
                                  loaderProps.color ||
                                  "#012D53",
                              },
                            ]}
                          />
                        </Pressable>
                      </View>
                      {overridePickerIndex === index && (
                        <View style={styles.pickerDropdown}>
                          <View style={styles.pickerSwatches}>
                            {COLOR_SWATCHES.map((c) => (
                              <Pressable
                                key={c}
                                style={[
                                  styles.pickerSwatch,
                                  { backgroundColor: c },
                                  override.color === c && styles.pickerSwatchOn,
                                ]}
                                onPress={() => {
                                  updateWaveOverride(index, { color: c });
                                  setOverridePickerIndex(null);
                                }}
                              />
                            ))}
                          </View>
                        </View>
                      )}
                      <TextInput
                        style={styles.inputSm}
                        value={
                          override.durationMs === undefined
                            ? ""
                            : String(override.durationMs)
                        }
                        onChangeText={(t) => {
                          if (!t.trim()) {
                            updateWaveOverride(index, {
                              durationMs: undefined,
                            });
                            return;
                          }
                          const parsed = Number(t);
                          if (!Number.isNaN(parsed)) {
                            updateWaveOverride(index, { durationMs: parsed });
                          }
                        }}
                        keyboardType="numeric"
                        placeholder="duration ms"
                        placeholderTextColor={MID}
                      />
                      <View style={styles.chipRow}>
                        <Pressable
                          style={[
                            styles.chipSm,
                            override.pathVariant === undefined && styles.chipOn,
                          ]}
                          onPress={() =>
                            updateWaveOverride(index, {
                              pathVariant: undefined,
                            })
                          }
                        >
                          <Text
                            style={[
                              styles.chipText,
                              override.pathVariant === undefined &&
                                styles.chipTextOn,
                            ]}
                          >
                            inherit
                          </Text>
                        </Pressable>
                        {PATH_VARIANTS.map((v) => (
                          <Pressable
                            key={`${index}-${v}`}
                            style={[
                              styles.chipSm,
                              override.pathVariant === v && styles.chipOn,
                            ]}
                            onPress={() =>
                              updateWaveOverride(index, { pathVariant: v })
                            }
                          >
                            <Text
                              style={[
                                styles.chipText,
                                override.pathVariant === v && styles.chipTextOn,
                              ]}
                            >
                              {v}
                            </Text>
                          </Pressable>
                        ))}
                      </View>
                    </View>
                  ))}
            </View>
          </View>

          {/* Preview — right side */}
          <View style={styles.preview}>
            {/* Wave preview */}
            <Text style={styles.metaLabel}>Live Preview</Text>
            <View
              style={[styles.previewBox, { backgroundColor: previewBgColor }]}
            >
              <WaveLoader {...asExternalWaveLoaderProps(loaderProps)} />
            </View>

            {/* Background tab bar */}
            <View style={styles.bgBar}>
              <View style={styles.bgTabs}>
                <Pressable
                  style={[
                    styles.bgTab,
                    previewBg === "light" && styles.bgTabOn,
                  ]}
                  onPress={() => setPreviewBg("light")}
                >
                  <Text
                    style={[
                      styles.bgTabText,
                      previewBg === "light" && styles.bgTabTextOn,
                    ]}
                  >
                    Light
                  </Text>
                </Pressable>
                <Pressable
                  style={[styles.bgTab, previewBg === "dark" && styles.bgTabOn]}
                  onPress={() => setPreviewBg("dark")}
                >
                  <Text
                    style={[
                      styles.bgTabText,
                      previewBg === "dark" && styles.bgTabTextOn,
                    ]}
                  >
                    Dark
                  </Text>
                </Pressable>
                <Pressable
                  style={[
                    styles.bgTab,
                    previewBg === "custom" && styles.bgTabOn,
                  ]}
                  onPress={() => setPreviewBg("custom")}
                >
                  <Text
                    style={[
                      styles.bgTabText,
                      previewBg === "custom" && styles.bgTabTextOn,
                    ]}
                  >
                    Custom
                  </Text>
                </Pressable>
              </View>
              {previewBg === "custom" && (
                <TextInput
                  style={[styles.bgInput, styles.bgInputPreview]}
                  value={customBg}
                  onChangeText={setCustomBg}
                  autoCapitalize="none"
                  autoCorrect={false}
                  placeholder="#1A1A2E"
                  placeholderTextColor={BORDER}
                />
              )}
              <Text style={styles.bgNote}>
                Preview only — not part of the component
              </Text>
            </View>

            {/* Presets */}
            <Text style={styles.metaLabel}>Presets</Text>
            <View style={styles.presetRow}>
              {PRESETS.map((preset) => (
                <Pressable
                  key={preset.id}
                  onPress={() => setFromPreset(preset)}
                >
                  <Text
                    style={[
                      styles.presetText,
                      presetId === preset.id && styles.presetTextOn,
                    ]}
                  >
                    {preset.label}
                  </Text>
                </Pressable>
              ))}
            </View>
            {(() => {
              const active = PRESETS.find((p) => p.id === presetId);
              if (!active) return null;
              return (
                <View style={styles.presetDescRow}>
                  <Text style={styles.presetDesc}>{active.description}</Text>
                  {active.note &&
                    (active.noteUrl ? (
                      <Pressable
                        onPress={() => Linking.openURL(active.noteUrl!)}
                      >
                        <Text style={styles.presetNote}>{active.note}</Text>
                      </Pressable>
                    ) : (
                      <Text style={styles.presetNote}>{active.note}</Text>
                    ))}
                </View>
              );
            })()}

            {/* Config */}
            <View style={styles.configHeader}>
              <Text style={styles.metaLabel}>Current Config</Text>
              <Pressable onPress={copyCurrentConfig}>
                <Text style={styles.copyText}>
                  {copied ? "copied" : "copy"}
                </Text>
              </Pressable>
            </View>
            <View style={styles.codeBox}>
              <Text selectable style={styles.codeText}>
                {currentConfig}
              </Text>
            </View>
          </View>
        </View>

        {/* Docs */}
        <View style={styles.docs}>
          <Text style={styles.docsTitle}>Docs</Text>

          <DocBlock title="Installation">
            <CodeBlock code="npm install wave-loader @shopify/react-native-skia" />
            <Text style={styles.bodyText}>
              Peer dependencies: react {">="} 18, react-native {">="} 0.73,
              @shopify/react-native-skia ^2.0.0
            </Text>
          </DocBlock>

          <DocBlock title="Basic usage">
            <CodeBlock
              code={`import { WaveLoader } from "wave-loader";

export function MyLoader() {
  return <WaveLoader width={240} height={80} />;
}`}
            />
          </DocBlock>

          <DocBlock title="Per-wave overrides">
            <CodeBlock
              code={`<WaveLoader
  waves={4}
  color="#1F6FEB"
  durationMs={4200}
  pathVariant="tall"
  waveOverrides={[
    { color: "#0A3D62", durationMs: 4600 },
    { color: "#00B4D8", pathVariant: "choppy" },
    { color: "#06D6A0", pathVariant: "smooth" },
    { color: "#48CAE4" },
  ]}
/>`}
            />
          </DocBlock>

          <DocBlock title="WaveLoaderProps">
            <View style={styles.table}>
              <TableHeader />
              {API_ROWS.map((row) => (
                <ApiTableRow
                  key={row.name}
                  name={row.name}
                  type={row.type}
                  defaultValue={row.defaultValue}
                  description={row.description}
                />
              ))}
            </View>
          </DocBlock>

          <DocBlock title="WaveLoaderWaveOverride">
            <View style={styles.table}>
              <TableHeader />
              {OVERRIDE_ROWS.map((row) => (
                <ApiTableRow
                  key={row.name}
                  name={row.name}
                  type={row.type}
                  defaultValue={row.defaultValue}
                  description={row.description}
                />
              ))}
            </View>
          </DocBlock>

          <DocBlock title="Presets">
            <View style={styles.codeBox}>
              <Text style={styles.codeText}>
                {`import { WaveLoader, auroraPreset } from "wave-loader";\n\n<WaveLoader {...auroraPreset} />`}
              </Text>
            </View>
            <Text style={styles.bodyText}>
              Ready-made configurations you can spread into WaveLoader:
            </Text>
            <Text style={[styles.bodyText]}>
              {PRESETS.filter((p) => p.id !== "mahalo")
                .map((p) => p.id)
                .join(", ")}
            </Text>
          </DocBlock>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Dark Space Studio</Text>
      </View>
    </ScrollView>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <View style={styles.fieldBlock}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {children}
    </View>
  );
}

function DocBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={styles.docBlock}>
      <Text style={styles.docBlockTitle}>{title}</Text>
      {children}
    </View>
  );
}

function CodeBlock({ code }: { code: string }) {
  return (
    <View style={styles.codeBox}>
      <Text selectable style={styles.codeText}>
        {code}
      </Text>
    </View>
  );
}

function TableHeader() {
  return (
    <View style={[styles.tableRow, styles.tableHead]}>
      <Text style={[styles.tableHeadCell, styles.cellName]}>Name</Text>
      <Text style={[styles.tableHeadCell, styles.cellType]}>Type</Text>
      <Text style={[styles.tableHeadCell, styles.cellDefault]}>Default</Text>
      <Text style={[styles.tableHeadCell, styles.cellDesc]}>Description</Text>
    </View>
  );
}

function ApiTableRow({
  name,
  type,
  defaultValue,
  description,
}: {
  name: string;
  type: string;
  defaultValue: string;
  description: string;
}) {
  return (
    <View style={styles.tableRow}>
      <Text
        selectable
        style={[styles.tableCell, styles.tableCellMono, styles.cellName]}
      >
        {name}
      </Text>
      <Text
        selectable
        style={[styles.tableCell, styles.tableCellMono, styles.cellType]}
      >
        {type}
      </Text>
      <Text
        selectable
        style={[styles.tableCell, styles.tableCellMono, styles.cellDefault]}
      >
        {defaultValue}
      </Text>
      <Text style={[styles.tableCell, styles.cellDesc]}>{description}</Text>
    </View>
  );
}

const MONO = Platform.select({
  ios: "Menlo",
  android: "monospace",
  default: "monospace",
});

const DARK = "#0C161F";
const LIGHT = "#FFFFED";
const MID = "#6B7D8D";
const BORDER = "#D8D4C0";

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: LIGHT,
  },
  pageContent: {
    paddingBottom: 0,
  },

  // Nav
  nav: {
    backgroundColor: DARK,
  },
  navInner: {
    maxWidth: 1080,
    width: "100%",
    alignSelf: "center",
    paddingHorizontal: 24,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  navLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  navBrand: {
    color: LIGHT,
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  navDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: MID,
  },
  navStudio: {
    color: MID,
    fontSize: 12,
    letterSpacing: 0.3,
  },
  navRight: {
    flexDirection: "row",
    gap: 20,
  },
  navLink: {
    color: MID,
    fontSize: 13,
  },

  // Hero
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

  // Content
  content: {
    maxWidth: 1080,
    width: "100%",
    alignSelf: "center",
    paddingHorizontal: 24,
  },

  // Playground
  playground: {
    flexDirection: "column",
    marginBottom: 64,
  },
  playgroundDesktop: {
    flexDirection: "row",
  },

  // Props panel — dark, more spacious
  props: {
    backgroundColor: DARK,
    paddingHorizontal: 24,
    paddingVertical: 28,
  },
  propsDesktop: {
    width: 360,
  },
  propsTitle: {
    color: LIGHT,
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginBottom: 24,
  },
  fieldBlock: {
    marginBottom: 16,
  },
  fieldGroup: {
    marginBottom: 20,
  },
  fieldLabel: {
    color: MID,
    fontSize: 12,
    marginBottom: 8,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#1E2D3A",
    color: LIGHT,
    backgroundColor: "transparent",
    paddingHorizontal: 0,
    paddingVertical: 8,
    fontSize: 13,
    fontFamily: MONO,
    marginBottom: 4,
  },
  inputSm: {
    borderBottomWidth: 1,
    borderBottomColor: "#1E2D3A",
    color: LIGHT,
    backgroundColor: "transparent",
    paddingHorizontal: 0,
    paddingVertical: 6,
    fontSize: 12,
    fontFamily: MONO,
    marginBottom: 8,
  },

  // Stepper
  stepperRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 4,
  },
  stepperBtn: {
    width: 30,
    height: 30,
    borderBottomWidth: 1,
    borderBottomColor: "#1E2D3A",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 4,
  },
  stepperBtnText: {
    color: MID,
    fontSize: 16,
    fontWeight: "600",
  },
  stepperInput: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: "#1E2D3A",
    color: LIGHT,
    backgroundColor: "transparent",
    paddingHorizontal: 0,
    paddingVertical: 7,
    fontSize: 13,
    fontFamily: MONO,
    textAlign: "left",
  },

  // Waves slider
  sliderLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  sliderValue: {
    color: LIGHT,
    fontSize: 13,
    fontFamily: MONO,
  },

  // Color picker
  colorInputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 0,
  },
  colorInput: {
    flex: 1,
  },
  colorBtn: {
    justifyContent: "center",
    paddingBottom: 4,
    marginLeft: 10,
  },
  colorBtnSwatch: {
    width: 24,
    height: 24,
    borderRadius: 1,
  },
  pickerDropdown: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#1E2D3A",
    padding: 10,
  },
  pickerSwatches: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  pickerSwatch: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "transparent",
  },
  pickerSwatchOn: {
    borderColor: LIGHT,
  },

  // Chips
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  chip: {
    borderWidth: 1,
    borderColor: "#1E2D3A",
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  chipSm: {
    borderWidth: 1,
    borderColor: "#1E2D3A",
    paddingHorizontal: 7,
    paddingVertical: 4,
  },
  chipOn: {
    borderColor: LIGHT,
  },
  chipText: {
    color: MID,
    fontSize: 11,
  },
  chipTextOn: {
    color: LIGHT,
  },

  // Overrides
  overridesRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  smallBtn: {
    borderWidth: 1,
    borderColor: "#1E2D3A",
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  smallBtnText: {
    color: MID,
    fontSize: 11,
  },
  overrideGroup: {
    borderTopWidth: 1,
    borderTopColor: "#1E2D3A",
    paddingTop: 10,
    marginBottom: 8,
  },
  overrideLabel: {
    color: MID,
    fontSize: 11,
    letterSpacing: 0.5,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  overrideColorRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 0,
  },
  overrideSwatchBtn: {
    justifyContent: "center",
    paddingBottom: 4,
    marginLeft: 10,
  },
  overrideSwatch: {
    width: 18,
    height: 18,
    borderRadius: 1,
  },

  // Preview
  preview: {
    flex: 1,
    paddingVertical: 24,
    paddingHorizontal: 24,
  },

  // Background tab bar
  bgBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 0,
    marginBottom: 28,
  },
  bgTabs: {
    flexDirection: "row",
  },
  bgTab: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: BORDER,
    backgroundColor: "transparent",
  },
  bgTabOn: {
    backgroundColor: LIGHT,
    borderTopColor: LIGHT,
  },
  bgTabText: {
    color: MID,
    fontSize: 11,
    letterSpacing: 0.3,
  },
  bgTabTextOn: {
    color: DARK,
    fontWeight: "600",
  },
  bgInput: {
    flex: 1,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: BORDER,
    paddingHorizontal: 10,
    paddingVertical: 7,
    fontSize: 12,
    fontFamily: MONO,
    color: DARK,
  },
  bgInputPreview: {
    flex: 0,
    width: 80,
  },
  bgNote: {
    color: MID,
    fontSize: 10,
    marginLeft: 12,
    alignSelf: "center",
  },

  // Preview box
  previewBox: {
    borderWidth: 1,
    borderColor: BORDER,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 360,
    minHeight: 200,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  metaLabel: {
    color: DARK,
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 10,
  },
  presetRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 20,
    marginBottom: 28,
  },
  presetText: {
    color: MID,
    fontSize: 13,
  },
  presetTextOn: {
    color: DARK,
    fontWeight: "600",
  },
  presetDescRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: -18,
    marginBottom: 28,
  },
  presetDesc: {
    color: MID,
    fontSize: 12,
  },
  presetNote: {
    color: DARK,
    fontSize: 11,
    textDecorationLine: "underline",
  },
  configHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  copyText: {
    color: MID,
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  codeBox: {
    borderWidth: 1,
    borderColor: BORDER,
    padding: 16,
    backgroundColor: LIGHT,
  },
  codeText: {
    color: DARK,
    fontSize: 12,
    lineHeight: 18,
    fontFamily: MONO,
  },

  // Docs
  docs: {
    paddingTop: 16,
    paddingBottom: 40,
  },
  docsTitle: {
    color: DARK,
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginBottom: 28,
  },
  docBlock: {
    borderTopColor: DARK,
    paddingTop: 20,
    marginBottom: 28,
  },
  docBlockTitle: {
    color: DARK,
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  bodyText: {
    color: MID,
    fontSize: 14,
    lineHeight: 22,
    marginTop: 8,
  },

  // Tables
  table: {
    borderTopWidth: 0,
  },
  tableHead: {
    backgroundColor: "transparent",
    borderBottomColor: DARK,
  },
  tableHeadCell: {
    color: DARK,
    fontSize: 11,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    paddingVertical: 8,
    paddingHorizontal: 6,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  tableCell: {
    color: MID,
    fontSize: 12,
    paddingHorizontal: 6,
    paddingVertical: 8,
    lineHeight: 18,
  },
  tableCellMono: {
    fontFamily: MONO,
    color: DARK,
  },
  cellName: {
    flex: 1.3,
  },
  cellType: {
    flex: 2,
  },
  cellDefault: {
    flex: 1.8,
  },
  cellDesc: {
    flex: 2.8,
  },

  // Preset docs
  presetDocRow: {
    flexDirection: "row",
    paddingVertical: 4,
  },
  presetDocName: {
    color: DARK,
    fontSize: 13,
    fontWeight: "600",
  },
  presetDocDesc: {
    color: MID,
    fontSize: 13,
  },

  // Footer
  footer: {
    backgroundColor: DARK,
    paddingVertical: 28,
    alignItems: "center",
  },
  footerText: {
    color: MID,
    fontSize: 12,
    letterSpacing: 0.8,
  },
});
