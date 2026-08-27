import { StyleSheet, Text, View } from "react-native";
import { colors } from "../lib/theme";

type DateRangeProps = {
  days: Date[];
};

function format(day: Date): string {
  const month = day.toLocaleDateString(undefined, { month: "short" });
  return `${day.getDate()} ${month.toLowerCase()}`;
}

export default function DateRange({ days }: DateRangeProps) {
  return (
    <View style={styles.row}>
      <Text style={styles.range} numberOfLines={1} maxFontSizeMultiplier={1.6}>
        {format(days[0])} – {format(days[days.length - 1])}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  range: {
    flexShrink: 1,
    fontSize: 16,
    color: colors.text,
  },
});
