import type { ReactNode } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import type { WaveLoaderProps, WaveLoaderWaveOverride, WavePathVariant } from "wave-loader";
import { ColorSwatchPalette } from "./colorSwatchPalette";
import { PATH_VARIANTS } from "../config/constants";
import { DARK, LIGHT, MID, MONO } from "../styles/theme";

type PropsPanelProps = {
  isDesktop: boolean;
  loaderProps: WaveLoaderProps;
  waves: number;
  durationMs: number;
  opacity: number;
  pathVariant: WavePathVariant;
  colorPickerOpen: boolean;
  overridePickerIndex: number | null;
  setPartial: (partial: Partial<WaveLoaderProps>) => void;
  setNumberField: (
    value: string,
    updater: (n: number | undefined) => Partial<WaveLoaderProps>,
  ) => void;
  adjustDuration: (delta: number) => void;
  setColorPickerOpen: (open: boolean) => void;
  setOverridePickerIndex: (index: number | null) => void;
  ensureOverrides: () => void;
  clearOverrides: () => void;
  updateWaveOverride: (
    index: number,
    partial: Partial<WaveLoaderWaveOverride>,
  ) => void;
};

export function PropsPanel({
  isDesktop,
  loaderProps,
  waves,
  durationMs,
  opacity,
  pathVariant,
  colorPickerOpen,
  overridePickerIndex,
  setPartial,
  setNumberField,
  adjustDuration,
  setColorPickerOpen,
  setOverridePickerIndex,
  ensureOverrides,
  clearOverrides,
  updateWaveOverride,
}: PropsPanelProps) {
  return (
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
                const nextOverrides = loaderProps.waveOverrides?.slice(0, n);
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
            <ColorSwatchPalette
              selectedColor={loaderProps.color}
              onSelect={(c) => {
                setPartial({ color: c });
                setColorPickerOpen(false);
              }}
            />
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
                    <ColorSwatchPalette
                      selectedColor={override.color}
                      onSelect={(c) => {
                        updateWaveOverride(index, { color: c });
                        setOverridePickerIndex(null);
                      }}
                    />
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
                      updateWaveOverride(index, { durationMs: undefined });
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
                      updateWaveOverride(index, { pathVariant: undefined })
                    }
                  >
                    <Text
                      style={[
                        styles.chipText,
                        override.pathVariant === undefined && styles.chipTextOn,
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

const styles = StyleSheet.create({
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
});
