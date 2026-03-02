import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

export const metadata: Metadata = {
  title: "Golf Meow | Last-Minute Tee Time Deals in the Coachella Valley",
  description:
    "Get alerts for discounted tee times at La Quinta, Indian Wells, Palm Desert & Rancho Mirage. No booking fees. Ever.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} min-h-screen bg-stone-50 font-sans antialiased text-stone-900`}>
        <Nav />
        {children}
      </body>
    </html>
  );
}
