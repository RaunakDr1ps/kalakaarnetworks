"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import {
  artists,
  dateKey,
  formatINR,
  getEventsOn,
  isArtistFree,
  isVenueFree,
  todayKey,
  venues,
  type Artist,
  type Venue,
} from "@/data/mock";
import { Icon } from "@/components/ui/Icon";
import { monthMatrix, monthNames, weekdayLabels } from "@/lib/date";

type CalendarFilter = "all" | "shows" | "talent" | "rooms";

const filters: { key: CalendarFilter; label: string }[] = [
  { key: "all", label: "Everything" },
  { key: "shows", label: "Public shows" },
  { key: "talent", label: "Talent free" },
  { key: "rooms", label: "Rooms free" },
];

export function AvailabilityCalendar({
  onBookArtist,
  onBookVenue,
}: {
  onBookArtist: (artist: Artist, date: string) => void;
  onBookVenue: (venue: Venue, date: string) => void;
}) {
  const [cursor, setCursor] = useState(new Date(2026, 10, 1));
  const [selected, setSelected] = useState("2026-11-21");
  const [filter, setFilter] = useState<CalendarFilter>("all");

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const cells = useMemo(() => monthMatrix(year, month), [year, month]);

  const selectedEvents = getEventsOn(selected);
  const selectedArtists = artists.filter((artist) => isArtistFree(artist, selected));
  const selectedVenues = venues.filter((venue) => isVenueFree(venue, selected));
  const selectedDate = new Date(`${selected}T12:00:00`);
  const selectedLabel = selectedDate.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  const moveMonth = (direction: number) => {
    setCursor(new Date(year, month + direction, 1));
  };

  const jumpToToday = () => {
    const date = new Date(`${todayKey}T12:00:00`);
    setCursor(new Date(date.getFullYear(), date.getMonth(), 1));
    setSelected(todayKey);
  };

  return (
    <div className="availability">
      <div className="availability__calendar">
        <div className="availability__top">
          <div className="availability__month">
            <button
              type="button"
              className="icon-button"
              onClick={() => moveMonth(-1)}
              aria-label="Previous month"
            >
              <Icon name="chevron-left" size={18} />
            </button>
            <div>
              <span className="eyebrow">Studio calendar</span>
              <h3>
                {monthNames[month]} <span>{year}</span>
              </h3>
            </div>
            <button
              type="button"
              className="icon-button"
              onClick={() => moveMonth(1)}
              aria-label="Next month"
            >
              <Icon name="chevron-right" size={18} />
            </button>
          </div>

          <div className="availability__tools">
            <button type="button" className="text-link" onClick={jumpToToday}>
              Today
            </button>
            <div className="segmented segmented--small" role="tablist" aria-label="Calendar filters">
              {filters.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  role="tab"
                  aria-selected={filter === item.key}
                  className={filter === item.key ? "is-active" : ""}
                  onClick={() => setFilter(item.key)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="calendar-grid calendar-grid--labels">
          {weekdayLabels.map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>

        <div className="calendar-grid calendar-grid--days">
          {cells.map((cell, index) => {
            const key = dateKey(cell.date);
            const events = getEventsOn(key);
            const talentFree = artists.filter((artist) => isArtistFree(artist, key)).length;
            const roomsFree = venues.filter((venue) => isVenueFree(venue, key)).length;
            const isSelected = key === selected;
            const isToday = key === todayKey;
            const showEvents = filter === "all" || filter === "shows";
            const showTalent = filter === "all" || filter === "talent";
            const showRooms = filter === "all" || filter === "rooms";
            const cellLabel = cell.date.toLocaleDateString("en-IN", {
              weekday: "long",
              day: "numeric",
              month: "long",
            });
            const ariaLabel = `${cellLabel}, ${events.length} public ${
              events.length === 1 ? "event" : "events"
            }, ${talentFree} artists free, ${roomsFree} rooms free`;

            return (
              <button
                key={`${key}-${index}`}
                type="button"
                className={`calendar-day ${cell.current ? "" : "is-outside"} ${
                  isSelected ? "is-selected" : ""
                } ${isToday ? "is-today" : ""} ${events.length ? "has-event" : ""}`}
                onClick={() => {
                  setSelected(key);
                  if (!cell.current) {
                    setCursor(new Date(cell.date.getFullYear(), cell.date.getMonth(), 1));
                  }
                }}
                aria-label={ariaLabel}
                aria-pressed={isSelected}
              >
                <span className="calendar-day__number">
                  {cell.date.getDate()}
                  {isToday && <em>today</em>}
                </span>
                <span className="calendar-day__body">
                  {showEvents &&
                    events.slice(0, 2).map((event) => (
                      <span key={event.id} className="calendar-event">
                        <i />
                        {event.title}
                      </span>
                    ))}
                  {showTalent && talentFree > 0 && (
                    <span className="calendar-stat calendar-stat--talent">
                      {talentFree} artists free
                    </span>
                  )}
                  {showRooms && roomsFree > 0 && (
                    <span className="calendar-stat calendar-stat--room">
                      {roomsFree} rooms free
                    </span>
                  )}
                </span>
              </button>
            );
          })}
        </div>

        <div className="calendar-key">
          <span><i className="key-event" /> Public show</span>
          <span><i className="key-talent" /> Talent available</span>
          <span><i className="key-room" /> Venue available</span>
          <span className="calendar-key__note">Live studio ledger · updated 09:42</span>
        </div>
      </div>

      <aside className="availability__panel">
        <div className="availability__panel-head">
          <span className="eyebrow">Selected date</span>
          <h3>{selectedLabel}</h3>
          <span className="availability__panel-year">{selected.slice(0, 4)}</span>
        </div>

        <div className="date-status">
          <span className="date-status__mark">
            {selectedEvents.length ? <Icon name="ticket" size={18} /> : <Icon name="calendar" size={18} />}
          </span>
          <div>
            <strong>{selectedEvents.length ? "The room is lively." : "The room is open."}</strong>
            <p>
              {selectedEvents.length
                ? `${selectedEvents.length} public ${selectedEvents.length === 1 ? "event" : "events"} and ${selectedArtists.length} artists still free.`
                : `${selectedArtists.length} artists and ${selectedVenues.length} venues are free on this date.`}
            </p>
          </div>
        </div>

        {selectedEvents.length > 0 && (filter === "all" || filter === "shows") && (
          <div className="panel-events">
            <span className="panel-label">On stage</span>
            {selectedEvents.map((event) => (
              <article key={event.id} className="panel-event">
                <div className="panel-event__image">
                  <Image
                    src={event.image}
                    alt=""
                    fill
                    sizes="72px"
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div>
                  <h4>{event.title}</h4>
                  <p>{event.time} · {event.venue}</p>
                  <span className="status-tag">{event.status}</span>
                </div>
              </article>
            ))}
          </div>
        )}

        {(filter === "all" || filter === "talent") && (
          <div className="panel-list">
            <div className="panel-list__head">
              <span className="panel-label">Talent free</span>
              <span>{selectedArtists.length}</span>
            </div>
            {selectedArtists.slice(0, 3).map((artist) => (
              <div key={artist.id} className="panel-row">
                <div className="panel-row__image">
                  <Image
                    src={artist.image}
                    alt=""
                    fill
                    sizes="40px"
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div className="panel-row__copy">
                  <strong>{artist.name}</strong>
                  <span>{artist.discipline} · {formatINR(artist.fee)}</span>
                </div>
                <button
                  type="button"
                  className="panel-row__action"
                  onClick={() => onBookArtist(artist, selected)}
                  aria-label={`Enquire about ${artist.name} on ${selectedLabel}`}
                >
                  <Icon name="plus" size={15} />
                </button>
              </div>
            ))}
          </div>
        )}

        {(filter === "all" || filter === "rooms") && (
          <div className="panel-list">
            <div className="panel-list__head">
              <span className="panel-label">Rooms free</span>
              <span>{selectedVenues.length}</span>
            </div>
            {selectedVenues.slice(0, 2).map((venue) => (
              <div key={venue.id} className="panel-row">
                <div className="panel-row__image panel-row__image--room">
                  <Image
                    src={venue.image}
                    alt=""
                    fill
                    sizes="40px"
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div className="panel-row__copy">
                  <strong>{venue.name}</strong>
                  <span>{venue.capacityLabel} · {venue.feeLabel}</span>
                </div>
                <button
                  type="button"
                  className="panel-row__action"
                  onClick={() => onBookVenue(venue, selected)}
                  aria-label={`Request ${venue.name} on ${selectedLabel}`}
                >
                  <Icon name="plus" size={15} />
                </button>
              </div>
            ))}
          </div>
        )}

        <button
          type="button"
          className="button button--ink button--full"
          onClick={() => {
            if (selectedArtists[0]) onBookArtist(selectedArtists[0], selected);
          }}
        >
          Book this date
          <Icon name="arrow-up-right" size={16} />
        </button>
        <p className="availability__fineprint">
          Availability is checked against confirmed holds and travel blocks.
          Dates are held for 72 hours after a written enquiry.
        </p>
      </aside>
    </div>
  );
}
