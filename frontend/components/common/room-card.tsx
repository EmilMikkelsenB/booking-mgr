import { Pressable, StyleSheet, Text } from "react-native";
import { colors } from "../../lib/theme";

type RoomCardProps = {
  name: string;
  capacity: number | null;
  time: string;
  onPress: () => void;
  booked?: boolean;
  selected?: boolean;
};

export default function RoomCard({
  name,
  capacity,
  time,
  onPress,
  booked = false,
  selected = false,
}: RoomCardProps) {
  const title = `${name} (${capacity ?? "–"})`;
  const textState = [booked && styles.mutedText, selected && styles.selectedText];

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        booked && styles.cardBooked,
        selected && styles.cardSelected,
        pressed && !booked && styles.pressed,
      ]}
      onPress={booked ? undefined : onPress}
      disabled={booked}
      accessibilityRole="button"
      accessibilityLabel={
        booked ? `${title}, ${time}, redan bokad` : `${title}, ${time}`
      }
      accessibilityState={{ selected, disabled: booked }}
    >
      <Text
        style={[styles.roomName, textState]}
        numberOfLines={2}
        maxFontSizeMultiplier={1.6}
      >
        {title}
      </Text>

      <Text
        style={[styles.time, textState]}
        numberOfLines={1}
        maxFontSizeMultiplier={1.6}
      >
        {time}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.accent,
    borderRadius: 12,
    padding: 10,
    minHeight: 56,
    justifyContent: "center",
  },
  cardBooked: {
    backgroundColor: colors.bookedBackground,
    borderColor: colors.borderSoft,
  },
  cardSelected: {
    backgroundColor: colors.accentDark,
    borderColor: colors.accentDark,
  },
  pressed: {
    opacity: 0.7,
  },
  selectedText: {
    color: colors.textOnDark,
  },
  roomName: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.text,
  },
  mutedText: {
    color: colors.textMuted,
  },
  time: {
    fontSize: 12,
    color: colors.text,
    marginTop: 4,
  },
});
