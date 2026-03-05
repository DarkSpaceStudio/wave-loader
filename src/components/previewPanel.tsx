import {
  Linking,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import type { WaveLoaderProps } from "wave-loader";
import { WaveLoader } from "wave-loader";
import { asExternalWaveLoaderProps, PRESETS } from "../config/constants";
import type { PresetItem, PreviewBg } from "../types";
import { BORDER, DARK, LIGHT, MID, MONO } from "../styles/theme";

type PreviewPanelProps = {
  loaderProps: WaveLoaderProps;
  previewBg: PreviewBg;
  customBg: string;
  presetId: string;
  currentConfig: string;
  copied: boolean;
  setPreviewBg: (bg: PreviewBg) => void;
  setCustomBg: (bg: string) => void;
  setFromPreset: (preset: PresetItem) => void;
  copyCurrentConfig: () => Promise<void>;
};

export function PreviewPanel({
  loaderProps,
  previewBg,
  customBg,
  presetId,
  currentConfig,
  copied,
  setPreviewBg,
  setCustomBg,
  setFromPreset,
  copyCurrentConfig,
}: PreviewPanelProps) {
  const previewBgColor =
    previewBg === "light" ? LIGHT : previewBg === "dark" ? DARK : customBg;

  return (
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
            style={[styles.bgTab, previewBg === "light" && styles.bgTabOn]}
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
            style={[styles.bgTab, previewBg === "custom" && styles.bgTabOn]}
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
          <Pressable key={preset.id} onPress={() => setFromPreset(preset)}>
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
          <Text style={styles.copyText}>{copied ? "copied" : "copy"}</Text>
        </Pressable>
      </View>
      <View style={styles.codeBox}>
        <Text selectable style={styles.codeText}>
          {currentConfig}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  preview: {
    flex: 1,
    paddingVertical: 24,
    paddingHorizontal: 24,
  },
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
});
