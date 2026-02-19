import React from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  Text,
  View,
} from "react-native";
import { AsyncSkia } from "../components/asyncSkia";

const WaveLoaderDemo = React.lazy(() => import("../components/waveLoaderDemo"));

class SkiaErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#FFFFED",
          }}
        >
          <Text
            style={{
              color: "#0C161F",
              fontSize: 16,
              fontWeight: "600",
              marginBottom: 8,
            }}
          >
            Rendering context lost
          </Text>
          <Text style={{ color: "#6B7D8D", fontSize: 13, marginBottom: 20 }}>
            This can happen after your device sleeps.
          </Text>
          <Pressable
            onPress={() => {
              if (Platform.OS === "web") {
                window.location.reload();
              } else {
                this.setState({ hasError: false });
              }
            }}
          >
            <Text
              style={{
                color: "#0C161F",
                fontSize: 13,
                textDecorationLine: "underline",
              }}
            >
              Reload page
            </Text>
          </Pressable>
        </View>
      );
    }
    return this.props.children;
  }
}

export default function Page() {
  return (
    <View style={{ flex: 1, backgroundColor: "#FFFFED" }}>
      <SkiaErrorBoundary>
        <React.Suspense
          fallback={
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ActivityIndicator color="#CFE6FF" />
              <Text style={{ color: "#CFE6FF", marginTop: 12 }}>
                Loading Skia...
              </Text>
            </View>
          }
        >
          <AsyncSkia />
          <WaveLoaderDemo />
        </React.Suspense>
      </SkiaErrorBoundary>
    </View>
  );
}
