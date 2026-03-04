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
  { error: Error | null }
> {
  state = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error) {
    console.error("Skia render failed", error);
  }

  render() {
    if (this.state.error) {
      const message = this.state.error.message || "";
      const isContextLoss = /context lost|webgl context/i.test(message);

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
            {isContextLoss ? "Rendering context lost" : "Unable to load Skia"}
          </Text>
          <Text style={{ color: "#6B7D8D", fontSize: 13, marginBottom: 20 }}>
            {isContextLoss
              ? "This can happen after your device sleeps."
              : "The browser failed while initializing the web renderer."}
          </Text>
          {!isContextLoss && message ? (
            <Text
              style={{
                color: "#6B7D8D",
                fontSize: 12,
                marginBottom: 20,
                maxWidth: 360,
                textAlign: "center",
              }}
            >
              {message}
            </Text>
          ) : null}
          <Text style={{ color: "#6B7D8D", fontSize: 13, marginBottom: 20 }}>
            Reload page after the wasm asset finishes deploying.
          </Text>
          <Pressable
            onPress={() => {
              if (Platform.OS === "web") {
                window.location.reload();
              } else {
                this.setState({ error: null });
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
