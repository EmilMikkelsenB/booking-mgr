import { useState } from "react";
import { useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { Room } from "@booking/backend";
import { useSchedule } from "../lib/useSchedule";
import Button from "./common/button";
import Dropdown from "./common/dropdown";
import DateArrows from "./date-arrows";
import DateRange from "./date-range";
import Table from "./table";
import { colors } from "../lib/theme";

export default function Booking() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const schedule = useSchedule();

  const [selected, setSelected] = useState<string | null>(null);
  const [roomFilter, setRoomFilter] = useState<Room[]>([]);

  const visibleRooms = roomFilter.length ? roomFilter : schedule.rooms;

  function changeView(apply: () => void) {
    apply();
    setSelected(null);
  }

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
      <Text style={styles.title} maxFontSizeMultiplier={1.3} numberOfLines={2}>
        Välj tid
      </Text>

      <View style={styles.dateWrapper}>
        <DateRange days={schedule.days} />
      </View>
      <Table
        days={schedule.days}
        rooms={visibleRooms}
        bookings={schedule.bookings}
        loading={schedule.loading}
        selected={selected}
        onSelect={setSelected}
      />
      <View style={styles.controls}>
        <View style={styles.roomPicker}>
          <Dropdown
            options={schedule.rooms}
            value={roomFilter}
            onChange={(rooms) => changeView(() => setRoomFilter(rooms))}
          />
        </View>
        <DateArrows
          onPrevious={() => changeView(schedule.showPreviousDays)}
          onNext={() => changeView(schedule.showNextDays)}
        />
      </View>
      <View style={[styles.footer, { paddingBottom: insets.bottom + 24 }]}>
        <Button
          text="Nästa"
          icon="arrow-right"
          iconPosition="right"
          disabled={!selected}
          onPress={() =>
            router.push({ pathname: "/confirm", params: { slot: selected } })
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 48,
    color: colors.text,
    marginTop: 8,
    marginHorizontal: 24,
  },
  dateWrapper: {
    marginTop: 24,
    marginBottom: 16,
    marginHorizontal: 24,
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginTop: 24,
    marginHorizontal: 24,
    zIndex: 10,
  },
  roomPicker: {
    flex: 1,
  },
  footer: {
    paddingTop: 12,
  },
});
