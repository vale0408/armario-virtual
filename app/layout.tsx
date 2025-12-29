import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Armario Virtual",
  description: "Tu armario virtual: prendas, outfits y combinaciones.",
  applicationName: "Armario Virtual",
  manifest: "/manifest.webmanifest",

  themeColor: "#F3D6E8",

  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" }
    ],
    apple: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" }
    ]
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
