export type GameStatus = "win" | "lose" | "playing" | "done";

export type GuessWordStatus = "correct" | "wrong position" | "wrong";

export interface Emoji {
  emoji: string;
  id: string;
}

export interface Puzzle {
  id: string;
  content: string;
  hints: string;
  emojis: Emoji[];
}

export interface Player {
  id: string;
  token: string;
}

export interface GameStats {
  attempts: number;
  time: number; // seconds
  success: boolean;
}

export interface StreakStats {
  puzzles: Puzzle[],
  gameStats: GameStats[]
}

export interface AttemptsMap {}

export interface GlobalStats {
  successAttempts: number[];
  minTime: number;
  maxTime: number;
}

export const MAX_GUESSES = 5;
export const TIME_LIMIT = 3*60;