import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import DevControlsWrapper from "./components/DevControlsWrapper";
import { PostHogProvider } from "./components/PostHogProvider";
import { Analytics } from "@vercel/analytics/next"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Apocalypse Simulator",
  description: "Test your survival skills in various apocalypse scenarios",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Analytics />
        <PostHogProvider>
          {children}
          <DevControlsWrapper />
        </PostHogProvider>
      </body>
    </html>
  );
}