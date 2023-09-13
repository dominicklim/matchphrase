import { GameStats, GameStatus, GlobalStats, Player } from "types";
import Modal from "./modal";
import { useState } from "react";
import axios from "axios";
import { analytics } from "@/pages/_app";

type PuzzleRating = "good" | "bad";

interface PuzzleStatsModalProps {
  emojiId: string;
  gameStatus: GameStatus;
  playerStats: GameStats;
  globalStats: GlobalStats;
  primaryAction: () => void;
  player: Player;
}

const PuzzleStatsModal = ({
  emojiId,
  gameStatus,
  playerStats,
  globalStats,
  primaryAction,
  player,
}: PuzzleStatsModalProps): JSX.Element => {
  const [hasRated, setHasRated] = useState(false);
  const userTime = Math.floor(playerStats.time);

  function onRateComplete(rating: string) {
    setHasRated(true);
  }

  return (
    <Modal closeModal={primaryAction}>
      <div className="w-full p-4 space-y-4 text-center uppercase font-semibold text-xl">
        {gameStatus === "win" && <div>Awesome!</div>}
        {gameStatus === "lose" && <div>Bummer!</div>}

        {!hasRated && (
          <div>
            <div className="text-sm">
              <div>This emoji puzzle was AI-generated.</div>
              <div>Was the emoji good</div>
              <div> at conveying the phrase?</div>
            </div>
            <div className="flex justify-center space-x-8 justify-items-center w-full p-4">
              <RateButton
                puzzleId={emojiId}
                playerId={player.id}
                rating="good"
                rateComplete={onRateComplete}
              />
              <RateButton
                puzzleId={emojiId}
                playerId={player.id}
                rating="bad"
                rateComplete={onRateComplete}
              />
            </div>
          </div>
        )}
        {hasRated && (
          <div>
            <div className="text-5xl">🙏</div>
            <div className="text-sm">We notified our prompt engineers</div>
          </div>
        )}

        {gameStatus === "win" && (
          <TimeBar
            userTime={userTime}
            fastestTime={Math.min(userTime, globalStats.minTime)}
            slowestTime={Math.max(userTime, globalStats.maxTime)}
          />
        )}
        <GuessCountsBarGraph guessCounts={globalStats.successAttempts} />
        <button
          className="uppercase bg-purple-500 text-white px-4 py-2 rounded-md"
          onClick={primaryAction}
        >
          Next
        </button>
      </div>
    </Modal>
  );
};

interface RateButtonProps {
  puzzleId: string;
  playerId: string;
  rating: PuzzleRating;
  rateComplete: (rating: string) => void;
}

const RateButton = ({
  puzzleId,
  playerId,
  rating,
  rateComplete,
}: RateButtonProps) => {
  const ratePuzzle = async (rating: PuzzleRating) => {
    rateComplete(rating);
    axios
      .post("/api/ratings", {
        playerId: playerId,
        puzzleId: puzzleId,
        score: rating == "good" ? 1 : -1,
      })
      .then(() => {
        console.log(
          `player ${playerId} rated puzzle ${puzzleId} with ${rating}`
        );
      });
    analytics.track("rate", {
      rating,
      puzzleId,
    });
  };

  const emoji = rating === "good" ? "👍" : "👎";
  const label = rating === "good" ? "Good" : "Bad";

  return (
    <button className="space-y-4" onClick={() => ratePuzzle(rating)}>
      <div className="text-6xl">{emoji}</div>
      <div className="uppercase font-semibold text-xl">{label}</div>
    </button>
  );
};

interface TimeBarProps {
  userTime: number;
  fastestTime: number;
  slowestTime: number;
}

const TimeBar = ({ userTime, fastestTime, slowestTime }: TimeBarProps) => {
  const userPosition =
    ((userTime - slowestTime) / (fastestTime - slowestTime)) * 100;

  return (
    <div className="relative py-2 px-8 space-y-2">
      <div className="relative w-full h-6">
        <div
          style={{ left: `${userPosition}%` }}
          className="absolute text-center text-sm transform -translate-x-1/2 whitespace-nowrap"
        >
          Your time
        </div>
      </div>
      <div className="w-full">
        <div className="relative h-4 bg-gradient-to-r from-red-500 to-green-500">
          <div
            style={{
              left: `${userPosition}%`,
              width: 0,
              height: 0,
              borderLeft: "0.5rem solid transparent",
              borderRight: "0.5rem solid transparent",
              borderTop: "0.5rem solid black",
            }}
            className="absolute -top-3 transform -translate-x-2"
          />
        </div>
        <div className="flex justify-between text-sm">
          <span>Worst</span>
          <span>Best</span>
        </div>
      </div>
    </div>
  );
};

type GuessCountsProps = {
  guessCounts: number[];
};

const GuessCountsBarGraph: React.FC<GuessCountsProps> = ({ guessCounts }) => {
  const maxGuessCount = Math.max(...guessCounts);

  return (
    <div className="p-2 space-y-2 bg-gray-100 rounded-lg">
      <div className="text-sm">How many tries did others take?</div>
      <div className="flex justify-around h-24">
        {guessCounts.map((count, index) => (
          <div
            key={index}
            className="text-center h-full flex flex-col justify-end"
            style={{
              width: `${100 / (guessCounts.length * 2)}%`,
            }}
          >
            <div
              style={{
                height: `${(count / maxGuessCount) * 100}%`,
              }}
              className="w-full bg-gray-400"
            />
            <span className="block text-sm">{index + 1}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PuzzleStatsModal;
