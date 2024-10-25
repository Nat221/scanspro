import React, { useState, useRef, useEffect } from "react";
import { View, Button, Text, Image, TouchableOpacity } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

const CameraScreen = () => {
  const [cameraReady, setCameraReady] = useState(null);
  const [permission, requestPermission] = useCameraPermissions();

  const cameraRef = useRef(null);

  const takePicture = async () => {
    if (cameraRef.current && cameraReady) {
      const photo = await cameraRef.current.takePictureAsync();

      console.log("Photo.uri", photo.uri);
      router.push({ pathname: "/crop", params: { uri: photo.uri } });
    }
  };

  if (!permission) {
    return <Text>Waiting for Camera Permision</Text>;
  }

  if (!permission.granted) {
    return (
      <View>
        <Text>No access to camera</Text>
        <Button onPress={requestPermission} title="Request Permission" />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <CameraView
          style={{ height: "80%", width: "100%" }}
          onCameraReady={() => {
            console.log("Ready");
            setCameraReady(true);
          }}
          ref={cameraRef}
          facing="back"
        />

        <TouchableOpacity
          style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            padding: 4,
            borderWidth: 2,
            borderColor: "white",
            marginTop: 20,
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={takePicture}
        >
          <View
            style={{
              width: 70,
              height: 70,
              borderRadius: 40,
              backgroundColor: "white",
              justifyContent: "center",
              alignItems: "center",
            }}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default CameraScreen;
