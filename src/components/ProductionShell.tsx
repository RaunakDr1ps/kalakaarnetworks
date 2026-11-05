"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { ClientView } from "@/components/landing/ClientView";
import { ArtistRegistrationModal } from "@/components/artist-registration-modal";

export function ProductionShell() {
  const [registerOpen, setRegisterOpen] = useState(false);

  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
    setRegisterOpen(false);
  }, []);

  return (
    <>
      <header className="site-shell">
        <div className="site-shell__inner">
          <Link href="/" className="site-shell__brand" aria-label="Kalakaar Networks">
            <span className="site-shell__mark">K</span>
            <span className="site-shell__name">Kalakaar <span className="site-shell__sub">Networks</span></span>
          </Link>

          <nav className="site-nav" aria-label="Main navigation">
            <a href="#" className="nav-link" onClick={(e) => { e.preventDefault(); scrollTo("hero"); }}>
              Home
            </a>
            <a href="#" className="nav-link" onClick={(e) => { e.preventDefault(); scrollTo("artists"); }}>
              Artists
            </a>
            <a href="#" className="nav-link" onClick={(e) => { e.preventDefault(); scrollTo("venues"); }}>
              Venues
            </a>
            <a href="#" className="nav-link" onClick={(e) => { e.preventDefault(); scrollTo("calendar"); }}>
              Calendar
            </a>
            <a href="#" className="nav-link nav-link--cta" onClick={(e) => { e.preventDefault(); setRegisterOpen(true); }}>
              Register as Artist
            </a>
            <a href="#" className="nav-link" onClick={(e) => { e.preventDefault(); scrollTo("studio"); }}>
              Contact / Book
            </a>
          </nav>

          <button
            type="button"
            className="menu-button"
            aria-expanded="false"
            aria-label="Toggle menu"
          >
            <span className="menu-button__bar" />
            <span className="menu-button__bar" />
            <span className="menu-button__bar" />
          </button>
        </div>
      </header>

      <div className="view-canvas view-canvas--client">
        <ClientView onRegisterArtist={() => setRegisterOpen(true)} />
      </div>

      <ArtistRegistrationModal
        open={registerOpen}
        onClose={() => setRegisterOpen(false)}
      />
    </>
  );
}
