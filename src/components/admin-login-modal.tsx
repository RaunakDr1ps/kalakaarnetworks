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
      let message = "Invalid email or password. Try aarav@kalakaarstudios.in / kalakaar2026";
      if (raw instanceof Error) {
        message = raw.message;
      } else if (raw && typeof raw === "object" && "message" in raw) {
        message = String((raw as { message: unknown }).message);
      }
      setServerError(message);
    }
  };

  return (
    <Modal open={open} onClose={onClose} size="small" labelledBy="admin-login-title">
      <div className="admin-login-modal">
        <div className="admin-login-modal__head">
          <span className="eyebrow">Admin Access</span>
          <h2 id="admin-login-title">Sign in to the Control Room</h2>
          <p>
            Enter your studio credentials to manage bookings, artists, venues, and
            team roles.
          </p>
        </div>

        {serverError && (
          <div className="admin-login-modal__error">
            <Icon name="close" size={15} />
            <span>{serverError}</span>
          </div>
        )}

        <form onSubmit={submit} className="admin-login-form">
          <label className="field">
            <span className="field__label">Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="aarav@kalakaarstudios.in"
            />
          </label>
          <label className="field">
            <span className="field__label">Password</span>
            <input
              type="password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
            />
          </label>

          <div className="modal-actions">
            <button
              type="button"
              className="button button--ghost"
              onClick={onClose}
              disabled={sending}
            >
              Cancel
            </button>
            <button type="submit" className="button button--ink" disabled={sending}>
              {sending ? "Signing in…" : "Sign in"}
              <Icon name="arrow-up-right" size={15} />
            </button>
          </div>
        </form>

        <div className="admin-login-modal__hint">
          Demo credentials: aarav@kalakaarstudios.in / kalakaar2026
        </div>
      </div>
    </Modal>
  );
}
