interface GuessProps {
  phrase: string;
  guess: string;
}

const Guess = ({ phrase, guess }: GuessProps): JSX.Element => {
  const words = phrase.split(" ");
  const guessChars = guess.split("");
  let guessIndex = 0;

  return (
    <div className="flex flex-wrap space-x-2 sm:space-x-4 justify-center items-center">
      {words.map((word, index) => (
        <div key={index} className="flex">
          {word.split("").map((char, i) => {
            let displayChar = guessChars[guessIndex] ?? "";
            if (char === "'" || char === "-") {
              displayChar = char;
            } else {
              guessIndex++;
            }
            return (
              <div
                key={`${index}-${i}`}
                className={`border ${
                  displayChar ? "border-black" : "border-gray-400"
                } w-5 h-6 m-0.5 text-lg sm:w-8 sm:h-10 sm:m-0.5 sm:text-2xl flex justify-center items-center bg-white uppercase font-semibold`}
              >
                {displayChar}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Guess;
