"use client";

import { useMemo, useState, useEffect, type FormEvent } from "react";
import Image from "next/image";
import {
  artistInquiries,
  artistPayouts,
  bookedDatesForArtist,
  dateKey,
  formatINR,
  todayKey,
} from "@/data/mock";
import { fetchGigs, type GigView } from "@/lib/supabase-data";
import { monthMatrix, monthNames, weekdayLabels } from "@/lib/date";
import { DashboardShell } from "./DashboardShell";
import { Icon } from "@/components/ui/Icon";
import { Modal } from "@/components/ui/Modal";
import { Toast } from "@/components/ui/Toast";

const navItems = [
  { label: "Overview", href: "#overview", icon: "grid" as const },
  { label: "Calendar", href: "#availability", icon: "calendar" as const },
  { label: "Inquiries", href: "#inquiries", icon: "message" as const, badge: "2" },
  { label: "Payouts", href: "#payouts", icon: "rupee" as const },
  { label: "Profile", href: "#profile", icon: "mic" as const },
];

const runOfShow = [
  { time: "4:00 PM", label: "Load-in", detail: "Artist and crew arrive at Urja stage door." },
  { time: "5:15 PM", label: "Soundcheck", detail: "30-minute line check, then clear the stage." },
  { time: "7:00 PM", label: "Doors", detail: "Guest list closes. Green room check." },
  { time: "7:30 PM", label: "Set", detail: "Ananya Rao, 55 minutes, followed by meet-and-greet." },
  { time: "9:00 PM", label: "Settlement", detail: "Final payout released by the studio producer." },
];

const bookedMap = new Map(bookedDatesForArtist.map((item) => [item.key, item]));

export function ArtistView({ onClientView }: { onClientView: () => void }) {
  const [cursor, setCursor] = useState(new Date(2026, 10, 1));
  const [blocked, setBlocked] = useState<Set<string>>(
    () => new Set(["2026-11-17", "2026-11-18", "2026-11-25", "2026-12-03"])
  );
  const [inquiryState, setInquiryState] = useState<Record<string, string>>(
    () => Object.fromEntries(artistInquiries.map((inquiry) => [inquiry.id, inquiry.status]))
  );
  const [toast, setToast] = useState<string | null>(null);
  const [runOpen, setRunOpen] = useState(false);
  const [payoutOpen, setPayoutOpen] = useState(false);
  const [payoutSent, setPayoutSent] = useState(false);
  const [gigs, setGigs] = useState<GigView[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetchGigs().then((fetched) => {
      if (!cancelled) {
        setGigs(fetched);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const cells = useMemo(() => monthMatrix(year, month), [year, month]);

  const monthStats = useMemo(() => {
    let available = 0;
    let busy = 0;
    let booked = 0;
    cells.forEach((cell) => {
      if (!cell.current) return;
      const key = dateKey(cell.date);
      if (bookedMap.has(key)) booked += 1;
      else if (blocked.has(key)) busy += 1;
      else if (key >= todayKey) available += 1;
    });
    return { available, busy, booked };
  }, [cells, blocked]);

  const setInquiry = (id: string, status: string, message: string) => {
    setInquiryState((current) => ({ ...current, [id]: status }));
    setToast(message);
  };

  const submitPayout = (event: FormEvent) => {
    event.preventDefault();
    setPayoutSent(true);
  };

  return (
    <DashboardShell
      role="Artist"
      workspace="Artist workspace"
      userName="Ananya Rao"
      userMeta="Comedian · Patna"
      initials="AR"
      navItems={navItems}
      current="Overview"
      onClientView={onClientView}
      topRight={<span className="top-status"><i /> Profile live</span>}
    >
      <div className="dash-page" id="overview">
        <div className="dash-page-head">
          <div>
            <span className="eyebrow">Wednesday, 4 November · Patna</span>
            <h1>Good evening, Ananya.</h1>
            <p>
              One gig this month, two holds waiting on you. November is nearly
              gone; December has room.
            </p>
          </div>
          <div className="dash-page-head__actions">
            <a href="#availability" className="button button--line">
              <Icon name="calendar" size={16} />
              Update availability
            </a>
            <button type="button" className="button button--ink" onClick={() => setRunOpen(true)}>
              Next run of show
              <Icon name="arrow-up-right" size={16} />
            </button>
          </div>
        </div>

        <section className="dash-hero">
          <div className="next-gig">
            <div className="next-gig__image">
              <Image
                src="/images/event-08.png"
                alt="The Laugh Assembly stage"
                fill
                loading="eager"
                sizes="(max-width: 900px) 100vw, 52vw"
                style={{ objectFit: "cover" }}
              />
              <span className="next-gig__tag">Confirmed · KS-2048</span>
              <div className="next-gig__date">
                <span>NOV</span>
                <strong>14</strong>
              </div>
            </div>
            <div className="next-gig__body">
              <div>
                <span className="eyebrow">Next on stage</span>
                <h2>The Laugh Assembly</h2>
                <p className="next-gig__meta">
                  <span><Icon name="pin" size={14} /> Urja Auditorium, Patna</span>
                  <span><Icon name="clock" size={14} /> 7:30 PM · doors 7:00</span>
                </p>
              </div>
              <div className="next-gig__ledger">
                <div>
                  <span>Fee</span>
                  <strong>₹1,80,000</strong>
                </div>
                <div>
                  <span>Advance</span>
                  <strong className="is-paid">Received</strong>
                </div>
                <div>
                  <span>Set</span>
                  <strong>55 min</strong>
                </div>
              </div>
              <div className="next-gig__footer">
                <span className="top-status"><i /> All riders confirmed</span>
                <button type="button" className="text-link" onClick={() => setRunOpen(true)}>
                  View call sheet
                  <Icon name="arrow-up-right" size={15} />
                </button>
              </div>
            </div>
          </div>

          <div className="dash-side-card">
            <div className="dash-side-card__head">
              <span className="eyebrow">This month</span>
              <button type="button" className="icon-button" aria-label="Payout details">
                <Icon name="more" size={18} />
              </button>
            </div>
            <div className="payout-figure">
              <span>Projected payout</span>
              <strong>₹4.0<span>L</span></strong>
              <p><span>↑ 17%</span> against October</p>
            </div>
            <div className="payout-split">
              <div>
                <span>Confirmed</span>
                <strong>₹1.8L</strong>
              </div>
              <div>
                <span>Awaiting</span>
                <strong>₹2.2L</strong>
              </div>
            </div>
            <div className="profile-meter">
              <div className="profile-meter__row">
                <span>Profile strength</span>
                <strong>92%</strong>
              </div>
              <div className="meter"><span style={{ width: "92%" }} /></div>
              <p>Add a recent show reel to complete your press kit.</p>
            </div>
          </div>
        </section>

        <div className="dash-stat-strip">
          <div>
            <span>Confirmed gigs</span>
            <strong>06</strong>
            <em>next 90 days</em>
          </div>
          <div>
            <span>Open inquiries</span>
            <strong>02</strong>
            <em>reply by Friday</em>
          </div>
          <div>
            <span>Audience reached</span>
            <strong>4,860</strong>
            <em>this season</em>
          </div>
          <div>
            <span>Repeat bookers</span>
            <strong>68%</strong>
            <em>last 12 months</em>
          </div>
        </div>

        <div className="dash-columns">
          <section className="panel panel--gigs" id="gigs">
            <div className="panel__head">
              <div>
                <span className="eyebrow">Upcoming</span>
                <h2>On the calendar</h2>
              </div>
              <a href="#availability" className="text-link">View all</a>
            </div>
            <div className="gig-list">
              {gigs.map((gig) => (
                <article key={`${gig.date}-${gig.title}`} className="gig-row">
                  <div className="gig-row__date">
                    <strong>{gig.date.split(" ")[0]}</strong>
                    <span>{gig.date.split(" ")[1]} · {gig.day}</span>
                  </div>
                  <div className="gig-row__image">
                    <Image
                      src={gig.image}
                      alt=""
                      fill
                      sizes="48px"
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                  <div className="gig-row__copy">
                    <h3>{gig.title}</h3>
                    <p>{gig.venue} · {gig.time}</p>
                  </div>
                  <div className="gig-row__fee">
                    <span>{gig.fee}</span>
                    <em className={gig.status === "Confirmed" ? "is-confirmed" : ""}>{gig.status}</em>
                  </div>
                  <button type="button" className="round-link round-link--small" aria-label={`Open ${gig.title}`}>
                    <Icon name="arrow-up-right" size={15} />
                  </button>
                </article>
              ))}
            </div>
          </section>

          <section className="panel" id="inquiries">
            <div className="panel__head">
              <div>
                <span className="eyebrow">Needs a reply</span>
                <h2>Inquiry desk</h2>
              </div>
              <span className="panel__count">02 open</span>
            </div>
            <div className="inquiry-list">
              {artistInquiries.map((inquiry) => {
                const status = inquiryState[inquiry.id];
                return (
                  <article key={inquiry.id} className={`inquiry ${status.toLowerCase().replaceAll(" ", "-")}`}>
                    <div className="inquiry__head">
                      <div>
                        <span>{inquiry.client}</span>
                        <h3>{inquiry.event}</h3>
                      </div>
                      <em>{status}</em>
                    </div>
                    <p className="inquiry__meta">
                      {inquiry.date} · {inquiry.city} · {formatINR(inquiry.fee)}
                    </p>
                    <p className="inquiry__note">{inquiry.note}</p>
                    {status === "New" || status === "Awaiting reply" ? (
                      <div className="inquiry__actions">
                        <button
                          type="button"
                          className="button button--ink button--tiny"
                          onClick={() => setInquiry(inquiry.id, "Confirmed", "Inquiry accepted. Your booking lead will send the contract.")}
                        >
                          Accept
                        </button>
                        <button
                          type="button"
                          className="button button--ghost button--tiny"
                          onClick={() => setInquiry(inquiry.id, "Declined", "Inquiry declined. The studio will suggest an alternate date.")}
                        >
                          Pass
                        </button>
                        <button type="button" className="text-link text-link--small">Open brief</button>
                      </div>
                    ) : (
                      <div className="inquiry__resolved">
                        <span className="top-status"><i /> {status === "Declined" ? "Closed" : "Added to calendar"}</span>
                        {status === "Confirmed" && <span>Contract queued</span>}
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          </section>
        </div>

        <section className="panel availability-panel" id="availability">
          <div className="panel__head">
            <div>
              <span className="eyebrow">Set your month</span>
              <h2>Availability</h2>
              <p className="panel__sub">
                Tap a date to mark it busy. Confirmed bookings are locked by the studio.
              </p>
            </div>
            <div className="availability-panel__controls">
              <div className="cal-legend">
                <span><i className="cal-dot cal-dot--free" /> Available</span>
                <span><i className="cal-dot cal-dot--busy" /> Busy</span>
                <span><i className="cal-dot cal-dot--booked" /> Booked</span>
              </div>
              <div className="month-switch">
                <button
                  type="button"
                  className="icon-button"
                  onClick={() => setCursor(new Date(year, month - 1, 1))}
                  aria-label="Previous month"
                >
                  <Icon name="chevron-left" size={17} />
                </button>
                <strong>{monthNames[month]} {year}</strong>
                <button
                  type="button"
                  className="icon-button"
                  onClick={() => setCursor(new Date(year, month + 1, 1))}
                  aria-label="Next month"
                >
                  <Icon name="chevron-right" size={17} />
                </button>
              </div>
            </div>
          </div>

          <div className="artist-availability">
            <div className="artist-calendar">
              <div className="artist-calendar__labels">
                {weekdayLabels.map((label) => <span key={label}>{label}</span>)}
              </div>
              <div className="artist-calendar__grid">
                {cells.map((cell, index) => {
                  const key = dateKey(cell.date);
                  const booked = bookedMap.get(key);
                  const isBusy = blocked.has(key);
                  const isPast = key < todayKey;
                  const isToday = key === todayKey;
                  const label = booked ? "Booked" : isBusy ? "Busy" : "Available";
                  return (
                    <button
                      key={`${key}-${index}`}
                      type="button"
                      className={`artist-day ${!cell.current ? "is-outside" : ""} ${
                        booked ? "is-booked" : isBusy ? "is-busy" : "is-free"
                      } ${isPast ? "is-past" : ""} ${isToday ? "is-today" : ""}`}
                      disabled={Boolean(booked) || isPast}
                      onClick={() => {
                        if (!cell.current || isPast || booked) return;
                        setBlocked((current) => {
                          const next = new Set(current);
                          if (next.has(key)) next.delete(key);
                          else next.add(key);
                          return next;
                        });
                      }}
                      title={booked ? `${booked.title} · ${booked.venue}` : label}
                      aria-label={`${cell.date.toLocaleDateString("en-IN", { day: "numeric", month: "long" })}, ${label}`}
                    >
                      <span className="artist-day__num">{cell.date.getDate()}</span>
                      {booked ? (
                        <span className="artist-day__event">{booked.title}</span>
                      ) : (
                        <span className="artist-day__state">{isBusy ? "Busy" : "Open"}</span>
                      )}
                      {isBusy && <i className="artist-day__slash" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <aside className="availability-summary">
              <span className="eyebrow">{monthNames[month]} at a glance</span>
              <div className="availability-summary__figure">
                <strong>{monthStats.available}</strong>
                <span>dates open</span>
              </div>
              <div className="availability-summary__rows">
                <div><span><i className="cal-dot cal-dot--booked" /> Booked</span><strong>{monthStats.booked}</strong></div>
                <div><span><i className="cal-dot cal-dot--busy" /> Marked busy</span><strong>{monthStats.busy}</strong></div>
                <div><span><i className="cal-dot cal-dot--free" /> Available</span><strong>{monthStats.available}</strong></div>
              </div>
              <p>
                Changes sync to the studio booking desk instantly. Public views
                show availability only, never the reason.
              </p>
              <button
                type="button"
                className="button button--line button--full"
                onClick={() => setToast("Availability synced with the studio desk.")}
              >
                <Icon name="check" size={15} />
                Sync calendar
              </button>
              <div className="availability-summary__tip">
                <Icon name="clock" size={15} />
                <span>Two back-to-back travel days may need a buffer. Studio policy is one clear day between cities.</span>
              </div>
            </aside>
          </div>
        </section>

        <section className="panel payout-panel" id="payouts">
          <div className="panel__head">
            <div>
              <span className="eyebrow">Money</span>
              <h2>Payout summary</h2>
            </div>
            <button type="button" className="button button--ink button--small" onClick={() => setPayoutOpen(true)}>
              Request payout
              <Icon name="arrow-up-right" size={15} />
            </button>
          </div>

          <div className="payout-layout">
            <div className="payout-chart">
              <div className="payout-chart__head">
                <div>
                  <span>Last five months</span>
                  <strong>₹9.1L</strong>
                </div>
                <span className="payout-chart__delta">↑ 22% season growth</span>
              </div>
              <div className="bars">
                {artistPayouts.map((item) => (
                  <div key={item.month} className={`bar ${item.month === "Nov" ? "is-current" : ""}`}>
                    <span className="bar__value">{item.label.split(" ")[0]}</span>
                    <div className="bar__track">
                      <span style={{ height: `${(item.value / 260000) * 100}%` }} />
                    </div>
                    <span className="bar__label">{item.month}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="payout-next">
              <span className="eyebrow">Next settlement</span>
              <strong>₹1,80,000</strong>
              <p>The Laugh Assembly · 14 Nov</p>
              <div className="payout-next__rows">
                <div><span>Artist fee</span><span>₹1,80,000</span></div>
                <div><span>Studio commission</span><span>Included</span></div>
                <div><span>Account</span><span>HDFC ····4812</span></div>
              </div>
              <button type="button" className="text-link" onClick={() => setPayoutOpen(true)}>
                Change settlement account
                <Icon name="arrow-up-right" size={15} />
              </button>
            </div>
          </div>
        </section>

        <div className="dash-footnote">
          <span>Kalakaar artist workspace · last synced 09:42</span>
          <span>Need help? <a href="mailto:artists@kalakaarstudios.in">artists@kalakaarstudios.in</a></span>
        </div>
      </div>

      <Modal open={runOpen} onClose={() => setRunOpen(false)} size="medium" labelledBy="run-title">
        <div className="run-modal">
          <span className="eyebrow">Call sheet · 14 November 2026</span>
          <h2 id="run-title">The Laugh Assembly</h2>
          <p className="run-modal__meta">Urja Auditorium, Patna · doors 7:00 PM · set 7:30 PM</p>
          <div className="run-list">
            {runOfShow.map((item) => (
              <div key={item.time} className="run-row">
                <span className="run-row__time">{item.time}</span>
                <span className="run-row__dot" />
                <div>
                  <strong>{item.label}</strong>
                  <p>{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="run-modal__footer">
            <span>Production lead · Devansh Sinha</span>
            <button type="button" className="button button--ink button--small" onClick={() => setRunOpen(false)}>
              Close call sheet
            </button>
          </div>
        </div>
      </Modal>

      <Modal open={payoutOpen} onClose={() => { setPayoutOpen(false); setPayoutSent(false); }} size="small" labelledBy="payout-title">
        {!payoutSent ? (
          <form className="payout-modal" onSubmit={submitPayout}>
            <span className="eyebrow">Settlement request</span>
            <h2 id="payout-title">Move your money.</h2>
            <p>
              Your available balance is <strong>₹1,80,000</strong>. Transfer to
              HDFC ····4812 usually settles in two working days.
            </p>
            <label className="field">
              <span className="field__label">Amount</span>
              <input defaultValue="180000" type="number" min="1000" max="180000" required />
            </label>
            <label className="field">
              <span className="field__label">Note to accounts</span>
              <textarea rows={2} placeholder="Optional note" />
            </label>
            <button type="submit" className="button button--ink button--full">
              Request transfer
              <Icon name="arrow-right" size={16} />
            </button>
          </form>
        ) : (
          <div className="payout-modal payout-modal--done">
            <span className="booking-success__mark"><Icon name="check" size={22} /></span>
            <span className="eyebrow">Request logged</span>
            <h2 id="payout-title">On its way.</h2>
            <p>
              Your payout request is with accounts. The studio will confirm the
              transfer by email within one working day.
            </p>
            <button type="button" className="button button--ink button--full" onClick={() => { setPayoutOpen(false); setPayoutSent(false); }}>
              Back to payouts
            </button>
          </div>
        )}
      </Modal>

      <Toast message={toast} onDone={() => setToast(null)} />
    </DashboardShell>
  );
}
