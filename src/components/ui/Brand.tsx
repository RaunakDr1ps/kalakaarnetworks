"use client";

import Link from "next/link";
import { useId } from "react";

export function BrandMark({
  size = 30,
  className = "",
  tone = "currentColor",
}: {
  size?: number;
  className?: string;
  tone?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M5 28V13.8C5 7.8 9.9 3 16 3s11 4.8 11 10.8V28"
        stroke={tone}
        strokeWidth="1.6"
      />
      <path d="M16 28V15" stroke={tone} strokeWidth="1.6" />
      <path d="m16.4 18 7-6.4M16.4 19.5l6.2 5.3" stroke={tone} strokeWidth="1.6" />
      <path d="M9.5 28h13" stroke={tone} strokeWidth="1.6" />
    </svg>
  );
}

export function Wordmark({
  compact = false,
  className = "",
}: {
  compact?: boolean;
  className?: string;
}) {
  return (
    <Link href="#" className={`wordmark ${className}`} aria-label="Kalakaar Studios">
      <BrandMark size={compact ? 25 : 30} />
      <span className="wordmark__type">
        <span className="wordmark__name">Kalakaar</span>
        {!compact && <span className="wordmark__sub">studios · patna</span>}
      </span>
    </Link>
  );
}

export function Doodle({
  variant = "wave",
  className = "",
}: {
  variant?: "wave" | "arch" | "sun" | "line" | "arrow";
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 120 36"
      fill="none"
      className={`doodle doodle--${variant} ${className}`}
      aria-hidden="true"
    >
      {variant === "wave" && (
        <path
          d="M3 23c9-15 17-15 26 0s17 15 26 0 17-15 26 0 17 15 26 0"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      )}
      {variant === "arch" && (
        <>
          <path d="M8 32C8 13 23 4 40 4s32 9 32 28" stroke="currentColor" strokeWidth="1.5" />
          <path d="M48 32c0-13 10-19 22-19s22 6 22 19" stroke="currentColor" strokeWidth="1.5" />
          <path d="M98 8v24M104 12v20M110 18v14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </>
      )}
      {variant === "sun" && (
        <>
          <circle cx="26" cy="18" r="8" stroke="currentColor" strokeWidth="1.5" />
          <path
            d="M26 2v5M26 29v5M10 18H5M47 18h-5M14.7 6.7l3.5 3.5M33.8 25.8l3.5 3.5M37.3 6.7l-3.5 3.5M18.2 25.8l-3.5 3.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </>
      )}
      {variant === "line" && (
        <>
          <path d="M3 18h114" stroke="currentColor" strokeWidth="1.5" />
          <path d="M96 13l6 5-6 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </>
      )}
      {variant === "arrow" && (
        <>
          <path
            d="M4 25c23-19 45-20 69-7 11 6 20 5 32-4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path d="M98 12h8v9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}

export function Stamp({
  text = "KALAKAAR STUDIOS · PATNA · EST. 2019 ·",
  className = "",
}: {
  text?: string;
  className?: string;
}) {
  const circleId = `stamp-circle-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;

  return (
    <div className={`stamp ${className}`} aria-hidden="true">
      <svg viewBox="0 0 120 120">
        <defs>
          <path
            id={circleId}
            d="M60,60 m-42,0 a42,42 0 1,1 84,0 a42,42 0 1,1 -84,0"
          />
        </defs>
        <circle cx="60" cy="60" r="56" fill="none" stroke="currentColor" />
        <circle cx="60" cy="60" r="46" fill="none" stroke="currentColor" />
        <text fontSize="7.2" fontWeight="600" letterSpacing="1.8">
          <textPath href={`#${circleId}`} startOffset="0%">
            {text}
          </textPath>
        </text>
        <path
          d="M47 71V50c0-8 5.8-14 13-14s13 6 13 14v21M60 71V55m0 3 9-7m-9 8 8 7"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
        />
      </svg>
    </div>
  );
}
