import type { Metadata } from "next";
import { Fraunces, Instrument_Sans } from "next/font/google";
import "./styles/base.css";
import "./styles/landing.css";
import "./styles/dashboard.css";
import "./styles/responsive.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  axes: ["opsz"],
});

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kalakaar Networks | Professional Event Management & Artist Booking",
  description:
    "Book top independent artists, comedians, musicians, and heritage venues across Patna, Ranchi, and Kolkata.",
  openGraph: {
    title: "Kalakaar Networks | Professional Event Management & Artist Booking",
    description:
      "Book top independent artists, comedians, musicians, and heritage venues across Patna, Ranchi, and Kolkata.",
    type: "website",
    locale: "en_IN",
    siteName: "Kalakaar Networks",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kalakaar Networks | Professional Event Management & Artist Booking",
    description:
      "Book top independent artists, comedians, musicians, and heritage venues across Patna, Ranchi, and Kolkata.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${instrumentSans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
