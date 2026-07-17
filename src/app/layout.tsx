import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Gerador de Carrosséis - Instagram Pro",
  description: "Crie carrosséis consistentes e profissionais de forma rápida com auxílio de Inteligência Artificial e templates controlados.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={`${plusJakartaSans.className} antialiased min-h-screen bg-slate-50 text-slate-800`}>
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
