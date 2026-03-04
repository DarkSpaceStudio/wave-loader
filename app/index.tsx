import React from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  Text,
  View,
} from "react-native";
import { WithSkiaWeb } from "@shopify/react-native-skia/lib/module/web";

const locateSkiaFile = (file: string) =>
  typeof window === "undefined"
    ? `/${file}`
    : new URL(file, window.location.origin).toString();

function SkiaLoadingFallback() {
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text style={{ color: "#6B7D8D" }}>Loading Skia...</Text>
    </View>
  );
}

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
  const isStaticWebRender =
    Platform.OS === "web" && typeof window === "undefined";

  return (
    <View style={{ flex: 1, backgroundColor: "#FFFFED" }}>
      <SkiaErrorBoundary>
        {isStaticWebRender ? (
          <SkiaLoadingFallback />
        ) : (
          <WithSkiaWeb
            fallback={<SkiaLoadingFallback />}
            opts={{ locateFile: locateSkiaFile }}
            getComponent={() => import("../components/waveLoaderDemo")}
          />
        )}
      </SkiaErrorBoundary>
    </View>
  );
}
