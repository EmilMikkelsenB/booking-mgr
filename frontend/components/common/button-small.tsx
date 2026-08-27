import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { Pressable, StyleSheet, Text } from "react-native";
import { colors } from "../../lib/theme";

type ButtonProps = {
  text: string;
  onPress?: () => void;
  color?: string;
  icon?: React.ComponentProps<typeof FontAwesome6>["name"];
  disabled?: boolean;
};

export default function ButtonSmall({
  text,
  onPress,
  color,
  icon,
  disabled = false,
}: ButtonProps) {
  return (
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
      {icon && <FontAwesome6 name={icon} size={14} color={colors.textOnDark} />}
      <Text style={styles.label} maxFontSizeMultiplier={1.4} numberOfLines={1}>
        {text}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.buttonBackground,
    alignSelf: "stretch",
    maxWidth: 145,
    minHeight: 48,
    borderRadius: 16,
    paddingHorizontal: 12,
    flexDirection: "row",
    gap: 8,
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
