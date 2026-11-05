"use client";

import { useCallback, useState } from "react";
import { DemoSwitcher, type ViewKey } from "@/components/ui/DemoSwitcher";
import { ClientView } from "@/components/landing/ClientView";
import { ArtistView } from "@/components/dashboard/ArtistView";
import { CustomerDashboard } from "@/components/dashboard/CustomerDashboard";
import { AdminDashboard } from "@/components/dashboard/AdminDashboard";

export function PrototypeShell() {
  const [view, setView] = useState<ViewKey>("client");

  const changeView = useCallback((next: ViewKey) => {
    setView(next);
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  return (
    <>
      <DemoSwitcher active={view} onChange={changeView} />
      <div key={view} className={`view-canvas view-canvas--${view}`}>
        {view === "client" && <ClientView />}
        {view === "artist" && <ArtistView onClientView={() => changeView("client")} />}
        {view === "customer" && <CustomerDashboard onClientView={() => changeView("client")} />}
        {view === "admin" && <AdminDashboard onClientView={() => changeView("client")} />}
      </div>
    </>
  );
}
