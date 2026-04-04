import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
      <div className="relative mb-8">
        <div className="text-[120px] font-display font-black text-kc-border leading-none select-none">
          404
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-display font-black text-2xl text-kc-blue glow-text">
            PAGE INTROUVABLE
          </span>
        </div>
      </div>
      <p className="text-kc-muted font-mono text-sm mb-8 max-w-sm">
        Ce match ou cette page n'existe pas. KC a peut-être drop la map avant qu'on la trouve.
      </p>
      <Link
        href="/"
        className="px-6 py-3 rounded-xl font-display font-semibold text-sm bg-kc-blue/10 border border-kc-blue/30 text-kc-blue hover:bg-kc-blue/20 transition-all"
      >
        Retour à l'accueil
      </Link>
    </div>
  );
}
