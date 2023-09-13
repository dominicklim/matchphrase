import { GuessWordStatus } from "types";
import { Fragment } from "react";

interface GuessesProps {
  // strings are expected to be lowercase
  guesses: string[];
  guessWordStatuses: GuessWordStatus[][];
  maxGuesses: number;
  timeRemaining: number;
}

const getWordClasses = (guessWordStatuses: GuessWordStatus[]) => {
  return guessWordStatuses.map((status) => {
    switch (status) {
      case "correct":
        return "px-1 rounded-sm sm:rounded-md bg-green-500";
      case "wrong position":
        return "px-1 rounded-sm sm:rounded-md bg-yellow-500";
      default:
        return "";
    }
  });
};

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  // Use String.padStart() to ensure the minutes and seconds have two digits
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
};

const Guesses = ({
  guesses,
  guessWordStatuses,
  maxGuesses,
  timeRemaining,
}: GuessesProps): JSX.Element => {
  const allWordClasses = guessWordStatuses.map(getWordClasses);

  const highlightGuess = (guess: string, wordClasses: string[]) => {
    return (
      <div>
        {guess.split(/\s+/).map((word, index) => (
          <Fragment key={`${word}-${index}`}>
            <span className={wordClasses[index]}>{word}</span>
            <span> </span>
          </Fragment>
        ))}
      </div>
    );
  };

  return (
    <div className="w-full flex-grow flex flex-col overflow-y-clip uppercase">
      <div className="flex justify-center border-y p-2 font-semibold">
        <div className="flex justify-between w-full max-w-lg">
          <div>
            {guesses.length} out of {maxGuesses} guesses
          </div>
          <div>{formatTime(timeRemaining)}</div>
        </div>
      </div>
      <div className="text-xl sm:text-2xl space-y-2 p-4 flex-grow overflow-y-scroll">
        {guesses.map((guess, i) => (
          <div key={i} className="text-center font-semibold">
            {highlightGuess(guess, allWordClasses[i])}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Guesses;
