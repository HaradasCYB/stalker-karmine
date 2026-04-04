import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  getMatchById,
  formatDate,
  GAME_COLORS,
  GAME_LABELS,
} from "@/lib/pandascore";
import type { Game } from "@/lib/pandascore";
import { clsx } from "clsx";

export const revalidate = 60;

const GAME_SLUG_MAP: Record<string, Game> = {
  lol: "lol",
  rl: "rl",
  valorant: "valorant",
};

interface Props {
  params: { game: string; id: string };
}

export default async function MatchDetailPage({ params }: Props) {
  const game = GAME_SLUG_MAP[params.game];
  if (!game) notFound();

  const matchId = parseInt(params.id, 10);
  if (isNaN(matchId)) notFound();

  const match = await getMatchById(game, matchId).catch(() => null);
  if (!match) notFound();

  const color = GAME_COLORS[game];
  
  // Déterminer KC parmi les opponents par son nom (fallback si _kcId absent)
  const kcTeam = match.opponents?.find(o =>
    o.opponent.name?.toLowerCase().includes("karmine")
  )?.opponent ?? null;
  const kcId = kcTeam?.id ?? 0;

  const opponent = match.opponents?.find(o => o.opponent.id !== kcId)?.opponent ?? null;
  const kcScore = match.results?.find(r => r.team_id === kcId)?.score ?? 0;
  const oppScore = match.results?.find(r => r.team_id !== kcId)?.score ?? 0;
  const won = match.status === "finished" && kcId ? match.winner_id === kcId : null;
  const isLive = match.status === "running";
  const isFinished = match.status === "finished";

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-20">
      {/* Breadcrumb */}
      <div className="py-6 flex items-center gap-2 text-xs font-mono text-kc-muted">
        <Link href="/" className="hover:text-white transition-colors">Accueil</Link>
        <span>/</span>
        <Link href={`/${params.game}`} className="hover:text-white transition-colors">
          {GAME_LABELS[game]}
        </Link>
        <span>/</span>
        <span className="text-white">{match.name}</span>
      </div>

      {/* Hero score card */}
      <div
        className="glass rounded-2xl border overflow-hidden mb-8"
        style={{ borderColor: isLive ? `${color}50` : "rgba(28,32,48,0.8)" }}
      >
        {/* Top bar */}
        <div
          className="px-6 py-3 flex items-center justify-between border-b border-kc-border"
          style={{ background: `${color}08` }}
        >
          <div className="flex items-center gap-3">
            {isLive && <span className="live-dot" />}
            <span className="text-xs font-mono text-kc-muted uppercase tracking-wider">
              {isLive ? "LIVE" : isFinished ? "Terminé" : "À venir"}
            </span>
            {match.tournament && (
              <>
                <span className="text-kc-border">·</span>
                <span className="text-xs font-mono text-kc-muted">{match.tournament.name}</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span
              className="text-[10px] font-mono font-bold px-2 py-0.5 rounded"
              style={{ color, background: `${color}15` }}
            >
              {GAME_LABELS[game]}
            </span>
            <span className="text-[10px] font-mono text-kc-muted">{match.number_of_games ? `BO${match.number_of_games}` : "—"}</span>
          </div>
        </div>

        {/* Score section */}
        <div className="px-6 py-8 grid grid-cols-3 items-center gap-4">
          {/* KC */}
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 bg-kc-blue/10 rounded-2xl flex items-center justify-center border border-kc-blue/30 overflow-hidden">
              <img src="https://cdn.pandascore.co/images/team/image/126068/600px-Karmine_Corp_logo.png" alt="Karmine Corp" style={{ width: 50, height: 50, objectFit: "contain" }} />
            </div>
            <span className="font-display font-bold text-white text-center text-sm">Karmine Corp</span>
            {isFinished && won === true && (
              <span className="badge-win text-[10px] px-2 py-0.5 rounded-full font-mono">VICTOIRE</span>
            )}
          </div>

          {/* Score */}
          <div className="text-center">
            {isFinished || isLive ? (
              <div className="flex items-center justify-center gap-4">
                <span
                  className="font-display font-black text-6xl"
                  style={{ color: won === true ? "#00FF80" : won === false ? "#FF5050" : "white" }}
                >
                  {kcScore}
                </span>
                <span className="font-display font-bold text-3xl text-kc-muted">:</span>
                <span className="font-display font-black text-6xl text-gray-500">{oppScore}</span>
              </div>
            ) : (
              <div className="space-y-1">
                <div className="font-display font-black text-3xl text-white">VS</div>
                <p className="text-xs font-mono text-kc-muted">
                  {formatDate(match.scheduled_at ?? match.begin_at)}
                </p>
              </div>
            )}
            {isLive && (
              <p className="text-xs font-mono mt-2" style={{ color }}>
                Match en cours
              </p>
            )}
          </div>

          {/* Opponent */}
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center border border-kc-border overflow-hidden">
              {opponent?.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={opponent.image_url} alt={opponent.name ?? ""} className="w-full h-full object-contain p-1" />
              ) : (
                <span className="font-display font-bold text-gray-500 text-lg">{opponent?.acronym ?? "?"}</span>
              )}
            </div>
            <span className="font-display font-bold text-gray-400 text-center text-sm">
              {opponent?.name ?? "TBD"}
            </span>
            {isFinished && won === false && (
              <span className="badge-loss text-[10px] px-2 py-0.5 rounded-full font-mono">VICTOIRE</span>
            )}
          </div>
        </div>

        {/* Date footer */}
        {(match.begin_at || match.scheduled_at) && (
          <div className="px-6 py-3 border-t border-kc-border text-center">
            <p className="text-xs font-mono text-kc-muted">
              {formatDate(match.begin_at ?? match.scheduled_at)}
              {match.league && ` · ${match.league.name}`}
              {match.serie && ` · ${match.serie.full_name}`}
            </p>
          </div>
        )}
      </div>

      {/* Games (sets/maps) breakdown */}
      {match.games && match.games.length > 0 && (
        <section className="mb-8">
          <h2 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
            <span className="w-1 h-5 rounded-full" style={{ background: color }} />
            Détail des{" "}
            {game === "rl" ? "manches" : game === "lol" ? "parties" : "maps"}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {match.games.map((g, i) => {
              const kcWonGame = g.winner?.id === kcId;
              const isRunning = g.status === "running";
              const isNotStarted = g.status === "not_started";
              return (
                <div
                  key={g.id}
                  className={clsx(
                    "glass rounded-xl p-4 border text-center",
                    isRunning && "border-kc-blue/40",
                    g.status === "finished" && kcWonGame && "border-green-500/20",
                    g.status === "finished" && !kcWonGame && "border-red-500/20",
                    isNotStarted && "border-kc-border opacity-50"
                  )}
                >
                  <p className="text-[10px] font-mono text-kc-muted mb-2">
                    {game === "rl" ? "Manche" : game === "lol" ? "Partie" : "Map"} {i + 1}
                  </p>
                  {isRunning && <span className="live-dot mx-auto block mb-2" />}
                  {g.status === "finished" && (
                    <span
                      className={clsx(
                        "text-xs font-display font-bold",
                        kcWonGame ? "text-green-400" : "text-red-400"
                      )}
                    >
                      {kcWonGame ? "KC ✓" : `${opponent?.acronym ?? "OPP"} ✓`}
                    </span>
                  )}
                  {isNotStarted && <span className="text-xs font-mono text-kc-muted">—</span>}
                  {g.length && (
                    <p className="text-[10px] font-mono text-kc-muted mt-1">
                      {Math.floor(g.length / 60)}min
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Match metadata */}
      <section className="mb-8">
        <h2 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
          <span className="w-1 h-5 rounded-full" style={{ background: color }} />
          Informations
        </h2>
        <div className="glass rounded-xl border border-kc-border overflow-hidden">
          <div className="divide-y divide-kc-border">
            {[
              { label: "Compétition", value: match.tournament?.name ?? "—" },
              { label: "Ligue", value: match.league?.name ?? "—" },
              { label: "Saison", value: match.serie?.full_name ?? "—" },
              { label: "Type de match", value: match.number_of_games ? `BO${match.number_of_games}` : "—" },
              { label: "Format", value: match.match_type ?? "—" },
              { label: "Date", value: formatDate(match.scheduled_at ?? match.begin_at) },
              { label: "Jeu", value: match.videogame?.name ?? GAME_LABELS[game] },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between px-5 py-3">
                <span className="text-xs font-mono text-kc-muted">{label}</span>
                <span className="text-xs font-display font-medium text-white">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA retour */}
      <div className="flex gap-3">
        <Link
          href={`/${params.game}`}
          className="px-5 py-2.5 rounded-xl text-sm font-display font-semibold border border-kc-border text-kc-muted hover:text-white hover:border-white/20 transition-all"
        >
          ← Retour {GAME_LABELS[game]}
        </Link>
        <Link
          href="/"
          className="px-5 py-2.5 rounded-xl text-sm font-display font-semibold border transition-all"
          style={{ borderColor: `${color}40`, color, background: `${color}10` }}
        >
          Accueil
        </Link>
      </div>
    </div>
  );
}
