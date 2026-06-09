import type { Metadata } from "next";
import { Inter, Outfit, Playfair_Display, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains" });

export const metadata: Metadata = {
  title: "Colombia Electoral Intelligence 2026",
  description: "Centro de inteligencia electoral — análisis territorial y narrativo en tiempo real.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={cn(
        "h-full dark", 
        inter.variable, 
        outfit.variable, 
        playfair.variable, 
        jetbrains.variable
      )}
    >
      <body className="min-h-full flex flex-col bg-[#02040a] text-[#f1f0ed] font-sans antialiased overflow-hidden">
        {/* Grain overlay for cinematic texture */}
        <div className="grain-overlay" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
