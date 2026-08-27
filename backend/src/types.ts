export interface Room {
  id: string;
  name: string;
  capacity: number | null;
}

export interface Booking {
  id: string;
  room_id: string;
  booked_name: string;
  starts_at: string;
  ends_at: string;
  created_at: string;
}

export type NewBooking = Pick<
  Booking,
  "room_id" | "booked_name" | "starts_at" | "ends_at"
>;
