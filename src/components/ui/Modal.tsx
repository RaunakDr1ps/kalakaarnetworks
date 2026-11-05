"use client";

import { useEffect, useRef, useSyncExternalStore, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Icon } from "./Icon";

const subscribe = () => () => {};

export function Modal({
  open,
  onClose,
  children,
  labelledBy,
  size = "medium",
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  labelledBy?: string;
  size?: "small" | "medium" | "large";
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const isClient = useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const frame = window.requestAnimationFrame(() => {
      dialogRef.current?.focus();
    });

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (!open || !isClient) return null;

  return createPortal(
    <div
      className="modal-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        className={`modal modal--${size}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        tabIndex={-1}
      >
        <button
          type="button"
          className="modal__close"
          onClick={onClose}
          aria-label="Close dialog"
        >
          <Icon name="close" size={19} />
        </button>
        {children}
      </div>
    </div>,
    document.body
  );
}
