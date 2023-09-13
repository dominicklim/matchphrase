import { GameStats, StreakStats } from "types";
import { toast } from "react-hot-toast";
import { analytics } from "@/pages/_app";

interface GameSummaryProps {
  streakStats: StreakStats;
  handleNextAction: (action: string) => void;
}

const GameSummary = ({
  streakStats,
  handleNextAction,
}: GameSummaryProps): JSX.Element => {
  const successes = streakStats.gameStats.filter((stats) => {
    return stats.success;
  });
  let minGuesses = 1;
  let minTime = 1;
  if (successes.length > 0) {
    minGuesses = Math.min(...successes.map((item) => item.attempts));
    minTime = Math.min(...successes.map((item) => item.time));
  }

  const progressIcons: string[] = streakStats.gameStats.map(
    (stats: GameStats) => {
      let progressIcon = "⚫";
      if (stats) {
        if (stats.success) {
          progressIcon = "🌟";
        } else {
          progressIcon = "❌";
        }
      }
      return progressIcon;
    }
  );

  const share = () => {
    const today = new Date();
    let shareText = `MatchPhrase ${today.getMonth() + 1}/${today.getDate()} \n`;
    shareText += progressIcons.join(" ");
    if (successes.length > 0) {
      shareText += `\nBest time: ${minTime}s`;
      shareText += `\nFewest tries: ${minGuesses}`;
    } else {
      shareText += `\n😢😢😢`;
    }

    navigator.clipboard
      .writeText(shareText)
      .then(() => {
        toast("Copied results to clipboard");
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
      });

    analytics.track("share", { shareText });
  };

  return (
    <div className="w-full md:w-1/2 p-4 space-y-4 text-center uppercase font-semibold text-xl">
      <div>SUMMARY</div>
      <div className="space-y-2 text-base">
        <div className="flex flex-row">
          <div className="basis-2/5 bg-slate-200 px-2">Emoji</div>
          <div className="basis-1/5 bg-slate-200 px-2">Time</div>
          <div className="basis-1/5 bg-slate-200 px-2">Tries</div>
          <div className="basis-1/5 bg-slate-200 px-2">Success</div>
        </div>
        {streakStats.gameStats.map((stats: GameStats, index) => {
          const successIcon = stats.success ? "🌟" : "❌";
          return (
            <div className="flex flex-row" key={streakStats.puzzles[index].id}>
              <div className="basis-2/5 px-2">
                {streakStats.puzzles[index].emojis[0].emoji}
              </div>
              <div className="basis-1/5 px-2">{stats.time}s</div>
              <div className="basis-1/5 px-2">{stats.attempts}</div>
              <div className="basis-1/5 px-2">{successIcon}</div>
            </div>
          );
        })}
      </div>
      <div className="space-y-2">
        <div className="text-base">
          You guessed {successes.length}/{streakStats.puzzles.length} correctly
        </div>

        {successes.length > 0 && (
          <div>
            <div className="text-base">Best time: {minTime}s</div>

            <div className="text-base">Fewest tries: {minGuesses}</div>
          </div>
        )}

        {successes.length == 0 && <div className="text-base">TRY AGAIN?</div>}
      </div>

      <button
        className="uppercase bg-green-500 text-white px-4 py-2 rounded-md mx-3"
        onClick={() => handleNextAction("restart")}
      >
        Play again
      </button>
      <button
        className="uppercase bg-purple-500 text-white px-4 py-2 rounded-md"
        onClick={share}
      >
        Share
      </button>
    </div>
  );
};

export default GameSummary;
