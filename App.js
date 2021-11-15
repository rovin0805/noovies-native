import React, { useState } from "react";
import { Image } from "react-native";
import AppLoading from "expo-app-loading";
import * as Font from "expo-font";
import { Ionicons } from "@expo/vector-icons";
import { Asset } from "expo-asset";

export default function App() {
  // const [assets] = useAssets([require("./assets/quokka.jpeg")]);
  // const [fonts] = Font.useFonts(Ionicons.font);
  const [ready, setReady] = useState(false);

  const loadFonts = (fontsArr) => fontsArr.map((font) => Font.loadAsync(font));
  const loadImages = (imagesArr) =>
    imagesArr.map((image) => {
      if (typeof image === "string") {
        return Image.prefetch(image);
      } else {
        return Asset.loadAsync(image);
      }
    });

  const startLoading = async () => {
    const fonts = loadFonts([Ionicons.font]);
    const images = loadImages([
      require("./assets/quokka.jpeg"),
      "https://reactnative.dev/img/oss_logo.png",
    ]);
    await Promise.all([...fonts, ...images]);
  };

  const onFinish = () => setReady(true);

  if (!ready) {
    return (
      <AppLoading
        startAsync={startLoading}
        onFinish={onFinish}
        onError={console.error}
      />
    );
  }

  return null;
}
