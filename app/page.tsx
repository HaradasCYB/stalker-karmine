import Link from "next/link";
import { getAllKCMatches, getKCMatches, isKCWinner, getKCScore, getOpponentScore, getKCOpponent, formatDate, GAME_LABELS, GAME_COLORS } from "@/lib/pandascore";
import type { Game, Match } from "@/lib/pandascore";
import { MatchCard } from "@/components/MatchCard";

export const revalidate = 60;

const GAMES: Game[] = ["lol", "rl", "valorant"];
const GAME_PATHS: Record<Game, string> = { lol: "/lol", rl: "/rl", valorant: "/valorant" };

function WinRate({ matches, game }: { matches: Match[]; game: Game }) {
  const finished = matches.filter((m) => m.status === "finished");
  const wins = finished.filter((m) => isKCWinner(m, game) === true).length;
  const rate = finished.length > 0 ? Math.round((wins / finished.length) * 100) : 0;
  return (
    <div className="text-center">
      <div className="text-3xl font-display font-black" style={{ color: GAME_COLORS[game] }}>
        {rate}%
      </div>
      <div className="text-xs font-mono text-kc-muted mt-1">
        {wins}V / {finished.length - wins}D
      </div>
    </div>
  );
}

export default async function HomePage() {
  const allMatches = await getAllKCMatches().catch(() => []);
  const liveMatches = allMatches.filter((m) => m.status === "running");
  const upcomingMatches = allMatches.filter((m) => m.status === "not_started").slice(0, 3);
  const recentMatches = allMatches.filter((m) => m.status === "finished").slice(0, 5);

  const gameMatches = {
    lol: allMatches.filter((m) => (m as any)._game === "lol"),
    rl: allMatches.filter((m) => (m as any)._game === "rl"),
    valorant: allMatches.filter((m) => (m as any)._game === "valorant"),
  } as Record<Game, Match[]>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">
      {/* Hero */}
      <section className="relative py-16 text-center">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[600px] h-[600px] rounded-full border border-kc-blue/5" />
          <div className="absolute w-[400px] h-[400px] rounded-full border border-kc-blue/8" />
          <div className="absolute w-[200px] h-[200px] rounded-full border border-kc-blue/10" />
        </div>

        {liveMatches.length > 0 && (
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full badge-live text-sm font-mono">
            <span className="live-dot" />
            {liveMatches.length} MATCH{liveMatches.length > 1 ? "S" : ""} EN COURS
          </div>
        )}

        <h1 className="font-display text-5xl sm:text-7xl font-black tracking-tight mb-4">
          <span className="text-white">STALKER</span>{" "}
          <span className="text-kc-blue glow-text">KARMINE</span>
        </h1>
        <p className="text-kc-muted font-body text-lg max-w-xl mx-auto mb-10">
          Suivi en temps réel de tous les matchs de{" "}
          <span className="text-white font-medium">Karmine Corp</span> sur LoL, Rocket League et Valorant.
        </p>

        {/* Quick nav */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {GAMES.map((game) => (
            <Link
              key={game}
              href={GAME_PATHS[game]}
              className="px-6 py-3 rounded-xl font-display font-semibold text-sm border transition-all duration-300 hover:scale-105"
              style={{
                borderColor: `${GAME_COLORS[game]}40`,
                color: GAME_COLORS[game],
                background: `${GAME_COLORS[game]}10`,
              }}
            >
              {GAME_LABELS[game]}
            </Link>
          ))}
          <Link
            href="/classements"
            className="px-6 py-3 rounded-xl font-display font-semibold text-sm border border-kc-border text-kc-muted hover:text-white hover:border-white/20 transition-all duration-300"
          >
            Classements
          </Link>
        </div>
      </section>

      {/* Live matches */}
      {liveMatches.length > 0 && (
        <section className="mb-12">
          <h2 className="font-display font-bold text-xl mb-4 flex items-center gap-3">
            <span className="live-dot" />
            Matchs en direct
          </h2>
          <div className="grid sm:grid-cols-2 gap-4 stagger">
            {liveMatches.map((m) => {
              const game: Game = (m as any)._game ?? "lol";
              return <MatchCard key={m.id} match={m} game={game} showGame />;
            })}
          </div>
        </section>
      )}

      {/* Stats par jeu */}
      <section className="mb-12">
        <h2 className="font-display font-bold text-xl mb-6">Performance globale</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {GAMES.map((game) => {
            const matches = gameMatches[game];
            const finished = matches.filter((m) => m.status === "finished");
            const wins = finished.filter((m) => isKCWinner(m, game) === true).length;
            return (
              <div
                key={game}
                className="glass rounded-xl p-6 card-hover border border-kc-border"
              >
                <div className="flex items-center justify-between mb-4">
                  <span
                    className="font-display font-black text-sm tracking-widest uppercase"
                    style={{ color: GAME_COLORS[game] }}
                  >
                    {GAME_LABELS[game]}
                  </span>
                  <Link href={GAME_PATHS[game]} className="text-xs font-mono text-kc-muted hover:text-white transition-colors">
                    Voir tout →
                  </Link>
                </div>
                <WinRate matches={matches} game={game} />
                <div className="mt-4 pt-4 border-t border-kc-border">
                  <div className="h-1.5 bg-kc-border rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: finished.length > 0 ? `${(wins / finished.length) * 100}%` : "0%",
                        background: GAME_COLORS[game],
                      }}
                    />
                  </div>
                  <p className="text-xs font-mono text-kc-muted mt-2">{finished.length} matchs joués</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Prochains matchs */}
      {upcomingMatches.length > 0 && (
        <section className="mb-12">
          <h2 className="font-display font-bold text-xl mb-4">Prochains matchs</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger">
            {upcomingMatches.map((m) => {
              const game: Game = (m as any)._game ?? "lol";
              return <MatchCard key={m.id} match={m} game={game} showGame />;
            })}
          </div>
        </section>
      )}

      {/* Derniers résultats */}
      {recentMatches.length > 0 && (
        <section>
          <h2 className="font-display font-bold text-xl mb-4">Derniers résultats</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger">
            {recentMatches.map((m) => {
              const game: Game = (m as any)._game ?? "lol";
              return <MatchCard key={m.id} match={m} game={game} showGame />;
            })}
          </div>
        </section>
      )}

      {allMatches.length === 0 && (
        <div className="text-center py-20 space-y-3">
          <p className="font-mono text-kc-muted text-sm">
            Aucun match trouvé sur les 6 derniers mois.
          </p>
          <p className="font-mono text-kc-muted text-xs">
            {process.env.PANDASCORE_TOKEN
              ? "KC n'a pas de matchs référencés sur PandaScore pour cette période."
              : <>Clé API manquante — configure <span className="text-kc-blue">PANDASCORE_TOKEN</span> dans Vercel.</>}
          </p>
        </div>
      )}
    </div>
  );
}
