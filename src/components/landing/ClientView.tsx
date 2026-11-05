"use client";

import { useMemo, useState, type FormEvent } from "react";
import Image from "next/image";
import {
  artists,
  isArtistFree,
  isVenueFree,
  publicEvents,
  venues,
  type Artist,
  type Venue,
} from "@/data/mock";
import { BrandMark, Doodle, Stamp, Wordmark } from "@/components/ui/Brand";
import { Icon } from "@/components/ui/Icon";
import { ArtistBookingModal, VenueRequestModal } from "./BookingModals";
import { AvailabilityCalendar } from "./AvailabilityCalendar";

type BudgetFilter = "any" | "under" | "mid" | "high";

const categories = ["All", "Comedy", "Music", "Dance", "Theatre", "Spoken Word", "Electronic"];

const budgetOptions: { value: BudgetFilter; label: string }[] = [
  { value: "any", label: "Any budget" },
  { value: "under", label: "Under ₹1L" },
  { value: "mid", label: "₹1L – ₹2L" },
  { value: "high", label: "₹2L and above" },
];

const marqueeItems = [
  "Artist bookings",
  "Venue reservations",
  "Show production",
  "Talent curation",
  "Patna · Ranchi · Kolkata",
];

export function ClientView() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [category, setCategory] = useState("All");
  const [budget, setBudget] = useState<BudgetFilter>("any");
  const [availableOn, setAvailableOn] = useState("");
  const [bookingArtist, setBookingArtist] = useState<Artist | null>(null);
  const [bookingDate, setBookingDate] = useState<string | undefined>(undefined);
  const [venueModal, setVenueModal] = useState<Venue | null>(null);
  const [venueDate, setVenueDate] = useState<string | undefined>(undefined);
  const [featuredVenue, setFeaturedVenue] = useState(venues[0]);
  const [venueSubmitted, setVenueSubmitted] = useState(false);
  const [venueForm, setVenueForm] = useState({
    date: "",
    capacity: "",
    format: "Performance",
    logistics: "",
    name: "",
    email: "",
  });

  const filteredArtists = useMemo(() => {
    return artists.filter((artist) => {
      if (category !== "All" && artist.category !== category) return false;
      if (budget === "under" && artist.fee >= 100000) return false;
      if (budget === "mid" && (artist.fee < 100000 || artist.fee >= 200000)) return false;
      if (budget === "high" && artist.fee < 200000) return false;
      if (availableOn && !isArtistFree(artist, availableOn)) return false;
      return true;
    });
  }, [category, budget, availableOn]);

  const openArtist = (artist: Artist, date?: string) => {
    setBookingArtist(artist);
    setBookingDate(date);
  };

  const openVenue = (venue: Venue, date?: string) => {
    setVenueModal(venue);
    setVenueDate(date);
  };

  const submitVenueForm = (event: FormEvent) => {
    event.preventDefault();
    setVenueSubmitted(true);
  };

  const resetVenueForm = () => {
    setVenueSubmitted(false);
    setVenueForm({
      date: "",
      capacity: "",
      format: "Performance",
      logistics: "",
      name: "",
      email: "",
    });
  };

  const nextEvent = publicEvents.find((event) => event.date === "2026-11-21") ?? publicEvents[0];

  return (
    <div className="client-view">
      <header className="site-header">
        <div className="site-header__inner">
          <Wordmark />

          <nav className="site-nav" aria-label="Main navigation">
            <a href="#artists">Artists</a>
            <a href="#venues">Venues</a>
            <a href="#calendar">Calendar</a>
            <a href="#studio">The studio</a>
          </nav>

          <div className="site-header__actions">
            <a className="site-header__phone" href="tel:+919876543210">
              +91 98765 43210
            </a>
            <button
              type="button"
              className="button button--ink button--small"
              onClick={() => document.querySelector("#artists")?.scrollIntoView({ behavior: "smooth" })}
            >
              Start a booking
              <Icon name="arrow-up-right" size={15} />
            </button>
            <button
              type="button"
              className="menu-button"
              aria-expanded={menuOpen}
              aria-label="Toggle menu"
              onClick={() => setMenuOpen((open) => !open)}
            >
              <Icon name={menuOpen ? "close" : "menu"} size={22} />
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav className="mobile-nav" aria-label="Mobile navigation">
            {[
              ["Artists", "#artists"],
              ["Venues", "#venues"],
              ["Availability calendar", "#calendar"],
              ["The studio", "#studio"],
            ].map(([label, href]) => (
              <a key={href} href={href} onClick={() => setMenuOpen(false)}>
                {label}
                <Icon name="arrow-up-right" size={15} />
              </a>
            ))}
            <a href="tel:+919876543210" onClick={() => setMenuOpen(false)}>
              +91 98765 43210
            </a>
          </nav>
        )}
      </header>

      <main>
        <section className="hero">
          <div className="hero__copy">
            <div className="hero__kicker reveal">
              <span className="eyebrow">Artist & venue booking house</span>
              <span className="hero__kicker-note">Patna · since 2019</span>
            </div>

            <h1 className="hero__title reveal reveal--delay-1">
              Some nights
              <br />
              deserve more
              <br />
              <em>than a stage.</em>
            </h1>

            <p className="hero__lede reveal reveal--delay-2">
              We find the artist, hold the room, and stay through the last cable
              coil. An independent booking house for comedy, music, theatre and
              the spaces that make them land.
            </p>

            <div className="hero__actions reveal reveal--delay-3">
              <a href="#artists" className="button button--ink">
                Find an artist
                <Icon name="arrow-up-right" size={17} />
              </a>
              <a href="#venues" className="button button--line">
                Reserve a venue
                <Icon name="building" size={17} />
              </a>
            </div>

            <div className="hero__proof reveal reveal--delay-4">
              <div>
                <strong>180+</strong>
                <span>nights produced</span>
              </div>
              <div>
                <strong>42</strong>
                <span>artists on the roster</span>
              </div>
              <div>
                <strong>08</strong>
                <span>rooms we hold</span>
              </div>
            </div>
          </div>

          <div className="hero__visual reveal reveal--delay-3">
            <div className="hero__image-main">
              <Image
                src="/images/event-08.png"
                alt="A full house at a Kalakaar Studios live show"
                fill
                preload
                loading="eager"
                sizes="(max-width: 900px) 90vw, 42vw"
                style={{ objectFit: "cover" }}
              />
              <span className="hero__image-tag">Live / Patna</span>
            </div>

            <div className="hero__image-side">
              <Image
                src="/images/event-06.png"
                alt="Musicians performing under warm stage light"
                fill
                sizes="(max-width: 900px) 38vw, 18vw"
                style={{ objectFit: "cover" }}
              />
            </div>

            <a href="#calendar" className="hero__next">
              <span className="hero__next-top">
                <span>Next public night</span>
                <Icon name="arrow-up-right" size={15} />
              </span>
              <strong>{nextEvent.title}</strong>
              <span className="hero__next-meta">
                21 Nov · 6:45 PM
                <br />
                {nextEvent.venue}
              </span>
              <span className="hero__next-status">{nextEvent.status}</span>
            </a>

            <div className="hero__rail">
              <span>25.5941° N</span>
              <span>85.1376° E</span>
            </div>
            <Stamp className="hero__stamp" />
            <Doodle variant="wave" className="hero__doodle" />
          </div>
        </section>

        <div className="marquee" aria-hidden="true">
          <div className="marquee__track">
            {[...marqueeItems, ...marqueeItems].map((item, index) => (
              <span key={`${item}-${index}`}>
                {item}
                <i />
              </span>
            ))}
          </div>
        </div>

        <section className="section section--talent" id="artists">
          <div className="section-heading section-heading--split">
            <div>
              <span className="eyebrow">
                <span className="index">01</span> The roster
              </span>
              <h2>
                People who make
                <br />
                a room forget
                <br />
                <em>its walls.</em>
              </h2>
            </div>
            <div className="section-heading__aside">
              <p>
                Comedians, ensembles, dancers and theatre makers we have seen
                work a room. Every booking includes our production eyes, not
                just a name on a contract.
              </p>
              <div className="section-heading__meta">
                <span>{artists.length} artists represented</span>
                <span>Booking lead replies in 1 working day</span>
              </div>
            </div>
          </div>

          <div className="filter-bar">
            <div className="filter-bar__categories" role="tablist" aria-label="Filter artists by category">
              {categories.map((item) => (
                <button
                  key={item}
                  type="button"
                  role="tab"
                  aria-selected={category === item}
                  className={category === item ? "is-active" : ""}
                  onClick={() => setCategory(item)}
                >
                  {item}
                </button>
              ))}
            </div>

            <div className="filter-bar__controls">
              <label className="filter-select">
                <span>Budget</span>
                <select
                  value={budget}
                  onChange={(event) => setBudget(event.target.value as BudgetFilter)}
                >
                  {budgetOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <Icon name="chevron-down" size={14} />
              </label>

              <label className="filter-date">
                <Icon name="calendar" size={15} />
                <span>Free on</span>
                <input
                  type="date"
                  min="2026-11-05"
                  value={availableOn}
                  onChange={(event) => setAvailableOn(event.target.value)}
                />
              </label>

              {(category !== "All" || budget !== "any" || availableOn) && (
                <button
                  type="button"
                  className="text-link filter-reset"
                  onClick={() => {
                    setCategory("All");
                    setBudget("any");
                    setAvailableOn("");
                  }}
                >
                  Clear filters
                </button>
              )}
            </div>
          </div>

          {filteredArtists.length > 0 ? (
            <div className="talent-grid">
              {filteredArtists.map((artist, index) => (
                <article
                  key={artist.id}
                  className={`talent-card ${index === 0 ? "is-featured" : ""}`}
                >
                  <button
                    type="button"
                    className="talent-card__image"
                    onClick={() => openArtist(artist, availableOn || undefined)}
                    aria-label={`View ${artist.name}`}
                  >
                    <Image
                      src={artist.image}
                      alt=""
                      fill
                      sizes={index === 0 ? "(max-width: 900px) 100vw, 48vw" : "(max-width: 900px) 100vw, 32vw"}
                      style={{ objectFit: "cover" }}
                    />
                    <span className="talent-card__index">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="talent-card__category">{artist.category}</span>
                  </button>

                  <div className="talent-card__body">
                    <div className="talent-card__title-row">
                      <div>
                        <h3>{artist.name}</h3>
                        <p>{artist.discipline} · {artist.city}</p>
                      </div>
                      <div className="talent-card__fee">
                        <span>From</span>
                        <strong>{artist.feeLabel}</strong>
                      </div>
                    </div>
                    <p className="talent-card__blurb">{artist.blurb}</p>
                    <div className="talent-card__specs">
                      <span><Icon name="clock" size={14} /> {artist.setLength}</span>
                      <span><Icon name="users" size={14} /> {artist.draw}</span>
                      <span><Icon name="music" size={14} /> {artist.languages.join(" / ")}</span>
                    </div>
                    <div className="talent-card__actions">
                      <span className="availability-line">
                        <i />
                        {availableOn
                          ? isArtistFree(artist, availableOn)
                            ? "Free on your date"
                            : "Date not free"
                          : "Taking bookings for 2027"}
                      </span>
                      <button
                        type="button"
                        className="button button--underlined"
                        onClick={() => openArtist(artist, availableOn || undefined)}
                      >
                        Enquire
                        <Icon name="arrow-up-right" size={15} />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <span className="eyebrow">No exact matches</span>
              <h3>The roster is deep, the filter is narrow.</h3>
              <p>
                Try a wider budget or a different date. We also source beyond
                the represented roster for the right brief.
              </p>
              <button
                type="button"
                className="button button--ink"
                onClick={() => {
                  setCategory("All");
                  setBudget("any");
                  setAvailableOn("");
                }}
              >
                Reset the filters
                <Icon name="arrow-right" size={16} />
              </button>
            </div>
          )}

          <div className="roster-note">
            <span className="roster-note__mark"><BrandMark size={24} /></span>
            <p>
              Not seeing the right shape? We source outside the represented
              roster for festivals, private celebrations and unusual formats.
            </p>
            <button
              type="button"
              className="text-link"
              onClick={() => openArtist(artists[1])}
            >
              Brief the studio
              <Icon name="arrow-up-right" size={15} />
            </button>
          </div>
        </section>

        <section className="section section--venues" id="venues">
          <div className="section-heading section-heading--split section-heading--light">
            <div>
              <span className="eyebrow">
                <span className="index">02</span> Rooms we hold
              </span>
              <h2>
                The right room
                <br />
                changes the way
                <br />
                <em>a night behaves.</em>
              </h2>
            </div>
            <div className="section-heading__aside">
              <p>
                We hold a small, deliberate list of rooms across Bihar and
                Jharkhand. Each one has been tested for sightlines, loading,
                sound and the walk from the car.
              </p>
              <div className="section-heading__meta">
                <span>8 rooms · 4 cities</span>
                <span>Site visits arranged in 48 hours</span>
              </div>
            </div>
          </div>

          <div className="venue-feature">
            <div className="venue-feature__visual">
              <div className="venue-feature__image">
                <Image
                  src={featuredVenue.image}
                  alt={`${featuredVenue.name} venue`}
                  fill
                  sizes="(max-width: 900px) 100vw, 55vw"
                  style={{ objectFit: "cover" }}
                />
                <div className="venue-feature__caption">
                  <span className="eyebrow">Featured room</span>
                  <h3>{featuredVenue.name}</h3>
                  <p>{featuredVenue.area}, {featuredVenue.city}</p>
                </div>
                <span className="venue-feature__index">R / 01</span>
              </div>
              <p className="venue-feature__blurb">{featuredVenue.blurb}</p>
              <div className="venue-feature__specs">
                {featuredVenue.specs.map((spec) => (
                  <span key={spec}>{spec}</span>
                ))}
              </div>
              <div className="venue-feature__ledger">
                <div>
                  <span>Capacity</span>
                  <strong>{featuredVenue.capacityLabel}</strong>
                </div>
                <div>
                  <span>Room type</span>
                  <strong>{featuredVenue.type}</strong>
                </div>
                <div>
                  <span>Starting rate</span>
                  <strong>{featuredVenue.feeLabel}</strong>
                </div>
              </div>
            </div>

            <div className="venue-form">
              {!venueSubmitted ? (
                <>
                  <div className="venue-form__head">
                    <span className="eyebrow">Hold a room</span>
                    <h3>Tell us what the day looks like.</h3>
                    <p>
                      One form for availability, capacity and logistics. A venue
                      lead replies with a firm hold and a site visit time.
                    </p>
                  </div>

                  <form onSubmit={submitVenueForm} className="venue-form__form">
                    <div className="form-grid form-grid--venue">
                      <label className="field">
                        <span className="field__label">Room</span>
                        <select
                          value={featuredVenue.id}
                          onChange={(event) => {
                            const found = venues.find((venue) => venue.id === event.target.value);
                            if (found) setFeaturedVenue(found);
                          }}
                        >
                          {venues.map((venue) => (
                            <option key={venue.id} value={venue.id}>
                              {venue.name} · {venue.city}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="field">
                        <span className="field__label">Event date</span>
                        <input
                          type="date"
                          required
                          min="2026-11-05"
                          value={venueForm.date}
                          onChange={(event) =>
                            setVenueForm((form) => ({ ...form, date: event.target.value }))
                          }
                        />
                      </label>
                      <label className="field">
                        <span className="field__label">Gathering capacity</span>
                        <input
                          type="number"
                          required
                          min="20"
                          max="1500"
                          placeholder={`Up to ${featuredVenue.capacity}`}
                          value={venueForm.capacity}
                          onChange={(event) =>
                            setVenueForm((form) => ({ ...form, capacity: event.target.value }))
                          }
                        />
                      </label>
                      <label className="field">
                        <span className="field__label">Format</span>
                        <select
                          value={venueForm.format}
                          onChange={(event) =>
                            setVenueForm((form) => ({ ...form, format: event.target.value }))
                          }
                        >
                          <option>Performance</option>
                          <option>Conference</option>
                          <option>Wedding function</option>
                          <option>Brand activation</option>
                          <option>Community gathering</option>
                        </select>
                      </label>
                      <label className="field field--full">
                        <span className="field__label">Logistics and technical needs</span>
                        <textarea
                          rows={3}
                          placeholder="Dinner service, green rooms, sound, seating style, accessibility."
                          value={venueForm.logistics}
                          onChange={(event) =>
                            setVenueForm((form) => ({ ...form, logistics: event.target.value }))
                          }
                        />
                      </label>
                      <label className="field">
                        <span className="field__label">Your name</span>
                        <input
                          required
                          placeholder="Full name"
                          value={venueForm.name}
                          onChange={(event) =>
                            setVenueForm((form) => ({ ...form, name: event.target.value }))
                          }
                        />
                      </label>
                      <label className="field">
                        <span className="field__label">Email</span>
                        <input
                          type="email"
                          required
                          placeholder="you@company.com"
                          value={venueForm.email}
                          onChange={(event) =>
                            setVenueForm((form) => ({ ...form, email: event.target.value }))
                          }
                        />
                      </label>
                    </div>

                    <div className="venue-form__footer">
                      <div>
                        <span>Held without payment</span>
                        <strong>72 hours</strong>
                      </div>
                      <button type="submit" className="button button--marigold">
                        Request this room
                        <Icon name="arrow-up-right" size={16} />
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <div className="venue-form venue-form--success">
                  <span className="booking-success__mark">
                    <Icon name="check" size={23} />
                  </span>
                  <span className="eyebrow">Request received · VR-1098</span>
                  <h3>We are checking the room.</h3>
                  <p>
                    {featuredVenue.name} on {venueForm.date || "the requested date"} for{" "}
                    {venueForm.capacity || "your party"}. A venue lead will reply with a hold and
                    the full technical sheet within one working day.
                  </p>
                  <div className="venue-form__success-grid">
                    <div>
                      <span>Room</span>
                      <strong>{featuredVenue.name}</strong>
                    </div>
                    <div>
                      <span>Date</span>
                      <strong>{venueForm.date}</strong>
                    </div>
                    <div>
                      <span>Format</span>
                      <strong>{venueForm.format}</strong>
                    </div>
                    <div>
                      <span>Capacity</span>
                      <strong>{venueForm.capacity || "To confirm"}</strong>
                    </div>
                  </div>
                  <button type="button" className="button button--line" onClick={resetVenueForm}>
                    Make another request
                    <Icon name="arrow-right" size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="room-list">
            <div className="room-list__head">
              <span className="eyebrow">The rest of the list</span>
              <span>4 of 8 rooms shown</span>
            </div>
            {venues.map((venue) => (
              <article key={venue.id} className="room-row">
                <div className="room-row__image">
                  <Image
                    src={venue.image}
                    alt=""
                    fill
                    sizes="88px"
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div className="room-row__name">
                  <span>{venue.city}</span>
                  <h3>{venue.name}</h3>
                </div>
                <div className="room-row__meta">
                  <span>{venue.type}</span>
                  <span>{venue.capacityLabel}</span>
                </div>
                <div className="room-row__availability">
                  <i className={isVenueFree(venue, "2026-11-21") ? "is-free" : "is-busy"} />
                  {isVenueFree(venue, "2026-11-21") ? "Free 21 Nov" : "Booked 21 Nov"}
                </div>
                <div className="room-row__rate">
                  <span>From</span>
                  <strong>{venue.feeLabel}</strong>
                </div>
                <button type="button" className="round-link" onClick={() => openVenue(venue)} aria-label={`Request ${venue.name}`}>
                  <Icon name="arrow-up-right" size={17} />
                </button>
              </article>
            ))}
          </div>
        </section>

        <section className="section section--calendar" id="calendar">
          <div className="section-heading section-heading--split">
            <div>
              <span className="eyebrow">
                <span className="index">03</span> Live availability
              </span>
              <h2>
                Find a date.
                <br />
                Then find
                <br />
                <em>the night.</em>
              </h2>
            </div>
            <div className="section-heading__aside">
              <p>
                Public shows, artist holds and room availability in one studio
                ledger. Click any date to see who is free and what is already
                on stage.
              </p>
              <div className="section-heading__meta">
                <span>Updated today, 09:42</span>
                <span>All times IST</span>
              </div>
            </div>
          </div>

          <AvailabilityCalendar
            onBookArtist={(artist, date) => openArtist(artist, date)}
            onBookVenue={(venue, date) => openVenue(venue, date)}
          />
        </section>

        <section className="section section--studio" id="studio">
          <div className="studio-grid">
            <div className="studio-manifesto">
              <span className="eyebrow">
                <span className="index">04</span> The studio
              </span>
              <h2>
                A booking desk,
                <br />
                not a marketplace.
              </h2>
              <p>
                Kalakaar Studios began in a two-room office above a tailor in
                Patna. The work has grown, but the method has not: know the
                artist, know the room, and put one person in charge of the night.
              </p>
              <div className="studio-signature">
                <span>Kalakaar Studios</span>
                <small>Booking & production · Est. 2019</small>
              </div>
              <Doodle variant="arrow" className="studio-doodle" />
            </div>

            <div className="process-list">
              {[
                {
                  number: "01",
                  title: "Listen to the brief",
                  copy: "Date, audience, budget and the tone of the room. We ask the awkward questions before a quote leaves the desk.",
                },
                {
                  number: "02",
                  title: "Cast the night",
                  copy: "One artist or a full bill. We check travel, language, set length and what the audience will actually respond to.",
                },
                {
                  number: "03",
                  title: "Hold the room",
                  copy: "Availability, technical fit and contracts in one chain. No parallel WhatsApp promises, no surprise line items.",
                },
                {
                  number: "04",
                  title: "Run the night",
                  copy: "Load-in, soundcheck, door, cue and settlement. A studio producer stays on-site from the first case to the last cab.",
                },
              ].map((step) => (
                <article key={step.number} className="process-row">
                  <span className="process-row__number">{step.number}</span>
                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.copy}</p>
                  </div>
                  <Icon name="arrow-up-right" size={19} />
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="closing-cta">
          <div className="closing-cta__inner">
            <span className="eyebrow">Start with a date</span>
            <h2>
              Tell us the night
              <br />
              you have in mind.
            </h2>
            <p>
              We will reply with availability, a realistic quote and the one
              thing that will make the room work.
            </p>
            <div className="closing-cta__actions">
              <button
                type="button"
                className="button button--marigold"
                onClick={() => openArtist(artists[0])}
              >
                Book an artist
                <Icon name="arrow-up-right" size={17} />
              </button>
              <button
                type="button"
                className="button button--cream"
                onClick={() => openVenue(venues[0])}
              >
                Reserve a venue
                <Icon name="building" size={17} />
              </button>
            </div>
            <a href="mailto:bookings@kalakaarstudios.in" className="closing-cta__email">
              bookings@kalakaarstudios.in
            </a>
          </div>
          <Stamp className="closing-cta__stamp" text="BOOK THE ARTIST · HOLD THE ROOM · RUN THE NIGHT ·" />
        </section>
      </main>

      <footer className="site-footer">
        <div className="site-footer__inner">
          <div className="site-footer__brand">
            <Wordmark />
            <p>
              An independent artist and venue booking house. Patna, Bihar.
            </p>
          </div>
          <div className="site-footer__col">
            <span className="eyebrow">Book</span>
            <a href="#artists">Artists</a>
            <a href="#venues">Venues</a>
            <a href="#calendar">Availability</a>
          </div>
          <div className="site-footer__col">
            <span className="eyebrow">Studio</span>
            <a href="#studio">About</a>
            <a href="mailto:bookings@kalakaarstudios.in">Contact</a>
            <a href="#artists">Join the roster</a>
          </div>
          <div className="site-footer__col">
            <span className="eyebrow">Find us</span>
            <p>2nd Floor, Boring Road<br />Patna 800001</p>
            <a href="tel:+919876543210">+91 98765 43210</a>
          </div>
        </div>
        <div className="site-footer__base">
          <span>© 2026 Kalakaar Studios</span>
          <span>Built for the people in the room.</span>
          <span>Privacy · Terms</span>
        </div>
      </footer>

      <ArtistBookingModal
        key={`artist-${bookingArtist?.id ?? "closed"}-${bookingDate ?? ""}`}
        artist={bookingArtist}
        initialDate={bookingDate}
        open={Boolean(bookingArtist)}
        onClose={() => setBookingArtist(null)}
      />
      <VenueRequestModal
        key={`venue-${venueModal?.id ?? "closed"}-${venueDate ?? ""}`}
        venue={venueModal}
        initialDate={venueDate}
        open={Boolean(venueModal)}
        onClose={() => setVenueModal(null)}
      />
    </div>
  );
}
