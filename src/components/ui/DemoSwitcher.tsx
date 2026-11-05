"use client";

import { useEffect } from "react";
import { BrandMark } from "./Brand";

export type ViewKey = "client" | "artist" | "customer" | "admin";

const views: { key: ViewKey; label: string; short: string }[] = [
  { key: "client", label: "Client view", short: "Client" },
  { key: "artist", label: "Artist dashboard", short: "Artist" },
  { key: "customer", label: "Client dashboard", short: "My events" },
  { key: "admin", label: "Admin master", short: "Admin" },
];

export function DemoSwitcher({
  active,
  onChange,
}: {
  active: ViewKey;
  onChange: (view: ViewKey) => void;
}) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLSelectElement
      ) {
        return;
      }
      const index = Number(event.key);
      if (index >= 1 && index <= 4) {
        onChange(views[index - 1].key);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onChange]);

  return (
    <header className="demo-bar">
      <div className="demo-bar__inner">
        <div className="demo-bar__identity">
          <BrandMark size={21} />
          <span className="demo-bar__name">Kalakaar</span>
          <span className="demo-bar__tag">Prototype</span>
        </div>

        <nav className="demo-switcher" aria-label="Switch prototype view">
          {views.map((view, index) => (
            <button
              key={view.key}
              type="button"
              className={`demo-switcher__tab ${active === view.key ? "is-active" : ""}`}
              onClick={() => onChange(view.key)}
              aria-current={active === view.key ? "page" : undefined}
              title={`Shortcut: ${index + 1}`}
            >
              <span className="demo-switcher__num">0{index + 1}</span>
              <span className="demo-switcher__long">{view.label}</span>
              <span className="demo-switcher__short">{view.short}</span>
            </button>
          ))}
        </nav>

        <div className="demo-bar__meta">
          <span className="demo-bar__live" />
          <span>Interactive demo</span>
          <span className="demo-bar__keys">1–4 to switch</span>
        </div>
      </div>
    </header>
  );
}
