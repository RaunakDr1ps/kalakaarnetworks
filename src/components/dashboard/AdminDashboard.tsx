"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import {
  adminRevenue,
  artists,
  assignmentLog,
  clientLeads,
  dateKey,
  formatINR,
  publicEvents,
  todayKey,
  venueRequests,
} from "@/data/mock";
import { monthMatrix, monthNames, weekdayLabels } from "@/lib/date";
import { DashboardShell } from "./DashboardShell";
import { Icon } from "@/components/ui/Icon";
import { Modal } from "@/components/ui/Modal";
import { Toast } from "@/components/ui/Toast";

const navItems = [
  { label: "Overview", href: "#admin-overview", icon: "grid" as const },
  { label: "Requests", href: "#requests", icon: "building" as const, badge: "7" },
  { label: "Assignments", href: "#assignments", icon: "mic" as const },
  { label: "Leads", href: "#leads", icon: "users" as const },
  { label: "Calendar", href: "#admin-calendar", icon: "calendar" as const },
];

type RequestFilter = "All" | "New" | "Reviewing" | "Approved";

export function AdminDashboard({ onClientView }: { onClientView: () => void }) {
  const [requestFilter, setRequestFilter] = useState<RequestFilter>("All");
  const [requestState, setRequestState] = useState<Record<string, string>>(
    () => Object.fromEntries(venueRequests.map((request) => [request.id, request.status]))
  );
  const [assigning, setAssigning] = useState<(typeof venueRequests)[0] | null>(null);
  const [assignArtist, setAssignArtist] = useState(artists[0].id);
  const [assignments, setAssignments] = useState(assignmentLog);
  const [leadState, setLeadState] = useState<Record<string, string>>(
    () => Object.fromEntries(clientLeads.map((lead) => [lead.id, lead.status]))
  );
  const [metric, setMetric] = useState<"both" | "booked" | "collected">("both");
  const [cursor, setCursor] = useState(new Date(2026, 10, 1));
  const [selectedDate, setSelectedDate] = useState("2026-11-21");
  const [listed, setListed] = useState<Set<string>>(
    () => new Set(publicEvents.map((event) => event.id))
  );
  const [toast, setToast] = useState<string | null>(null);

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const cells = useMemo(() => monthMatrix(year, month), [year, month]);

  const filteredRequests = venueRequests.filter(
    (request) => requestFilter === "All" || requestState[request.id] === requestFilter
  );

  const selectedEvents = publicEvents.filter((event) => event.date === selectedDate);
  const selectedLabel = new Date(`${selectedDate}T12:00:00`).toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  const setRequest = (id: string, status: string, message: string) => {
    setRequestState((current) => ({ ...current, [id]: status }));
    setToast(message);
  };

  const confirmAssignment = () => {
    if (!assigning) return;
    const artist = artists.find((item) => item.id === assignArtist);
    setRequestState((current) => ({ ...current, [assigning.id]: "Reviewing" }));
    setAssignments((current) => [
      {
        time: "Now",
        title: `Artist assigned · ${artist?.name ?? "Artist"}`,
        detail: `${assigning.id} · ${assigning.venue} · ${assigning.date}`,
        kind: "Assign",
      },
      ...current,
    ]);
    setToast(`${artist?.name} assigned to ${assigning.id}. Contract task created.`);
    setAssigning(null);
  };

  const toggleListed = (id: string) => {
    setListed((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const leadAction = (id: string, status: string, message: string) => {
    setLeadState((current) => ({ ...current, [id]: status }));
    setToast(message);
  };

  const maxRevenue = 24;

  return (
    <DashboardShell
      role="Admin"
      workspace="Control room"
      userName="Aarav Sinha"
      userMeta="Studio director"
      initials="AS"
      navItems={navItems}
      current="Overview"
      onClientView={onClientView}
      topRight={<span className="top-status top-status--admin"><i /> All systems live</span>}
    >
      <div className="dash-page" id="admin-overview">
        <div className="dash-page-head">
          <div>
            <span className="eyebrow">Wednesday, 4 November · 09:42 IST</span>
            <h1>Everything on the desk.</h1>
            <p>
              Seven venue requests, two holds expiring today and a full November
              calendar. The studio is moving.
            </p>
          </div>
          <div className="dash-page-head__actions">
            <button type="button" className="button button--line" onClick={() => setToast("Daily operations report exported as PDF.")}>
              <Icon name="download" size={16} />
              Export report
            </button>
            <button type="button" className="button button--ink" onClick={onClientView}>
              Open booking site
              <Icon name="arrow-up-right" size={16} />
            </button>
          </div>
        </div>

        <div className="dash-stat-strip dash-stat-strip--admin">
          <div>
            <span>November GMV</span>
            <strong>₹21.6L</strong>
            <em>↑ 17.4% month on month</em>
          </div>
          <div>
            <span>Collected</span>
            <strong>₹12.3L</strong>
            <em>57% of booked</em>
          </div>
          <div>
            <span>Open venue requests</span>
            <strong>07</strong>
            <em>2 expire today</em>
          </div>
          <div>
            <span>Lead conversion</span>
            <strong>68%</strong>
            <em>last 30 days</em>
          </div>
        </div>

        <div className="admin-top-grid">
          <section className="panel revenue-panel">
            <div className="panel__head">
              <div>
                <span className="eyebrow">Studio revenue</span>
                <h2>Booked against collected</h2>
              </div>
              <div className="segmented segmented--small" role="tablist" aria-label="Revenue metric">
                {[
                  ["both", "Both"],
                  ["booked", "Booked"],
                  ["collected", "Collected"],
                ].map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    role="tab"
                    aria-selected={metric === value}
                    className={metric === value ? "is-active" : ""}
                    onClick={() => setMetric(value as "both" | "booked" | "collected")}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="revenue-chart">
              <div className="revenue-chart__scale" aria-hidden="true">
                <span>₹24L</span>
                <span>₹16L</span>
                <span>₹8L</span>
                <span>₹0</span>
              </div>
              <div className="revenue-chart__plot">
                <div className="revenue-chart__grid" aria-hidden="true">
                  <i /><i /><i /><i />
                </div>
                <div className="revenue-bars">
                  {adminRevenue.map((item) => (
                    <div key={item.month} className="revenue-bar">
                      <div className="revenue-bar__columns">
                        {(metric === "both" || metric === "booked") && (
                          <span
                            className="revenue-bar__booked"
                            style={{ height: `${(item.booked / maxRevenue) * 100}%` }}
                            title={`Booked ₹${item.booked}L`}
                          />
                        )}
                        {(metric === "both" || metric === "collected") && (
                          <span
                            className="revenue-bar__collected"
                            style={{ height: `${(item.collected / maxRevenue) * 100}%` }}
                            title={`Collected ₹${item.collected}L`}
                          />
                        )}
                      </div>
                      <span className="revenue-bar__label">{item.month}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="revenue-footer">
              <div className="revenue-key">
                <span><i className="key-booked" /> Booked</span>
                <span><i className="key-collected" /> Collected</span>
              </div>
              <div className="revenue-summary">
                <div><span>Outstanding</span><strong>₹9.3L</strong></div>
                <div><span>Avg. booking value</span><strong>₹1.42L</strong></div>
                <div><span>Forecast close</span><strong>₹24.8L</strong></div>
              </div>
            </div>
          </section>

          <section className="panel ops-panel">
            <div className="panel__head">
              <div>
                <span className="eyebrow">Today</span>
                <h2>Production board</h2>
              </div>
              <span className="panel__count">4 live</span>
            </div>
            <div className="ops-list">
              {[
                { time: "10:00", title: "Sufi Cartel advance", detail: "₹2.4L expected · KS-2048", status: "Due today", icon: "rupee" as const },
                { time: "12:30", title: "Urja site visit", detail: "Bihar Chamber · 320 guests", status: "Confirmed", icon: "pin" as const },
                { time: "15:00", title: "Laugh Assembly tech", detail: "Urja Auditorium · Stage A", status: "In progress", icon: "stage" as const },
                { time: "18:00", title: "Old Mill load-in", detail: "Sound rig · 3 trucks", status: "Scheduled", icon: "building" as const },
              ].map((item) => (
                <article key={item.time} className="ops-row">
                  <span className="ops-row__time">{item.time}</span>
                  <span className="ops-row__icon"><Icon name={item.icon} size={16} /></span>
                  <div>
                    <strong>{item.title}</strong>
                    <p>{item.detail}</p>
                  </div>
                  <em>{item.status}</em>
                </article>
              ))}
            </div>
            <div className="ops-panel__footer">
              <span><i /> 2 holds expire by 6pm</span>
              <button type="button" className="text-link text-link--small" onClick={() => setToast("Hold queue opened.")}>
                Review holds
                <Icon name="arrow-right" size={14} />
              </button>
            </div>
          </section>
        </div>

        <section className="panel requests-panel" id="requests">
          <div className="panel__head panel__head--wrap">
            <div>
              <span className="eyebrow">Venue desk</span>
              <h2>Incoming room requests</h2>
            </div>
            <div className="segmented segmented--small" role="tablist" aria-label="Filter venue requests">
              {(["All", "New", "Reviewing", "Approved"] as RequestFilter[]).map((filter) => (
                <button
                  key={filter}
                  type="button"
                  role="tab"
                  aria-selected={requestFilter === filter}
                  className={requestFilter === filter ? "is-active" : ""}
                  onClick={() => setRequestFilter(filter)}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Request</th>
                  <th>Client</th>
                  <th>Room</th>
                  <th>Date</th>
                  <th>Capacity</th>
                  <th>Value</th>
                  <th>Status</th>
                  <th aria-label="Actions" />
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map((request) => {
                  const status = requestState[request.id];
                  return (
                    <tr key={request.id}>
                      <td><span className="table-id">{request.id}</span></td>
                      <td>
                        <strong>{request.client}</strong>
                        <span className="table-sub">{request.logistics}</span>
                      </td>
                      <td>{request.venue}</td>
                      <td>{request.date}</td>
                      <td>{request.capacity}</td>
                      <td><strong>{formatINR(request.budget)}</strong></td>
                      <td>
                        <span className={`request-status request-status--${status.toLowerCase()}`}>
                          {status}
                        </span>
                      </td>
                      <td>
                        <div className="table-actions">
                          {(status === "New" || status === "Reviewing") && (
                            <>
                              <button
                                type="button"
                                className="button button--ink button--tiny"
                                onClick={() => setRequest(request.id, "Approved", `${request.id} approved. Contract draft queued.`)}
                              >
                                Approve
                              </button>
                              <button
                                type="button"
                                className="icon-button"
                                aria-label={`Assign artist to ${request.id}`}
                                onClick={() => setAssigning(request)}
                              >
                                <Icon name="mic" size={16} />
                              </button>
                            </>
                          )}
                          {status === "Approved" && (
                            <button
                              type="button"
                              className="text-link text-link--small"
                              onClick={() => setAssigning(request)}
                            >
                              Assign artist
                              <Icon name="plus" size={13} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filteredRequests.length === 0 && (
              <div className="table-empty">
                No requests in this state. The desk is clear.
              </div>
            )}
          </div>
          <div className="requests-footer">
            <span>Showing {filteredRequests.length} of {venueRequests.length} requests</span>
            <span>Response target · under 4 working hours</span>
          </div>
        </section>

        <div className="admin-mid-grid">
          <section className="panel assignments-panel" id="assignments">
            <div className="panel__head">
              <div>
                <span className="eyebrow">Talent desk</span>
                <h2>Assignment log</h2>
              </div>
              <button type="button" className="text-link text-link--small" onClick={() => setToast("Full assignment log opened.")}>
                Full log
                <Icon name="arrow-up-right" size={14} />
              </button>
            </div>
            <div className="assignment-list">
              {assignments.slice(0, 6).map((entry, index) => (
                <article key={`${entry.title}-${index}`} className="assignment-row">
                  <div className="assignment-row__rail">
                    <i className={`assignment-mark assignment-mark--${entry.kind.toLowerCase()}`} />
                    {index < Math.min(assignments.length, 6) - 1 && <span />}
                  </div>
                  <div className="assignment-row__copy">
                    <div>
                      <strong>{entry.title}</strong>
                      <span>{entry.time}</span>
                    </div>
                    <p>{entry.detail}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="panel leads-panel" id="leads">
            <div className="panel__head">
              <div>
                <span className="eyebrow">CRM</span>
                <h2>Lead approvals</h2>
              </div>
              <span className="panel__count">₹9.3L pipeline</span>
            </div>
            <div className="lead-list">
              {clientLeads.map((lead) => {
                const status = leadState[lead.id];
                return (
                  <article key={lead.id} className={`lead-row ${status === "Approved" ? "is-approved" : ""}`}>
                    <div className="lead-row__head">
                      <div>
                        <span>{lead.id} · {lead.source}</span>
                        <h3>{lead.name}</h3>
                      </div>
                      <strong>{formatINR(lead.value)}</strong>
                    </div>
                    <p>{lead.event}</p>
                    {status === "Pending" ? (
                      <div className="lead-row__actions">
                        <button
                          type="button"
                          className="button button--ink button--tiny"
                          onClick={() => leadAction(lead.id, "Approved", `${lead.id} approved for the booking desk.`)}
                        >
                          Approve lead
                        </button>
                        <button
                          type="button"
                          className="button button--ghost button--tiny"
                          onClick={() => leadAction(lead.id, "On hold", `${lead.id} moved to nurture.`)}
                        >
                          Nurture
                        </button>
                      </div>
                    ) : (
                      <div className="lead-row__resolved">
                        <span className="top-status"><i /> {status}</span>
                        <button type="button" className="text-link text-link--small">Open CRM</button>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          </section>
        </div>

        <section className="panel admin-calendar-panel" id="admin-calendar">
          <div className="panel__head">
            <div>
              <span className="eyebrow">Master calendar</span>
              <h2>Event management</h2>
              <p className="panel__sub">
                Publish, hold and inspect every public night from one ledger.
              </p>
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

          <div className="admin-calendar">
            <div className="admin-calendar__main">
              <div className="admin-calendar__labels">
                {weekdayLabels.map((label) => <span key={label}>{label}</span>)}
              </div>
              <div className="admin-calendar__grid">
                {cells.map((cell, index) => {
                  const key = dateKey(cell.date);
                  const events = publicEvents.filter((event) => event.date === key);
                  return (
                    <button
                      key={`${key}-${index}`}
                      type="button"
                      className={`admin-day ${!cell.current ? "is-outside" : ""} ${
                        key === selectedDate ? "is-selected" : ""
                      } ${key === todayKey ? "is-today" : ""}`}
                      onClick={() => {
                        setSelectedDate(key);
                        if (!cell.current) setCursor(new Date(cell.date.getFullYear(), cell.date.getMonth(), 1));
                      }}
                    >
                      <span className="admin-day__num">{cell.date.getDate()}</span>
                      {events.map((event) => (
                        <span key={event.id} className="admin-day__event">
                          <i className={listed.has(event.id) ? "is-live" : "is-hidden"} />
                          {event.title}
                        </span>
                      ))}
                    </button>
                  );
                })}
              </div>
            </div>

            <aside className="admin-calendar__side">
              <span className="eyebrow">Selected · {selectedLabel}</span>
              {selectedEvents.length ? (
                selectedEvents.map((event) => (
                  <article key={event.id} className="calendar-manage-card">
                    <div className="calendar-manage-card__image">
                      <Image src={event.image} alt="" fill sizes="300px" style={{ objectFit: "cover" }} />
                      <span className={listed.has(event.id) ? "is-live" : ""}>
                        {listed.has(event.id) ? "Listed publicly" : "Hidden"}
                      </span>
                    </div>
                    <h3>{event.title}</h3>
                    <p>{event.time} · {event.venue}</p>
                    <div className="calendar-manage-card__stats">
                      <div><span>Status</span><strong>{event.status}</strong></div>
                      <div><span>Artists</span><strong>{event.artists.length}</strong></div>
                    </div>
                    <button
                      type="button"
                      className={`toggle-row ${listed.has(event.id) ? "is-on" : ""}`}
                      onClick={() => {
                        toggleListed(event.id);
                        setToast(`${event.title} ${listed.has(event.id) ? "hidden from" : "listed on"} the public calendar.`);
                      }}
                    >
                      <span className="toggle-row__switch"><i /></span>
                      <span>Public listing</span>
                      <em>{listed.has(event.id) ? "On" : "Off"}</em>
                    </button>
                    <button
                      type="button"
                      className="button button--line button--small button--full"
                      onClick={() => setToast(`${event.title}: internal hold added.`)}
                    >
                      Add internal hold
                      <Icon name="plus" size={14} />
                    </button>
                  </article>
                ))
              ) : (
                <div className="calendar-empty">
                  <span className="eyebrow">Open date</span>
                  <h3>No public event.</h3>
                  <p>A clean night. Use it for a private hold or a site visit.</p>
                  <button type="button" className="button button--line button--small" onClick={() => setToast("Internal hold added for the selected date.")}>
                    Add internal hold
                    <Icon name="plus" size={14} />
                  </button>
                </div>
              )}
            </aside>
          </div>
        </section>

        <div className="dash-footnote">
          <span>Kalakaar control room · data updated 09:42</span>
          <span>Ops line · <a href="mailto:ops@kalakaarstudios.in">ops@kalakaarstudios.in</a></span>
        </div>
      </div>

      <Modal open={Boolean(assigning)} onClose={() => setAssigning(null)} size="small" labelledBy="assign-title">
        {assigning && (
          <div className="assign-modal">
            <span className="eyebrow">Talent assignment</span>
            <h2 id="assign-title">Cast the room.</h2>
            <p>
              {assigning.id} · {assigning.venue} · {assigning.date}. The artist
              will be attached to the request and a contract task will be created.
            </p>
            <label className="field">
              <span className="field__label">Artist</span>
              <select value={assignArtist} onChange={(event) => setAssignArtist(event.target.value)}>
                {artists.map((artist) => (
                  <option key={artist.id} value={artist.id}>
                    {artist.name} · {artist.category} · {artist.feeLabel}
                  </option>
                ))}
              </select>
            </label>
            <div className="assign-modal__summary">
              <div><span>Room value</span><strong>{formatINR(assigning.budget)}</strong></div>
              <div><span>Capacity</span><strong>{assigning.capacity} guests</strong></div>
              <div><span>Client</span><strong>{assigning.client}</strong></div>
            </div>
            <button type="button" className="button button--ink button--full" onClick={confirmAssignment}>
              Confirm assignment
              <Icon name="check" size={16} />
            </button>
          </div>
        )}
      </Modal>

      <Toast message={toast} onDone={() => setToast(null)} />
    </DashboardShell>
  );
}
