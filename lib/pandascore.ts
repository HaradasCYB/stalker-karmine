// lib/pandascore.ts
// Client PandaScore API - Couvre LoL, Rocket League, Valorant
// Toutes les fonctions utilisent ISR via next: { revalidate: 60 }

const BASE = "https://api.pandascore.co";
const TOKEN = process.env.PANDASCORE_TOKEN ?? "";

// Karmine Corp team IDs sur PandaScore
export const KC_TEAMS = {
  lol: 126068,       // KC LoL
  rl: 127674,        // KC Rocket League
  valorant: 127813,  // KC Valorant
} as const;

export type Game = "lol" | "rl" | "valorant";

const GAME_SLUG: Record<Game, string> = {
  lol: "league-of-legends",
  rl: "rocket-league",
  valorant: "valorant",
};

async function fetchPS<T>(path: string, params: Record<string, string | number> = {}): Promise<T> {
  const url = new URL(`${BASE}${path}`);
  url.searchParams.set("token", TOKEN);
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, String(v));
  }

  const res = await fetch(url.toString(), {
    next: { revalidate: 60 },
    headers: { Accept: "application/json" },
  });

  if (!res.ok) {
    console.error(`PandaScore error ${res.status} on ${path}`);
    return [] as unknown as T;
  }
  return res.json();
}

// ─── Types ───────────────────────────────────────────────────────────────────

export interface Team {
  id: number;
  name: string;
  acronym: string;
  image_url: string | null;
}

export interface Player {
  id: number;
  name: string;
  first_name: string;
  last_name: string;
  image_url: string | null;
  role: string | null;
  nationality: string | null;
}

export interface Game_ {
  id: number;
  status: "not_started" | "running" | "finished";
  winner: Team | null;
  length: number | null;
  detailed_stats: boolean;
}

export interface Match {
  id: number;
  name: string;
  status: "not_started" | "running" | "finished" | "canceled";
  scheduled_at: string | null;
  begin_at: string | null;
  end_at: string | null;
  winner: Team | null;
  winner_id: number | null;
  opponents: { opponent: Team; type: string }[];
  results: { team_id: number; score: number }[];
  games: Game_[];
  tournament: {
    id: number;
    name: string;
    slug: string;
  } | null;
  league: {
    id: number;
    name: string;
    image_url: string | null;
    slug: string;
  } | null;
  serie: {
    id: number;
    name: string;
    full_name: string;
    year: number;
  } | null;
  videogame: { slug: string; name: string };
  number_of_games: number;
  match_type: string;
}

export interface Standing {
  rank: number;
  team: Team;
  wins: number;
  losses: number;
  draws: number;
  points: number | null;
}

export interface Tournament {
  id: number;
  name: string;
  slug: string;
  begin_at: string | null;
  end_at: string | null;
  league: { id: number; name: string; image_url: string | null };
  serie: { id: number; name: string; full_name: string; year: number } | null;
  videogame: { slug: string; name: string };
}

export interface PlayerStats {
  player: Player;
  averages: Record<string, number>;
  totals: Record<string, number>;
}

// ─── Matches ─────────────────────────────────────────────────────────────────

export async function getKCMatches(game: Game): Promise<Match[]> {
  const teamId = KC_TEAMS[game];

  // Fenêtre large : 6 mois en arrière → 2 mois en avant
  const now = new Date();
  const sixMonthsAgo = new Date(now);
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  const twoMonthsAhead = new Date(now);
  twoMonthsAhead.setMonth(twoMonthsAhead.getMonth() + 2);

  const rangeStart = sixMonthsAgo.toISOString().split("T")[0]; // YYYY-MM-DD
  const rangeEnd = twoMonthsAhead.toISOString().split("T")[0];

  // Endpoint générique /matches avec filtre équipe + plage de dates
  const all = await fetchPS<Match[]>(`/${GAME_SLUG[game]}/matches`, {
    "filter[opponent_id]": teamId,
    "range[scheduled_at]": `${rangeStart},${rangeEnd}`,
    sort: "-scheduled_at",
    per_page: 50,
  });

  // Si rien avec scheduled_at, on tente sans filtre de date (fallback)
  if (!all || all.length === 0) {
    const fallback = await fetchPS<Match[]>(`/${GAME_SLUG[game]}/matches`, {
      "filter[opponent_id]": teamId,
      sort: "-begin_at",
      per_page: 30,
    });
    const results = fallback ?? [];
    // Tri : live > upcoming > finished
    return results.sort((a, b) => {
      const order = { running: 0, not_started: 1, finished: 2, canceled: 3 };
      return (order[a.status] ?? 3) - (order[b.status] ?? 3);
    });
  }

  return all.sort((a, b) => {
    const order = { running: 0, not_started: 1, finished: 2, canceled: 3 };
    return (order[a.status] ?? 3) - (order[b.status] ?? 3);
  });
}

export async function getAllKCMatches(): Promise<Match[]> {
  const [lol, rl, val] = await Promise.all([
    getKCMatches("lol"),
    getKCMatches("rl"),
    getKCMatches("valorant"),
  ]);

  // Tag chaque match avec son jeu pour faciliter le rendu côté page
  const tag = (matches: Match[], game: Game) =>
    matches.map((m) => ({ ...m, _game: game }));

  return [...tag(lol, "lol"), ...tag(rl, "rl"), ...tag(val, "valorant")].sort(
    (a, b) => {
      // Live en premier, puis upcoming, puis finished par date décroissante
      const order = { running: 0, not_started: 1, finished: 2, canceled: 3 };
      const statusDiff = (order[a.status] ?? 3) - (order[b.status] ?? 3);
      if (statusDiff !== 0) return statusDiff;
      const da = new Date(a.scheduled_at ?? a.begin_at ?? 0).getTime();
      const db = new Date(b.scheduled_at ?? b.begin_at ?? 0).getTime();
      return db - da;
    }
  );
}

export async function getMatchById(game: Game, id: number): Promise<Match | null> {
  return fetchPS<Match>(`/${GAME_SLUG[game]}/matches/${id}`);
}

// ─── Standings ────────────────────────────────────────────────────────────────

export async function getTournamentStandings(game: Game, tournamentId: number): Promise<Standing[]> {
  return fetchPS<Standing[]>(`/${GAME_SLUG[game]}/tournaments/${tournamentId}/standings`, {
    per_page: 20,
  });
}

export async function getKCTournaments(game: Game): Promise<Tournament[]> {
  const teamId = KC_TEAMS[game];
  return fetchPS<Tournament[]>(`/${GAME_SLUG[game]}/tournaments`, {
    "filter[team_id]": teamId,
    sort: "-begin_at",
    per_page: 10,
  });
}

// ─── Team / Players ──────────────────────────────────────────────────────────

export async function getKCRoster(game: Game): Promise<Player[]> {
  const teamId = KC_TEAMS[game];
  const team = await fetchPS<{ players: Player[] }>(`/${GAME_SLUG[game]}/teams/${teamId}`);
  return team?.players ?? [];
}

// ─── Stats helpers ────────────────────────────────────────────────────────────

export function getKCOpponent(match: Match, game: Game): Team | null {
  const kcId = KC_TEAMS[game];
  const opp = match.opponents?.find((o) => o.opponent.id !== kcId);
  return opp?.opponent ?? null;
}

export function getKCScore(match: Match, game: Game): number {
  const kcId = KC_TEAMS[game];
  return match.results?.find((r) => r.team_id === kcId)?.score ?? 0;
}

export function getOpponentScore(match: Match, game: Game): number {
  const kcId = KC_TEAMS[game];
  return match.results?.find((r) => r.team_id !== kcId)?.score ?? 0;
}

export function isKCWinner(match: Match, game: Game): boolean | null {
  if (match.status !== "finished") return null;
  return match.winner_id === KC_TEAMS[game];
}

export function formatDate(dateStr: string | null): string {
  if (!dateStr) return "TBD";
  const d = new Date(dateStr);
  return d.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export const GAME_LABELS: Record<Game, string> = {
  lol: "League of Legends",
  rl: "Rocket League",
  valorant: "Valorant",
};

export const GAME_COLORS: Record<Game, string> = {
  lol: "#C89B3C",
  rl: "#2196F3",
  valorant: "#FF4655",
};
