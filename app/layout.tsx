// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { AuthProvider } from "./context/AuthContext";

const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-display" });
const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Armario Virtual",
  description: "Tu armario virtual: prendas, outfits y combinaciones.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "Armario",
    statusBarStyle: "default", // prueba también "black-translucent" si quieres
  },
  icons: {
    apple: [
      { url: "/icons/icon-192.png" },
    ],
  },
};

export const viewport = {
  themeColor: "#F3D6E8",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${playfair.variable} ${inter.variable}`}>
      <body className="font-[var(--font-sans)]">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
