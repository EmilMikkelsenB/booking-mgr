import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Button from "./common/button";
import { colors } from "../lib/theme";

export default function SplashScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        },
      ]}
    >
      <Text style={styles.title} maxFontSizeMultiplier={1.2} numberOfLines={2}>
        Boka ett rum
      </Text>
      <View style={[styles.buttonWrapper, { paddingBottom: insets.bottom + 24 }]}>
        <Button
          text="Boka"
          icon="arrow-right"
          iconPosition="right"
          onPress={() => router.push("/booking")}
        />
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 80,
    color: colors.text,
    marginTop: 124,
    marginHorizontal: 24,
  },
  buttonWrapper: {
    marginTop: "auto",
  },
});
