import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { router } from "expo-router";
// @ts-ignore
import { BlurView } from "expo-blur";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen() {
  const handleLogin = () => {
    router.replace("/(tabs)");
  };

  return (
    <ImageBackground
      source={{
        uri: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop",
      }}
      style={{ flex: 1 }}
      blurRadius={90}
    >
      <SafeAreaView className="flex-1 justify-center px-6">
        <View className="items-center mb-10">
          <View className="w-16 h-16 bg-[#46EC13] rounded-2xl items-center justify-center mb-4 shadow-lg shadow-green-500/50">
            <Text className="text-black font-bold text-3xl">V</Text>
          </View>
          <Text className="text-white text-3xl font-bold">Vayva Merchant</Text>
          <Text className="text-white/60 mt-2 text-base">
            Manage your store on the go
          </Text>
        </View>

        <BlurView
          intensity={30}
          tint="dark"
          className="overflow-hidden rounded-3xl border border-white/10 p-6"
        >
          <View className="gap-4">
            <View>
              <Text className="text-xs text-white/70 uppercase font-bold mb-2 ml-1">
                Email
              </Text>
              <TextInput
                placeholder="store@vayva.ng"
                placeholderTextColor="rgba(255,255,255,0.3)"
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white text-base"
              />
            </View>
            <View>
              <Text className="text-xs text-white/70 uppercase font-bold mb-2 ml-1">
                Password
              </Text>
              <TextInput
                placeholder="••••••••"
                secureTextEntry
                placeholderTextColor="rgba(255,255,255,0.3)"
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white text-base"
              />
            </View>

            <TouchableOpacity
              onPress={handleLogin}
              className="bg-[#46EC13] rounded-full py-4 items-center mt-4 active:opacity-90 shadow-lg shadow-green-500/20"
            >
              <Text className="text-black font-bold text-lg">Sign In</Text>
            </TouchableOpacity>

            <TouchableOpacity className="items-center mt-2">
              <Text className="text-white/50 text-sm">Forgot password?</Text>
            </TouchableOpacity>
          </View>
        </BlurView>

        <View className="mt-10 items-center">
          <Text className="text-white/30 text-xs">
            Vayva Inc • Version 1.0.0
          </Text>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}
