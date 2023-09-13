import { GetServerSideProps } from "next";
import { useEffect, useState } from "react";
import {
  Puzzle as PuzzleType,
  Player,
  GameStatus,
  StreakStats,
  GameStats,
} from "types";
import axios from "axios";
import Puzzle from "components/puzzle";
import InstructionsModal from "components/instructionsModal";

import { getPlayerId } from "utils/player";
import GameSummary from "components/gameSummary";
import { analytics } from "./_app";

interface HomeProps {
  puzzles: PuzzleType[];
  player: Player;
}

type AppState = "start" | "play" | "end";

export default function Home({ player }: HomeProps) {
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);
  const [streakStats, setStreakStats] = useState<StreakStats>({
    puzzles: [],
    gameStats: [],
  });
  const [appState, setAppState] = useState<AppState>("start");
  const [puzzles, setPuzzles] = useState<PuzzleType[]>([]);

  useEffect(() => {
    axios.get(`/api/puzzles`).then((response) => {
      setStreakStats({ puzzles: response.data, gameStats: [] });
      setPuzzles(response.data);
    });
  }, []);

  useEffect(() => {
    if (appState === "start") {
      if (puzzles.length > 0) {
        setCurrentPuzzleIndex(0);
        setStreakStats({
          puzzles: puzzles,
          gameStats: [],
        });
        analytics.track(`app-state-${appState}`);
      }
    } else {
      analytics.track(`app-state-${appState}`);
    }
  }, [appState, puzzles]);

  const onPuzzleStateChange = (
    gameStatus: GameStatus,
    stats: GameStats | undefined
  ) => {
    if (gameStatus === "win" || gameStatus == "lose") {
      if (stats) {
        setStreakStats((prev) => ({
          ...prev,
          gameStats: [...prev.gameStats, stats],
        }));
      }
    } else if (gameStatus === "done") {
      if (currentPuzzleIndex === puzzles.length - 1) {
        setAppState("end");
      } else {
        setCurrentPuzzleIndex(currentPuzzleIndex + 1);
      }
    }
    analytics.track(`game-status-${gameStatus}`, {
      streakStats,
      puzzleIndex: currentPuzzleIndex,
    });
  };

  return (
    <div className="flex flex-col absolute inset-0 w-full space-y-2 items-center">
      <div className="relative flex justify-center items-center w-full border-b p-2">
        <div className="absolute left-2 uppercase text-center font-semibold text-sm">
          <span className="px-1 rounded-sm bg-green-500">Match</span>
          <span> Phrase</span>
        </div>
        <div className="absolute right-0">
          <button
            className="w-8 h-8 text-lg"
            onClick={() => setAppState("start")}
          >
            ❓
          </button>
        </div>

        <div className="text-center text-sm space-x-1">
          {puzzles.length === 0 && (
            <>
              <span>⚫</span>
              <span>⚫</span>
              <span>⚫</span>
              <span>⚫</span>
              <span>⚫</span>
            </>
          )}
          {puzzles.map((puzzle: PuzzleType, index) => {
            let progressIcon = "⚫";
            if (streakStats.gameStats[index]) {
              if (streakStats.gameStats[index].success) {
                progressIcon = "🌟";
              } else {
                progressIcon = "❌";
              }
            }

            return <span key={puzzle.id}>{progressIcon}</span>;
          })}
        </div>
      </div>
      {appState == "play" && (
        <>
          {puzzles.length > 0 ? (
            <Puzzle
              puzzle={puzzles[currentPuzzleIndex]}
              player={player}
              onPuzzleStateChange={onPuzzleStateChange}
            />
          ) : (
            <div className="h-40 flex items-center">
              Translating movie quotes... ⏳
            </div>
          )}
        </>
      )}

      {appState === "start" && (
        <InstructionsModal closeModal={() => setAppState("play")} />
      )}
      {appState === "end" && (
        <GameSummary
          streakStats={streakStats}
          handleNextAction={(action: string) => {
            if (action == "restart") {
              setAppState("start");
            } else {
              setAppState("end");
            }
          }}
        />
      )}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const playerId = await getPlayerId(req, res);
  analytics.identify(playerId);

  return {
    props: {
      player: { id: playerId, token: new Date().toISOString() },
    },
  };
};
