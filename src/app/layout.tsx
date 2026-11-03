import type { Metadata } from "next";
import localFont from "next/font/local";
import { Martian_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

// Fontes da Fontshare (ITF Free Font License), hospedadas no próprio site.
const tanker = localFont({ variable: "--f-titulo", src: "../fonts/tanker-400.woff2", weight: "400" });
const switzer = localFont({
  variable: "--f-sans",
  src: [
    { path: "../fonts/switzer-400.woff2", weight: "400" },
    { path: "../fonts/switzer-500.woff2", weight: "500" },
    { path: "../fonts/switzer-600.woff2", weight: "600" },
  ],
});
const mono = Martian_Mono({ variable: "--f-mono", subsets: ["latin"], axes: ["wdth"] });

export const metadata: Metadata = {
  title: "Marina Xavier — Produto e IA",
  description: "Designer que aprendeu a construir. Líder de Produto no CITi, onde criou uma área inteira em cima de IA.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body className={`${tanker.variable} ${switzer.variable} ${mono.variable}`}>{children}
        <Analytics />
      </body>
    </html>
  );
}
