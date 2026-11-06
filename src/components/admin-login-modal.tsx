"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { Modal } from "@/components/ui/Modal";
import { signInWithPassword } from "@/lib/supabase-data";

export function AdminLoginModal({
  open,
  onClose,
  onLoginSuccess,
}: {
  open: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}) {
  const [sending, setSending] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setServerError(null);
    setSending(true);

    const result = await signInWithPassword(email, password);

    setSending(false);
    if (result.success && result.session) {
      onLoginSuccess();
    } else {
      const raw = result.error ?? null;
      let message = "Invalid email or password.";
      if (raw instanceof Error) {
        message = raw.message;
      } else if (raw && typeof raw === "object" && "message" in raw) {
        message = String((raw as { message: unknown }).message);
      }
      setServerError(message);
    }
  };

  return (
    <Modal open={open} onClose={onClose} size="medium" labelledBy="admin-login-title">
      <div className="admin-login-card">
        <div className="admin-login-modal__head">
          <span className="eyebrow">Admin Access</span>
          <h2 id="admin-login-title">Sign in to the Control Room</h2>
          <p>
            Enter your studio credentials to manage bookings, artists, venues, and
            team roles.
          </p>
        </div>

        {serverError && (
          <div className="login-error">
            <Icon name="close" size={15} />
            <span>{serverError}</span>
          </div>
        )}

        <form onSubmit={submit} className="login-form">
          <label className="login-field">
            <span className="login-field__label">Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@studio.com"
              className="login-input"
            />
          </label>
          <label className="login-field">
            <span className="login-field__label">Password</span>
            <input
              type="password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              className="login-input"
            />
          </label>

          <button type="submit" className="login-submit" disabled={sending}>
            {sending ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </Modal>
  );
}
