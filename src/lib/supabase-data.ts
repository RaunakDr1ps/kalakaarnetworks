import { supabase, isSupabaseConfigured } from "./supabase";
import type { Artist, Venue } from "@/data/mock";

/* ------------------------------------------------------------------ */
/* Supabase row types (match supabase/schema.sql)                     */
/* ------------------------------------------------------------------ */

export interface SupabaseArtist {
  id: string;
  name: string;
  category: string;
  bio: string | null;
  rate: number | null;
  image_url: string | null;
  availability_status: string | null;
  created_at: string | null;
}

export interface SupabaseVenue {
  id: string;
  name: string;
  location: string | null;
  capacity: number | null;
  rate: number | null;
  description: string | null;
  created_at: string | null;
}

export interface SupabaseBooking {
  id: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  type: "artist" | "venue";
  target_id: string;
  event_date: string;
  status: string;
  created_at: string | null;
}

/* ------------------------------------------------------------------ */
/* Profiles / Auth types                                                */
/* ------------------------------------------------------------------ */

export type UserRole = "admin" | "manager" | "artist";

export interface SupabaseProfile {
  id: string;
  email: string | null;
  role: UserRole;
  full_name: string | null;
  created_at: string | null;
}

export interface AuthSession {
  user: {
    id: string;
    email: string | null;
  } | null;
  profile: SupabaseProfile | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isManager: boolean;
  isArtist: boolean;
}

/* ------------------------------------------------------------------ */
/* Auth helpers                                                         */
/* ------------------------------------------------------------------ */

export async function signInWithPassword(email: string, password: string) {
  if (!isSupabaseConfigured || !supabase) {
    return {
      success: false,
      session: null,
      error: new Error("Supabase is not configured."),
    };
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      return { success: false, session: null, error };
    }

    let profile: SupabaseProfile | null = null;
    if (data.user) {
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", data.user.id)
        .single();
      if (!profileError && profileData) {
        profile = profileData as SupabaseProfile;
      }
    }

    return {
      success: true,
      session: {
        user: data.user ? { id: data.user.id, email: data.user.email } : null,
        profile,
        isAuthenticated: !!data.user,
        isAdmin: profile?.role === "admin",
        isManager: profile?.role === "manager",
        isArtist: profile?.role === "artist",
      },
      error: null,
    };
  } catch (error) {
    return { success: false, session: null, error };
  }
}

export async function signOut() {
  if (!isSupabaseConfigured || !supabase) {
    return { success: true, error: null };
  }
  try {
    const { error } = await supabase.auth.signOut();
    return { success: !error, error };
  } catch (error) {
    return { success: false, error };
  }
}

export async function fetchProfile(userId: string): Promise<SupabaseProfile | null> {
  if (!isSupabaseConfigured || !supabase) {
    return null;
  }
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    if (error) {
      console.warn("[supabase] profile fetch failed", error);
      return null;
    }
    return data as SupabaseProfile;
  } catch (error) {
    console.warn("[supabase] profile fetch error", error);
    return null;
  }
}

export async function fetchProfiles(): Promise<SupabaseProfile[]> {
  if (!isSupabaseConfigured || !supabase) {
    return [];
  }
  try {
    const { data, error } = await supabase.from("profiles").select("*").order("created_at", { ascending: true });
    if (error) {
      console.warn("[supabase] profiles fetch failed", error);
      return [];
    }
    return (data ?? []) as SupabaseProfile[];
  } catch (error) {
    console.warn("[supabase] profiles fetch error", error);
    return [];
  }
}

export async function updateProfileRole(userId: string, role: UserRole) {
  if (!isSupabaseConfigured || !supabase) {
    return { success: false, error: new Error("Supabase is not configured.") };
  }
  try {
    const { data, error } = await supabase
      .from("profiles")
      .update({ role })
      .eq("id", userId)
      .select()
      .single();
    return { success: !error, data, error };
  } catch (error) {
    return { success: false, data: null, error };
  }
}

export async function inviteTeamMember(email: string) {
  if (!isSupabaseConfigured || !supabase) {
    return { success: false, error: new Error("Supabase is not configured.") };
  }
  try {
    const { data, error } = await supabase.auth.admin.inviteUserByEmail(email);
    return { success: !error, data, error };
  } catch (error) {
    return { success: false, data: null, error };
  }
}

export type BookingForm = {
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  type: "artist" | "venue";
  targetId: string;
  eventDate: string;
};

export interface ClientBookingView {
  id: string;
  kind: "Artist" | "Venue";
  name: string;
  detail: string;
  date: string;
  venue: string;
  status: string;
  progress: number;
  image: string;
}

export function mapSupabaseBookings(bookings: SupabaseBooking[]): ClientBookingView[] {
  return bookings.map((b) => ({
    id: b.id,
    kind: (b.type === "artist" ? "Artist" : "Venue") as "Artist" | "Venue",
    name: b.client_name,
    detail: `Booking enquiry for ${b.target_id}`,
    date: b.event_date,
    venue: "",
    status: b.status,
    progress: 0,
    image: "/images/event-08.png",
  }));
}

export interface GigView {
  date: string;
  day: string;
  title: string;
  venue: string;
  time: string;
  fee: string;
  status: string;
  image: string;
}

export function mapSupabaseBookingsToGigs(bookings: SupabaseBooking[]): GigView[] {
  return bookings.map((b) => {
    const date = new Date(`${b.event_date}T12:00:00`);
    return {
      date: date.toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
      day: date.toLocaleDateString("en-IN", { weekday: "short" }),
      title: b.client_name,
      venue: "",
      time: "",
      fee: "",
      status: b.status,
      image: "/images/event-08.png",
    };
  });
}

export async function fetchClientBookings(): Promise<ClientBookingView[]> {
  const bookings = await fetchBookings();
  return mapSupabaseBookings(bookings);
}

export async function fetchGigs(): Promise<GigView[]> {
  const bookings = await fetchBookings();
  return mapSupabaseBookingsToGigs(bookings);
}

/* ------------------------------------------------------------------ */
/* Row → UI type mappers                                              */
/* ------------------------------------------------------------------ */

function mapSupabaseArtist(row: SupabaseArtist): Artist {
  const fee = row.rate ?? 150000;
  return {
    id: row.id,
    name: row.name,
    category: (row.category as Artist["category"]) || "Music",
    discipline: row.bio ?? "Performer",
    city: "Patna",
    fee,
    feeLabel: `₹${Math.round(fee / 100000)}L`,
    image: row.image_url ?? "/images/event-08.png",
    blurb: row.bio ?? "Available for bookings through Kalakaar Studios.",
    languages: ["Hindi", "English"],
    setLength: "60 min",
    draw: "1,000 cap",
    unavailable: [],
  };
}

function mapSupabaseVenue(row: SupabaseVenue): Venue {
  const fee = row.rate ?? 100000;
  return {
    id: row.id,
    name: row.name,
    city: row.location ?? "Patna",
    area: row.location ?? "Patna",
    capacity: row.capacity ?? 500,
    capacityLabel: `${row.capacity ?? 500} seated`,
    type: row.description ?? "Event space",
    fee,
    feeLabel: `₹${Math.round(fee / 100000)}L / day`,
    image: "/images/event-08.png",
    blurb: row.description ?? "A versatile event space.",
    specs: [],
    unavailable: [],
  };
}

/* ------------------------------------------------------------------ */
/* Reads                                                              */
/* ------------------------------------------------------------------ */

export async function fetchArtists(): Promise<Artist[]> {
  if (!isSupabaseConfigured || !supabase) {
    return [];
  }
  try {
    const { data, error } = await supabase
      .from("artists")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      console.warn("[supabase] artists fetch failed", error);
      return [];
    }
    return (data ?? []).map(mapSupabaseArtist);
  } catch (error) {
    console.warn("[supabase] artists fetch error", error);
    return [];
  }
}

export async function fetchVenues(): Promise<Venue[]> {
  if (!isSupabaseConfigured || !supabase) {
    return [];
  }
  try {
    const { data, error } = await supabase
      .from("venues")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      console.warn("[supabase] venues fetch failed", error);
      return [];
    }
    return (data ?? []).map(mapSupabaseVenue);
  } catch (error) {
    console.warn("[supabase] venues fetch error", error);
    return [];
  }
}

export async function fetchBookings(): Promise<SupabaseBooking[]> {
  if (!isSupabaseConfigured || !supabase) {
    return [];
  }
  try {
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      console.warn("[supabase] bookings fetch failed", error);
      return [];
    }
    return (data ?? []) as SupabaseBooking[];
  } catch (error) {
    console.warn("[supabase] bookings fetch error", error);
    return [];
  }
}

/* ------------------------------------------------------------------ */
/* Writes                                                             */
/* ------------------------------------------------------------------ */

export async function insertBooking(booking: BookingForm) {
  const payload = {
    client_name: booking.clientName,
    client_email: booking.clientEmail,
    client_phone: booking.clientPhone,
    type: booking.type,
    target_id: booking.targetId,
    event_date: booking.eventDate,
    status: "new",
  };

  if (!isSupabaseConfigured || !supabase) {
    return { success: false, data: null, error: new Error("Supabase is not configured.") };
  }

  try {
    const { data, error } = await supabase
      .from("bookings")
      .insert([payload])
      .select()
      .single();
    return { success: !error, data, error };
  } catch (error) {
    return { success: false, data: null, error };
  }
}

export interface ArtistApplication {
  id: string;
  name: string;
  stage_name: string | null;
  category: string;
  location: string | null;
  travel_availability: string | null;
  rate: number | null;
  description: string | null;
  portfolio_links: string | null;
  contact_email: string;
  contact_phone: string | null;
  availability_status: string | null;
  created_at: string | null;
}

export async function insertArtistApplication(application: {
  fullName: string;
  stageName: string;
  category: string;
  location: string;
  travelAvailability: string;
  rate: number;
  bio: string;
  portfolioLinks: string;
  contactEmail: string;
  contactPhone: string;
}) {
  const slugBase = (application.stageName || application.fullName)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  const payload: Partial<ArtistApplication> = {
    id: slugBase,
    name: application.fullName,
    stage_name: application.stageName || null,
    category: application.category,
    location: application.location || null,
    travel_availability: application.travelAvailability || null,
    rate: application.rate || null,
    description: application.bio || null,
    portfolio_links: application.portfolioLinks || null,
    contact_email: application.contactEmail,
    contact_phone: application.contactPhone || null,
    availability_status: "pending",
  };

  if (!isSupabaseConfigured || !supabase) {
    return { success: false, data: null, error: new Error("Supabase is not configured.") };
  }

  try {
    const { data, error } = await supabase
      .from("artists")
      .insert([payload])
      .select()
      .single();
    return { success: !error, data, error };
  } catch (error) {
    return { success: false, data: null, error };
  }
}
