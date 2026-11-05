"use client";

import { useMemo, useState, type FormEvent } from "react";
import Image from "next/image";
import {
  clientBookings,
  clientInvoices,
  clientMessages,
  clientTimeline,
  dateKey,
  formatINR,
  todayKey,
} from "@/data/mock";
import { monthMatrix, monthNames, weekdayLabels } from "@/lib/date";
import { DashboardShell } from "./DashboardShell";
import { Icon } from "@/components/ui/Icon";
import { Modal } from "@/components/ui/Modal";
import { Toast } from "@/components/ui/Toast";

const navItems = [
  { label: "Overview", href: "#client-overview", icon: "grid" as const },
  { label: "Bookings", href: "#bookings", icon: "ticket" as const, badge: "3" },
  { label: "Schedule", href: "#schedule", icon: "calendar" as const },
  { label: "Invoices", href: "#invoices", icon: "file" as const, badge: "2" },
  { label: "Messages", href: "#messages", icon: "message" as const },
];

const bookingSteps = ["Request", "Artist", "Contract", "Event day"];
const productionDates = clientTimeline.map((item) => item.date);

export function CustomerDashboard({ onClientView }: { onClientView: () => void }) {
  const [selectedBooking, setSelectedBooking] = useState<(typeof clientBookings)[0] | null>(null);
  const [invoiceState, setInvoiceState] = useState<Record<string, "Due" | "Paid">>(
    () => Object.fromEntries(clientInvoices.map((invoice) => [invoice.id, invoice.status]))
  );
  const [payingInvoice, setPayingInvoice] = useState<(typeof clientInvoices)[0] | null>(null);
  const [messages, setMessages] = useState(clientMessages);
  const [draft, setDraft] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const [cursor, setCursor] = useState(new Date(2026, 10, 1));
  const [selectedDate, setSelectedDate] = useState("2026-11-21");

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const cells = useMemo(() => monthMatrix(year, month), [year, month]);

  const selectedBookingEvents = clientBookings.filter((booking) => booking.date === selectedDate);
  const selectedProduction = clientTimeline.filter((item) => item.date === selectedDate);
  const selectedLabel = new Date(`${selectedDate}T12:00:00`).toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  const dueTotal = clientInvoices.reduce((sum, invoice) => {
    return invoiceState[invoice.id] === "Due" ? sum + invoice.amount : sum;
  }, 0);

  const payInvoice = (event: FormEvent) => {
    event.preventDefault();
    if (!payingInvoice) return;
    setInvoiceState((current) => ({ ...current, [payingInvoice.id]: "Paid" }));
    setToast(`${payingInvoice.id} marked paid. A receipt is on its way.`);
    setPayingInvoice(null);
  };

  const sendMessage = (event: FormEvent) => {
    event.preventDefault();
    if (!draft.trim()) return;
    setMessages((current) => [
      ...current,
      {
        id: `m-${current.length + 1}`,
        from: "You",
        role: "Client",
        time: "Just now",
        body: draft.trim(),
        mine: true,
      },
    ]);
    setDraft("");
    setToast("Message sent to Devansh.");
  };

  return (
    <DashboardShell
      role="Client"
      workspace="Client workspace"
      userName="Ishaan Verma"
      userMeta="Patna · 3 active bookings"
      initials="IV"
      navItems={navItems}
      current="Overview"
      onClientView={onClientView}
      topRight={<span className="top-status"><i /> Concierge online</span>}
    >
      <div className="dash-page" id="client-overview">
        <div className="dash-page-head">
          <div>
            <span className="eyebrow">Wednesday, 4 November · Patna</span>
            <h1>Good afternoon, Ishaan.</h1>
            <p>
              Your season is taking shape. One production call next, two
              invoices to clear, and a room full of people waiting.
            </p>
          </div>
          <div className="dash-page-head__actions">
            <a href="#messages" className="button button--line">
              <Icon name="message" size={16} />
              Message the desk
            </a>
            <button type="button" className="button button--ink" onClick={onClientView}>
              Plan another night
              <Icon name="plus" size={16} />
            </button>
          </div>
        </div>

        <div className="dash-stat-strip dash-stat-strip--client">
          <div>
            <span>Active bookings</span>
            <strong>03</strong>
            <em>2 artists · 1 venue</em>
          </div>
          <div>
            <span>Next event</span>
            <strong>21 Nov</strong>
            <em>Sufi Under the Stars</em>
          </div>
          <div>
            <span>Balance due</span>
            <strong>{formatINR(dueTotal)}</strong>
            <em>across {Object.values(invoiceState).filter((status) => status === "Due").length} invoices</em>
          </div>
          <div>
            <span>Guest list</span>
            <strong>146</strong>
            <em>confirmed so far</em>
          </div>
        </div>

        <section className="panel bookings-panel" id="bookings">
          <div className="panel__head">
            <div>
              <span className="eyebrow">In motion</span>
              <h2>Active bookings</h2>
            </div>
            <button type="button" className="text-link" onClick={onClientView}>
              Add a booking
              <Icon name="plus" size={15} />
            </button>
          </div>

          <div className="booking-cards">
            {clientBookings.map((booking, index) => (
              <article key={booking.id} className="booking-card">
                <div className="booking-card__image">
                  <Image
                    src={booking.image}
                    alt=""
                    fill
                    loading={index === 0 ? "eager" : "lazy"}
                    sizes="(max-width: 900px) 100vw, 30vw"
                    style={{ objectFit: "cover" }}
                  />
                  <span className="booking-card__kind">{booking.kind}</span>
                  <span className="booking-card__id">{booking.id}</span>
                </div>
                <div className="booking-card__body">
                  <div className="booking-card__title">
                    <div>
                      <h3>{booking.name}</h3>
                      <p>{booking.detail}</p>
                    </div>
                    <span className="status-tag">{booking.status}</span>
                  </div>
                  <div className="booking-card__meta">
                    <span><Icon name="calendar" size={14} /> {booking.date}</span>
                    <span><Icon name="pin" size={14} /> {booking.venue}</span>
                  </div>
                  <div className="booking-progress">
                    {bookingSteps.map((step, index) => (
                      <div
                        key={step}
                        className={`booking-progress__step ${index <= booking.progress ? "is-done" : ""}`}
                      >
                        <span>{index + 1}</span>
                        <em>{step}</em>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    className="button button--ghost button--small button--full"
                    onClick={() => setSelectedBooking(booking)}
                  >
                    Open booking
                    <Icon name="arrow-up-right" size={15} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <div className="dash-columns dash-columns--client">
          <section className="panel" id="timeline">
            <div className="panel__head">
              <div>
                <span className="eyebrow">What happens next</span>
                <h2>Event timeline</h2>
              </div>
              <span className="panel__count">KS-2048</span>
            </div>
            <div className="client-timeline">
              {clientTimeline.map((item, index) => (
                <article key={`${item.date}-${item.title}`} className={`client-timeline__row ${item.status === "Next" ? "is-next" : ""}`}>
                  <div className="client-timeline__date">
                    <strong>{item.date.slice(8)}</strong>
                    <span>{new Date(`${item.date}T12:00:00`).toLocaleDateString("en-IN", { month: "short" })}</span>
                  </div>
                  <div className="client-timeline__line">
                    <i />
                    {index < clientTimeline.length - 1 && <span />}
                  </div>
                  <div className="client-timeline__copy">
                    <div>
                      <h3>{item.title}</h3>
                      <span>{item.time}</span>
                    </div>
                    <p>{item.detail}</p>
                  </div>
                </article>
              ))}
            </div>
            <div className="timeline-note">
              <Icon name="pin" size={16} />
              <div>
                <strong>Production call</strong>
                <span>Friday, 6 Nov at 4:00 PM · Google Meet</span>
              </div>
              <button type="button" className="text-link text-link--small">Join link</button>
            </div>
          </section>

          <section className="panel" id="invoices">
            <div className="panel__head">
              <div>
                <span className="eyebrow">Money</span>
                <h2>Invoices</h2>
              </div>
              <span className="panel__count">{formatINR(dueTotal)} due</span>
            </div>
            <div className="invoice-list">
              {clientInvoices.map((invoice) => {
                const status = invoiceState[invoice.id];
                return (
                  <article key={invoice.id} className={`invoice-row ${status === "Paid" ? "is-paid" : ""}`}>
                    <div className="invoice-row__mark">
                      {status === "Paid" ? <Icon name="check" size={17} /> : <Icon name="file" size={17} />}
                    </div>
                    <div className="invoice-row__copy">
                      <span>{invoice.id} · issued {invoice.issued}</span>
                      <h3>{invoice.title}</h3>
                      <p>{status === "Paid" ? `Settled ${invoice.due}` : `Due ${invoice.due}`}</p>
                    </div>
                    <div className="invoice-row__amount">
                      <strong>{formatINR(invoice.amount)}</strong>
                      <span className={`invoice-status ${status === "Paid" ? "is-paid" : ""}`}>{status}</span>
                    </div>
                    {status === "Due" ? (
                      <button
                        type="button"
                        className="button button--ink button--tiny"
                        onClick={() => setPayingInvoice(invoice)}
                      >
                        Pay
                      </button>
                    ) : (
                      <button type="button" className="icon-button" aria-label="Download receipt">
                        <Icon name="download" size={17} />
                      </button>
                    )}
                  </article>
                );
              })}
            </div>
            <p className="invoice-footnote">
              All payments are held in escrow until 24 hours after the event.
            </p>
          </section>
        </div>

        <div className="dash-columns dash-columns--client">
          <section className="panel schedule-panel" id="schedule">
            <div className="panel__head">
              <div>
                <span className="eyebrow">Your dates</span>
                <h2>Event schedule</h2>
              </div>
              <div className="month-switch">
                <button type="button" className="icon-button" onClick={() => setCursor(new Date(year, month - 1, 1))} aria-label="Previous month">
                  <Icon name="chevron-left" size={17} />
                </button>
                <strong>{monthNames[month]} {year}</strong>
                <button type="button" className="icon-button" onClick={() => setCursor(new Date(year, month + 1, 1))} aria-label="Next month">
                  <Icon name="chevron-right" size={17} />
                </button>
              </div>
            </div>

            <div className="client-calendar">
              <div className="client-calendar__grid client-calendar__grid--labels">
                {weekdayLabels.map((label) => <span key={label}>{label}</span>)}
              </div>
              <div className="client-calendar__grid">
                {cells.map((cell, index) => {
                  const key = dateKey(cell.date);
                  const booking = clientBookings.find((item) => item.date === key);
                  const production = productionDates.includes(key);
                  return (
                    <button
                      key={`${key}-${index}`}
                      type="button"
                      className={`client-day ${!cell.current ? "is-outside" : ""} ${
                        key === selectedDate ? "is-selected" : ""
                      } ${key === todayKey ? "is-today" : ""}`}
                      onClick={() => {
                        setSelectedDate(key);
                        if (!cell.current) setCursor(new Date(cell.date.getFullYear(), cell.date.getMonth(), 1));
                      }}
                    >
                      <span>{cell.date.getDate()}</span>
                      <i className="client-day__marks">
                        {booking && <em className="mark-event" />}
                        {production && <em className="mark-production" />}
                      </i>
                    </button>
                  );
                })}
              </div>
              <div className="cal-legend cal-legend--client">
                <span><i className="mark-event" /> Event</span>
                <span><i className="mark-production" /> Production</span>
              </div>
            </div>

            <div className="schedule-detail">
              <span className="eyebrow">Selected · {selectedLabel}</span>
              {selectedBookingEvents.length || selectedProduction.length ? (
                <div className="schedule-detail__list">
                  {selectedBookingEvents.map((booking) => (
                    <div key={booking.id} className="schedule-detail__row">
                      <span className="schedule-detail__time">Event</span>
                      <div>
                        <strong>{booking.name}</strong>
                        <p>{booking.detail} · {booking.venue}</p>
                      </div>
                    </div>
                  ))}
                  {selectedProduction.map((item) => (
                    <div key={item.title} className="schedule-detail__row">
                      <span className="schedule-detail__time">{item.time}</span>
                      <div>
                        <strong>{item.title}</strong>
                        <p>{item.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="schedule-detail__empty">
                  Nothing scheduled. A good night for a site visit.
                </p>
              )}
            </div>
          </section>

          <section className="panel messages-panel" id="messages">
            <div className="panel__head">
              <div>
                <span className="eyebrow">Direct line</span>
                <h2>Messages</h2>
              </div>
              <div className="message-contact">
                <span className="avatar avatar--small">DS</span>
                <span>Devansh · Booking lead</span>
                <i />
              </div>
            </div>

            <div className="message-thread">
              {messages.map((message) => (
                <article key={message.id} className={`message ${message.mine ? "is-mine" : ""}`}>
                  <div className="message__meta">
                    <strong>{message.from}</strong>
                    <span>{message.time}</span>
                  </div>
                  <p>{message.body}</p>
                </article>
              ))}
            </div>

            <form className="message-form" onSubmit={sendMessage}>
              <textarea
                rows={2}
                placeholder="Write to the booking desk…"
                aria-label="Message the booking desk"
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
              />
              <button type="submit" className="button button--ink button--small" aria-label="Send message">
                Send
                <Icon name="send" size={15} />
              </button>
            </form>
          </section>
        </div>

        <div className="concierge-strip">
          <span className="concierge-strip__mark"><Icon name="compass" size={20} /></span>
          <div>
            <span className="eyebrow">Your booking lead</span>
            <h3>Devansh is on the desk until 7pm.</h3>
            <p>One person for the artist, the room, the invoice and the door.</p>
          </div>
          <a href="tel:+919876543210" className="button button--line button--small">
            Call Devansh
            <Icon name="arrow-up-right" size={15} />
          </a>
        </div>

        <div className="dash-footnote">
          <span>Kalakaar client workspace · all times IST</span>
          <span>Concierge · <a href="mailto:clients@kalakaarstudios.in">clients@kalakaarstudios.in</a></span>
        </div>
      </div>

      <Modal
        open={Boolean(selectedBooking)}
        onClose={() => setSelectedBooking(null)}
        size="medium"
        labelledBy="booking-detail-title"
      >
        {selectedBooking && (
          <div className="booking-detail-modal">
            <div className="booking-detail-modal__image">
              <Image src={selectedBooking.image} alt="" fill sizes="600px" style={{ objectFit: "cover" }} />
              <span>{selectedBooking.id}</span>
            </div>
            <div className="booking-detail-modal__body">
              <span className="eyebrow">{selectedBooking.kind} booking</span>
              <h2 id="booking-detail-title">{selectedBooking.name}</h2>
              <p>{selectedBooking.detail} at {selectedBooking.venue}.</p>
              <div className="booking-detail-modal__grid">
                <div><span>Date</span><strong>{selectedBooking.date}</strong></div>
                <div><span>Status</span><strong>{selectedBooking.status}</strong></div>
                <div><span>Production lead</span><strong>Devansh Sinha</strong></div>
                <div><span>Booking reference</span><strong>{selectedBooking.id}</strong></div>
              </div>
              <div className="booking-progress booking-progress--large">
                {bookingSteps.map((step, index) => (
                  <div key={step} className={`booking-progress__step ${index <= selectedBooking.progress ? "is-done" : ""}`}>
                    <span>{index + 1}</span>
                    <em>{step}</em>
                  </div>
                ))}
              </div>
              <div className="booking-detail-modal__actions">
                <button type="button" className="button button--line button--small">
                  Download brief
                  <Icon name="download" size={15} />
                </button>
                <button type="button" className="button button--ink button--small" onClick={() => setSelectedBooking(null)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <Modal open={Boolean(payingInvoice)} onClose={() => setPayingInvoice(null)} size="small" labelledBy="pay-title">
        {payingInvoice && (
          <form className="pay-modal" onSubmit={payInvoice}>
            <span className="eyebrow">Secure payment</span>
            <h2 id="pay-title">Settle {payingInvoice.id}.</h2>
            <p>{payingInvoice.title}</p>
            <div className="pay-modal__amount">
              <span>Amount due</span>
              <strong>{formatINR(payingInvoice.amount)}</strong>
            </div>
            <label className="field">
              <span className="field__label">Card number</span>
              <input inputMode="numeric" placeholder="0000 0000 0000 0000" defaultValue="4242 4242 4242 4242" required />
            </label>
            <div className="form-grid">
              <label className="field">
                <span className="field__label">Expiry</span>
                <input placeholder="MM / YY" defaultValue="08 / 29" required />
              </label>
              <label className="field">
                <span className="field__label">CVV</span>
                <input placeholder="123" defaultValue="•••" required />
              </label>
            </div>
            <button type="submit" className="button button--ink button--full">
              Pay {formatINR(payingInvoice.amount)}
              <Icon name="lock" size={15} />
            </button>
            <p className="pay-modal__note">Demo only. No payment will be processed.</p>
          </form>
        )}
      </Modal>

      <Toast message={toast} onDone={() => setToast(null)} />
    </DashboardShell>
  );
}
