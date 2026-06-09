import type { Metadata } from "next";
import { Playfair_Display } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "600", "700", "900"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Colombia Electoral Intelligence 2026",
  description: "Centro de inteligencia electoral — análisis territorial y narrativo en tiempo real para las elecciones presidenciales de Colombia 2026.",
  keywords: ["Colombia", "elecciones", "2026", "inteligencia electoral", "Cepeda", "De la Espriella"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={cn("h-full", playfair.variable)}
    >
      <body className="min-h-full flex flex-col bg-[#04060d] text-[#F1F0ED] antialiased overflow-hidden">
        {/* Grain overlay for cinematic texture */}
        <div className="grain-overlay" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
