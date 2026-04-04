import type { Metadata } from "next";
import "./globals.css";
import { NavBar } from "@/components/NavBar";

export const metadata: Metadata = {
  title: "Stalker Karmine — KC Match Tracker",
  description: "Suivi complet des matchs de Karmine Corp — League of Legends, Rocket League, Valorant",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Stalker Karmine",
    description: "Tous les matchs de KC en temps réel",
    siteName: "Stalker Karmine",
    locale: "fr_FR",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-kc-dark text-white min-h-screen">
        {/* Ambient background glow */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-kc-blue opacity-[0.04] blur-[120px] rounded-full" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-kc-blue opacity-[0.02] blur-[100px] rounded-full" />
        </div>

        {/* Grid background */}
        <div className="fixed inset-0 bg-grid pointer-events-none opacity-100" />

        <NavBar />

        <main className="relative z-10 pt-20">
          {children}
        </main>

        <footer className="relative z-10 mt-20 border-t border-kc-border py-8 px-6">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-kc-blue font-display font-bold text-lg">STALKER</span>
              <span className="text-kc-muted font-display font-bold text-lg">KARMINE</span>
            </div>
            <p className="text-kc-muted text-sm font-mono">
              Data powered by{" "}
              <a href="https://pandascore.co" className="text-kc-blue hover:underline" target="_blank" rel="noopener">
                PandaScore
              </a>{" "}
              · Revalidation ISR 60s · Non-officiel
            </p>
            <p className="text-kc-muted text-xs">
              © 2025 Stalker Karmine — Fan project
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
