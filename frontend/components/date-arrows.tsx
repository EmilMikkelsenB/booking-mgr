import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { Pressable, StyleSheet, View } from "react-native";
import { colors } from "../lib/theme";

type DateArrowsProps = {
  onPrevious: () => void;
  onNext: () => void;
};

export default function DateArrows({ onPrevious, onNext }: DateArrowsProps) {
  return (
    <View style={styles.arrows}>
      <Pressable
        onPress={onPrevious}
        style={({ pressed }) => [styles.arrowButton, pressed && styles.pressed]}
        accessibilityRole="button"
        accessibilityLabel="Visa föregående dagar"
      >
        <FontAwesome6 name="chevron-left" size={18} color={colors.text} />
      </Pressable>

      <Pressable
        onPress={onNext}
        style={({ pressed }) => [styles.arrowButton, pressed && styles.pressed]}
        accessibilityRole="button"
        accessibilityLabel="Visa nästa dagar"
      >
        <FontAwesome6 name="chevron-right" size={18} color={colors.text} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  arrows: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  arrowButton: {
    minWidth: 44,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.borderSoft,
  },
  pressed: {
    opacity: 0.6,
  },
});
