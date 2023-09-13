import { useEffect, useMemo, useState } from "react";
import Emojis from "components/emojis";
import Guess from "components/guess";
import Guesses from "components/guesses";
import Keyboard from "components/keyboard";
import PuzzleStatsModal from "components/puzzleStats";

import {
  GameStatus,
  GuessWordStatus,
  Puzzle as PuzzleType,
  Player,
  GameStats,
  GlobalStats,
  MAX_GUESSES,
  TIME_LIMIT,
} from "types";
import { toast } from "react-hot-toast";

import Hints from "components/hints";
import axios from "axios";

interface PuzzleProps {
  puzzle: PuzzleType;
  player: Player;
  onPuzzleStateChange: (state: GameStatus, stats: GameStats) => void;
}

type DisplayedModal = "instructions" | "stats" | "none";

// special characters are apostrophes and dashes
function leaveLettersSpacesAndSpecialCharacters(input: string): string {
  return input.replace(/[^a-zA-Z\s'-]/g, "");
}

const getWordCounts = (words: string[]): Record<string, number> => {
  const wordCount: Record<string, number> = {};

  for (const word of words) {
    wordCount[word] = (wordCount[word] || 0) + 1;
  }

  return wordCount;
};

const getGuessWordStatuses = (
  guess: string,
  targetWords: string[]
): GuessWordStatus[] => {
  const guessWords = guess.split(/\s+/);
  const targetWordCounts = getWordCounts(targetWords);

  const exactMatchIndices = new Set<number>();
  guessWords.forEach((word, i) => {
    if (word === targetWords[i]) {
      targetWordCounts[word] -= 1;
      exactMatchIndices.add(i);
    }
  });

  return guessWords.map((word, i) => {
    if (exactMatchIndices.has(i)) {
      return "correct";
    }
    if (word in targetWordCounts && targetWordCounts[word] > 0) {
      targetWordCounts[word] -= 1;
      return "wrong position";
    }
    return "wrong";
  });
};

const getResultsSquares = (statuses: GuessWordStatus[]) => {
  return statuses
    .map((status) => {
      switch (status) {
        case "correct":
          return "🟩";
        case "wrong position":
          return "🟨";
        default:
          return "⬜";
      }
    })
    .join("");
};

const getResults = (
  emoji: string,
  numWords: number,
  gameStatus: GameStatus,
  resultsSquares: string[]
) => {
  const allSquares = resultsSquares.join("\n");
  switch (gameStatus) {
    case "win":
      return `Match Phrase\n\n${emoji}\n\n${allSquares}`;
    case "lose":
      return `Match Phrase\n\n${emoji}\n${numWords} words\n\n${allSquares}`;
    default:
      return "";
  }
};

const formatGuess = (phrase: string, guess: string) => {
  let guessIndex = 0;
  let formattedGuess = "";

  for (const char of phrase) {
    if (char === " " || char === "'" || char === "-") {
      formattedGuess += char;
    } else {
      formattedGuess += guess[guessIndex] || "";
      guessIndex++;
    }
  }

  return formattedGuess;
};

const Puzzle = ({
  puzzle,
  player,
  onPuzzleStateChange,
}: PuzzleProps): JSX.Element => {
  const [guess, setGuess] = useState("");
  const [guesses, setGuesses] = useState<string[]>([]);
  const [gameStatus, setGameStatus] = useState<GameStatus>("playing");
  const [emojiIndex, setEmojiIndex] = useState(0);
  const [lastAttemptTime, setLastAttemptTime] = useState<Date>(new Date());
  const [playerStats, setPlayerStats] = useState<GameStats>();
  const [globalStats, setGlobalStats] = useState<GlobalStats>();
  const [displayedModal, setDisplayedModal] = useState<DisplayedModal>("none");
  const [timeRemaining, setTimeRemaining] = useState(TIME_LIMIT);

  const hints = useMemo(() => puzzle.hints.split("||"), [puzzle.hints]);
  const emoji = puzzle.emojis[emojiIndex];
  const phrase = leaveLettersSpacesAndSpecialCharacters(
    puzzle.content
  ).toLowerCase();
  const targetWords = phrase.split(/\s+/);
  const guessWordStatuses = guesses.map((guess) =>
    getGuessWordStatuses(guess, targetWords)
  );

  const onGuessSubmit = async (guess: string, success: boolean) => {
    axios
      .post("/api/attempts", {
        userInput: guess,
        puzzleId: puzzle.id,
        emojiId: emoji.id,
        playerId: player.id,
        duration: (new Date().getTime() - lastAttemptTime.getTime()) / 1000,
        success: success ? 1 : 0,
        order: guesses.length,
      })
      .then((response) => {
        console.log(`Attempt logged: `, response.data);
      })
      .catch((error) => {
        console.log("Error while logging attempt:", error);
      });
  };

  const handleKeyPress = (key: string) => {
    switch (key) {
      case "enter":
        if (guesses.length === MAX_GUESSES) {
          toast("No more guesses", { id: "guesses-exceeded" });
          return;
        }

        const formattedGuess = formatGuess(phrase, guess);
        if (formattedGuess.length < phrase.length) {
          toast("Not enough letters", { id: "not-enough-letters" });
          return;
        }
        let success = false;

        if (formattedGuess === phrase) {
          toast("Nice job");
          setGameStatus("win");
          setDisplayedModal("stats");
          success = true;
        } else if (guesses.length === MAX_GUESSES - 1) {
          // Reveal some of the words
          const hiddenText = puzzle.content
            .split(" ")
            .map((t) => {
              return Math.random() < 0.5
                ? t
                : `[${t
                    .split("")
                    .map((c) => "_")
                    .join("")}]`;
            })
            .join(" ")
            .trim();
          toast(hiddenText, {
            duration: 1000 * 2,
            style: { textTransform: "uppercase" },
          });
          setGameStatus("lose");
          setDisplayedModal("stats");
        }

        setGuesses([...guesses, formattedGuess]);
        setPlayerStats({
          attempts: guesses.length + 1, // Guesses.length not updated at this point
          time: (new Date().getTime() - lastAttemptTime.getTime()) / 1000,
          success: success,
        });
        onGuessSubmit(formattedGuess, success);

        setGuess("");
        break;
      case "backspace":
        setGuess(guess.slice(0, -1));
        break;
      default:
        setGuess(guess + key);
        break;
    }
  };

  useEffect(() => {
    if (timeRemaining > 0 && gameStatus == "playing") {
      const timerId = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
      return () => clearTimeout(timerId);
    } else {
      if (gameStatus != "win") {
        setGameStatus("lose");
        setPlayerStats({
          attempts: guesses.length,
          time: (new Date().getTime() - lastAttemptTime.getTime()) / 1000,
          success: false,
        });
        setDisplayedModal("stats");
      }
    }
  }, [timeRemaining]);

  useEffect(() => {
    axios
      .get(`/api/puzzles/${puzzle.id}/stats`)
      .then((response) => {
        const globalStats: GlobalStats = response.data.puzzle.stats;
        setGlobalStats(globalStats);
      })
      .catch((error) => {
        console.log("Error while fetching globalStats:", error);
      });

    setGuesses([]);
    setGuess("");
    setGameStatus("playing");
    setDisplayedModal("none");
    setLastAttemptTime(new Date());
    setTimeRemaining(TIME_LIMIT);
    setPlayerStats({
      attempts: guesses.length,
      time: (new Date().getTime() - lastAttemptTime.getTime()) / 1000,
      success: false,
    });
  }, [puzzle.id]);

  useEffect(() => {
    if (playerStats) {
      onPuzzleStateChange(gameStatus, playerStats);
    }
  }, [gameStatus]);

  const onChangeEmojiIndex = () => {
    setEmojiIndex((emojiIndex + 1) % puzzle.emojis.length);
  };

  return (
    <>
      <div className="space-y-2">
        <Emojis emoji={emoji.emoji} onChangeEmojiIndex={onChangeEmojiIndex} />
        <div className="w-full max-w-xl px-2">
          <Guess phrase={phrase} guess={guess} />
        </div>
        <Hints hints={hints} numWords={targetWords.length} />
      </div>
      <Guesses
        guesses={guesses}
        guessWordStatuses={guessWordStatuses}
        maxGuesses={MAX_GUESSES}
        timeRemaining={timeRemaining}
      />
      <div className="w-full max-w-lg pb-2">
        <Keyboard
          onKeyPress={handleKeyPress}
          disabled={gameStatus !== "playing"}
        />
      </div>
      {displayedModal === "stats" && playerStats && globalStats && (
        <PuzzleStatsModal
          emojiId={emoji.id}
          gameStatus={gameStatus}
          playerStats={playerStats}
          globalStats={globalStats}
          primaryAction={() => {
            setDisplayedModal("none");
            if (playerStats) {
              onPuzzleStateChange("done", playerStats);
            }
          }}
          player={player}
        />
      )}
    </>
  );
};

export default Puzzle;
