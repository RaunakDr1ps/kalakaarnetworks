"use client";

import { useMemo, useState, useEffect } from "react";
import {
  fetchAdminMetrics,
  fetchMonthlyRevenue,
  fetchProductionBoard,
  fetchArtists,
  fetchProfiles,
  updateProfileRole,
  fetchPendingArtists,
  updateArtistAvailability,
  type AdminMetrics,
  type MonthlyRevenue,
  type ProductionBoardItem,
  type SupabaseProfile,
  type SupabaseArtist,
  type AuthSession,
  type UserRole,
} from "@/lib/supabase-data";
import { supabase } from "@/lib/supabase";
import { monthMatrix, monthNames, weekdayLabels } from "@/lib/date";
import { DashboardShell } from "./DashboardShell";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Modal } from "@/components/ui/Modal";
import { Toast } from "@/components/ui/Toast";

export type Artist = {
  id: string;
  name: string;
  category: string;
  feeLabel: string;
};

const formatINR = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

const sanitizePortfolioUrl = (url: string | null | undefined): string => {
  if (!url) return "#";
  if (/^https?:\/\//i.test(url)) return url;
  return `https://${url}`;
};

const navItems = [
  { label: "Overview", href: "#admin-overview", icon: "grid" as const },
  { label: "Requests", href: "#requests", icon: "building" as const },
  { label: "Assignments", href: "#assignments", icon: "mic" as const },
  { label: "Leads", href: "#leads", icon: "users" as const },
  { label: "Calendar", href: "#admin-calendar", icon: "calendar" as const },
];

type RequestFilter = "All" | "New" | "Reviewing" | "Approved";

export function AdminDashboard({
  onClientView,
  session = null,
}: {
  onClientView: () => void;
  session: AuthSession | null;
}) {
  const [requestFilter, setRequestFilter] = useState<RequestFilter>("All");
  const [requestState, setRequestState] = useState<Record<string, string>>({});
  const [assigning, setAssigning] = useState<{ id: string; venue: string; date: string } | null>(null);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [assignArtist, setAssignArtist] = useState("");
  const [assignments, setAssignments] = useState<{ time: string; title: string; detail: string; kind: string }[]>([]);
  const [metric, setMetric] = useState<"both" | "booked" | "collected">("both");
  const [cursor, setCursor] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState("");
  const [listed, setListed] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState<string | null>(null);
  const [teamTab, setTeamTab] = useState(false);
  const [profiles, setProfiles] = useState<SupabaseProfile[]>([]);
  const [editingRole, setEditingRole] = useState<{ id: string; role: UserRole } | null>(null);
  const [roleSaving, setRoleSaving] = useState(false);

  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [monthlyRevenue, setMonthlyRevenue] = useState<MonthlyRevenue[]>([]);
  const [productionBoard, setProductionBoard] = useState<ProductionBoardItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState<{ id: string; title: string; time: string; read: boolean }[]>([]);

  const [pendingArtists, setPendingArtists] = useState<SupabaseArtist[]>([]);

  const userRole = session?.profile?.role ?? "artist";
  const isAdmin = userRole === "admin";
  const isManager = userRole === "manager";

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      const [fetchedArtists, fetchedProfiles, fetchedMetrics, fetchedMonthly, fetchedBoard, fetchedPending] =
        await Promise.all([
          fetchArtists(),
          fetchProfiles(),
          fetchAdminMetrics(),
          fetchMonthlyRevenue(),
          fetchProductionBoard(),
          fetchPendingArtists(),
        ]);
      if (!cancelled) {
        setArtists(fetchedArtists);
        setProfiles(fetchedProfiles);
        setMetrics(fetchedMetrics);
        setMonthlyRevenue(fetchedMonthly);
        setProductionBoard(fetchedBoard);
        setPendingArtists(fetchedPending);

        const dynamicNotifications: { id: string; title: string; time: string; read: boolean }[] = [];
        fetchedPending.forEach((a) => {
          dynamicNotifications.push({
            id: `artist-${a.id}`,
            title: `New Artist Application from ${a.name}`,
            time: new Date(a.created_at ?? Date.now()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            read: false,
          });
        });
        productionBoard
          .filter((b) => b.status === "pending" || b.status === "new")
          .forEach((b) => {
            dynamicNotifications.push({
              id: `booking-${b.id}`,
              title: `New ${b.type === "artist" ? "Artist" : "Venue"} Booking request`,
              time: new Date(b.event_date ?? Date.now()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              read: false,
            });
          });
        setNotifications(dynamicNotifications);

        if (fetchedArtists.length > 0) setAssignArtist(fetchedArtists[0].id);
        setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [productionBoard]);

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const cells = useMemo(() => monthMatrix(year, month), [year, month]);

  const selectedLabel = selectedDate
    ? new Date(`${selectedDate}T12:00:00`).toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
      })
    : "";

  const dayEventsForSelected = useMemo(() => {
    if (!selectedDate) return [];
    return productionBoard.filter((e) => e.eventDate === selectedDate);
  }, [productionBoard, selectedDate]);

  const setRequest = (id: string, status: string, message: string) => {
    if (!isAdmin && !isManager) return;
    setRequestState((current) => ({ ...current, [id]: status }));
    setToast(message);
  };

  const confirmAssignment = () => {
    if (!isAdmin) return;
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
    if (!isAdmin) return;
    setListed((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleRoleChange = (id: string, role: string) => {
    if (!isAdmin) return;
    setEditingRole({ id, role: role as "admin" | "manager" | "artist" });
  };

  const saveRole = async () => {
    if (!editingRole) return;
    setRoleSaving(true);
    const result = await updateProfileRole(editingRole.id, editingRole.role);
    setRoleSaving(false);
    if (result.success) {
      setProfiles((current) =>
        current.map((p) => (p.id === editingRole.id ? { ...p, role: editingRole.role } : p))
      );
      setToast(`Role updated to ${editingRole.role}.`);
    } else {
      setToast("Failed to update role.");
    }
    setEditingRole(null);
  };

  const approveArtist = async (id: string) => {
    if (!supabase) {
      setToast("Supabase not configured.");
      return;
    }
    try {
      const { error } = await supabase
        .from("artists")
        .update({ availability_status: "available" })
        .eq("id", id);
      if (error) {
        console.error("[supabase] approve artist error:", error);
        setToast("Failed to approve artist.");
        return;
      }
      setPendingArtists((current) => current.filter((a) => a.id !== id));
      setToast("Artist approved successfully.");
    } catch (error) {
      console.error("[supabase] approve artist exception:", error);
      setToast("Failed to approve artist.");
    }
  };

  const rejectArtist = async (id: string) => {
    const result = await updateArtistAvailability(id, "rejected");
    if (result.success) {
      setPendingArtists((current) => current.filter((a) => a.id !== id));
      setToast("Artist application rejected.");
    } else {
      setToast("Failed to reject artist.");
    }
  };

  const markNotificationRead = (id: string) => {
    setNotifications((current) =>
      current.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const maxRevenue = Math.max(...monthlyRevenue.map((m) => m.booked), 24);

  const bv = metrics?.bookableValue ?? 0;
  const cl = metrics?.collected ?? 0;
  const tb = metrics?.totalBookings ?? 0;
  const cb = metrics?.confirmedBookings ?? 0;
  const ovr = metrics?.openVenueRequests ?? 0;
  const lc = metrics?.leadConversion ?? 0;

  const searchLower = searchQuery.toLowerCase();

  const filteredArtists = pendingArtists.filter((a) => {
    const q = searchLower;
    if (!q) return true;
    return (
      (a.name ?? "").toLowerCase().includes(q) ||
      (a.stage_name ?? "").toLowerCase().includes(q) ||
      (a.category ?? "").toLowerCase().includes(q) ||
      (a.location ?? "").toLowerCase().includes(q) ||
      (a.contact_email ?? "").toLowerCase().includes(q) ||
      (a.contact_phone ?? "").toLowerCase().includes(q)
    );
  });

  const filteredBookings = productionBoard.filter((b) => {
    const q = searchLower;
    if (!q) return true;
    return (
      b.client_name.toLowerCase().includes(q) ||
      b.target_id.toLowerCase().includes(q) ||
      b.event_date.includes(q) ||
      b.status.toLowerCase().includes(q)
    );
  });

  const filteredProfiles = profiles.filter((p) => {
    const q = searchLower;
    if (!q) return true;
    return (
      (p.full_name ?? "").toLowerCase().includes(q) ||
      (p.email ?? "").toLowerCase().includes(q) ||
      p.role.toLowerCase().includes(q)
    );
  });

  const renderedProfileRows = filteredProfiles.length > 0 ? filteredProfiles.map((profile) => (
    <tr key={profile.id}>
      <td>
        <strong>{profile.full_name || "Unnamed user"}</strong>
      </td>
      <td>{profile.email}</td>
      <td>
        <span className={`role-badge role-badge--${profile.role}`}>
          {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
        </span>
      </td>
    </tr>
  )) : (
    <tr>
      <td colSpan={4} className="table-empty">
        {searchQuery ? "No matching team members." : "No team members in Supabase profiles table."}
      </td>
    </tr>
                  );

  const pageContent = loading ? (
    <div className="dash-page" id="admin-overview">
      <div className="empty-state">
        <div className="empty-state__mark"><Icon name="compass" size={24} /></div>
        <h2>Loading control room…</h2>
        <p>Fetching live data from the studio database.</p>
      </div>
    </div>
  ) : (
    <>
      <div className="dash-page" id="admin-overview">
        <div className="dash-page-head">
          <div>
            <span className="eyebrow">Kalakaar Networks · Control room</span>
            <h1>Everything on the desk.</h1>
            <p>
              Live data from the Supabase database. Metrics, charts, and the
              production board update from booking records.
            </p>
          </div>
          <div className="dash-page-head__actions">
            <label className="search-field">
              <span className="search-field__label">Search</span>
              <input
                type="text"
                placeholder="Search artists, bookings, team…"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="search-input"
              />
            </label>
            <button
              type="button"
              className="button button--line"
              onClick={() => setToast("Daily operations report exported as PDF.")}
            >
              <Icon name="download" size={16} />
              Export report
            </button>
            <button
              type="button"
              className="button button--ink"
              onClick={onClientView}
            >
              Open booking site
              <Icon name="arrow-up-right" size={16} />
            </button>
          </div>
        </div>

        <div className="dash-stat-strip dash-stat-strip--admin">
          <div>
            <span>Bookable value</span>
            <strong>{formatINR(bv)}</strong>
            <em>Sum of all booking amounts</em>
          </div>
          <div>
            <span>Collected</span>
            <strong>{formatINR(cl)}</strong>
            <em>
              {tb > 0 ? `${Math.round((cl / bv) * 100)}% of booked` : "0% of booked"}
            </em>
          </div>
          <div>
            <span>Open venue requests</span>
            <strong>{ovr}</strong>
            <em>Bookings with status pending</em>
          </div>
          <div>
            <span>Lead conversion</span>
            <strong>{lc}%</strong>
            <em>
              {tb > 0 ? `${cb} of ${tb} confirmed` : "No bookings yet"}
            </em>
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

            {monthlyRevenue.length === 0 ? (
              <div className="empty-state" style={{ padding: "40px 24px" }}>
                <div className="empty-state__mark"><Icon name="ticket" size={24} /></div>
                <h2>No booking data available yet</h2>
                <p>
                  Once bookings are recorded in Supabase, revenue charts will appear here.
                </p>
              </div>
            ) : (
              <div className="revenue-chart">
                <div className="revenue-chart__scale" aria-hidden="true">
                  <span>₹{Math.ceil(maxRevenue / 100000)}L</span>
                  <span>₹0</span>
                </div>
                <div className="revenue-chart__plot">
                  <div className="revenue-chart__grid" aria-hidden="true">
                    <i /><i /><i /><i />
                  </div>
                  <div className="revenue-bars">
                    {monthlyRevenue.map((item) => (
                      <div key={item.month} className="revenue-bar">
                        <div className="revenue-bar__columns">
                          {(metric === "both" || metric === "booked") && (
                            <span
                              className="revenue-bar__booked"
                              style={{ height: `${(item.booked / maxRevenue) * 100}%` }}
                              title={`Booked ${formatINR(item.booked)}`}
                            />
                          )}
                          {(metric === "both" || metric === "collected") && (
                            <span
                              className="revenue-bar__collected"
                              style={{ height: `${(item.collected / maxRevenue) * 100}%` }}
                              title={`Collected ${formatINR(item.collected)}`}
                            />
                          )}
                        </div>
                        <span className="revenue-bar__label">{item.month}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="revenue-footer">
              <div className="revenue-key">
                <span><i className="key-booked" /> Booked</span>
                <span><i className="key-collected" /> Collected</span>
              </div>
              <div className="revenue-summary">
                <div>
                  <span>Outstanding</span>
                  <strong>{formatINR(Math.max(0, bv - cl))}</strong>
                </div>
                <div>
                  <span>Avg. booking value</span>
                  <strong>
                    {tb > 0
                      ? formatINR(Math.round(bv / tb))
                      : "₹0"}
                  </strong>
                </div>
                <div>
                  <span>Forecast close</span>
                  <strong>{formatINR(bv)}</strong>
                </div>
              </div>
            </div>
          </section>

          <section className="panel ops-panel">
            <div className="panel__head">
              <div>
                <span className="eyebrow">Today</span>
                <h2>Production board</h2>
              </div>
              <span className="panel__count">{productionBoard.length} upcoming</span>
            </div>
            {productionBoard.length === 0 ? (
              <div className="empty-state" style={{ padding: "30px 24px" }}>
                <div className="empty-state__mark"><Icon name="calendar" size={20} /></div>
                <h2>No upcoming bookings</h2>
                <p>
                  When bookings are created with future event dates, they will appear here.
                </p>
              </div>
            ) : (
              <div className="ops-list">
                {productionBoard.map((item) => (
                  <article key={item.id} className="ops-row">
                    <span className="ops-row__time">{item.time}</span>
                    <span className="ops-row__icon">
                      <Icon name={item.icon as IconName} size={16} />
                    </span>
                    <div>
                      <strong>{item.title}</strong>
                      <p>{item.detail}</p>
                    </div>
                    <em>{item.status}</em>
                  </article>
                ))}
              </div>
            )}
            <div className="ops-panel__footer">
              <span><i /> Upcoming bookings from the database</span>
              <button
                type="button"
                className="text-link text-link--small"
                onClick={() => setToast("Production board refreshed.")}
              >
                Refresh
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
              {(["All", "New", "Reviewing", "Approved"] as RequestFilter[]).map(
                (filter) => (
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
                )
              )}
            </div>
          </div>

          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Request</th>
                  <th>Client</th>
                  <th>Target</th>
                  <th>Date</th>
                  <th>Value</th>
                  <th>Status</th>
                  <th aria-label="Actions" />
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((booking) => {
                  const status = requestState[booking.id] || booking.status;
                  return (
                    <tr key={booking.id}>
                      <td>
                        <span className="table-id">{booking.id.slice(0, 8)}</span>
                      </td>
                      <td>
                        <strong>{booking.client_name}</strong>
                        <span className="table-sub">
                          {booking.type === "artist"
                            ? "Artist booking"
                            : "Venue request"}
                        </span>
                      </td>
                      <td>{booking.target_id}</td>
                      <td>{booking.event_date}</td>
                      <td>
                        <strong>{formatINR(0)}</strong>
                      </td>
                      <td>
                        <span className={`request-status request-status--${status.toLowerCase()}`}>
                          {status}
                        </span>
                      </td>
                      <td>
                        <div className="table-actions">
                          {(status === "new" || status === "pending") && (
                            <>
                              <button
                                type="button"
                                className="button button--ink button--tiny"
                                onClick={() =>
                                  setRequest(
                                    booking.id,
                                    "confirmed",
                                    `${booking.id} confirmed.`
                                  )
                                }
                                disabled={!isAdmin && !isManager}
                              >
                                Confirm
                              </button>
                              {isAdmin && (
                                <button
                                  type="button"
                                  className="icon-button"
                                  aria-label={`Assign to ${booking.id}`}
                                  onClick={() =>
                                    setAssigning({
                                      id: booking.id,
                                      venue: booking.target_id,
                                      date: booking.event_date,
                                    })
                                  }
                                >
                                  <Icon name="mic" size={16} />
                                </button>
                              )}
                            </>
                          )}
                          {status === "confirmed" && (
                            <button
                              type="button"
                              className="text-link text-link--small"
                              onClick={() =>
                                setAssigning({
                                  id: booking.id,
                                  venue: booking.target_id,
                                  date: booking.event_date,
                                })
                              }
                              disabled={!isAdmin}
                            >
                              Assign
                              <Icon name="plus" size={13} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filteredBookings.length === 0 && (
                  <tr>
                    <td colSpan={7} className="table-empty">
                      No requests in this state. The desk is clear.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <div className="requests-footer">
              <span>
                Showing {filteredBookings.length} of {productionBoard.length} upcoming
              </span>
              <span>Response target · under 4 working hours</span>
            </div>
          </div>
        </section>

        <div className="admin-mid-grid">
          <section className="panel assignments-panel" id="assignments">
            <div className="panel__head">
              <div>
                <span className="eyebrow">Talent desk</span>
                <h2>Assignment log</h2>
              </div>
              <button
                type="button"
                className="text-link text-link--small"
                onClick={() => setToast("Full assignment log opened.")}
              >
                Full log
                <Icon name="arrow-up-right" size={14} />
              </button>
            </div>
            <div className="assignment-list">
              {assignments.slice(0, 6).map((entry, index) => (
                <article
                  key={`${entry.title}-${index}`}
                  className="assignment-row"
                >
                  <div className="assignment-row__rail">
                    <i
                      className={`assignment-mark assignment-mark--${entry.kind.toLowerCase()}`}
                    />
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
              {assignments.length === 0 && (
                <div className="table-empty">No assignments yet.</div>
              )}
            </div>
          </section>

          <section className="panel leads-panel" id="leads">
            <div className="panel__head">
              <div>
                <span className="eyebrow">CRM</span>
                <h2>Lead conversions</h2>
              </div>
              <span className="panel__count">{metrics?.leadConversion ?? 0}%</span>
            </div>
            <div className="lead-list">
              <div className="table-empty">
                Lead conversion is calculated from confirmed bookings vs total bookings in Supabase.
              </div>
            </div>
          </section>
        </div>

        <section className="panel admin-calendar-panel" id="admin-calendar">
          <div className="panel__head">
            <div>
              <span className="eyebrow">Master calendar</span>
              <h2>Event management</h2>
              <p className="panel__sub">
                Upcoming bookings from the Supabase database.
              </p>
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

          <div className="admin-calendar">
            <div className="admin-calendar__main">
              <div className="admin-calendar__labels">
                {weekdayLabels.map((label) => <span key={label}>{label}</span>)}
              </div>
              <div className="admin-calendar__grid">
                {cells.map((cell, index) => {
                  const key = `${cell.date.getFullYear()}-${String(
                    cell.date.getMonth() + 1
                  ).padStart(2, "0")}-${String(cell.date.getDate()).padStart(2, "0")}`;
                  const dayEvents = productionBoard.filter(
                    (e) => e.eventDate === key
                  );
                  return (
                    <button
                      key={`${key}-${index}`}
                      type="button"
                      className={`admin-day ${!cell.current ? "is-outside" : ""} ${
                        key === selectedDate ? "is-selected" : ""
                      }`}
                      onClick={() => {
                        setSelectedDate(key);
                        if (!cell.current)
                          setCursor(
                            new Date(
                              cell.date.getFullYear(),
                              cell.date.getMonth(),
                              1
                            )
                          );
                      }}
                    >
                      <span className="admin-day__num">{cell.date.getDate()}</span>
                      {dayEvents.map((event) => (
                        <span key={event.id} className="admin-day__event">
                          <i className="is-live" />
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
              {dayEventsForSelected.length > 0 ? (
                dayEventsForSelected.map((event) => (
                  <article key={event.id} className="calendar-manage-card">
                    <div className="calendar-manage-card__image">
                      <span className="is-live">
                        {event.title.slice(0, 1).toUpperCase()}
                      </span>
                    </div>
                    <h3>{event.title}</h3>
                    <p>{event.time} · {event.detail}</p>
                    <div className="calendar-manage-card__stats">
                      <div>
                        <span>Status</span>
                        <strong>{event.status}</strong>
                      </div>
                      <div>
                        <span>Type</span>
                        <strong>{event.detail.split(" · ")[0]}</strong>
                      </div>
                    </div>
                    <button
                      type="button"
                      className={`toggle-row ${
                        listed.has(event.id) ? "is-on" : ""
                      }`}
                      onClick={() => {
                        toggleListed(event.id);
                        setToast(
                          `${event.title} ${
                            listed.has(event.id)
                              ? "hidden from"
                              : "listed on"
                          } the calendar.`
                        );
                      }}
                      disabled={!isAdmin}
                    >
                      <span className="toggle-row__switch"><i /></span>
                      <span>Public listing</span>
                      <em>{listed.has(event.id) ? "On" : "Off"}</em>
                    </button>
                    <button
                      type="button"
                      className="button button--line button--small button--full"
                      onClick={() => setToast(`${event.title}: internal hold added.`)}
                      disabled={!isAdmin}
                    >
                      Add internal hold
                      <Icon name="plus" size={14} />
                    </button>
                  </article>
                ))
              ) : (
                <div className="calendar-empty">
                  <span className="eyebrow">Open date</span>
                  <h3>No bookings on this date.</h3>
                  <p>Select a date with upcoming bookings to manage it.</p>
                  <button
                    type="button"
                    className="button button--line button--small"
                    onClick={() => setToast("Internal hold added.")}
                    disabled={!isAdmin}
                  >
                    Add internal hold
                    <Icon name="plus" size={14} />
                  </button>
                </div>
              )}
            </aside>
          </div>
        </section>

        {/* Artist Applications Review Desk */}
        <section className="panel artist-applications-panel" id="artist-applications">
          <div className="panel__head">
            <div>
              <span className="eyebrow">Talent onboarding</span>
              <h2>Artist Applications</h2>
            </div>
            <span className="panel__count">{filteredArtists.length} of {pendingArtists.length} pending</span>
          </div>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name / Stage Name</th>
                  <th>Category</th>
                  <th>Location</th>
                  <th>Rate</th>
                  <th>Contact</th>
                  <th>Portfolio</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredArtists.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="table-empty">
                      searchQuery
                        ? &quot;No matching artist applications.&quot;
                        : &quot;No pending artist applications.&quot;
                    </td>
                  </tr>
                ) : (
                  filteredArtists.map((artist) => (
                    <tr key={artist.id}>
                      <td>
                        <strong>{artist.name}</strong>
                        {artist.stage_name && (
                          <span className="table-sub">{artist.stage_name}</span>
                        )}
                      </td>
                      <td>{artist.category}</td>
                      <td>{artist.location}</td>
                      <td>
                        <strong>{formatINR(artist.rate ?? 0)}</strong>
                      </td>
                      <td>
                        <span>{artist.contact_email}</span>
                        {artist.contact_phone && (
                          <span className="table-sub">{artist.contact_phone}</span>
                        )}
                      </td>
                      <td>
                        {artist.portfolio_links ? (
                          <a
                            href={sanitizePortfolioUrl(artist.portfolio_links)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-link text-link--small"
                          >
                            View links
                          </a>
                        ) : (
                          <span className="table-sub">—</span>
                        )}
                      </td>
                      <td>
                        <div className="table-actions">
                          <button
                            type="button"
                            className="button button--ink button--tiny"
                            onClick={() => approveArtist(artist.id)}
                          >
                            Approve
                          </button>
                          <button
                            type="button"
                            className="button button--ghost button--tiny"
                            onClick={() => rejectArtist(artist.id)}
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        {isAdmin && (
          <section className="panel team-roles-panel" id="team-roles">
            <div className="panel__head">
              <div>
                <span className="eyebrow">Team management</span>
                <h2>Team & Roles</h2>
              </div>
              <span className="panel__count">{filteredProfiles.length} of {profiles.length} members</span>
            </div>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Member</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {profiles.map((profile) => (
                    <tr key={profile.id}>
                      <td>
                        <strong>{profile.full_name || "Unnamed user"}</strong>
                      </td>
                      <td>{profile.email}</td>
                      <td>
                        {editingRole?.id === profile.id ? (
                          <select
                            value={editingRole.role}
                            onChange={(event) =>
                              setEditingRole({
                                id: profile.id,
                                role: event.target.value as UserRole,
                              })}
                            disabled={roleSaving}
                          >
                            <option value="admin">Admin</option>
                            <option value="manager">Manager</option>
                            <option value="artist">Artist</option>
                          </select>
                        ) : (
                          <span className={`role-badge role-badge--${profile.role}`}>
                            {profile.role.charAt(0).toUpperCase() +
                              profile.role.slice(1)}
                          </span>
                        )}
                      </td>
                      <td>
                        {editingRole?.id !== profile.id ? (
                          <>
                            <button
                              type="button"
                              className="text-link text-link--small"
                              onClick={() =>
                                handleRoleChange(profile.id, profile.role)
                              }
                              disabled={
                                roleSaving ||
                                profile.id === session?.profile?.id
                              }
                            >
                              Edit
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              type="button"
                              className="button button--ink button--tiny"
                              onClick={saveRole}
                              disabled={roleSaving}
                            >
                              Save
                            </button>
                            <button
                              type="button"
                              className="button button--ghost button--tiny"
                              onClick={() => setEditingRole(null)}
                              disabled={roleSaving}
                            >
                              Cancel
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                  {profiles.length === 0 && (
                    <tr>
                      <td colSpan={4} className="table-empty">
                        No team members in Supabase profiles table.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>

      <Modal
        open={Boolean(assigning)}
        onClose={() => setAssigning(null)}
        size="small"
        labelledBy="assign-title"
      >
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
              <select
                value={assignArtist}
                onChange={(event) => setAssignArtist(event.target.value)}
              >
                {artists.map((artist) => (
                  <option key={artist.id} value={artist.id}>
                    {artist.name} · {artist.category} · {artist.feeLabel}
                  </option>
                ))}
              </select>
            </label>
            <div className="assign-modal__summary">
              <div>
                <span>Room value</span>
                <strong>{formatINR(0)}</strong>
              </div>
              <div>
                <span>Client</span>
                <strong>{assigning.id}</strong>
              </div>
            </div>
            <button
              type="button"
              className="button button--ink button--full"
              onClick={confirmAssignment}
              disabled={!isAdmin}
            >
              Confirm assignment
              <Icon name="check" size={16} />
            </button>
          </div>
        )}
      </Modal>

      <Modal
        open={teamTab}
        onClose={() => setTeamTab(false)}
        size="large"
        labelledBy="team-title"
      >
        <div className="team-modal">
          <span className="eyebrow">Team & Role Management</span>
          <h2 id="team-title">Team Members</h2>
          <p>
            Manage Supabase profiles and assign admin or manager roles. Artists
            are created through the public registration form.
          </p>
          <div className="form-grid">
            <label className="field">
              <span className="field__label">Email address</span>
              <input
                type="email"
                placeholder="devansh@kalakaarstudios.in"
              />
            </label>
            <label className="field">
              <span className="field__label">Role</span>
              <select defaultValue="manager">
                <option value="manager">Manager</option>
                <option value="artist">Artist</option>
              </select>
            </label>
          </div>
          <div className="modal-actions">
            <button
              type="button"
              className="button button--ghost"
              onClick={() => setTeamTab(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="button button--ink"
              disabled={!isAdmin}
            >
              Invite team member
            </button>
          </div>
          <div className="team-list">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Member</th>
                  <th>Email</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>{renderedProfileRows}</tbody>
            </table>
          </div>
        </div>
      </Modal>
      {notificationsOpen && (
        <div className="notification-drawer-overlay" onClick={() => setNotificationsOpen(false)} />
      )}
      <Modal open={notificationsOpen} onClose={() => setNotificationsOpen(false)} size="medium" labelledBy="notification-title">
        <div className="notification-drawer">
          <div className="notification-drawer__head">
            <span className="eyebrow">Notifications</span>
            <h2 id="notification-title">Activity Log</h2>
            <button
              type="button"
              className="text-link text-link--small"
              onClick={() => setNotificationsOpen(false)}
            >
              Done
            </button>
          </div>
          <div className="notification-list">
            {notifications.length === 0 ? (
              <div className="table-empty">No recent activity.</div>
            ) : (
              notifications.map((n) => (
                <article
                  key={n.id}
                  className={`notification-item ${n.read ? "notification-item--read" : ""}`}
                  onClick={() => markNotificationRead(n.id)}
                >
                  <div className="notification-item__mark">
                    <i className={`notification-dot ${n.read ? "notification-dot--read" : "notification-dot--unread"}`} />
                  </div>
                  <div className="notification-item__body">
                    <span className="notification-item__title">{n.title}</span>
                    <span className="notification-item__time">{n.time}</span>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
      </Modal>
    </>
  );

  return (
    <DashboardShell
      role="Admin"
      workspace="Control room"
      userName={
        session?.profile?.full_name ||
        session?.user?.email ||
        "Raunak Sharma"
      }
      userMeta={`${userRole.charAt(0).toUpperCase() + userRole.slice(1)} · Kalakaar Studios`}
      initials={
        session?.profile?.full_name
          ? session.profile.full_name.split(" ").map((n) => n[0]).join("")
          : session?.user?.email
            ? session.user.email.charAt(0).toUpperCase()
            : "RS"
      }
      navItems={[
        ...navItems,
        ...(isAdmin
          ? [{ label: "Team & Roles", href: "#team-roles", icon: "users" as const }]
          : []),
      ]}
      current="Overview"
      onClientView={onClientView}
      topRight={
        <>
          <span className="top-status top-status--admin">
            <i /> {session?.profile?.role}
          </span>
          <button
            type="button"
            className="text-link text-link--small"
            onClick={() => setTeamTab(true)}
          >
            Manage Team
          </button>
          <button
            type="button"
            className="notification-bell"
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            aria-label="Notifications"
          >
            <Icon name="bell" size={17} />
            {notifications.some((n) => !n.read) && (
              <span className="notification-badge" />
            )}
          </button>
        </>
      }
    >
      {session && <AdminSessionGate session={session} />}
      {pageContent}
      <Toast message={toast} onDone={() => setToast(null)} />
    </DashboardShell>
  );
}

function AdminSessionGate({ session }: { session: AuthSession | null }) {
  if (!session || !session.isAuthenticated) {
    return null;
  }
  return null;
}








