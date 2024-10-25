import { View, Image, Text } from "react-native";
import React, { useState, useEffect } from "react";
import { useLocalSearchParams, router } from "expo-router";
import { ImageEditor } from "expo-crop-image";
import { SafeAreaView } from "react-native-safe-area-context";

const Crop = () => {
  const { uri } = useLocalSearchParams();
  const [showEditor, setShowEditor] = useState(true);

  useEffect(() => {
    setShowEditor(true);
  }, [uri]);

  console.log("Crop ");
  console.log(uri);

  return (
    <>
      {showEditor && (
        <ImageEditor
          imageUri={uri}
          fixedAspectRatio={2 / 3}
          onEditingCancel={() => {
            setShowEditor(false);
            setTimeout(() => router.replace("/camera"), 100);
          }}
          onEditingComplete={(image) => {
            console.log("Crop image");
            setShowEditor(false);
            console.log("Image", image);
            setTimeout(() => {
              router.push({ pathname: "/pdf", params: { uri: image.uri } });
            }, 100);
          }}
          minimumCropDimensions={{ width: 50, height: 50 }}
          editorOptions={{
            controlBar: { height: "10px" },
          }}
        />
      )}
    </>
  );
};

export default Crop;
