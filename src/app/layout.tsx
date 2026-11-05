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
  title: "Kalakaar Studios · Artist & Venue Booking",
  description:
    "Book live talent and rare rooms with Kalakaar Studios. An independent artist and venue booking house in Patna.",
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
