import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "OfertaAI — generator ofert sprzedażowych",
  description: "AI analizuje zdjęcia produktu i przygotowuje gotową ofertę sprzedażową."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="pl"><body>{children}</body></html>;
}