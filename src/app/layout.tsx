import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
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
    <html lang="pt-BR" className={`${inter.variable}`}>
      <head>
        {/* Importação de fontes adicionais para uso no SlideCanvas */}
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Lato:wght@400;700&family=Manrope:wght@400;600;800&family=Montserrat:wght@400;600;800;900&family=Plus+Jakarta+Sans:wght@400;600;800&family=Poppins:wght@400;600;800&family=Space+Grotesk:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased min-h-screen bg-slate-50 text-slate-800">
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
