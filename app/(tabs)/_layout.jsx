import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";

const TabsLayout = () => {
  return (
    <Stack screenOptions={{ gestureEnabled: false, headerShown: false }}>
      {/* <Stack.Screen name="camera" /> */}
      <Stack.Screen name="crop" />
      <Stack.Screen name="pdf" />
    </Stack>
  );
};

export default TabsLayout;
