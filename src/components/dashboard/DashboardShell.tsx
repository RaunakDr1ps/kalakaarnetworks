"use client";

import { useState, type ReactNode } from "react";
import { BrandMark } from "@/components/ui/Brand";
import { Icon, type IconName } from "@/components/ui/Icon";

export type DashNavItem = {
  label: string;
  href: string;
  icon: IconName;
  badge?: string;
};

export function DashboardShell({
  role,
  workspace,
  userName,
  userMeta,
  initials,
  navItems,
  current,
  children,
  onClientView,
  topRight,
}: {
  role: string;
  workspace: string;
  userName: string;
  userMeta: string;
  initials: string;
  navItems: DashNavItem[];
  current: string;
  children: ReactNode;
  onClientView?: () => void;
  topRight?: ReactNode;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="dashboard">
      <aside className={`dash-sidebar ${menuOpen ? "is-open" : ""}`}>
        <div className="dash-sidebar__top">
          <div className="dash-brand">
            <BrandMark size={28} />
            <div>
              <strong>Kalakaar</strong>
              <span>{workspace}</span>
            </div>
          </div>
          <button
            type="button"
            className="dash-sidebar__close"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
          >
            <Icon name="close" size={20} />
          </button>
        </div>

        <div className="dash-role">
          <span>Workspace</span>
          <strong>{role}</strong>
        </div>

        <nav className="dash-nav" aria-label={`${role} navigation`}>
          {navItems.map((item, index) => (
            <a
              key={item.href}
              href={item.href}
              className={current === item.label ? "is-active" : ""}
              onClick={() => setMenuOpen(false)}
            >
              <span className="dash-nav__index">0{index + 1}</span>
              <Icon name={item.icon} size={17} />
              <span>{item.label}</span>
              {item.badge && <em>{item.badge}</em>}
            </a>
          ))}
        </nav>

        <div className="dash-sidebar__note">
          <span className="eyebrow">Studio line</span>
          <a href="tel:+919876543210">+91 98765 43210</a>
          <p>Booking desk open · Mon–Sat, 10am–7pm</p>
        </div>

        <div className="dash-user">
          <span className="avatar">{initials}</span>
          <div>
            <strong>{userName}</strong>
            <span>{userMeta}</span>
          </div>
          <button type="button" className="dash-user__more" aria-label="Account menu">
            <Icon name="more" size={18} />
          </button>
        </div>

        {onClientView && (
          <button type="button" className="dash-sidebar__exit" onClick={onClientView}>
            <Icon name="arrow-left" size={15} />
            View public site
          </button>
        )}
      </aside>

      {menuOpen && (
        <button
          type="button"
          className="dash-scrim"
          aria-label="Close menu"
          onClick={() => setMenuOpen(false)}
        />
      )}

      <div className="dash-body">
        <header className="dash-topbar">
          <div className="dash-topbar__left">
            <button
              type="button"
              className="dash-menu"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
            >
              <Icon name="menu" size={21} />
            </button>
            <div className="dash-breadcrumb">
              <span>Kalakaar /</span>
              <strong>{workspace}</strong>
            </div>
          </div>

          <div className="dash-topbar__right">
            {topRight}
            <button type="button" className="dash-icon-btn" aria-label="Search">
              <Icon name="search" size={18} />
            </button>
            <div className="dash-topbar__date">
              <span>Wed, 4 Nov</span>
              <strong>2026</strong>
            </div>
          </div>
        </header>

        <main className="dash-content">{children}</main>
      </div>
    </div>
  );
}
