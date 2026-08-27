import type { SupabaseClient } from "@supabase/supabase-js";
import type { Booking, NewBooking, Room } from "./types";

export class BookingConflictError extends Error {
  constructor(public readonly conflicts: Booking[]) {
    super("That room is already booked for part of this time.");
    this.name = "BookingConflictError";
  }
}

export function createBookingsApi(db: SupabaseClient) {
  async function findConflicts(
    roomId: string,
    startsAt: Date,
    endsAt: Date,
  ): Promise<Booking[]> {
    const { data, error } = await db
      .from("bookings")
      .select("*")
      .eq("room_id", roomId)
      .lt("starts_at", endsAt.toISOString())
      .gt("ends_at", startsAt.toISOString());

    if (error) throw error;
    return data;
  }

  return {
    async listRooms(): Promise<Room[]> {
      const { data, error } = await db.from("rooms").select("*").order("name");
      if (error) throw error;
      return data;
    },

    async listBookings(
      roomId: string,
      dayStart: Date,
      dayEnd: Date,
    ): Promise<Booking[]> {
      const { data, error } = await db
        .from("bookings")
        .select("*")
        .eq("room_id", roomId)
        .lt("starts_at", dayEnd.toISOString())
        .gt("ends_at", dayStart.toISOString())
        .order("starts_at");

      if (error) throw error;
      return data;
    },

    findConflicts,

    async createBooking(input: NewBooking): Promise<Booking> {
      const conflicts = await findConflicts(
        input.room_id,
        new Date(input.starts_at),
        new Date(input.ends_at),
      );

      if (conflicts.length > 0) {
        throw new BookingConflictError(conflicts);
      }

      const { data, error } = await db.from("bookings").insert(input).select().single();

      if (error) throw error;
      return data;
    },
  };
}
