import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "../../lib/theme";

type ButtonProps = {
  text: string;
  onPress?: () => void;
  color?: string;
  disabled?: boolean;
  icon?: React.ComponentProps<typeof FontAwesome6>["name"];
  iconPosition?: "left" | "right";
};

export default function Button({
  text,
  onPress,
  color,
  disabled = false,
  icon,
  iconPosition = "left",
}: ButtonProps) {
  const glyph = icon ? (
    <FontAwesome6 name={icon} size={16} color={colors.textOnDark} />
  ) : null;

  return (
    <View style={styles.wrapper}>
      <Pressable
        style={({ pressed }) => [
          styles.button,
          color ? { backgroundColor: color } : null,
          disabled && styles.disabled,
          pressed && !disabled && styles.pressed,
        ]}
        onPress={disabled ? undefined : onPress}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel={text}
        accessibilityState={{ disabled }}
      >
        {iconPosition === "left" && glyph}
        <Text style={styles.label} maxFontSizeMultiplier={1.4} numberOfLines={1}>
          {text}
        </Text>
        {iconPosition === "right" && glyph}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    paddingHorizontal: 24,
  },
  button: {
    backgroundColor: colors.buttonBackground,
    width: "100%",
    maxWidth: 345,
    minHeight: 48,
    borderRadius: 16,
    paddingHorizontal: 16,
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: {
    opacity: 0.7,
  },
  disabled: {
    opacity: 0.35,
  },
  label: {
    fontSize: 16,
    color: colors.textOnDark,
    fontWeight: "600",
  },
});
