import Image from "next/image";
import { getKCTournaments, getTournamentStandings, GAME_LABELS, GAME_COLORS } from "@/lib/pandascore";
import type { Game, Standing, Tournament } from "@/lib/pandascore";
import { clsx } from "clsx";

export const revalidate = 60;

const GAMES: Game[] = ["lol", "rl", "valorant"];

function StandingTable({ standings, kcId, color }: { standings: Standing[]; kcId: number; color: string }) {
  if (!standings.length) return (
    <p className="text-xs font-mono text-kc-muted italic">Classement non disponible.</p>
  );
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-kc-border">
            <th className="text-left py-2 px-3 font-mono text-xs text-kc-muted w-10">#</th>
            <th className="text-left py-2 px-3 font-mono text-xs text-kc-muted">Équipe</th>
            <th className="text-center py-2 px-3 font-mono text-xs text-kc-muted">V</th>
            <th className="text-center py-2 px-3 font-mono text-xs text-kc-muted">D</th>
            <th className="text-center py-2 px-3 font-mono text-xs text-kc-muted">Pts</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((s) => {
            const isKC = s.team.id === kcId;
            return (
              <tr
                key={s.team.id}
                className={clsx(
                  "border-b border-kc-border/50 transition-colors",
                  isKC ? "bg-kc-blue/5" : "hover:bg-white/2"
                )}
              >
                <td className="py-2 px-3 font-mono text-xs">
                  <span className={clsx(
                    "inline-flex items-center justify-center w-6 h-6 rounded text-xs font-bold",
                    s.rank === 1 ? "bg-yellow-500/20 text-yellow-400" :
                    s.rank === 2 ? "bg-gray-400/20 text-gray-300" :
                    s.rank === 3 ? "bg-orange-600/20 text-orange-400" :
                    "text-kc-muted"
                  )}>
                    {s.rank}
                  </span>
                </td>
                <td className="py-2 px-3">
                  <div className="flex items-center gap-2">
                    {s.team.image_url && (
                      <Image src={s.team.image_url} alt={s.team.name} width={20} height={20} className="object-contain" />
                    )}
                    <span className={clsx(
                      "font-display font-semibold text-sm",
                      isKC ? "text-kc-blue" : "text-white"
                    )}>
                      {s.team.name}
                      {isKC && <span className="ml-2 text-[10px] font-mono text-kc-blue/60">← KC</span>}
                    </span>
                  </div>
                </td>
                <td className="py-2 px-3 text-center font-mono text-sm text-green-400">{s.wins}</td>
                <td className="py-2 px-3 text-center font-mono text-sm text-red-400">{s.losses}</td>
                <td className="py-2 px-3 text-center font-mono text-sm font-bold" style={{ color: isKC ? color : undefined }}>
                  {s.points ?? "—"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

async function GameClassements({ game }: { game: Game }) {
  const color = GAME_COLORS[game];
  const kcId = KC_TEAMS[game];
  const tournaments = await getKCTournaments(game).catch(() => [] as Tournament[]);

  // Get standings for the 3 most recent tournaments
  const recent = tournaments.slice(0, 3);
  const standingsResults = await Promise.allSettled(
    recent.map((t) => getTournamentStandings(t.id))
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <h2
          className="font-display font-black text-2xl tracking-tight uppercase"
          style={{ color }}
        >
          {GAME_LABELS[game]}
        </h2>
        <div className="flex-1 h-px" style={{ background: `${color}30` }} />
      </div>

      {recent.length === 0 && (
        <p className="text-xs font-mono text-kc-muted">Aucune compétition récente trouvée.</p>
      )}

      {recent.map((tournament, i) => {
        const standings = standingsResults[i].status === "fulfilled" ? standingsResults[i].value : [];
        return (
          <div key={tournament.id} className="glass rounded-xl border border-kc-border overflow-hidden">
            <div
              className="px-5 py-3 border-b border-kc-border flex items-center justify-between"
              style={{ background: `${color}08` }}
            >
              <div>
                <h3 className="font-display font-semibold text-sm text-white">{tournament.name}</h3>
                {tournament.league && (
                  <p className="text-xs font-mono text-kc-muted mt-0.5">{tournament.league.name}</p>
                )}
              </div>
              {tournament.begin_at && (
                <span className="text-xs font-mono text-kc-muted">
                  {new Date(tournament.begin_at).getFullYear()}
                </span>
              )}
            </div>
            <div className="p-1">
              <StandingTable standings={standings} kcId={kcId} color={color} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default async function ClassementsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">
      {/* Header */}
      <div className="py-12 mb-10 text-center relative">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[500px] h-[200px] bg-kc-blue opacity-[0.03] blur-3xl rounded-full" />
        </div>
        <p className="font-mono text-xs tracking-[0.3em] text-kc-muted mb-3">KARMINE CORP</p>
        <h1 className="font-display font-black text-5xl sm:text-6xl text-white mb-4">
          CLASS<span className="text-kc-blue">EMENTS</span>
        </h1>
        <p className="text-kc-muted text-sm max-w-md mx-auto">
          Position de KC dans chaque compétition récente, par jeu.
        </p>
      </div>

      {/* One section per game */}
      <div className="space-y-16">
        {GAMES.map((game) => (
          <GameClassements key={game} game={game} />
        ))}
      </div>
    </div>
  );
}
