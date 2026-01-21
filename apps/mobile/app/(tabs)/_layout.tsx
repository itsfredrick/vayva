import React from "react";
import { Tabs } from "expo-router";
import { View } from "react-native";
import { BlurView } from "expo-blur";
import {
  Home,
  ShoppingBag,
  Bell,
  Menu,
  ShieldCheck,
  LucideIcon
} from "lucide-react-native";

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

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: "rgba(11, 20, 26, 0.85)",
          borderTopWidth: 1,
          borderTopColor: "rgba(255,255,255,0.05)",
          elevation: 0,
          height: 85,
          paddingTop: 10,
        },
        tabBarActiveTintColor: "#46EC13",
        tabBarInactiveTintColor: "rgba(255,255,255,0.4)",
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "600",
          marginTop: 4,
        },
        tabBarBackground: () => (
          <BlurView
            tint="dark"
            intensity={80}
            style={{ position: "absolute", inset: 0 }}
          />
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <Icon name={Home} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: "Orders",
          tabBarIcon: ({ color }) => (
            <Icon name={ShoppingBag} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="approvals"
        options={{
          title: "Approvals",
          tabBarIcon: ({ color }) => (
            <View>
              <Icon name={ShieldCheck} size={24} color={color} />
              <View className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border border-[#0b141a]" />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: "Alerts",
          tabBarIcon: ({ color }) => (
            <Icon name={Bell} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="menu"
        options={{
          title: "Menu",
          tabBarIcon: ({ color }) => (
            <Icon name={Menu} size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
