import { useEffect } from "react";

import Button from "./button";

const ROWS = [
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
  ["backspace", "z", "x", "c", "v", "b", "n", "m", "enter"],
];

const ALLOWED_KEYS = new Set(ROWS.flat());

interface KeyboardProps {
  onKeyPress: (key: string) => void;
  disabled?: boolean;
}

const Keyboard = ({
  onKeyPress,
  disabled = false,
}: KeyboardProps): JSX.Element => {
  const handleKeyPress = (key: string) => {
    if (disabled) return;

    onKeyPress(key);
  };

  // Add the event listener when onKeyPress changes (state that it references changes).
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (disabled) return;

      const key = event.key.toLowerCase();
      if (ALLOWED_KEYS.has(key)) {
        onKeyPress(key);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onKeyPress, disabled]);

  return (
    <div className="flex flex-col w-full items-center justify-center space-y-2 px-1 font-bold uppercase">
      {ROWS.map((row, rowIndex) => (
        <div key={rowIndex} className="flex justify-center w-full">
          {row.map((letter) => {
            let label = letter;
            let className = "w-1/10 px-1 flex-shrink-0";
            if (letter === "backspace") {
              label = "⌫";
              className = "flex-shrink w-24 px-1";
            }
            if (letter === "enter") {
              label = "⏎";
              className = "flex-shrink w-24 px-1";
            }

            return (
              <div key={letter} className={className}>
                <Button label={label} onClick={() => handleKeyPress(letter)} />
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Keyboard;
