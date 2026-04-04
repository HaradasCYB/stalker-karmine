// lib/pandascore.ts
const BASE = "https://api.pandascore.co";
const TOKEN = process.env.PANDASCORE_TOKEN ?? "";

export type Game = "lol" | "rl" | "valorant";

const GAME_SLUG: Record<Game, string> = {
  lol: "league-of-legends",
  rl: "rl",
  valorant: "valorant",
};

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

export interface Team { id: number; name: string; acronym: string; image_url: string | null; }
export interface Player { id: number; name: string; first_name: string; last_name: string; image_url: string | null; role: string | null; nationality: string | null; }
export interface Game_ { id: number; status: "not_started" | "running" | "finished"; winner: Team | null; length: number | null; detailed_stats: boolean; }
export interface Match {
  id: number; name: string;
  status: "not_started" | "running" | "finished" | "canceled";
  scheduled_at: string | null; begin_at: string | null; end_at: string | null;
  winner: Team | null; winner_id: number | null;
  opponents: { opponent: Team; type: string }[];
  results: { team_id: number; score: number }[];
  games: Game_[];
  tournament: { id: number; name: string; slug: string } | null;
  league: { id: number; name: string; image_url: string | null; slug: string } | null;
  serie: { id: number; name: string; full_name: string; year: number } | null;
  videogame: { slug: string; name: string };
  number_of_games: number; match_type: string;
  _game?: Game; _kcId?: number;
}
export interface Standing { rank: number; team: Team; wins: number; losses: number; draws: number; points: number | null; }
export interface Tournament { id: number; name: string; slug: string; begin_at: string | null; end_at: string | null; league: { id: number; name: string; image_url: string | null }; serie: { id: number; name: string; full_name: string; year: number } | null; videogame: { slug: string; name: string }; }

// Cache IDs KC
const kcTeamIds: Partial<Record<Game, number>> = {};

async function fetchPS<T>(path: string, params: Record<string, string | number> = {}): Promise<T> {
  if (!TOKEN) { console.error("PANDASCORE_TOKEN manquant"); return [] as unknown as T; }
  const url = new URL(`${BASE}${path}`);
  url.searchParams.set("token", TOKEN);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, String(v));
  try {
    const res = await fetch(url.toString(), { next: { revalidate: 60 }, headers: { Accept: "application/json" } });
    if (!res.ok) { console.error(`PandaScore error ${res.status} on ${path}`); return [] as unknown as T; }
    return res.json();
  } catch (e) { console.error(`PandaScore fetch failed:`, e); return [] as unknown as T; }
}

async function getKCTeamId(game: Game): Promise<number | null> {
  if (kcTeamIds[game]) return kcTeamIds[game]!;
  const teams = await fetchPS<Team[]>(`/${GAME_SLUG[game]}/teams`, { "search[name]": "Karmine", per_page: 10 });
  if (!Array.isArray(teams) || teams.length === 0) { console.error(`KC not found for ${game}`); return null; }
  const team = teams.find(t => t.name.toLowerCase().includes("karmine")) ?? teams[0];
  kcTeamIds[game] = team.id;
  console.log(`KC ID for ${game}: ${team.id} (${team.name})`);
  return team.id;
}

export async function getKCMatches(game: Game): Promise<Match[]> {
  const teamId = await getKCTeamId(game);
  if (!teamId) return [];
  const [past, running, upcoming] = await Promise.allSettled([
    fetchPS<Match[]>(`/${GAME_SLUG[game]}/matches/past`, { "filter[opponent_id]": teamId, sort: "-begin_at", per_page: 30 }),
    fetchPS<Match[]>(`/${GAME_SLUG[game]}/matches/running`, { "filter[opponent_id]": teamId, per_page: 10 }),
    fetchPS<Match[]>(`/${GAME_SLUG[game]}/matches/upcoming`, { "filter[opponent_id]": teamId, sort: "begin_at", per_page: 20 }),
  ]);
  const tag = (arr: Match[]) => arr.map(m => ({ ...m, _game: game, _kcId: teamId }));
  return [
    ...tag(running.status === "fulfilled" ? running.value ?? [] : []),
    ...tag(upcoming.status === "fulfilled" ? upcoming.value ?? [] : []),
    ...tag(past.status === "fulfilled" ? past.value ?? [] : []),
  ];
}

export async function getAllKCMatches(): Promise<Match[]> {
  const [lol, rl, val] = await Promise.all([getKCMatches("lol"), getKCMatches("rl"), getKCMatches("valorant")]);
  return [...lol, ...rl, ...val].sort((a, b) => {
    const order = { running: 0, not_started: 1, finished: 2, canceled: 3 };
    const sd = (order[a.status] ?? 3) - (order[b.status] ?? 3);
    if (sd !== 0) return sd;
    return new Date(b.scheduled_at ?? b.begin_at ?? 0).getTime() - new Date(a.scheduled_at ?? a.begin_at ?? 0).getTime();
  });
}

export async function getMatchById(game: Game, id: number): Promise<Match | null> {
  return fetchPS<Match>(`/${GAME_SLUG[game]}/matches/${id}`);
}

export async function getTournamentStandings(game: Game, tournamentId: number): Promise<Standing[]> {
  return fetchPS<Standing[]>(`/${GAME_SLUG[game]}/tournaments/${tournamentId}/standings`, { per_page: 20 });
}

export async function getKCTournaments(game: Game): Promise<Tournament[]> {
  const teamId = await getKCTeamId(game);
  if (!teamId) return [];
  return fetchPS<Tournament[]>(`/${GAME_SLUG[game]}/tournaments`, { "filter[team_id]": teamId, sort: "-begin_at", per_page: 10 });
}

export async function getKCRoster(game: Game): Promise<Player[]> {
  const teamId = await getKCTeamId(game);
  if (!teamId) return [];
  const team = await fetchPS<any>(`/${GAME_SLUG[game]}/teams/${teamId}`);
  return team?.players ?? [];
}

export function getKCOpponent(match: Match, kcId: number): Team | null {
  return match.opponents?.find(o => o.opponent.id !== kcId)?.opponent ?? null;
}
export function getKCScore(match: Match, kcId: number): number {
  return match.results?.find(r => r.team_id === kcId)?.score ?? 0;
}
export function getOpponentScore(match: Match, kcId: number): number {
  return match.results?.find(r => r.team_id !== kcId)?.score ?? 0;
}
export function isKCWinner(match: Match, kcId: number): boolean | null {
  if (match.status !== "finished") return null;
  return match.winner_id === kcId;
}
export function formatDate(dateStr: string | null): string {
  if (!dateStr) return "TBD";
  return new Date(dateStr).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}
export const KC_TEAMS = { lol: 0, rl: 0, valorant: 0 } as const;
