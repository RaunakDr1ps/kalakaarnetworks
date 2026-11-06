import { supabase, isSupabaseConfigured } from "./supabase";
import type { Artist, Venue } from "@/data/mock";

/* ------------------------------------------------------------------ */
/* Supabase row types (match supabase/schema.sql)                     */
/* ------------------------------------------------------------------ */

export interface SupabaseArtist {
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
    discipline: row.description ?? "Performer",
    city: row.location ?? "Patna",
    fee,
    feeLabel: `₹${Math.round(fee / 100000)}L`,
    image: row.portfolio_links ?? "/images/event-08.png",
    blurb: row.description ?? "Available for bookings through Kalakaar Studios.",
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

/* ------------------------------------------------------------------ */
/* Admin metrics / charts / production board                          */
/* ------------------------------------------------------------------ */

export interface AdminMetrics {
  bookableValue: number;
  collected: number;
  openVenueRequests: number;
  leadConversion: number;
  totalBookings: number;
  confirmedBookings: number;
}

export interface MonthlyRevenue {
  month: string;
  booked: number;
  collected: number;
}

export interface ProductionBoardItem {
  id: string;
  time: string;
  title: string;
  detail: string;
  status: string;
  icon: string;
  eventDate: string;
  client_name: string;
  type: string;
  target_id: string;
  event_date: string;
}

export async function fetchAdminMetrics(): Promise<AdminMetrics> {
  if (!isSupabaseConfigured || !supabase) {
    return {
      bookableValue: 0,
      collected: 0,
      openVenueRequests: 0,
      leadConversion: 0,
      totalBookings: 0,
      confirmedBookings: 0,
    };
  }
  try {
    const { data, error } = await supabase
      .from("bookings")
      .select("status, booking_amount, payment_status, event_date");
    if (error) {
      console.warn("[supabase] admin metrics fetch failed", error);
      return {
        bookableValue: 0,
        collected: 0,
        openVenueRequests: 0,
        leadConversion: 0,
        totalBookings: 0,
        confirmedBookings: 0,
      };
    }
    const bookings = (data ?? []) as Array<{
      status: string;
      booking_amount: number | null;
      payment_status: string | null;
      event_date: string;
    }>;

    const totalBookings = bookings.length;
    const confirmedBookings = bookings.filter(
      (b) => b.status === "confirmed" || b.status === "approved"
    ).length;

    const bookableValue = bookings.reduce(
      (sum, b) => sum + (Number(b.booking_amount) || 0),
      0
    );

    const collected = bookings.reduce(
      (sum, b) =>
        sum + (b.payment_status === "paid" ? Number(b.booking_amount) || 0 : 0),
      0
    );

    const openVenueRequests = bookings.filter(
      (b) => b.status === "pending"
    ).length;

    const leadConversion =
      totalBookings > 0 ? Math.round((confirmedBookings / totalBookings) * 100) : 0;

    return {
      bookableValue,
      collected,
      openVenueRequests,
      leadConversion,
      totalBookings,
      confirmedBookings,
    };
  } catch (error) {
    console.warn("[supabase] admin metrics fetch error", error);
    return {
      bookableValue: 0,
      collected: 0,
      openVenueRequests: 0,
      leadConversion: 0,
      totalBookings: 0,
      confirmedBookings: 0,
    };
  }
}

export async function fetchMonthlyRevenue(): Promise<MonthlyRevenue[]> {
  if (!isSupabaseConfigured || !supabase) {
    return [];
  }
  try {
    const { data, error } = await supabase
      .from("bookings")
      .select("status, booking_amount, payment_status, event_date, created_at");
    if (error) {
      console.warn("[supabase] monthly revenue fetch failed", error);
      return [];
    }
    const bookings = (data ?? []) as Array<{
      status: string;
      booking_amount: number | null;
      payment_status: string | null;
      event_date: string;
      created_at: string;
    }>;

    const monthly: Record<string, { booked: number; collected: number }> = {};

    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = d.toLocaleDateString("en-IN", { month: "short" });
      monthly[key] = { booked: 0, collected: 0 };
    }

    bookings.forEach((b) => {
      const eventDate = new Date(b.event_date);
      const key = eventDate.toLocaleDateString("en-IN", { month: "short" });
      const amount = Number(b.booking_amount) || 0;
      if (monthly[key]) {
        monthly[key].booked += amount;
        if (b.payment_status === "paid") {
          monthly[key].collected += amount;
        }
      }
    });

    return Object.entries(monthly).map(([month, vals]) => ({
      month,
      booked: vals.booked,
      collected: vals.collected,
    }));
  } catch (error) {
    console.warn("[supabase] monthly revenue fetch error", error);
    return [];
  }
}

export async function fetchProductionBoard(): Promise<ProductionBoardItem[]> {
  if (!isSupabaseConfigured || !supabase) {
    return [];
  }
  try {
    const today = new Date().toISOString().split("T")[0];
    const { data, error } = await supabase
      .from("bookings")
      .select("id, client_name, target_id, type, event_date, status")
      .gte("event_date", today)
      .order("event_date", { ascending: true })
      .limit(8);
    if (error) {
      console.warn("[supabase] production board fetch failed", error);
      return [];
    }
    const bookings = (data ?? []) as Array<{
      id: string;
      client_name: string;
      target_id: string;
      type: string;
      event_date: string;
      status: string;
    }>;

    const iconMap: Record<string, string> = {
      artist: "mic",
      venue: "building",
    };

    const statusMap: Record<string, string> = {
      new: "Pending",
      confirmed: "Confirmed",
      pending: "Pending",
      approved: "Approved",
      declined: "Declined",
    };

    return bookings.map((b) => {
      const eventDate = new Date(b.event_date);
      const hours = eventDate.getHours().toString().padStart(2, "0");
      const minutes = eventDate.getMinutes().toString().padStart(2, "0");
      return {
        id: b.id,
        time: `${hours}:${minutes}`,
        title: b.client_name,
        detail: `${b.type === "artist" ? "Artist" : "Venue"} · ${b.target_id}`,
        status: statusMap[b.status] || b.status,
        icon: iconMap[b.type] || "ticket",
        eventDate: b.event_date,
        client_name: b.client_name,
        type: b.type,
        target_id: b.target_id,
        event_date: b.event_date,
      };
    });
  } catch (error) {
    console.warn("[supabase] production board fetch error", error);
    return [];
  }
}

/* ------------------------------------------------------------------ */
/* Artist applications review desk                                    */
/* ------------------------------------------------------------------ */

export async function fetchPendingArtists(): Promise<SupabaseArtist[]> {
  if (!isSupabaseConfigured || !supabase) {
    return [];
  }
  try {
    const { data, error } = await supabase
      .from("artists")
      .select("*")
      .eq("availability_status", "pending")
      .order("created_at", { ascending: true });
    if (error) {
      console.warn("[supabase] pending artists fetch failed", error);
      return [];
    }
    return (data ?? []) as SupabaseArtist[];
  } catch (error) {
    console.warn("[supabase] pending artists fetch error", error);
    return [];
  }
}

export async function updateArtistAvailability(artistId: string, status: "available" | "rejected") {
  if (!isSupabaseConfigured || !supabase) {
    return { success: false, error: new Error("Supabase is not configured.") };
  }
  try {
    const { data, error } = await supabase
      .from("artists")
      .update({ availability_status: status })
      .eq("id", artistId)
      .select()
      .single();
    return { success: !error, data, error };
  } catch (error) {
    return { success: false, data: null, error };
  }
}
