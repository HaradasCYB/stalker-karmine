import { getKCMatches, getKCRoster, isKCWinner, GAME_COLORS, GAME_LABELS, formatDate, getKCOpponent } from "@/lib/pandascore";
import type { Game, Match } from "@/lib/pandascore";
import { MatchCard } from "@/components/MatchCard";
import { clsx } from "clsx";

interface Props {
  game: Game;
}

function GameHero({ game }: { game: Game }) {
  const color = GAME_COLORS[game];
  const label = GAME_LABELS[game];
  return (
    <div className="relative py-12 mb-10">
      <div
        className="absolute inset-0 opacity-5 blur-3xl rounded-full mx-auto w-1/2"
        style={{ background: color }}
      />
      <div className="relative text-center">
        <div
          className="inline-block font-mono text-xs tracking-[0.3em] mb-3 px-3 py-1 rounded-full border"
          style={{ color, borderColor: `${color}30`, background: `${color}10` }}
        >
          KARMINE CORP
        </div>
        <h1 className="font-display font-black text-5xl sm:text-6xl text-white mb-2">
          {label.toUpperCase()}
        </h1>
        <div className="w-20 h-1 mx-auto rounded-full mt-4" style={{ background: color }} />
      </div>
    </div>
  );
}

function RecordBadge({ wins, losses }: { wins: number; losses: number }) {
  const total = wins + losses;
  const rate = total > 0 ? Math.round((wins / total) * 100) : 0;
  return (
    <div className="glass rounded-xl p-4 flex items-center gap-6 border border-kc-border">
      <div className="text-center">
        <div className="text-2xl font-display font-black text-green-400">{wins}</div>
        <div className="text-xs font-mono text-kc-muted">Victoires</div>
      </div>
      <div className="flex-1 text-center">
        <div className="text-3xl font-display font-black text-white">{rate}%</div>
        <div className="text-xs font-mono text-kc-muted">Win Rate</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-display font-black text-red-400">{losses}</div>
        <div className="text-xs font-mono text-kc-muted">Défaites</div>
      </div>
    </div>
  );
}

export async function GamePage({ game }: Props) {
  const [matches, roster] = await Promise.all([
    getKCMatches(game).catch(() => [] as Match[]),
    getKCRoster(game).catch(() => []),
  ]);

  const liveMatches = matches.filter((m) => m.status === "running");
  const upcoming = matches.filter((m) => m.status === "not_started");
  const finished = matches.filter((m) => m.status === "finished");
  const wins = finished.filter((m) => isKCWinner(m, game) === true).length;
  const losses = finished.length - wins;

  const color = GAME_COLORS[game];

  // Group finished by tournament
  const byTournament = finished.reduce<Record<string, Match[]>>((acc, m) => {
    const key = m.tournament?.name ?? m.serie?.full_name ?? "Autre";
    if (!acc[key]) acc[key] = [];
    acc[key].push(m);
    return acc;
  }, {});

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">
      <GameHero game={game} />

      {/* Record */}
      <div className="mb-10">
        <RecordBadge wins={wins} losses={losses} />
      </div>

      {/* Live */}
      {liveMatches.length > 0 && (
        <section className="mb-10">
          <h2 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
            <span className="live-dot" /> En direct
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {liveMatches.map((m) => <MatchCard key={m.id} match={m} game={game} />)}
          </div>
        </section>
      )}

      {/* Upcoming */}
      {upcoming.length > 0 && (
        <section className="mb-10">
          <h2 className="font-display font-bold text-lg mb-4 text-orange-400">Prochains matchs</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcoming.map((m) => <MatchCard key={m.id} match={m} game={game} />)}
          </div>
        </section>
      )}

      {/* Roster */}
      {roster.length > 0 && (
        <section className="mb-10">
          <h2 className="font-display font-bold text-lg mb-4">Roster actuel</h2>
          <div className="flex flex-wrap gap-3">
            {roster.map((p) => (
              <div key={p.id} className="glass rounded-lg px-4 py-2 border border-kc-border flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ background: color }}
                />
                <span className="font-display font-semibold text-sm text-white">{p.name}</span>
                {p.role && (
                  <span className="text-xs font-mono text-kc-muted capitalize">{p.role}</span>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Résultats par tournoi */}
      {Object.keys(byTournament).length > 0 && (
        <section>
          <h2 className="font-display font-bold text-lg mb-6">Résultats par compétition</h2>
          <div className="space-y-8">
            {Object.entries(byTournament).map(([tournament, tMatches]) => {
              const tWins = tMatches.filter((m) => isKCWinner(m, game) === true).length;
              const tLosses = tMatches.length - tWins;
              return (
                <div key={tournament}>
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="font-display font-semibold text-base text-white">{tournament}</h3>
                    <span className="text-xs font-mono text-green-400">{tWins}V</span>
                    <span className="text-xs font-mono text-red-400">{tLosses}D</span>
                    <div className="flex-1 h-px bg-kc-border" />
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {tMatches.map((m) => <MatchCard key={m.id} match={m} game={game} />)}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {matches.length === 0 && (
        <div className="text-center py-20">
          <p className="font-mono text-kc-muted text-sm">Aucun match trouvé — clé API manquante ou KC non référencé.</p>
        </div>
      )}
    </div>
  );
}
