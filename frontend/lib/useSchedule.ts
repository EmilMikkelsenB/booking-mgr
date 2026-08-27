import { useEffect, useMemo, useState } from "react";
import type { Booking, Room } from "@booking/backend";
import { api } from "./api";

const DAYS_SHOWN = 3;
const CLOSE_HOUR = 17;

export function useSchedule() {
  const [startDay, setStartDay] = useState(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  });
  const [rooms, setRooms] = useState<Room[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const days = useMemo(
    () =>
      Array.from({ length: DAYS_SHOWN }, (_, offset) => {
        const day = new Date(startDay);
        day.setDate(day.getDate() + offset);
        return day;
      }),
    [startDay],
  );

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const roomList = await api.listRooms();

        const windowEnd = new Date(days[days.length - 1]);
        windowEnd.setHours(CLOSE_HOUR, 0, 0, 0);

        const perRoom = await Promise.all(
          roomList.map((room) => api.listBookings(room.id, days[0], windowEnd)),
        );

        if (cancelled) return;
        setRooms(roomList);
        setBookings(perRoom.flat());
      } catch {
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [days]);

  function shiftDays(amount: number) {
    setStartDay((current) => {
      const next = new Date(current);
      next.setDate(next.getDate() + amount);
      return next;
    });
  }

  return {
    days,
    rooms,
    bookings,
    loading,
    showPreviousDays: () => shiftDays(-DAYS_SHOWN),
    showNextDays: () => shiftDays(DAYS_SHOWN),
  };
}
