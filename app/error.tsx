"use client";
import Link from "next/link";

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
      <div className="mb-4 text-5xl font-display font-black text-red-500">ERREUR</div>
      <p className="text-kc-muted font-mono text-sm mb-2">Une erreur inattendue s'est produite.</p>
      <p className="text-red-400/60 font-mono text-xs mb-8 max-w-sm">{error.message}</p>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="px-5 py-2.5 rounded-xl font-display font-semibold text-sm bg-kc-blue/10 border border-kc-blue/30 text-kc-blue hover:bg-kc-blue/20 transition-all"
        >
          Réessayer
        </button>
        <Link
          href="/"
          className="px-5 py-2.5 rounded-xl font-display font-semibold text-sm border border-kc-border text-kc-muted hover:text-white transition-all"
        >
          Accueil
        </Link>
      </div>
    </div>
  );
}
