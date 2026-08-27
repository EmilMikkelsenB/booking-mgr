import { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import {
  AccessibilityInfo,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { api } from "../lib/api";
import Button from "./common/button";
import { colors } from "../lib/theme";
import ButtonSmall from "./common/button-small";

const DISMISS_MS = 3000;

export default function Confirm() {
  const [bookedName, setBookedName] = useState("");
  const [saving, setSaving] = useState(false);
  const [booked, setBooked] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { slot } = useLocalSearchParams<{ slot?: string }>();

  const name = bookedName.trim();
  const canBook = name.length > 0 && !!slot && !saving;

  useEffect(() => {
    let cancelled = false;
    AccessibilityInfo.isReduceMotionEnabled().then((on) => {
      if (!cancelled) setReduceMotion(on);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  async function book() {
    if (!canBook || !slot) return;

    const [startsAt, roomId] = slot.split("|");
    const endsAt = new Date(new Date(startsAt).getTime() + 60 * 60 * 1000);

    setSaving(true);
    try {
      await api.createBooking({
        room_id: roomId,
        booked_name: name,
        starts_at: startsAt,
        ends_at: endsAt.toISOString(),
      });
      setBooked(true);
    } catch {
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
    if (!booked) return;
    const timer = setTimeout(() => router.replace("/"), DISMISS_MS);
    return () => clearTimeout(timer);
  }, [booked, router]);

  return (
    <KeyboardAvoidingView
      style={[
        styles.container,
        {
          paddingTop: insets.top,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        },
      ]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
        <Text style={styles.title} maxFontSizeMultiplier={1.3} numberOfLines={2}>
          Vem Bokar?
        </Text>

        <View style={styles.field}>
          <Text style={styles.label} maxFontSizeMultiplier={1.6}>
            Förnamn och efternamn
          </Text>
          <TextInput
            style={styles.input}
            onChangeText={setBookedName}
            value={bookedName}
            placeholder="Ditt namn"
            placeholderTextColor={colors.textMuted}
            autoComplete="name"
            textContentType="name"
            autoCapitalize="words"
            autoCorrect={false}
            returnKeyType="done"
            onSubmitEditing={book}
            accessibilityLabel="Förnamn och efternamn"
          />
        </View>
      </ScrollView>

      <View style={[styles.buttonWrapper, { paddingBottom: insets.bottom + 24 }]}>
        <View style={styles.buttonCell}>
          <ButtonSmall
            text="Tillbaka"
            icon="chevron-left"
            color={colors.buttonBackgroundMuted}
            disabled={saving}
            onPress={() => router.back()}
          />
        </View>
        <View style={styles.buttonCell}>
          <ButtonSmall
            text={saving ? "Bokar…" : "Boka"}
            icon="check"
            disabled={!canBook}
            onPress={book}
          />
        </View>
      </View>

      <Modal
        visible={booked}
        transparent
        animationType={reduceMotion ? "none" : "fade"}
        onRequestClose={() => router.replace("/")}
      >
        <Pressable
          style={styles.overlay}
          onPress={() => router.replace("/")}
          accessibilityLabel="Stäng bekräftelse"
        >
          <View style={styles.dialog}>
            <FontAwesome6 name="circle-check" size={28} color={colors.accentDark} />
            <Text style={styles.dialogTitle} maxFontSizeMultiplier={1.4}>
              Ditt rum är bokat!
            </Text>
            <Text style={styles.dialogText} numberOfLines={2}>
              {name}
            </Text>
          </View>
        </Pressable>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flexGrow: 1,
    paddingBottom: 24,
  },
  title: {
    fontSize: 48,
    color: colors.text,
    marginTop: 24,
    marginHorizontal: 24,
  },
  field: {
    marginTop: 40,
    marginHorizontal: 24,
    gap: 8,
  },
  label: {
    fontSize: 20,
    color: colors.text,
  },
  input: {
    alignSelf: "stretch",
    maxWidth: 345,
    fontSize: 16,
    minHeight: 48,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    color: colors.text,
  },
  overlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: colors.overlay,
  },
  dialog: {
    width: "100%",
    maxWidth: 320,
    minHeight: 137,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 24,
    backgroundColor: colors.background,
    borderRadius: 16,
  },
  dialogTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: colors.text,
    textAlign: "center",
  },
  dialogText: {
    fontSize: 16,
    color: colors.textFaint,
    textAlign: "center",
  },
  buttonWrapper: {
    paddingTop: 12,
    paddingHorizontal: 24,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  buttonCell: {
    flex: 1,
    maxWidth: 145,
  },
});
