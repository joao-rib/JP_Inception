import type { Metadata } from "next";
import { Suspense } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import CloseSessionOnUnload from "./frontend/components/CloseSessionOnUnload";
import GlobalHamburgerMenu from "./frontend/components/GlobalHamburgerMenu";
import ThemeInitializer from "./frontend/components/ThemeInitializer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ft_transcendence!",
  description: "Let's play!",
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
        <ThemeInitializer />
        <Suspense fallback={null}>
          <CloseSessionOnUnload />
          <GlobalHamburgerMenu />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
