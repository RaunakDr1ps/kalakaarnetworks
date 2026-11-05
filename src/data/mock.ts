export type Artist = {
  id: string;
  name: string;
  category: "Comedy" | "Music" | "Dance" | "Theatre" | "Spoken Word" | "Electronic";
  discipline: string;
  city: string;
  fee: number;
  feeLabel: string;
  image: string;
  blurb: string;
  languages: string[];
  setLength: string;
  draw: string;
  unavailable: string[];
};

export type Venue = {
  id: string;
  name: string;
  city: string;
  area: string;
  capacity: number;
  capacityLabel: string;
  type: string;
  fee: number;
  feeLabel: string;
  image: string;
  blurb: string;
  specs: string[];
  unavailable: string[];
};

export type PublicEvent = {
  id: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  venueId: string;
  kind: "Talent" | "Venue" | "Public";
  category: string;
  image: string;
  summary: string;
  artists: string[];
  status: "Selling fast" | "On sale" | "Invite only" | "Few seats";
};

export const artists: Artist[] = [
  {
    id: "ananya-rao",
    name: "Ananya Rao",
    category: "Comedy",
    discipline: "Stand-up",
    city: "Patna",
    fee: 180000,
    feeLabel: "₹1.8L",
    image: "/images/event-08.png",
    blurb:
      "Sharp, bilingual stand-up about small-town ambition and the people who survive it. A clean hour with an unclean edge.",
    languages: ["Hindi", "English"],
    setLength: "45–60 min",
    draw: "1,200 cap",
    unavailable: ["2026-11-07", "2026-11-14", "2026-11-22", "2026-12-12"],
  },
  {
    id: "sufi-cartel",
    name: "The Sufi Cartel",
    category: "Music",
    discipline: "Sufi ensemble",
    city: "Delhi",
    fee: 320000,
    feeLabel: "₹3.2L",
    image: "/images/event-06.png",
    blurb:
      "Seven musicians, one long night. Qawwali roots pulled through brass, bass and a live ambient rig built for courtyards.",
    languages: ["Urdu", "Hindi"],
    setLength: "75–90 min",
    draw: "2,500 cap",
    unavailable: ["2026-11-07", "2026-11-21", "2026-12-05"],
  },
  {
    id: "raghav-mehra",
    name: "Raghav Mehra",
    category: "Music",
    discipline: "Indie vocalist",
    city: "Mumbai",
    fee: 240000,
    feeLabel: "₹2.4L",
    image: "/images/event-01.png",
    blurb:
      "A voice built for rooms with bad air conditioning and good acoustics. Original Hindi indie with a four-piece band.",
    languages: ["Hindi", "English"],
    setLength: "60 min",
    draw: "1,800 cap",
    unavailable: ["2026-11-14", "2026-11-28", "2026-12-19"],
  },
  {
    id: "nrityagram-collective",
    name: "Nrityagram Collective",
    category: "Dance",
    discipline: "Contemporary Indian",
    city: "Bengaluru",
    fee: 145000,
    feeLabel: "₹1.45L",
    image: "/images/event-04.png",
    blurb:
      "Six dancers moving between Bharatanatyam grammar and contemporary floorwork. A full evening work, or a 20-minute festival cut.",
    languages: ["No dialogue"],
    setLength: "20–65 min",
    draw: "800 cap",
    unavailable: ["2026-11-21", "2026-11-28", "2026-12-05", "2026-12-12"],
  },
  {
    id: "kabir-night-shift",
    name: "Kabir & The Night Shift",
    category: "Music",
    discipline: "Jazz quartet",
    city: "Kolkata",
    fee: 110000,
    feeLabel: "₹1.1L",
    image: "/images/event-03.png",
    blurb:
      "Piano, upright bass, brushed drums and a saxophone that knows when to leave. Dinner sets with a pulse.",
    languages: ["Instrumental"],
    setLength: "45–120 min",
    draw: "400 cap",
    unavailable: ["2026-11-07", "2026-11-15", "2026-11-29"],
  },
  {
    id: "meera-vashisht",
    name: "Meera Vashisht",
    category: "Spoken Word",
    discipline: "Poet & storyteller",
    city: "Jaipur",
    fee: 75000,
    feeLabel: "₹75K",
    image: "/images/event-07.png",
    blurb:
      "Stories from family albums and railway platforms, told with a poet's timing. Best in a listening room, unbeatable in a courtyard.",
    languages: ["Hindi", "English"],
    setLength: "30–45 min",
    draw: "300 cap",
    unavailable: ["2026-11-14", "2026-11-20", "2026-12-06"],
  },
  {
    id: "tara-electronica",
    name: "Tara Electronica",
    category: "Electronic",
    discipline: "Live electronic",
    city: "Goa",
    fee: 160000,
    feeLabel: "₹1.6L",
    image: "/images/event-05.png",
    blurb:
      "A live modular set that starts at a simmer and ends somewhere near sunrise. Brings her own visual console.",
    languages: ["Instrumental"],
    setLength: "90 min",
    draw: "1,500 cap",
    unavailable: ["2026-11-07", "2026-11-21", "2026-11-27"],
  },
  {
    id: "bhaav-theatre",
    name: "Bhaav Theatre",
    category: "Theatre",
    discipline: "Touring theatre",
    city: "Lucknow",
    fee: 90000,
    feeLabel: "₹90K",
    image: "/images/event-02.png",
    blurb:
      "A five-actor ensemble staging new Hindi writing. The current production, Paper Moon, travels with a 16-foot set.",
    languages: ["Hindi"],
    setLength: "95 min",
    draw: "450 cap",
    unavailable: ["2026-11-08", "2026-11-22", "2026-12-13"],
  },
];

export const venues: Venue[] = [
  {
    id: "urja-auditorium",
    name: "Urja Auditorium",
    city: "Patna",
    area: "Fraser Road",
    capacity: 1200,
    capacityLabel: "1,200 seated",
    type: "Proscenium theatre",
    fee: 125000,
    feeLabel: "₹1.25L / day",
    image: "/images/event-03.png",
    blurb:
      "A 1970s auditorium with a 42-foot proscenium, newly rebuilt sound and a balcony that makes a laugh land twice.",
    specs: ["42 ft proscenium", "L-Acoustics PA", "4 green rooms", "Full blackout"],
    unavailable: ["2026-11-07", "2026-11-14", "2026-11-28", "2026-12-12"],
  },
  {
    id: "old-mill",
    name: "The Old Mill",
    city: "Patna",
    area: "Bailey Road",
    capacity: 600,
    capacityLabel: "600 standing",
    type: "Industrial warehouse",
    fee: 85000,
    feeLabel: "₹85K / day",
    image: "/images/event-01.png",
    blurb:
      "Raw brick, 24-foot ceilings and a loading bay wide enough for a truck. Built for gigs that want to feel found, not furnished.",
    specs: ["24 ft clear height", "Drive-in load-in", "Generator backup", "Outdoor spillover"],
    unavailable: ["2026-11-21", "2026-12-05", "2026-12-19"],
  },
  {
    id: "maurya-hall-a",
    name: "Maurya Lok · Hall A",
    city: "Patna",
    area: "Maurya Lok",
    capacity: 450,
    capacityLabel: "450 seated",
    type: "Conference hall",
    fee: 70000,
    feeLabel: "₹70K / day",
    image: "/images/event-02.png",
    blurb:
      "A polished, column-free hall for launches, keynotes and award nights. Rigging points are mapped and waiting.",
    specs: ["Column-free", "16A power grid", "LED wall ready", "Valet access"],
    unavailable: ["2026-11-08", "2026-11-15", "2026-12-06"],
  },
  {
    id: "garden-five-seasons",
    name: "Garden of Five Seasons",
    city: "Ranchi",
    area: "Kanke Road",
    capacity: 300,
    capacityLabel: "300 seated",
    type: "Open-air garden",
    fee: 95000,
    feeLabel: "₹95K / day",
    image: "/images/event-04.png",
    blurb:
      "A lawn under old mango trees for weddings, readings and long lunches. We handle the weather plan, you handle the guest list.",
    specs: ["Rain plan included", "Marquee permitted", "Acoustic limits 10pm", "300 car parks"],
    unavailable: ["2026-11-14", "2026-11-28", "2026-12-20"],
  },
];

export const publicEvents: PublicEvent[] = [
  {
    id: "laugh-assembly",
    title: "The Laugh Assembly",
    date: "2026-11-14",
    time: "7:30 PM",
    venue: "Urja Auditorium",
    venueId: "urja-auditorium",
    kind: "Public",
    category: "Comedy",
    image: "/images/event-08.png",
    summary:
      "Ananya Rao headlines a three-act comedy night. Two support sets, one long interval, no two-drink minimum.",
    artists: ["Ananya Rao", "Meera Vashisht"],
    status: "Selling fast",
  },
  {
    id: "sufi-stars",
    title: "Sufi Under the Stars",
    date: "2026-11-21",
    time: "6:45 PM",
    venue: "The Old Mill",
    venueId: "old-mill",
    kind: "Public",
    category: "Music",
    image: "/images/event-06.png",
    summary:
      "The Sufi Cartel in the round, with a 20-minute opening set from Kabir & The Night Shift. Courtyard seating, one long set.",
    artists: ["The Sufi Cartel", "Kabir & The Night Shift"],
    status: "Few seats",
  },
  {
    id: "paper-moon",
    title: "Paper Moon",
    date: "2026-11-28",
    time: "8:00 PM",
    venue: "Urja Auditorium",
    venueId: "urja-auditorium",
    kind: "Public",
    category: "Theatre",
    image: "/images/event-02.png",
    summary:
      "Bhaav Theatre's new production about a family that moves house without moving anything else. Hindi, 95 minutes, no interval.",
    artists: ["Bhaav Theatre"],
    status: "On sale",
  },
  {
    id: "monsoon-edit",
    title: "The Monsoon Edit",
    date: "2026-12-05",
    time: "11:00 AM",
    venue: "Maurya Lok · Hall A",
    venueId: "maurya-hall-a",
    kind: "Public",
    category: "Brand activation",
    image: "/images/event-05.png",
    summary:
      "A one-day design and craft market with a live print bar. Invite-only preview at 10am, public entry from 11.",
    artists: ["Tara Electronica"],
    status: "Invite only",
  },
  {
    id: "night-bloom",
    title: "Night Bloom",
    date: "2026-12-12",
    time: "9:00 PM",
    venue: "The Old Mill",
    venueId: "old-mill",
    kind: "Public",
    category: "Electronic",
    image: "/images/event-01.png",
    summary:
      "Tara Electronica's live modular set with a custom light console, plus a late DJ slot from the studio residents.",
    artists: ["Tara Electronica"],
    status: "On sale",
  },
  {
    id: "winter-table",
    title: "The Winter Table",
    date: "2026-12-20",
    time: "1:00 PM",
    venue: "Garden of Five Seasons",
    venueId: "garden-five-seasons",
    kind: "Public",
    category: "Garden lunch",
    image: "/images/event-04.png",
    summary:
      "A long lunch in Ranchi with a four-course menu, Meera Vashisht reading between courses, and no speeches.",
    artists: ["Meera Vashisht"],
    status: "Few seats",
  },
];

export const formatINR = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

export const dateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const todayKey = "2026-11-04";

export const isArtistFree = (artist: Artist, key: string) =>
  !artist.unavailable.includes(key);

export const isVenueFree = (venue: Venue, key: string) =>
  !venue.unavailable.includes(key);

export const getEventsOn = (key: string) =>
  publicEvents.filter((event) => event.date === key);

export const bookedDatesForArtist = [
  { key: "2026-11-14", title: "The Laugh Assembly", venue: "Urja Auditorium" },
  { key: "2026-11-21", title: "Sufi Under the Stars", venue: "The Old Mill" },
  { key: "2026-12-12", title: "Private corporate set", venue: "Maurya Lok" },
  { key: "2026-11-27", title: "Studio recording", venue: "Patna" },
];

export const artistInquiries = [
  {
    id: "inq-021",
    client: "Bihar Chamber of Commerce",
    event: "Annual members' evening",
    date: "2026-11-22",
    city: "Patna",
    fee: 180000,
    status: "New" as const,
    note: "40-minute set, Hindi-led, audience of 320. Dinner follows.",
  },
  {
    id: "inq-018",
    client: "Tara & Kabir",
    event: "Wedding sangeet",
    date: "2026-12-04",
    city: "Ranchi",
    fee: 220000,
    status: "Awaiting reply" as const,
    note: "Family audience, clean set requested. Sound and stay covered by us.",
  },
  {
    id: "inq-015",
    client: "Studio Nine",
    event: "Brand film screening",
    date: "2026-12-11",
    city: "Patna",
    fee: 150000,
    status: "Confirmed" as const,
    note: "20-minute host set before the screening. Arrival by 6pm.",
  },
  {
    id: "inq-009",
    client: "The Old Mill",
    event: "New Year's Eve",
    date: "2026-12-31",
    city: "Patna",
    fee: 250000,
    status: "Declined" as const,
    note: "Date conflict, artist unavailable.",
  },
];

export const artistPayouts = [
  { month: "Jul", value: 120000, label: "₹1.2L" },
  { month: "Aug", value: 210000, label: "₹2.1L" },
  { month: "Sep", value: 160000, label: "₹1.6L" },
  { month: "Oct", value: 240000, label: "₹2.4L" },
  { month: "Nov", value: 180000, label: "₹1.8L (projected)" },
];

export const clientBookings = [
  {
    id: "KS-2048",
    kind: "Artist",
    name: "The Sufi Cartel",
    detail: "Sufi Under the Stars",
    date: "2026-11-21",
    venue: "The Old Mill, Patna",
    status: "Artist confirmed",
    progress: 2,
    image: "/images/event-06.png",
  },
  {
    id: "KS-2051",
    kind: "Venue",
    name: "Urja Auditorium",
    detail: "Annual members' evening",
    date: "2026-11-22",
    venue: "Fraser Road, Patna",
    status: "Contract sent",
    progress: 1,
    image: "/images/event-03.png",
  },
  {
    id: "KS-2033",
    kind: "Artist",
    name: "Meera Vashisht",
    detail: "The Winter Table",
    date: "2026-12-20",
    venue: "Garden of Five Seasons, Ranchi",
    status: "Advance paid",
    progress: 3,
    image: "/images/event-07.png",
  },
];

export const clientTimeline = [
  {
    date: "2026-11-06",
    time: "4:00 PM",
    title: "Production call",
    detail: "Tech rider walkthrough with The Sufi Cartel and the Old Mill crew.",
    status: "Next",
  },
  {
    date: "2026-11-12",
    time: "11:00 AM",
    title: "Advance due",
    detail: "Balance of ₹1,92,000 for booking KS-2048.",
    status: "Upcoming",
  },
  {
    date: "2026-11-19",
    time: "6:30 PM",
    title: "Load-in begins",
    detail: "Artist crew arrives. Studio production lead: Devansh.",
    status: "Upcoming",
  },
  {
    date: "2026-11-21",
    time: "6:45 PM",
    title: "Doors open",
    detail: "Sufi Under the Stars at The Old Mill. Guest list closes at 5pm.",
    status: "Upcoming",
  },
];

export const clientInvoices = [
  {
    id: "INV-8842",
    title: "Artist booking · The Sufi Cartel",
    issued: "28 Oct 2026",
    due: "12 Nov 2026",
    amount: 192000,
    status: "Due" as const,
  },
  {
    id: "INV-8827",
    title: "Venue reservation · Urja Auditorium",
    issued: "24 Oct 2026",
    due: "08 Nov 2026",
    amount: 125000,
    status: "Due" as const,
  },
  {
    id: "INV-8791",
    title: "Artist booking · Meera Vashisht",
    issued: "02 Oct 2026",
    due: "Paid 08 Oct",
    amount: 75000,
    status: "Paid" as const,
  },
];

export const clientMessages = [
  {
    id: "m1",
    from: "Devansh Sinha",
    role: "Booking lead, Kalakaar Studios",
    time: "Today, 9:42 AM",
    body: "Morning Ishaan. The Old Mill has confirmed the 4pm load-in. I am sending the revised production schedule this evening. Do you want the green room nearest the stage kept for the band?",
    mine: false,
  },
  {
    id: "m2",
    from: "You",
    role: "Client",
    time: "Today, 10:05 AM",
    body: "Yes, keep that one for the band. Also, can we add two more guest-list names at the door?",
    mine: true,
  },
  {
    id: "m3",
    from: "Devansh Sinha",
    role: "Booking lead, Kalakaar Studios",
    time: "Today, 10:18 AM",
    body: "Done on both. I will add them to the door list and send you the updated sheet before lunch.",
    mine: false,
  },
];

export const venueRequests = [
  {
    id: "VR-1094",
    client: "Bihar Chamber of Commerce",
    venue: "Urja Auditorium",
    date: "2026-11-22",
    capacity: 320,
    budget: 125000,
    status: "New" as const,
    logistics: "Dinner service after. Need 4 green rooms and a lectern.",
  },
  {
    id: "VR-1091",
    client: "Studio Nine",
    venue: "Maurya Lok · Hall A",
    date: "2026-12-11",
    capacity: 180,
    budget: 70000,
    status: "Reviewing" as const,
    logistics: "Brand film screening. LED wall and 2 wireless mics.",
  },
  {
    id: "VR-1088",
    client: "Tara & Kabir",
    venue: "Garden of Five Seasons",
    date: "2026-12-20",
    capacity: 260,
    budget: 95000,
    status: "Approved" as const,
    logistics: "Sangeet lunch. Rain plan mandatory. 40 cars.",
  },
  {
    id: "VR-1083",
    client: "Patna Literature Circle",
    venue: "The Old Mill",
    date: "2026-12-05",
    capacity: 240,
    budget: 85000,
    status: "New" as const,
    logistics: "Readings and a bar. Low lighting, 12 round tables.",
  },
];

export const assignmentLog = [
  {
    time: "10:24",
    title: "Artist assigned · The Sufi Cartel",
    detail: "VR-1094 · Urja Auditorium · 22 Nov",
    kind: "Assign",
  },
  {
    time: "09:51",
    title: "Contract countersigned",
    detail: "KS-2048 · The Old Mill · 21 Nov",
    kind: "Contract",
  },
  {
    time: "09:18",
    title: "New venue request",
    detail: "VR-1094 · Bihar Chamber of Commerce",
    kind: "Request",
  },
  {
    time: "Yesterday, 18:42",
    title: "Lead approved",
    detail: "L-044 · Tara & Kabir · Ranchi",
    kind: "Lead",
  },
  {
    time: "Yesterday, 16:10",
    title: "Payout released",
    detail: "₹1,80,000 · Ananya Rao · Oct cycle",
    kind: "Payout",
  },
];

export const clientLeads = [
  {
    id: "L-048",
    name: "Bihar Chamber of Commerce",
    event: "Annual members' evening",
    value: 305000,
    source: "Referral · Sunita M.",
    status: "Pending" as const,
  },
  {
    id: "L-046",
    name: "Tara & Kabir",
    event: "Winter sangeet lunch",
    value: 440000,
    source: "Instagram · reels",
    status: "Pending" as const,
  },
  {
    id: "L-044",
    name: "Patna Literature Circle",
    event: "December readings",
    value: 185000,
    source: "Repeat client",
    status: "Approved" as const,
  },
];

export const adminRevenue = [
  { month: "Jun", booked: 11.2, collected: 8.4 },
  { month: "Jul", booked: 13.8, collected: 11.1 },
  { month: "Aug", booked: 12.4, collected: 9.8 },
  { month: "Sep", booked: 16.9, collected: 14.2 },
  { month: "Oct", booked: 18.4, collected: 15.7 },
  { month: "Nov", booked: 21.6, collected: 12.3 },
];
