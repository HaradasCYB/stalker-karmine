import Image from "next/image";
import { getKCMatches, getTournamentStandings, GAME_LABELS, GAME_COLORS } from "@/lib/pandascore";
import type { Game, Standing, Match } from "@/lib/pandascore";
import { clsx } from "clsx";

export const revalidate = 300; // 5min pour les classements

const GAMES: Game[] = ["lol", "rl", "valorant"];

function StandingTable({ standings, color }: { standings: Standing[]; color: string }) {
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
            // KC identifié par nom, sans "Blue"
            const isKC = s.team.name?.toLowerCase().includes("karmine") &&
              !s.team.name?.toLowerCase().includes("blue");
            return (
              <tr key={s.team.id} className={clsx("border-b border-kc-border/50 transition-colors", isKC ? "bg-kc-blue/5" : "hover:bg-white/2")}>
                <td className="py-2 px-3 font-mono text-xs">
                  <span className={clsx("inline-flex items-center justify-center w-6 h-6 rounded text-xs font-bold",
                    s.rank === 1 ? "bg-yellow-500/20 text-yellow-400" :
                    s.rank === 2 ? "bg-gray-400/20 text-gray-300" :
                    s.rank === 3 ? "bg-orange-600/20 text-orange-400" : "text-kc-muted")}>
                    {s.rank}
                  </span>
                </td>
                <td className="py-2 px-3">
                  <div className="flex items-center gap-2">
                    {s.team.image_url && (
                      <Image src={s.team.image_url} alt={s.team.name} width={20} height={20} className="object-contain" unoptimized />
                    )}
                    <span className={clsx("font-display font-semibold text-sm", isKC ? "text-kc-blue" : "text-white")}>
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

// Extrait les tournois uniques depuis les matchs KC
function extractTournaments(matches: Match[]) {
  const seen = new Set<number>();
  const tournaments: { id: number; name: string; leagueName: string | null }[] = [];
  for (const m of matches) {
    if (m.tournament && !seen.has(m.tournament.id)) {
      seen.add(m.tournament.id);
      tournaments.push({
        id: m.tournament.id,
        name: m.tournament.name,
        leagueName: m.league?.name ?? null,
      });
    }
  }
  return tournaments.slice(0, 5); // max 5 tournois récents
}

async function GameClassements({ game }: { game: Game }) {
  const color = GAME_COLORS[game];

  // Récupérer les matchs KC pour extraire les tournois
  const matches = await getKCMatches(game).catch(() => [] as Match[]);
  const tournaments = extractTournaments(matches);

  // Fetch standings pour chaque tournoi
  const standingsResults = await Promise.allSettled(
    tournaments.map(t => getTournamentStandings(t.id))
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <h2 className="font-display font-black text-2xl tracking-tight uppercase" style={{ color }}>
          {GAME_LABELS[game]}
        </h2>
        <div className="flex-1 h-px" style={{ background: `${color}30` }} />
      </div>

      {tournaments.length === 0 && (
        <p className="text-xs font-mono text-kc-muted">Aucune compétition récente trouvée.</p>
      )}

      {tournaments.map((tournament, i) => {
        const standings = standingsResults[i].status === "fulfilled" ? standingsResults[i].value : [];
        return (
          <div key={tournament.id} className="glass rounded-xl border border-kc-border overflow-hidden">
            <div className="px-5 py-3 border-b border-kc-border flex items-center justify-between" style={{ background: `${color}08` }}>
              <div>
                <h3 className="font-display font-semibold text-sm text-white">{tournament.name}</h3>
                {tournament.leagueName && <p className="text-xs font-mono text-kc-muted mt-0.5">{tournament.leagueName}</p>}
              </div>
            </div>
            <div className="p-1">
              <StandingTable standings={standings} color={color} />
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

      <div className="space-y-16">
        {GAMES.map((game) => (
          <GameClassements key={game} game={game} />
        ))}
      </div>
    </div>
  );
}
