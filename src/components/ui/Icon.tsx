import type { SVGProps } from "react";

type IconName =
  | "arrow-up-right"
  | "arrow-right"
  | "arrow-left"
  | "chevron-left"
  | "chevron-right"
  | "chevron-down"
  | "calendar"
  | "pin"
  | "users"
  | "rupee"
  | "clock"
  | "ticket"
  | "check"
  | "plus"
  | "close"
  | "menu"
  | "music"
  | "mic"
  | "stage"
  | "building"
  | "sliders"
  | "send"
  | "bell"
  | "message"
  | "file"
  | "card"
  | "grid"
  | "compass"
  | "chart"
  | "settings"
  | "search"
  | "play"
  | "download"
  | "more"
  | "logout"
  | "lock"
  | "eye";

type IconProps = SVGProps<SVGSVGElement> & {
  name: IconName;
  size?: number;
  strokeWidth?: number;
};

/** Hand-drawn-feeling custom icon set. No third-party icon dependencies. */
export function Icon({
  name,
  size = 18,
  strokeWidth = 1.5,
  ...props
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {name === "arrow-up-right" && (
        <>
          <path d="M6.5 17.5 17 7" />
          <path d="M8 7h9v9" />
        </>
      )}
      {name === "arrow-right" && (
        <>
          <path d="M4 12h15" />
          <path d="m14 7 5 5-5 5" />
        </>
      )}
      {name === "arrow-left" && (
        <>
          <path d="M20 12H5" />
          <path d="m10 7-5 5 5 5" />
        </>
      )}
      {name === "chevron-left" && <path d="m14.5 5-7 7 7 7" />}
      {name === "chevron-right" && <path d="m9.5 5 7 7-7 7" />}
      {name === "chevron-down" && <path d="m5 9.5 7 7 7-7" />}
      {name === "calendar" && (
        <>
          <rect x="3.5" y="5.5" width="17" height="15" rx="1.5" />
          <path d="M8 3.5v4M16 3.5v4M3.5 10h17" />
          <path d="M8 14h2M14 14h2M8 17h2" />
        </>
      )}
      {name === "pin" && (
        <>
          <path d="M19 10c0 5-7 10.5-7 10.5S5 15 5 10a7 7 0 1 1 14 0Z" />
          <circle cx="12" cy="10" r="2.3" />
        </>
      )}
      {name === "users" && (
        <>
          <circle cx="9.5" cy="8" r="3.5" />
          <path d="M3.5 20c.4-4 2.7-6 6-6s5.6 2 6 6" />
          <path d="M16 5.2a3.4 3.4 0 0 1 0 6.5M17.5 14.5c2 .7 3.1 2.5 3.3 5" />
        </>
      )}
      {name === "rupee" && (
        <>
          <path d="M7 4h10M7 8h10M7 12h5.5c3 0 4.5-1.6 4.5-4M7 4c5 0 7.5 2.7 7.5 8 0 3.5-2 5-5 8" />
        </>
      )}
      {name === "clock" && (
        <>
          <circle cx="12" cy="12" r="8.5" />
          <path d="M12 7.5V12l3.2 2" />
        </>
      )}
      {name === "ticket" && (
        <>
          <path d="M4 8.5V6h16v2.5a3.5 3.5 0 0 0 0 7V18H4v-2.5a3.5 3.5 0 0 0 0-7Z" />
          <path d="M14 8v1.5M14 12v1.5M14 16v1.5" />
        </>
      )}
      {name === "check" && (
        <>
          <path d="M4.5 12.5 9.3 17 19.5 6.5" />
        </>
      )}
      {name === "plus" && <path d="M12 4v16M4 12h16" />}
      {name === "close" && <path d="m5 5 14 14M19 5 5 19" />}
      {name === "menu" && <path d="M4 7h16M4 12h11M4 17h16" />}
      {name === "music" && (
        <>
          <path d="M9 18V6l10-2v12" />
          <circle cx="6.5" cy="18.5" r="2.5" />
          <circle cx="16.5" cy="16.5" r="2.5" />
        </>
      )}
      {name === "mic" && (
        <>
          <rect x="9" y="3" width="6" height="11" rx="3" />
          <path d="M5.5 11.5a6.5 6.5 0 0 0 13 0M12 18v3M9 21h6" />
        </>
      )}
      {name === "stage" && (
        <>
          <path d="M3 20h18M5 20V9h14v11M8 9V6h8v3" />
          <path d="M9 14h6M12 11v6" />
        </>
      )}
      {name === "building" && (
        <>
          <path d="M4 20V7l8-4 8 4v13M2.5 20h19" />
          <path d="M8 9h2M14 9h2M8 13h2M14 13h2M10 20v-4h4v4" />
        </>
      )}
      {name === "sliders" && (
        <>
          <path d="M4 7h6M14 7h6M4 12h10M18 12h2M4 17h3M11 17h9" />
          <circle cx="12" cy="7" r="2" />
          <circle cx="16" cy="12" r="2" />
          <circle cx="9" cy="17" r="2" />
        </>
      )}
      {name === "send" && (
        <>
          <path d="m3.5 11.5 17-7-6.5 16-3-6.5-7.5-2.5Z" />
          <path d="m11 14 4-4" />
        </>
      )}
      {name === "bell" && (
        <>
          <path d="M18 9a6 6 0 0 0-12 0c0 6-2 7-2 7h16s-2-1-2-7Z" />
          <path d="M10 20a2.2 2.2 0 0 0 4 0" />
        </>
      )}
      {name === "message" && (
        <>
          <path d="M4 4.5h16v12H9l-5 4v-16Z" />
          <path d="M8 9h8M8 12.5h5" />
        </>
      )}
      {name === "file" && (
        <>
          <path d="M6 3h8l4 4v14H6V3Z" />
          <path d="M14 3v5h4M9 12h6M9 16h6" />
        </>
      )}
      {name === "card" && (
        <>
          <rect x="3" y="5.5" width="18" height="13" rx="1.5" />
          <path d="M3 10h18M7 15h3" />
        </>
      )}
      {name === "grid" && (
        <>
          <rect x="4" y="4" width="6" height="6" />
          <rect x="14" y="4" width="6" height="6" />
          <rect x="4" y="14" width="6" height="6" />
          <rect x="14" y="14" width="6" height="6" />
        </>
      )}
      {name === "compass" && (
        <>
          <circle cx="12" cy="12" r="8.5" />
          <path d="m15.5 8.5-2 5-5 2 2-5 5-2Z" />
        </>
      )}
      {name === "chart" && (
        <>
          <path d="M4 20V4M4 20h16" />
          <path d="m7 15 4-5 3 3 5-7" />
        </>
      )}
      {name === "settings" && (
        <>
          <circle cx="12" cy="12" r="3" />
          <path d="M12 3v2.5M12 18.5V21M3 12h2.5M18.5 12H21M5.6 5.6l1.8 1.8M16.6 16.6l1.8 1.8M18.4 5.6l-1.8 1.8M7.4 16.6l-1.8 1.8" />
        </>
      )}
      {name === "search" && (
        <>
          <circle cx="10.5" cy="10.5" r="6.5" />
          <path d="m15.5 15.5 4.5 4.5" />
        </>
      )}
      {name === "play" && <path d="m8 5 11 7-11 7V5Z" />}
      {name === "download" && (
        <>
          <path d="M12 3v12M7 10l5 5 5-5M4 20h16" />
        </>
      )}
      {name === "more" && (
        <>
          <circle cx="5" cy="12" r="1" fill="currentColor" />
          <circle cx="12" cy="12" r="1" fill="currentColor" />
          <circle cx="19" cy="12" r="1" fill="currentColor" />
        </>
      )}
      {name === "logout" && (
        <>
          <path d="M10 4H4v16h6M14 8l4 4-4 4M18 12H9" />
        </>
      )}
      {name === "lock" && (
        <>
          <rect x="5" y="10" width="14" height="10" rx="1.5" />
          <path d="M8.5 10V7a3.5 3.5 0 0 1 7 0v3" />
        </>
      )}
      {name === "eye" && (
        <>
          <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
          <circle cx="12" cy="12" r="2.5" />
        </>
      )}
    </svg>
  );
}

export type { IconName };
