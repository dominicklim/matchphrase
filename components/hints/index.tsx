import { analytics } from "@/pages/_app";
import { useEffect, useState } from "react";

interface HintsProps {
  hints: string[];
  numWords: number;
}

const getHint = (hints: string[], i: number, numWords: number) => {
  if (i === 0) {
    return `${numWords} ${numWords === 1 ? "word" : "words"}`;
  }

  return hints[i];
};

const Hints = ({ hints, numWords }: HintsProps) => {
  const [numShownHints, setNumShownHints] = useState(1);

  useEffect(() => {
    setNumShownHints(1);
  }, [hints]);

  return (
    <div className="w-full uppercase text-center">
      {hints
        .filter((_, i) => i < numShownHints)
        .map((_, i) => {
          const hint = getHint(hints, i, numWords);
          return (
            <p key={hint} className="font-semibold">
              {hint}
            </p>
          );
        })}
      {numShownHints < hints.length && (
        <button
          className="text-purple-500 uppercase text-sm"
          onClick={() => {
            setNumShownHints(numShownHints + 1);
            analytics.track("show-hints", {
              numHints: numShownHints + 1,
            });
          }}
        >
          More hints
        </button>
      )}
    </div>
  );
};

export default Hints;
