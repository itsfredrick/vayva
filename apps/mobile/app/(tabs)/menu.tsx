/* eslint-disable */
// @ts-nocheck
import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Settings,
  User,
  _LogOut,
  HelpCircle,
  FileText,
  LucideIcon
} from "lucide-react-native";

const SUB_MENU = [
  { icon: User, label: "Profile" },
  { icon: Settings, label: "Store Settings" },
  { icon: FileText, label: "Policies" },
  { icon: HelpCircle, label: "Help & Support" },
];

import { router } from "expo-router";

const Icon = ({
  name: Component,
  size,
  color,
}: {
  name: LucideIcon;
  size: number;
  color: string;
}) => {
  return <Component size={size} color={color} />;
};

export default function MenuScreen(): React.JSX.Element {
  return (
    <SafeAreaView className="flex-1 bg-[#142210]">
      <View className="px-6 py-4 mb-4">
        <Text className="text-white font-bold text-2xl">Menu</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 24 }}>
        <View className="bg-[#0b141a] rounded-2xl border border-white/5 overflow-hidden mb-6">
          <TouchableOpacity className="flex-row items-center p-4 border-b border-white/5">
            <View className="w-12 h-12 rounded-full bg-indigo-500 items-center justify-center mr-4">
              <Text className="text-white font-bold text-lg">JD</Text>
            </View>
            <View>
              <Text className="text-white font-bold text-lg">John Doe</Text>
              <Text className="text-white/50 text-xs">Admin • TechDepot</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View className="bg-[#0b141a] rounded-2xl border border-white/5 overflow-hidden mb-6">
          {SUB_MENU.map((item, i) => (
            <TouchableOpacity
              key={i}
              className="flex-row items-center p-4 border-b border-white/5 last:border-0 active:bg-white/5"
            >
              <Icon name={item.icon} size={24} color="#FFFFFF" />
              <Text className="text-white ml-4 font-medium text-base">
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          onPress={() => router.replace("/(auth)/login")}
          className="flex-row items-center justify-center p-4 rounded-xl border border-red-500/20 bg-red-500/10 active:bg-red-500/20"
        >
          <User size={20} color="#FFFFFF" />

          <Text className="text-red-500 ml-2 font-bold">Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
