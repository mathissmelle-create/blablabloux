import type { Metadata } from "next";
import { Inter, Orbitron } from "next/font/google";
import "./globals.css";
import { AppProviders } from "./providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const orbitron = Orbitron({ subsets: ["latin"], variable: "--font-orbitron" });

export const metadata: Metadata = {
  title: "CS2 Prime",
  description: "Premium CS2-themed case opening, battles, and roulette platform.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${orbitron.variable} font-[var(--font-inter)]`}>
        <div className="pointer-events-none fixed inset-0 -z-10">
          <div className="absolute left-[-10%] top-[-20%] h-96 w-96 rounded-full bg-accent/15 blur-3xl" />
          <div className="absolute right-[-8%] top-0 h-80 w-80 rounded-full bg-indigo-400/10 blur-3xl" />
          <div className="absolute inset-0 opacity-[0.03] fine-grid" />
        </div>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
