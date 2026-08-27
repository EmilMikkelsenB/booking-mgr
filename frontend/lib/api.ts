import { createBookingsApi } from "@booking/backend";
import { supabase } from "./supabase";

export const api = createBookingsApi(supabase);
