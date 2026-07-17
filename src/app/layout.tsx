import type { Metadata } from "next";
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
      <head>
        {/* Preconnect para melhorar carregamento das fontes */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Plus Jakarta Sans como fonte principal da aplicação + demais fontes para uso no SlideCanvas */}
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&family=DM+Sans:wght@400;500;700&family=Lato:wght@400;700&family=Manrope:wght@400;600;800&family=Montserrat:wght@400;600;800;900&family=Poppins:wght@400;600;800&family=Space+Grotesk:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased min-h-screen bg-slate-50 text-slate-800 font-sans">
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
