"use client";
import { useState, useEffect } from "react";

const CHANNEL = "kamet0";
const PARENT = "stalker-karmine.vercel.app";

interface TwitchStreamInfo {
  isLive: boolean;
  viewerCount?: number;
  gameName?: string;
  title?: string;
}

export function TwitchStream() {
  const [isLive, setIsLive] = useState<boolean | null>(null);
  const [showStream, setShowStream] = useState(false);
  const [info, setInfo] = useState<TwitchStreamInfo>({ isLive: false });

  // On vérifie si Kameto est live via l'embed lui-même (pas d'API Twitch nécessaire)
  // L'iframe Twitch se charge toujours, on affiche selon le statut
  useEffect(() => {
    setIsLive(true); // On affiche toujours le player, Twitch gère l'état offline
  }, []);

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display font-bold text-xl flex items-center gap-3">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#9146FF">
            <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z"/>
          </svg>
          Kameto en direct
        </h2>
        <a
          href={`https://twitch.tv/${CHANNEL}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-mono text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1"
        >
          Ouvrir sur Twitch →
        </a>
      </div>

      <div className="glass rounded-xl border border-purple-500/20 overflow-hidden">
        {/* Header bar */}
        <div className="px-4 py-3 border-b border-purple-500/10 flex items-center justify-between bg-purple-500/5">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
            <span className="text-xs font-mono text-purple-400 font-medium tracking-wider">
              twitch.tv/kameto
            </span>
          </div>
          {!showStream && (
            <button
              onClick={() => setShowStream(true)}
              className="text-xs font-display font-semibold px-3 py-1.5 rounded-lg bg-purple-500/20 border border-purple-500/30 text-purple-300 hover:bg-purple-500/30 transition-all"
            >
              Charger le stream
            </button>
          )}
        </div>

        {/* Player */}
        {showStream ? (
          <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
            <iframe
              src={`https://player.twitch.tv/?channel=${CHANNEL}&parent=${PARENT}&autoplay=true&muted=false`}
              className="absolute inset-0 w-full h-full"
              allowFullScreen
              allow="autoplay; fullscreen"
              title={`Stream Twitch de ${CHANNEL}`}
            />
          </div>
        ) : (
          /* Thumbnail placeholder cliquable */
          <div
            className="relative w-full cursor-pointer group"
            style={{ paddingBottom: "56.25%" }}
            onClick={() => setShowStream(true)}
          >
            {/* Background Twitch offline style */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-kc-dark to-kc-dark flex flex-col items-center justify-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-purple-500 rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
                <div className="relative w-20 h-20 rounded-full bg-purple-500/20 border-2 border-purple-500/40 flex items-center justify-center group-hover:border-purple-400/60 transition-all">
                  <svg className="w-8 h-8 text-purple-400" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
              </div>
              <div className="text-center">
                <p className="font-display font-bold text-white text-lg">kameto</p>
                <p className="text-xs font-mono text-purple-400/70 mt-1">
                  Cliquer pour charger le stream
                </p>
              </div>
              <p className="text-[10px] font-mono text-kc-muted max-w-xs text-center px-4">
                Co-fondateur de Karmine Corp · Contenu gaming & esport
              </p>
            </div>
          </div>
        )}

        {/* Chat toggle */}
        {showStream && (
          <div className="px-4 py-2 border-t border-purple-500/10 flex items-center justify-between">
            <span className="text-[10px] font-mono text-kc-muted">
              Le stream peut afficher "offline" si Kameto ne stream pas actuellement
            </span>
            <a
              href={`https://twitch.tv/${CHANNEL}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] font-mono text-purple-400 hover:underline"
            >
              Voir avec chat →
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
