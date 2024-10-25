import {
  View,
  Text,
  Image,
  Button,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { printToFileAsync } from "expo-print";
import { shareAsync } from "expo-sharing";
import * as FileSystem from "expo-file-system";
import { useGlobalContext } from "../../context/GlobalProvider";
import { FontAwesome } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const PdfScreen = () => {
  const { uri } = useLocalSearchParams();
  // const [base64image, setBase64image] = useState("");
  const { croppedImageBase64, setCroppedImageBase64 } = useGlobalContext();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fileToBase64Image = async () => {
      try {
        const base64 = await FileSystem.readAsStringAsync(uri, {
          encoding: FileSystem.EncodingType.Base64,
        });

        setCroppedImageBase64((prev) => [...prev, base64]);
      } catch (error) {
        console.log("Error converting to base64:  ", error);
      }
    };
    if (uri) {
      fileToBase64Image();
    }
  }, [uri]);

  const htmlContent = `<html>
  <head>
  <style>
   body {margin: 0; display: flex; padding: 0; height: 100%; width: 100%; box-sizing: border-box; overflow: hidden }
   img {max-height: 90%; max-width: auto; display: block; margin: 5px auto; box-sizing: border-box }
   ${
     croppedImageBase64.length < 2
       ? `body {display: flex; justify-content: center; align-items: center } img:first-child {margin-top: auto; margin-bottom: auto; margin-left: auto; margin-right: auto; overflow: hidden; page-break-after: avoid}`
       : `body {display: block; } img:not(:last-child) {page-break-after: always;}`
   }
   
   </style>
   </head>
   <body>${croppedImageBase64
     .map((image) => `<img src="data:image/jpeg;base64,${image}" />`)
     .join("")}
   </body>
   </html>`;

  const generatePdf = async () => {
    if (croppedImageBase64.length < 1) return;

    setIsLoading(true);

    try {
      pdf = await printToFileAsync({ html: htmlContent, base64: false });
      setIsLoading(false);
      console.log("Html", htmlContent);
      Alert.alert(
        "Pdf succesfully created",
        "Would you like to share it?",
        [
          {
            text: "No",
            onPress: () => {
              console.log("User do not want to share pdf");
            },
            style: "cancel",
          },
          {
            text: "Yes",
            onPress: async () => {
              await shareAsync(pdf.uri);
              setCroppedImageBase64([]);
              console.log("State empty");
              router.push("/camera");
            },
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const addMorePages = () => {
    router.push("/camera");
  };

  const restartPdf = () => {
    Alert.alert(
      "Restart",
      "You are about to lose your progress and restart from beggining.\nDo you wish to proceed?",
      [
        {
          text: "No",
          onPress: () => {
            console.log("Restart declined");
          },
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => {
            setCroppedImageBase64([]);
            router.push("/camera");
          },
        },
      ],
      { cancelable: false }
    );
    setCroppedImageBase64([]);
  };

  console.log("Pdf params", JSON.stringify(uri));

  if (isLoading) {
    return (
      <View style={{ flex: 1 }}>
        <ActivityIndicator size="large" color="black" />
      </View>
    );
  }
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <Image
          source={{ uri: uri }}
          style={{ width: "100%", height: "80%", resizeMode: "contain" }}
        />
        <View
          style={{
            marginTop: 20,
            marginHorizontal: 10,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 10,
          }}
        >
          <TouchableOpacity
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={generatePdf}
          >
            <FontAwesome name="file-pdf-o" size={20} color="white" />
            <Text style={{ color: "white", marginTop: 10 }}>Generate Pdf</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={restartPdf}
          >
            <FontAwesome name="refresh" size={20} color="white" />
            <Text style={{ color: "white", marginTop: 10 }}>Restart</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={addMorePages}
          >
            <FontAwesome name="plus-square" size={20} color="white" />
            <Text style={{ color: "white", marginTop: 10 }}>Add page</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default PdfScreen;
