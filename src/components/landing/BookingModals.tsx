"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import type { Artist, Venue } from "@/data/mock";
import { formatINR } from "@/data/mock";
import { Icon } from "@/components/ui/Icon";
import { Modal } from "@/components/ui/Modal";

const eventTypes = [
  "Private celebration",
  "Corporate event",
  "Festival",
  "Wedding",
  "Campus / community",
  "Brand activation",
];

const budgets = [
  "Under ₹1,00,000",
  "₹1,00,000 – ₹2,00,000",
  "₹2,00,000 – ₹4,00,000",
  "₹4,00,000+",
];

function FormField({
  label,
  children,
  hint,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
  className?: string;
}) {
  return (
    <label className={`field ${className}`}>
      <span className="field__label">{label}</span>
      {children}
      {hint && <span className="field__hint">{hint}</span>}
    </label>
  );
}

export function ArtistBookingModal({
  artist,
  initialDate,
  open,
  onClose,
}: {
  artist: Artist | null;
  initialDate?: string;
  open: boolean;
  onClose: () => void;
}) {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    date: initialDate ?? "",
    city: artist?.city ?? "Patna",
    venue: "",
    eventType: eventTypes[0],
    guests: "",
    budget: budgets[1],
    notes: "",
    name: "",
    email: "",
    phone: "",
  });

  if (!artist) return null;

  const set = (key: keyof typeof form, value: string) =>
    setForm((current) => ({ ...current, [key]: value }));

  const advance = (event: FormEvent) => {
    event.preventDefault();
    if (step === 1) {
      setStep(2);
    } else {
      setSubmitted(true);
      setStep(3);
    }
  };

  return (
    <Modal open={open} onClose={onClose} size="large" labelledBy="booking-title">
      {!submitted ? (
        <div className="booking-modal">
          <aside className="booking-modal__aside">
            <div className="booking-modal__image">
              <Image
                src={artist.image}
                alt=""
                fill
                sizes="(max-width: 800px) 100vw, 320px"
                style={{ objectFit: "cover" }}
              />
            </div>
            <div className="booking-modal__artist">
              <span className="eyebrow">Booking enquiry</span>
              <h3>{artist.name}</h3>
              <p>{artist.discipline} · {artist.city}</p>
              <dl className="mini-ledger">
                <div>
                  <dt>Starting fee</dt>
                  <dd>{formatINR(artist.fee)}</dd>
                </div>
                <div>
                  <dt>Set length</dt>
                  <dd>{artist.setLength}</dd>
                </div>
                <div>
                  <dt>Languages</dt>
                  <dd>{artist.languages.join(", ")}</dd>
                </div>
              </dl>
            </div>
            <p className="booking-modal__note">
              A booking lead replies within one working day with a hold,
              production notes and a clear quote.
            </p>
          </aside>

          <div className="booking-modal__main">
            <div className="modal-heading">
              <span className="eyebrow">Artist booking · 01 / 02</span>
              <h2 id="booking-title">Tell us about the night.</h2>
              <p>
                The more we know, the more useful our first reply will be. No
                payment is taken at this stage.
              </p>
            </div>

            <div className="step-rail" aria-label={`Step ${step} of 2`}>
              <span className={step === 1 ? "is-current" : "is-done"}>01 Brief</span>
              <span className="step-rail__line" />
              <span className={step === 2 ? "is-current" : ""}>02 Contact</span>
            </div>

            <form onSubmit={advance}>
              {step === 1 ? (
                <div className="form-grid">
                  <FormField label="Event date">
                    <input
                      type="date"
                      required
                      min="2026-11-05"
                      value={form.date}
                      onChange={(event) => set("date", event.target.value)}
                    />
                  </FormField>
                  <FormField label="City">
                    <input
                      required
                      value={form.city}
                      onChange={(event) => set("city", event.target.value)}
                      placeholder="Patna"
                    />
                  </FormField>
                  <FormField label="Venue or area">
                    <input
                      required
                      value={form.venue}
                      onChange={(event) => set("venue", event.target.value)}
                      placeholder="Urja Auditorium, Fraser Road"
                    />
                  </FormField>
                  <FormField label="Format">
                    <select
                      value={form.eventType}
                      onChange={(event) => set("eventType", event.target.value)}
                    >
                      {eventTypes.map((type) => (
                        <option key={type}>{type}</option>
                      ))}
                    </select>
                  </FormField>
                  <FormField label="Expected audience">
                    <input
                      type="number"
                      min="20"
                      required
                      value={form.guests}
                      onChange={(event) => set("guests", event.target.value)}
                      placeholder="320"
                    />
                  </FormField>
                  <FormField label="All-in budget">
                    <select
                      value={form.budget}
                      onChange={(event) => set("budget", event.target.value)}
                    >
                      {budgets.map((budget) => (
                        <option key={budget}>{budget}</option>
                      ))}
                    </select>
                  </FormField>
                  <FormField
                    label="Anything we should know?"
                    hint="Language preference, audience age, technical requirements, other acts."
                    className="field--full"
                  >
                    <textarea
                      rows={3}
                      value={form.notes}
                      onChange={(event) => set("notes", event.target.value)}
                      placeholder="A short brief helps us check the right set."
                    />
                  </FormField>
                </div>
              ) : (
                <div className="form-grid">
                  <FormField label="Your name">
                    <input
                      required
                      value={form.name}
                      onChange={(event) => set("name", event.target.value)}
                      placeholder="Full name"
                    />
                  </FormField>
                  <FormField label="Email">
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(event) => set("email", event.target.value)}
                      placeholder="you@company.com"
                    />
                  </FormField>
                  <FormField label="Phone">
                    <input
                      required
                      minLength={10}
                      value={form.phone}
                      onChange={(event) => set("phone", event.target.value)}
                      placeholder="+91 98xxx xxxxx"
                    />
                  </FormField>
                  <FormField label="Organisation (optional)">
                    <input placeholder="Studio, company or family name" />
                  </FormField>
                  <div className="brief-summary field--full">
                    <span className="eyebrow">Your brief</span>
                    <p>
                      {form.date || "Date to confirm"} · {form.venue || "Venue to confirm"},{" "}
                      {form.city}. {artist.name} for {form.guests || "—"} guests.{" "}
                      {form.eventType}, budget {form.budget.toLowerCase()}.
                    </p>
                  </div>
                </div>
              )}

              <div className="modal-actions">
                {step === 2 ? (
                  <button
                    type="button"
                    className="button button--ghost"
                    onClick={() => setStep(1)}
                  >
                    <Icon name="arrow-left" size={16} />
                    Back to brief
                  </button>
                ) : (
                  <span className="modal-actions__hint">
                    No payment · No obligation
                  </span>
                )}
                <button type="submit" className="button button--ink">
                  {step === 1 ? "Continue to contact" : "Send booking request"}
                  <Icon name="arrow-up-right" size={16} />
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div className="booking-success">
          <div className="booking-success__mark">
            <Icon name="check" size={24} strokeWidth={1.7} />
          </div>
          <span className="eyebrow">Request received · KS-2077</span>
          <h2 id="booking-title">The date is now on hold.</h2>
          <p>
            We have pencilled {artist.name} for{" "}
            <strong>{form.date || "the requested date"}</strong> and sent your
            brief to the booking desk. You will hear from a human within one
            working day.
          </p>
          <div className="booking-success__ticket">
            <div>
              <span>Artist</span>
              <strong>{artist.name}</strong>
            </div>
            <div>
              <span>Date</span>
              <strong>{form.date || "To confirm"}</strong>
            </div>
            <div>
              <span>City</span>
              <strong>{form.city}</strong>
            </div>
            <div>
              <span>Estimate</span>
              <strong>{artist.feeLabel}</strong>
            </div>
          </div>
          <div className="booking-success__actions">
            <button type="button" className="button button--ink" onClick={onClose}>
              Back to the roster
              <Icon name="arrow-right" size={16} />
            </button>
            <span>Reference held for 72 hours.</span>
          </div>
        </div>
      )}
    </Modal>
  );
}

export function VenueRequestModal({
  venue,
  initialDate,
  open,
  onClose,
}: {
  venue: Venue | null;
  initialDate?: string;
  open: boolean;
  onClose: () => void;
}) {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    date: initialDate ?? "",
    capacity: "",
    format: "Performance",
    start: "18:00",
    end: "23:00",
    logistics: "",
    name: "",
    email: "",
    phone: "",
  });

  if (!venue) return null;

  const set = (key: keyof typeof form, value: string) =>
    setForm((current) => ({ ...current, [key]: value }));

  const submit = (event: FormEvent) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <Modal open={open} onClose={onClose} size="large" labelledBy="venue-title">
      {!submitted ? (
        <div className="venue-modal">
          <div className="venue-modal__image">
            <Image
              src={venue.image}
              alt=""
              fill
              sizes="(max-width: 800px) 100vw, 460px"
              style={{ objectFit: "cover" }}
            />
            <div className="venue-modal__image-caption">
              <span>{venue.type}</span>
              <strong>{venue.name}</strong>
              <span>{venue.area}, {venue.city}</span>
            </div>
          </div>

          <div className="venue-modal__main">
            <div className="modal-heading">
              <span className="eyebrow">Venue request</span>
              <h2 id="venue-title">Hold the room.</h2>
              <p>
                Tell us what the day looks like. We will confirm availability,
                technical fit and a single all-in quote.
              </p>
            </div>

            <form onSubmit={submit}>
              <div className="form-grid">
                <FormField label="Preferred date">
                  <input
                    type="date"
                    required
                    min="2026-11-05"
                    value={form.date}
                    onChange={(event) => set("date", event.target.value)}
                  />
                </FormField>
                <FormField label="Expected capacity">
                  <input
                    type="number"
                    required
                    min="20"
                    max="1500"
                    value={form.capacity}
                    onChange={(event) => set("capacity", event.target.value)}
                    placeholder={`Up to ${venue.capacity}`}
                  />
                </FormField>
                <FormField label="Event format">
                  <select
                    value={form.format}
                    onChange={(event) => set("format", event.target.value)}
                  >
                    <option>Performance</option>
                    <option>Conference</option>
                    <option>Wedding function</option>
                    <option>Brand activation</option>
                    <option>Community gathering</option>
                  </select>
                </FormField>
                <FormField label="Access window">
                  <div className="time-pair">
                    <input
                      type="time"
                      value={form.start}
                      onChange={(event) => set("start", event.target.value)}
                    />
                    <span>to</span>
                    <input
                      type="time"
                      value={form.end}
                      onChange={(event) => set("end", event.target.value)}
                    />
                  </div>
                </FormField>
                <FormField
                  label="Logistics and technical needs"
                  hint="Stage size, seating style, green rooms, catering, sound, accessibility."
                  className="field--full"
                >
                  <textarea
                    rows={3}
                    value={form.logistics}
                    onChange={(event) => set("logistics", event.target.value)}
                    placeholder="Dinner service after the show. Four green rooms. Lectern and two wireless mics."
                  />
                </FormField>
                <FormField label="Your name">
                  <input
                    required
                    value={form.name}
                    onChange={(event) => set("name", event.target.value)}
                    placeholder="Full name"
                  />
                </FormField>
                <FormField label="Email">
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(event) => set("email", event.target.value)}
                    placeholder="you@company.com"
                  />
                </FormField>
                <FormField label="Phone">
                  <input
                    required
                    minLength={10}
                    value={form.phone}
                    onChange={(event) => set("phone", event.target.value)}
                    placeholder="+91 98xxx xxxxx"
                  />
                </FormField>
              </div>

              <div className="modal-actions">
                <div className="modal-actions__price">
                  <span>From</span>
                  <strong>{venue.feeLabel}</strong>
                </div>
                <button type="submit" className="button button--ink">
                  Request the room
                  <Icon name="arrow-up-right" size={16} />
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div className="booking-success">
          <div className="booking-success__mark">
            <Icon name="check" size={24} strokeWidth={1.7} />
          </div>
          <span className="eyebrow">Room request received · VR-1098</span>
          <h2 id="venue-title">We will check the room.</h2>
          <p>
            Your request for <strong>{venue.name}</strong> on{" "}
            <strong>{form.date}</strong> is with the venue desk. We will come
            back with a hold, a site visit slot and the full technical picture.
          </p>
          <div className="booking-success__ticket">
            <div>
              <span>Room</span>
              <strong>{venue.name}</strong>
            </div>
            <div>
              <span>Date</span>
              <strong>{form.date}</strong>
            </div>
            <div>
              <span>Guests</span>
              <strong>{form.capacity || "To confirm"}</strong>
            </div>
            <div>
              <span>From</span>
              <strong>{venue.feeLabel}</strong>
            </div>
          </div>
          <div className="booking-success__actions">
            <button type="button" className="button button--ink" onClick={onClose}>
              Keep looking
              <Icon name="arrow-right" size={16} />
            </button>
            <span>No card details collected.</span>
          </div>
        </div>
      )}
    </Modal>
  );
}
