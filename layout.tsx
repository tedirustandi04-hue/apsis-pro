import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "APSIS Pro | Assessment Intelligence",
  description: "Aplikasi Pembuat Soal, Asesmen & Analisis Evaluasi Pembelajaran"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
