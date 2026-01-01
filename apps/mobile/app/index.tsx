import { View, Text } from "react-native";
import { Link } from "expo-router";
import { tokens } from "@vayva/theme";

export default function Home() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: tokens.colors.background,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text
        style={{
          fontSize: 24,
          fontWeight: "bold",
          color: tokens.colors.primary,
          marginBottom: 20,
        }}
      >
        Vayva Mobile
      </Text>
      <Link href="/details" style={{ color: tokens.colors.text.inverse }}>
        Go to Details
      </Link>
    </View>
  );
}
