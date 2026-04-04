import Link from "next/link";
import Image from "next/image";
import { clsx } from "clsx";
import type { Match, Game } from "@/lib/pandascore";
import { getKCOpponent, getKCScore, getOpponentScore, isKCWinner, formatDate, KC_TEAMS, GAME_COLORS } from "@/lib/pandascore";

interface Props {
  match: Match;
  game: Game;
  showGame?: boolean;
}

const GAME_LABEL: Record<Game, string> = { lol: "LoL", rl: "RL", valorant: "VAL" };
const GAME_SLUG_PATH: Record<Game, string> = { lol: "lol", rl: "rl", valorant: "valorant" };

function StatusBadge({ status, isLive }: { status: Match["status"]; isLive: boolean }) {
  if (isLive) return (
    <span className="badge-live flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-mono font-medium">
      <span className="live-dot !w-1.5 !h-1.5" /> LIVE
    </span>
  );
  if (status === "finished") return null;
  if (status === "not_started") return (
    <span className="badge-upcoming px-2 py-0.5 rounded-full text-xs font-mono">À VENIR</span>
  );
  return null;
}

export function MatchCard({ match, game, showGame = false }: Props) {
  const opponent = getKCOpponent(match, game);
  const kcScore = getKCScore(match, game);
  const oppScore = getOpponentScore(match, game);
  const won = isKCWinner(match, game);
  const isLive = match.status === "running";
  const isFinished = match.status === "finished";
  const color = GAME_COLORS[game];

  return (
    <Link href={`/match/${GAME_SLUG_PATH[game]}/${match.id}`}>
      <div
        className={clsx(
          "glass rounded-xl p-4 card-hover cursor-pointer",
          isLive && "border-kc-blue/40 glow-blue",
          isFinished && won === true && "border-green-500/20",
          isFinished && won === false && "border-red-500/20",
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {showGame && (
              <span
                className="text-[10px] font-mono font-bold px-2 py-0.5 rounded"
                style={{ background: `${color}20`, color }}
              >
                {GAME_LABEL[game]}
              </span>
            )}
            {match.league && (
              <span className="text-[10px] font-mono text-kc-muted truncate max-w-[150px]">
                {match.league.name}
              </span>
            )}
          </div>
          <StatusBadge status={match.status} isLive={isLive} />
        </div>

        {/* Teams + Score */}
        <div className="flex items-center justify-between gap-4">
          {/* KC Side */}
          <div className="flex items-center gap-2 flex-1">
            <div className="w-8 h-8 bg-kc-blue/10 rounded-lg flex items-center justify-center border border-kc-blue/20">
              <span className="font-display font-black text-kc-blue text-xs">KC</span>
            </div>
            <span className="font-display font-semibold text-white text-sm">Karmine Corp</span>
          </div>

          {/* Score */}
          {isFinished || isLive ? (
            <div className="flex items-center gap-3 font-display font-black text-2xl">
              <span className={clsx(
                won === true ? "text-green-400" : won === false ? "text-red-400" : "text-white"
              )}>
                {kcScore}
              </span>
              <span className="text-kc-muted text-lg">—</span>
              <span className="text-gray-400">{oppScore}</span>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-xs font-mono text-kc-muted">
                {formatDate(match.scheduled_at ?? match.begin_at)}
              </p>
              <p className="text-xs font-mono text-kc-muted mt-0.5">BO{match.number_of_games}</p>
            </div>
          )}

          {/* Opponent */}
          <div className="flex items-center gap-2 flex-1 justify-end">
            <span className="font-display font-semibold text-gray-400 text-sm text-right">
              {opponent?.name ?? "TBD"}
            </span>
            <div className="w-8 h-8 bg-white/5 rounded-lg overflow-hidden border border-kc-border flex-shrink-0">
              {opponent?.image_url ? (
                <Image src={opponent.image_url} alt={opponent.name} width={32} height={32} className="object-contain" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-[8px] text-gray-500 font-mono">{opponent?.acronym ?? "?"}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        {isFinished && (
          <div className="mt-3 pt-3 border-t border-kc-border flex items-center justify-between">
            <span className="text-[10px] font-mono text-kc-muted">
              {match.tournament?.name ?? "—"}
            </span>
            {won !== null && (
              <span className={clsx(
                "text-[10px] font-display font-bold px-2 py-0.5 rounded",
                won ? "badge-win" : "badge-loss"
              )}>
                {won ? "VICTOIRE" : "DÉFAITE"}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
