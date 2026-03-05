import { Pressable, StyleSheet, View } from "react-native";
import { COLOR_SWATCHES } from "../config/constants";
import { LIGHT } from "../styles/theme";

export function ColorSwatchPalette({
  selectedColor,
  onSelect,
}: {
  selectedColor: string | undefined;
  onSelect: (color: string) => void;
}) {
  return (
    <View style={styles.pickerSwatches}>
      {COLOR_SWATCHES.map((color) => (
        <Pressable
          key={color}
          style={[
            styles.pickerSwatch,
            { backgroundColor: color },
            selectedColor === color && styles.pickerSwatchOn,
          ]}
          onPress={() => onSelect(color)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
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
});
