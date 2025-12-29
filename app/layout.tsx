
// app/layout.tsx
import "./globals.css";
import { Playfair_Display, Inter } from "next/font/google";
import { AuthProvider } from "./context/AuthContext";

const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-display" });
const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${playfair.variable} ${inter.variable}`}>
      <body className="font-[var(--font-sans)]">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
