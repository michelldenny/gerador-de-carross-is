import type { Metadata } from "next";
import "@fontsource/plus-jakarta-sans/400.css";
import "@fontsource/plus-jakarta-sans/600.css";
import "@fontsource/plus-jakarta-sans/700.css";
import "@fontsource/plus-jakarta-sans/800.css";
import "@fontsource/barlow-condensed/700.css";
import "@fontsource/barlow-condensed/900.css";
import "./globals.css";
import { Toaster } from "sonner";

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
      <body className="font-sans antialiased min-h-screen bg-slate-50 text-slate-800">
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
