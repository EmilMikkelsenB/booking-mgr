import { useEffect, useState } from "react";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { BackHandler, Pressable, StyleSheet, Text, View } from "react-native";
import type { Room } from "@booking/backend";
import ButtonSmall from "./button-small";
import { colors } from "../../lib/theme";

type DropdownProps = {
  options: Room[];
  value: Room[];
  onChange: (value: Room[]) => void;
};

export default function Dropdown({ options, value, onChange }: DropdownProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      setOpen(false);
      return true;
    });
    return () => sub.remove();
  }, [open]);

  function toggle(room: Room) {
    if (value.some((r) => r.id === room.id)) {
      onChange(value.filter((r) => r.id !== room.id));
    } else {
      onChange([...value, room]);
    }
  }

  const label =
    value.length === 0
      ? "Alla rum"
      : value.length === 1
        ? value[0].name
        : `${value.length} rum`;

  return (
    <View style={styles.container}>
      {open && (
        <Pressable
          style={styles.backdrop}
          onPress={() => setOpen(false)}
          accessibilityLabel="Stäng rumsfilter"
        />
      )}

      <Pressable
        onPress={() => setOpen(!open)}
        style={styles.trigger}
        accessibilityRole="button"
        accessibilityLabel={`Filtrera rum, valt: ${label}`}
        accessibilityState={{ expanded: open }}
      >
        <View style={styles.triggerRow}>
          <Text style={styles.triggerText} numberOfLines={1}>
            {label}
          </Text>
          <FontAwesome6
            name={open ? "chevron-up" : "chevron-down"}
            size={14}
            color={colors.buttonBackground}
          />
        </View>
      </Pressable>

      {open && (
        <View style={styles.list}>
          {options.map((room) => {
            const checked = value.some((r) => r.id === room.id);
            return (
              <Pressable
                key={room.id}
                style={styles.row}
                onPress={() => toggle(room)}
                accessibilityRole="checkbox"
                accessibilityState={{ checked }}
                accessibilityLabel={`${room.name}, ${room.capacity} personer`}
              >
                <Text style={styles.rowText} numberOfLines={2}>
                  {room.name} ({room.capacity} Personer)
                </Text>
                <View style={styles.checkbox}>
                  {checked && <Text style={styles.checkmark}>✓</Text>}
                </View>
              </Pressable>
            );
          })}

          <View style={styles.actions}>
            <View style={styles.actionCell}>
              <ButtonSmall text="Välj" onPress={() => setOpen(false)} />
            </View>
            <View style={styles.actionCell}>
              <ButtonSmall
                text="Avmarkera"
                onPress={() => onChange([])}
                color={colors.buttonBackgroundMuted}
              />
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  actions: {
    flexDirection: "row",
    gap: 8,
    marginTop: 24,
  },
  actionCell: {
    flex: 1,
  },
  container: {
    zIndex: 10,
  },
  backdrop: {
    position: "absolute",
    top: -2000,
    bottom: -2000,
    left: -2000,
    right: -2000,
  },
  trigger: {
    alignSelf: "flex-start",
    paddingHorizontal: 16,
    paddingVertical: 10,
    minHeight: 44,
    justifyContent: "center",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    minWidth: 164,
    maxWidth: "100%",
    backgroundColor: colors.background,
  },
  triggerText: {
    flexShrink: 1,
    color: colors.buttonBackground,
    fontWeight: "600",
  },
  triggerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  list: {
    position: "absolute",
    left: 0,
    right: 0,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    overflow: "hidden",
    elevation: 4,
    paddingHorizontal: 16,
    paddingVertical: 16,
    bottom: "100%",
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    minHeight: 48,
  },
  rowText: {
    flexShrink: 1,
    fontSize: 16,
    color: colors.text,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  checkmark: {
    color: colors.accentDark,
    fontSize: 15,
    fontWeight: "700",
    lineHeight: 18,
  },
});
