-- ============================================================================
-- Supabase Schema for Kalakaar Studios
-- Run these statements in the Supabase Dashboard → SQL Editor.
-- ============================================================================

-- Core tables: artists, venues, bookings
create table if not exists artists (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  bio text,
  rate integer,
  image_url text,
  availability_status text default 'available',
  created_at timestamptz default now()
);

create table if not exists venues (
  id uuid primary key default gen_random_uuid(),
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
insert into artists (id, name, category, bio, rate, image_url, availability_status) values
  ('ananya-rao', 'Ananya Rao', 'Comedy', 'Sharp, bilingual stand-up about small-town ambition.', 180000, '/images/event-08.png', 'available'),
  ('sufi-cartel', 'The Sufi Cartel', 'Music', 'Seven musicians, one long night. Qawwali roots through brass, bass and live ambient rig.', 320000, '/images/event-06.png', 'available'),
  ('raghav-mehra', 'Raghav Mehra', 'Music', 'A voice built for rooms with bad air conditioning and good acoustics.', 240000, '/images/event-01.png', 'available'),
  ('nrityagram-collective', 'Nrityagram Collective', 'Dance', 'Six dancers moving between Bharatanatyam grammar and contemporary floorwork.', 145000, '/images/event-04.png', 'available'),
  ('kabir-night-shift', 'Kabir & The Night Shift', 'Music', 'Piano, upright bass, brushed drums and a saxophone that knows when to leave.', 110000, '/images/event-03.png', 'available'),
  ('meera-vashisht', 'Meera Vashisht', 'Spoken Word', 'Stories from family albums and railway platforms, told with a poet is timing.', 75000, '/images/event-07.png', 'available'),
  ('tara-electronica', 'Tara Electronica', 'Electronic', 'A live modular set that starts at a simmer and ends somewhere near sunrise.', 160000, '/images/event-05.png', 'available'),
  ('bhaav-theatre', 'Bhaav Theatre', 'Theatre', 'A five-actor ensemble staging new Hindi writing.', 90000, '/images/event-02.png', 'available')
on conflict (id) do nothing;

insert into venues (id, name, location, capacity, rate, description) values
  ('urja-auditorium', 'Urja Auditorium', 'Patna · Fraser Road', 1200, 125000, 'A 1970s auditorium with a 42-foot proscenium, newly rebuilt sound and a balcony that makes a laugh land twice.'),
  ('old-mill', 'The Old Mill', 'Patna · Bailey Road', 600, 85000, 'Raw brick, 24-foot ceilings and a loading bay wide enough for a truck. Built for gigs that want to feel found, not furnished.'),
  ('maurya-hall-a', 'Maurya Lok · Hall A', 'Patna · Maurya Lok', 450, 70000, 'A polished, column-free hall for launches, keynotes and award nights. Rigging points are mapped and waiting.'),
  ('garden-five-seasons', 'Garden of Five Seasons', 'Ranchi · Kanke Road', 300, 95000, 'A lawn under old mango trees for weddings, readings and long lunches. We handle the weather plan, you handle the guest list.')
on conflict (id) do nothing;
