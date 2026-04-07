import Link from "next/link";
import { getAllKCMatches, GAME_COLORS, GAME_LABELS } from "@/lib/pandascore";
import type { Game, Match } from "@/lib/pandascore";
import { MatchCard } from "@/components/MatchCard";

export const revalidate = 30;

const GAME_SLUG_PATH: Record<Game, string> = { lol: "lol", rl: "rl", valorant: "valorant" };
const KC_LOGO = "https://cdn.pandascore.co/images/team/image/126068/600px-Karmine_Corp_logo.png";

function LiveScoreCard({ match }: { match: Match }) {
  const game = (match._game ?? "lol") as Game;
  const kcId = match._kcId ?? 0;
  const opponent = match.opponents?.find(o => o.opponent.id !== kcId)?.opponent ?? null;
  const kcScore = match.results?.find(r => r.team_id === kcId)?.score ?? 0;
  const oppScore = match.results?.find(r => r.team_id !== kcId)?.score ?? 0;
  const color = GAME_COLORS[game];

  return (
    <Link href={`/match/${GAME_SLUG_PATH[game]}/${match.id}`}>
      <div className="glass rounded-2xl border border-kc-blue/40 glow-blue overflow-hidden card-hover">
        <div className="px-6 py-3 border-b border-kc-blue/20 flex items-center justify-between" style={{ background: "rgba(0,191,255,0.05)" }}>
          <div className="flex items-center gap-3">
            <span className="live-dot" />
            <span className="text-xs font-mono font-bold text-kc-blue tracking-widest">LIVE</span>
            <span className="text-xs font-mono text-kc-muted">·</span>
            <span className="text-xs font-mono text-kc-muted">{match.league?.name ?? GAME_LABELS[game]}</span>
          </div>
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded" style={{ color, background: `${color}20` }}>
            {GAME_LABELS[game]}
          </span>
        </div>
        <div className="px-8 py-8 grid grid-cols-3 items-center gap-6">
          <div className="flex flex-col items-center gap-3">
            <div className="w-20 h-20 bg-kc-blue/10 rounded-2xl flex items-center justify-center border border-kc-blue/30 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={KC_LOGO} alt="KC" style={{ width: 64, height: 64, objectFit: "contain" }} />
            </div>
            <span className="font-display font-bold text-white text-sm text-center">Karmine Corp</span>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-4 font-display font-black text-6xl">
              <span className="text-kc-blue">{kcScore}</span>
              <span className="text-kc-muted text-3xl">:</span>
              <span className="text-gray-400">{oppScore}</span>
            </div>
            {match.tournament && <p className="text-xs font-mono text-kc-muted mt-3">{match.tournament.name}</p>}
          </div>
          <div className="flex flex-col items-center gap-3">
            <div className="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center border border-kc-border overflow-hidden">
              {opponent?.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={opponent.image_url} alt={opponent.name} style={{ width: 64, height: 64, objectFit: "contain" }} />
              ) : (
                <span className="font-display font-bold text-gray-500 text-xl">{opponent?.acronym ?? "?"}</span>
              )}
            </div>
            <span className="font-display font-bold text-gray-400 text-sm text-center">{opponent?.name ?? "TBD"}</span>
          </div>
        </div>
        <div className="px-6 py-3 border-t border-kc-blue/10 text-center">
          <span className="text-xs font-mono text-kc-muted">
            {match.number_of_games ? `BO${match.number_of_games}` : ""} · Cliquer pour le détail
          </span>
        </div>
      </div>
    </Link>
  );
}

export default async function LivePage() {
  const allMatches = await getAllKCMatches().catch(() => [] as Match[]);
  const liveMatches = allMatches.filter(m => m.status === "running");
  const upcomingMatches = allMatches.filter(m => m.status === "not_started").slice(0, 6);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-20">
      <div className="py-12 text-center relative mb-10">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[400px] h-[200px] bg-kc-blue opacity-[0.05] blur-3xl rounded-full" />
        </div>
        <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full badge-live text-sm font-mono">
          <span className="live-dot" /> SUIVI EN DIRECT
        </div>
        <h1 className="font-display font-black text-5xl sm:text-6xl text-white">
          LIVE <span className="text-kc-blue">KC</span>
        </h1>
        <p className="text-kc-muted text-sm mt-3 font-mono">Actualisation automatique toutes les 30 secondes</p>
      </div>

      {liveMatches.length > 0 ? (
        <section className="mb-12">
          <h2 className="font-display font-bold text-lg mb-6 flex items-center gap-3">
            <span className="live-dot" />
            {liveMatches.length} match{liveMatches.length > 1 ? "s" : ""} en cours
          </h2>
          <div className="space-y-6">
            {liveMatches.map(m => <LiveScoreCard key={m.id} match={m} />)}
          </div>
        </section>
      ) : (
        <div className="glass rounded-2xl border border-kc-border p-16 text-center mb-12">
          <div className="text-6xl mb-4">😴</div>
          <h3 className="font-display font-bold text-xl text-white mb-2">Aucun match en cours</h3>
          <p className="text-kc-muted text-sm font-mono">KC ne joue pas en ce moment.</p>
          <p className="text-kc-muted text-xs font-mono mt-1">La page se rafraîchit automatiquement toutes les 30s.</p>
        </div>
      )}

      {upcomingMatches.length > 0 && (
        <section>
          <h2 className="font-display font-bold text-lg mb-4 text-orange-400">Prochains matchs</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {upcomingMatches.map(m => {
              const game = (m._game ?? "lol") as Game;
              return <MatchCard key={m.id} match={m} game={game} showGame />;
            })}
          </div>
        </section>
      )}
    </div>
  );
}
