import React from "react";
import { Stack } from "expo-router";

export default function Layout(): React.JSX.Element {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ title: "Home", headerShown: false }}
      />
    </Stack>
  );
}
