"use client";

import { useState, type FormEvent } from "react";
import { Icon } from "@/components/ui/Icon";
import { Modal } from "@/components/ui/Modal";
import { supabase } from "@/lib/supabase";

const categories = [
  "Stand-up Comedy",
  "Indie Music",
  "Theatre",
  "DJ / Electronic",
  "Sufi / Folk",
  "Spoken Word",
  "Dance",
  "Jazz",
];

const cities = ["Patna", "Ranchi", "Kolkata", "Delhi", "Mumbai", "Bengaluru", "Lucknow", "Goa"];

export function ArtistRegistrationModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [form, setForm] = useState({
    fullName: "",
    stageName: "",
    category: categories[0],
    location: cities[0],
    travelAvailability: "",
    rate: "",
    bio: "",
    portfolioLinks: "",
    contactEmail: "",
    contactPhone: "",
  });

  const set = (key: keyof typeof form, value: string) =>
    setForm((current) => ({ ...current, [key]: value }));

  const resetForm = () => {
    setForm({
      fullName: "",
      stageName: "",
      category: categories[0],
      location: cities[0],
      travelAvailability: "",
      rate: "",
      bio: "",
      portfolioLinks: "",
      contactEmail: "",
      contactPhone: "",
    });
    setServerError(null);
    setSubmitted(false);
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setServerError(null);
    setSending(true);

    const fullName = form.fullName || "";
    const stageName = form.stageName || "";
    const slugBase = (stageName || fullName || "artist")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-");

    const payload = {
      id: slugBase || `artist-${Date.now()}`,
      name: fullName || "",
      stage_name: stageName || null,
      category: form.category || "General",
      location: form.location || "Patna",
      travel_availability: form.travelAvailability || null,
      rate: Number(form.rate) || 0,
      description: form.bio || null,
      portfolio_links: form.portfolioLinks || null,
      contact_email: form.contactEmail || null,
      contact_phone: form.contactPhone || null,
      availability_status: "pending",
    };

    if (!supabase) {
      setSending(false);
      setServerError(
        "Supabase is not configured. Your application could not be saved.",
      );
      return;
    }

    try {
      const { error } = await supabase.from("artists").insert([payload]);

      if (error) {
        setSending(false);
        console.error("[supabase] artist insert error:", error);
        let message =
          "We could not save your application. Please try again.";
        if (error.code === "23505") {
          message =
            "An artist with this name already exists. Please use a different stage name.";
        } else if (error.message) {
          message = error.message;
        }
        setServerError(message);
        return;
      }

      resetForm();
      setSubmitted(true);
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      setSending(false);
      console.error("[supabase] artist insert exception:", error);
      const message =
        error instanceof Error ? error.message : "An unexpected error occurred.";
      setServerError(message);
    }
  };

  return (
    <Modal open={open} onClose={onClose} size="large" labelledBy="registration-title">
      {!submitted ? (
        <form className="registration-modal" onSubmit={submit}>
          <div className="registration-modal__head">
            <span className="eyebrow">Artist Onboarding</span>
            <h2 id="registration-title">Register as an Artist</h2>
            <p>
              Join the Kalakaar Networks roster. Once submitted, your application
              goes into review and our booking desk will be in touch.
            </p>
          </div>

          {serverError && (
            <div className="registration-modal__error">
              <Icon name="close" size={15} />
              <span>{serverError}</span>
            </div>
          )}

          <div className="form-grid">
            <label className="field">
              <span className="field__label">Full Name</span>
              <input
                required
                value={form.fullName}
                onChange={(event) => set("fullName", event.target.value)}
                placeholder="Devansh Sinha"
              />
            </label>
            <label className="field">
              <span className="field__label">Stage Name (optional)</span>
              <input
                value={form.stageName}
                onChange={(event) => set("stageName", event.target.value)}
                placeholder="The Sufi Cartel"
              />
            </label>
            <label className="field">
              <span className="field__label">Category / Genre</span>
              <select
                required
                value={form.category}
                onChange={(event) => set("category", event.target.value)}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span className="field__label">Base Location</span>
              <select
                required
                value={form.location}
                onChange={(event) => set("location", event.target.value)}
              >
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span className="field__label">Travel Availability</span>
              <input
                required
                value={form.travelAvailability}
                onChange={(event) => set("travelAvailability", event.target.value)}
                placeholder="Patna, Ranchi, Kolkata"
              />
            </label>
            <label className="field">
              <span className="field__label">Performance Fee (₹)</span>
              <input
                type="number"
                min="0"
                required
                value={form.rate}
                onChange={(event) => set("rate", event.target.value)}
                placeholder="150000"
              />
            </label>
            <label className="field field--full">
              <span className="field__label">Short Bio</span>
              <textarea
                rows={3}
                required
                value={form.bio}
                onChange={(event) => set("bio", event.target.value)}
                placeholder="Tell us about your work, your sound, and the rooms you play."
              />
            </label>
            <label className="field field--full">
              <span className="field__label">Portfolio / Social Links</span>
              <input
                value={form.portfolioLinks}
                onChange={(event) => set("portfolioLinks", event.target.value)}
                placeholder="Instagram, YouTube, or Spotify links (comma separated)"
              />
            </label>
            <label className="field">
              <span className="field__label">Contact Email</span>
              <input
                type="email"
                required
                value={form.contactEmail}
                onChange={(event) => set("contactEmail", event.target.value)}
                placeholder="you@example.com"
              />
            </label>
            <label className="field">
              <span className="field__label">Contact Phone</span>
              <input
                required
                value={form.contactPhone}
                onChange={(event) => set("contactPhone", event.target.value)}
                placeholder="+91 98xxx xxxxx"
              />
            </label>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="button button--ghost"
              onClick={onClose}
              disabled={sending}
            >
              Cancel
            </button>
            <button type="submit" className="button button--ink" disabled={sending}>
              {sending ? "Submitting…" : "Submit Application"}
              <Icon name="arrow-up-right" size={15} />
            </button>
          </div>
        </form>
      ) : (
        <div className="booking-success">
          <div className="booking-success__mark">
            <Icon name="check" size={24} strokeWidth={1.7} />
          </div>
          <span className="eyebrow">Application received</span>
          <h2 id="registration-title">Thank you, {form.fullName}.</h2>
          <p>
            Your artist application has been submitted and is now under review by
            the Kalakaar booking desk. We will be in touch within a few working days.
          </p>
          <div className="booking-success__actions">
            <button type="button" className="button button--ink" onClick={onClose}>
              Back to the site
              <Icon name="arrow-right" size={16} />
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}
