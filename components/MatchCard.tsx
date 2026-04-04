import Link from "next/link";
import Image from "next/image";
import { clsx } from "clsx";
import type { Match, Game } from "@/lib/pandascore";
import { formatDate, GAME_COLORS } from "@/lib/pandascore";

interface Props { match: Match; game: Game; showGame?: boolean; }
const GAME_LABEL: Record<Game, string> = { lol: "LoL", rl: "RL", valorant: "VAL" };
const GAME_SLUG_PATH: Record<Game, string> = { lol: "lol", rl: "rl", valorant: "valorant" };

// URL du logo KC officiel sur le CDN PandaScore
const KC_LOGO = "https://cdn.pandascore.co/images/team/image/126068/600px-Karmine_Corp_logo.png";

function TeamLogo({ imageUrl, name, acronym, isKC = false, size = 40 }: {
  imageUrl: string | null; name: string; acronym?: string; isKC?: boolean; size?: number;
}) {
  const borderColor = isKC ? "rgba(0,191,255,0.4)" : "rgba(28,32,48,0.8)";
  const bg = isKC ? "rgba(0,191,255,0.08)" : "rgba(255,255,255,0.03)";
  const src = isKC ? KC_LOGO : imageUrl;

  return (
    <div
      className="rounded-xl overflow-hidden flex items-center justify-center flex-shrink-0"
      style={{ width: size, height: size, border: `1.5px solid ${borderColor}`, background: bg, minWidth: size }}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={name}
          style={{ width: size - 8, height: size - 8, objectFit: "contain" }}
        />
      ) : (
        <span className="font-display font-black text-gray-400" style={{ fontSize: size * 0.28 }}>
          {acronym?.slice(0, 3) ?? name.slice(0, 2).toUpperCase()}
        </span>
      )}
    </div>
  );
}

function StatusBadge({ status, isLive }: { status: Match["status"]; isLive: boolean }) {
  if (isLive) return (
    <span className="badge-live flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-mono font-medium">
      <span className="live-dot !w-1.5 !h-1.5" /> LIVE
    </span>
  );
  if (status === "not_started") return (
    <span className="badge-upcoming px-2 py-0.5 rounded-full text-xs font-mono">À VENIR</span>
  );
  return null;
}

export function MatchCard({ match, game, showGame = false }: Props) {
  const kcId = match._kcId ?? 0;
  const opponent = match.opponents?.find(o => o.opponent.id !== kcId)?.opponent ?? null;
  const kcScore = match.results?.find(r => r.team_id === kcId)?.score ?? 0;
  const oppScore = match.results?.find(r => r.team_id !== kcId)?.score ?? 0;
  const won = match.status === "finished" ? match.winner_id === kcId : null;
  const isLive = match.status === "running";
  const isFinished = match.status === "finished";
  const color = GAME_COLORS[game];

  return (
    <Link href={`/match/${GAME_SLUG_PATH[game]}/${match.id}`}>
      <div className={clsx(
        "glass rounded-xl p-4 card-hover cursor-pointer",
        isLive && "border-kc-blue/40 glow-blue",
        isFinished && won === true && "border-green-500/20",
        isFinished && won === false && "border-red-500/20",
      )}>
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {showGame && (
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded" style={{ background: `${color}20`, color }}>
                {GAME_LABEL[game]}
              </span>
            )}
            {match.league && (
              <span className="text-[10px] font-mono text-kc-muted truncate max-w-[160px]">{match.league.name}</span>
            )}
          </div>
          <StatusBadge status={match.status} isLive={isLive} />
        </div>

        {/* Teams + Score */}
        <div className="flex items-center justify-between gap-3">
          {/* KC */}
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            <TeamLogo imageUrl={null} name="Karmine Corp" acronym="KC" isKC size={40} />
            <span className="font-display font-semibold text-white text-sm truncate">Karmine Corp</span>
          </div>

          {/* Score */}
          {isFinished || isLive ? (
            <div className="flex items-center gap-2.5 font-display font-black text-2xl flex-shrink-0">
              <span className={clsx(won === true ? "text-green-400" : won === false ? "text-red-400" : "text-white")}>
                {kcScore}
              </span>
              <span className="text-kc-muted text-base">—</span>
              <span className="text-gray-400">{oppScore}</span>
            </div>
          ) : (
            <div className="text-center flex-shrink-0">
              <p className="text-xs font-mono text-kc-muted">{formatDate(match.scheduled_at ?? match.begin_at)}</p>
              <p className="text-xs font-mono text-kc-muted mt-0.5">BO{match.number_of_games}</p>
            </div>
          )}

          {/* Opponent */}
          <div className="flex items-center gap-2.5 flex-1 min-w-0 justify-end">
            <span className="font-display font-semibold text-gray-400 text-sm truncate text-right">
              {opponent?.name ?? "TBD"}
            </span>
            <TeamLogo
              imageUrl={opponent?.image_url ?? null}
              name={opponent?.name ?? "?"}
              acronym={opponent?.acronym}
              size={40}
            />
          </div>
        </div>

        {/* Footer */}
        {isFinished && (
          <div className="mt-3 pt-3 border-t border-kc-border flex items-center justify-between">
            <span className="text-[10px] font-mono text-kc-muted truncate max-w-[60%]">
              {match.tournament?.name ?? "—"}
            </span>
            {won !== null && (
              <span className={clsx("text-[10px] font-display font-bold px-2 py-0.5 rounded flex-shrink-0", won ? "badge-win" : "badge-loss")}>
                {won ? "VICTOIRE" : "DÉFAITE"}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
