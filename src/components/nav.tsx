import { Linking, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  Easing,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { DARK, LIGHT, MID } from "../styles/theme";

const TIMING = { duration: 250, easing: Easing.linear };

export function Nav() {
  return (
    <View style={styles.nav}>
      <View style={styles.navInner}>
        <View style={styles.navLeft}>
          <Text style={styles.navBrand}>{"<WaveLoader />"}</Text>
          <Pressable onPress={() => Linking.openURL("")}>
            <Text style={styles.navStudio}></Text>
          </Pressable>
        </View>
        <View style={styles.navRight}>
          <NavButton
            label="npm"
            url="https://www.npmjs.com/package/wave-loader"
          />
          <NavButton
            label="GitHub"
            url="https://github.com/DarkSpaceStudio/wave-loader"
          />
          <NavButton label="DarkSpace.Studio" url="https://darkspace.studio/" />
        </View>
      </View>
    </View>
  );
}

function NavButton({ label, url }: { label: string; url: string }) {
  const hovered = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    color: interpolateColor(hovered.value, [0, 1], [MID, LIGHT]),
  }));

  return (
    <Pressable
      {...({
        href: url,
        hrefAttrs: { target: "_blank", rel: "noopener noreferrer" },
      } as object)}
      onPress={() => Linking.openURL(url)}
      onHoverIn={() => {
        hovered.value = withTiming(1, TIMING);
      }}
      onHoverOut={() => {
        hovered.value = withTiming(0, TIMING);
      }}
    >
      <Animated.Text style={[styles.navLink, animatedStyle]}>
        {label}
      </Animated.Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
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
  navBy: {
    color: MID,
    fontSize: 13,
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
});
