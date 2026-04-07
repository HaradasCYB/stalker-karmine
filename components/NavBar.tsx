"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";

const LINKS = [
  { href: "/", label: "Accueil" },
  { href: "/live", label: "🔴 Live", color: "#00BFFF" },
  { href: "/lol", label: "LoL", color: "#C89B3C" },
  { href: "/rl", label: "Rocket League", color: "#2196F3" },
  { href: "/valorant", label: "Valorant", color: "#FF4655" },
  { href: "/classements", label: "Classements" },
];

export function NavBar() {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-kc-border">
      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
          <div className="w-9 h-9 flex items-center justify-center rounded-lg border border-kc-blue/40 bg-kc-blue/10 overflow-hidden group-hover:border-kc-blue/70 transition-all flex-shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj4KICA8cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgcng9IjE4IiBmaWxsPSIjMDBCRkZGIi8+CiAgPHRleHQgeD0iNTAiIHk9IjY4IiBmb250LWZhbWlseT0iQXJpYWwgQmxhY2ssIEFyaWFsIiBmb250LXdlaWdodD0iOTAwIiBmb250LXNpemU9IjQ0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgbGV0dGVyLXNwYWNpbmc9Ii0yIj5LQzwvdGV4dD4KPC9zdmc+"
              alt="KC"
              style={{ width: 26, height: 26, objectFit: "contain" }}
            />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-display font-bold text-white text-sm tracking-wider">STALKER</span>
            <span className="font-display font-bold text-kc-blue text-[10px] tracking-[0.2em]">KARMINE</span>
          </div>
        </Link>

        {/* Nav Links — desktop */}
        <div className="hidden lg:flex items-center gap-0.5">
          {LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={clsx(
                  "relative px-3 py-2 text-sm font-display font-medium tracking-wide rounded-lg transition-all duration-200 whitespace-nowrap",
                  isActive ? "text-kc-blue bg-kc-blue/10" : "text-gray-400 hover:text-white hover:bg-white/5"
                )}
                style={isActive && link.color ? { color: link.color, background: `${link.color}15` } : {}}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full" style={{ background: link.color ?? "#00BFFF" }} />
                )}
              </Link>
            );
          })}
        </div>

        {/* Mobile nav */}
        <div className="flex lg:hidden items-center gap-0.5 overflow-x-auto">
          {LINKS.map((link) => (
            <Link key={link.href} href={link.href} className={clsx("text-xs font-display font-medium px-1.5 py-1 rounded whitespace-nowrap", pathname === link.href ? "text-kc-blue" : "text-gray-500")}>
              {link.label === "Rocket League" ? "RL" : link.label === "Valorant" ? "VAL" : link.label === "Classements" ? "CLT" : link.label === "Accueil" ? "🏠" : link.label}
            </Link>
          ))}
        </div>

        {/* Live indicator */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="live-dot" />
          <span className="text-xs font-mono text-kc-muted hidden xl:block">LIVE TRACKING</span>
        </div>
      </nav>
    </header>
  );
}
