"use client";

import { useEffect } from "react";
import { Icon } from "./Icon";

export function Toast({
  message,
  onDone,
}: {
  message: string | null;
  onDone: () => void;
}) {
  useEffect(() => {
    if (!message) return;
    const timer = window.setTimeout(onDone, 3200);
    return () => window.clearTimeout(timer);
  }, [message, onDone]);

  if (!message) return null;

  return (
    <div className="toast" role="status">
      <span className="toast__mark">
        <Icon name="check" size={14} strokeWidth={2} />
      </span>
      <span>{message}</span>
    </div>
  );
}
