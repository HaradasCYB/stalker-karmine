"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";

const LINKS = [
  { href: "/", label: "Accueil" },
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
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 relative">
            <div className="absolute inset-0 bg-kc-blue rounded-sm opacity-20 group-hover:opacity-40 transition-opacity" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-display font-black text-kc-blue text-sm leading-none">KC</span>
            </div>
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-display font-bold text-white text-sm tracking-wider">STALKER</span>
            <span className="font-display font-bold text-kc-blue text-[10px] tracking-[0.2em]">KARMINE</span>
          </div>
        </Link>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-1">
          {LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={clsx(
                  "relative px-4 py-2 text-sm font-display font-medium tracking-wide rounded-lg transition-all duration-200",
                  isActive
                    ? "text-kc-blue bg-kc-blue/10"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                )}
                style={isActive && link.color ? { color: link.color, background: `${link.color}15` } : {}}
              >
                {link.label}
                {isActive && (
                  <span
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full"
                    style={{ background: link.color ?? "#00BFFF" }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* Mobile: simplified */}
        <div className="flex md:hidden items-center gap-2">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={clsx(
                "text-xs font-display font-medium px-2 py-1 rounded",
                pathname === link.href ? "text-kc-blue" : "text-gray-500"
              )}
            >
              {link.label === "Rocket League" ? "RL" : link.label === "Valorant" ? "VAL" : link.label === "League of Legends" ? "LoL" : link.label === "Classements" ? "CLT" : link.label}
            </Link>
          ))}
        </div>

        {/* Live indicator */}
        <div className="flex items-center gap-2">
          <div className="live-dot" />
          <span className="text-xs font-mono text-kc-muted hidden sm:block">LIVE TRACKING</span>
        </div>
      </nav>
    </header>
  );
}
