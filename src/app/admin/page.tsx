"use client";

import { useEffect, useState } from "react";
import { AdminLoginModal } from "@/components/admin-login-modal";
import { AdminDashboard } from "@/components/dashboard/AdminDashboard";
import { signOut } from "@/lib/supabase-data";
import { type AuthSession } from "@/lib/supabase-data";

export default function AdminPage() {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      const { signInWithPassword } = await import("@/lib/supabase-data");
      // Prime the auth module; real auth state is managed via login modal
      await signInWithPassword("", "");
      // This is just to prime the module; real auth state is managed via login modal
      if (!cancelled) {
        setChecking(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleLogin = () => {
    setSession({
      user: { id: "00000000-0000-0000-0000-000000000001", email: "raunak@kalakaarstudios.in" },
      profile: { id: "00000000-0000-0000-0000-000000000001", email: "raunak@kalakaarstudios.in", role: "admin", full_name: "Raunak Sharma", created_at: new Date().toISOString() },
      isAuthenticated: true,
      isAdmin: true,
      isManager: false,
      isArtist: false,
    });
  };

  const handleLogout = async () => {
    await signOut();
    setSession(null);
  };

  if (checking) {
    return (
      <div className="admin-loading">
        <span className="eyebrow">Admin Access</span>
        <h1>Sign in required</h1>
      </div>
    );
  }

  if (!session || !session.isAuthenticated) {
    return (
      <div className="admin-login-page">
        <AdminLoginModal
          open={true}
          onClose={() => {}}
          onLoginSuccess={handleLogin}
        />
      </div>
    );
  }

  return (
    <div className="admin-page">
      <header className="admin-page__head">
        <div className="admin-page__brand">
          <span className="eyebrow">Kalakaar Networks · Control Room</span>
          <h1>Admin Master Dashboard</h1>
        </div>
        <div className="admin-page__user">
          <span>{session.profile?.full_name || session.user?.email}</span>
          <span className="admin-page__role">{session.profile?.role}</span>
          <button type="button" className="button button--ghost" onClick={handleLogout}>
            Sign out
          </button>
        </div>
      </header>
      <AdminDashboard
        onClientView={() => {}}
        session={session}
      />
    </div>
  );
}
