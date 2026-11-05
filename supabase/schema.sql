-- ============================================================================
-- Supabase Schema for Kalakaar Studios
-- Run these statements in the Supabase Dashboard → SQL Editor.
-- ============================================================================

-- Core tables: artists, venues, bookings
create table if not exists artists (
  id text primary key,
  name text not null,
  stage_name text,
  category text not null,
  location text,
  travel_availability text,
  rate integer,
  description text,
  portfolio_links text,
  contact_email text not null,
  contact_phone text,
  status text default 'pending',
  created_at timestamptz default now()
);

create table if not exists venues (
  id text primary key,
  name text not null,
  location text,
  capacity integer,
  rate integer,
  description text,
  created_at timestamptz default now()
);

create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  client_name text not null,
  client_email text not null,
  client_phone text,
  type text check (type in ('artist', 'venue')),
  target_id text not null,
  event_date date not null,
  status text default 'new',
  created_at timestamptz default now()
);

-- Optional: enable realtime subscriptions on the core tables
-- alter publication supabase_realtime add table artists, venues, bookings;

-- Row Level Security (demo-friendly public policies; tighten for production)
alter table artists enable row level security;
alter table venues enable row level security;
alter table bookings enable row level security;

create policy "Public read artists" on artists for select using (true);
create policy "Public read venues" on venues for select using (true);
create policy "Public read bookings" on bookings for select using (true);
create policy "Public insert bookings" on bookings for insert with check (true);

-- Seed data mirroring the demo roster (run once after creating the tables)
insert into artists (id, name, stage_name, category, location, travel_availability, rate, description, portfolio_links, contact_email, contact_phone, status) values
  ('ananya-rao', 'Ananya Rao', null, 'Comedy', 'Patna', 'Patna, Ranchi', 180000, 'Sharp, bilingual stand-up about small-town ambition.', null, 'ananya@example.com', '+91 98765 43210', 'available'),
  ('sufi-cartel', 'The Sufi Cartel', 'The Sufi Cartel', 'Music', 'Delhi', 'Delhi, Kolkata, Mumbai', 320000, 'Seven musicians, one long night. Qawwali roots through brass, bass and live ambient rig.', null, 'sufi@example.com', '+91 98765 43210', 'available'),
  ('raghav-mehra', 'Raghav Mehra', null, 'Music', 'Mumbai', 'Mumbai, Pune, Goa', 240000, 'A voice built for rooms with bad air conditioning and good acoustics.', null, 'raghav@example.com', '+91 98765 43210', 'available'),
  ('nrityagram-collective', 'Nrityagram Collective', null, 'Dance', 'Bengaluru', 'Bengaluru, Chennai, Hyderabad', 145000, 'Six dancers moving between Bharatanatyam grammar and contemporary floorwork.', null, 'nrityagram@example.com', '+91 98765 43210', 'available'),
  ('kabir-night-shift', 'Kabir & The Night Shift', null, 'Music', 'Kolkata', 'Kolkata, Delhi, Mumbai', 110000, 'Piano, upright bass, brushed drums and a saxophone that knows when to leave.', null, 'kabir@example.com', '+91 98765 43210', 'available'),
  ('meera-vashisht', 'Meera Vashisht', null, 'Spoken Word', 'Jaipur', 'Jaipur, Delhi, Lucknow', 75000, 'Stories from family albums and railway platforms, told with a poet is timing.', null, 'meera@example.com', '+91 98765 43210', 'available'),
  ('tara-electronica', 'Tara Electronica', null, 'Electronic', 'Goa', 'Goa, Mumbai, Bengaluru', 160000, 'A live modular set that starts at a simmer and ends somewhere near sunrise.', null, 'tara@example.com', '+91 98765 43210', 'available'),
  ('bhaav-theatre', 'Bhaav Theatre', null, 'Theatre', 'Lucknow', 'Lucknow, Patna, Delhi', 90000, 'A five-actor ensemble staging new Hindi writing.', null, 'bhaav@example.com', '+91 98765 43210', 'available')
on conflict (id) do nothing;

insert into venues (id, name, location, capacity, rate, description) values
  ('urja-auditorium', 'Urja Auditorium', 'Patna · Fraser Road', 1200, 125000, 'A 1970s auditorium with a 42-foot proscenium, newly rebuilt sound and a balcony that makes a laugh land twice.'),
  ('old-mill', 'The Old Mill', 'Patna · Bailey Road', 600, 85000, 'Raw brick, 24-foot ceilings and a loading bay wide enough for a truck. Built for gigs that want to feel found, not furnished.'),
  ('maurya-hall-a', 'Maurya Lok · Hall A', 'Patna · Maurya Lok', 450, 70000, 'A polished, column-free hall for launches, keynotes and award nights. Rigging points are mapped and waiting.'),
  ('garden-five-seasons', 'Garden of Five Seasons', 'Ranchi · Kanke Road', 300, 95000, 'A lawn under old mango trees for weddings, readings and long lunches. We handle the weather plan, you handle the guest list.')
on conflict (id) do nothing;
