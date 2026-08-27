import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import type { Booking, Room } from "@booking/backend";
import RoomCard from "./common/room-card";
import { colors } from "../lib/theme";

const OPEN_HOUR = 8;
const CLOSE_HOUR = 17;
const HOUR_MS = 60 * 60 * 1000;

const hours = Array.from({ length: CLOSE_HOUR - OPEN_HOUR }, (_, i) => OPEN_HOUR + i);

function isBooked(bookings: Booking[], roomId: string, start: Date): boolean {
  const end = new Date(start.getTime() + HOUR_MS);
  return bookings.some(
    (b) =>
      b.room_id === roomId &&
      new Date(b.starts_at) < end &&
      new Date(b.ends_at) > start,
  );
}

type TableProps = {
  days: Date[];
  rooms: Room[];
  bookings: Booking[];
  loading: boolean;
  selected: string | null;
  onSelect: (key: string) => void;
};

export default function Table({
  days,
  rooms,
  bookings,
  loading,
  selected,
  onSelect,
}: TableProps) {
  return (
    <View style={styles.table}>
      <View style={styles.headerRow}>
        {days.map((day, i) => (
          <View
            key={i}
            style={[styles.column, styles.headerCell, i > 0 && styles.divider]}
          >
            <Text style={styles.headerText} maxFontSizeMultiplier={1.6}>
              {day.getDate()}/{day.getMonth() + 1}
            </Text>
          </View>
        ))}
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator />
        </View>
      ) : rooms.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.stateTitle}>Inga rum att visa</Text>
          <Text style={styles.stateText}>Försök igen senare.</Text>
        </View>
      ) : (
        <ScrollView>
          <View style={styles.body}>
            {days.map((day, i) => (
              <View key={i} style={[styles.column, i > 0 && styles.divider]}>
                {hours.map((hour) => {
                  const start = new Date(day);
                  start.setHours(hour, 0, 0, 0);
                  return rooms.map((room) => {
                    const key = `${start.toISOString()}|${room.id}`;
                    return (
                      <RoomCard
                        key={key}
                        name={room.name}
                        capacity={room.capacity}
                        time={`${hour}:00–${hour + 1}:00`}
                        booked={isBooked(bookings, room.id, start)}
                        selected={selected === key}
                        onPress={() => onSelect(key)}
                      />
                    );
                  });
                })}
              </View>
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  table: {
    flex: 1,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    overflow: "hidden",
    marginHorizontal: 24,
    marginTop: "auto",
    maxHeight: 400,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 24,
  },
  stateTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    textAlign: "center",
  },
  stateText: {
    fontSize: 14,
    color: colors.textFaint,
    textAlign: "center",
  },
  headerRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerCell: {
    paddingVertical: 12,
  },
  headerText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.text,
    textAlign: "center",
  },
  body: {
    flexDirection: "row",
  },
  column: {
    flex: 1,
    minWidth: 0,
    paddingHorizontal: 6,
    paddingVertical: 6,
    gap: 8,
  },
  divider: {
    borderLeftWidth: 1,
    borderLeftColor: colors.border,
  },
});
