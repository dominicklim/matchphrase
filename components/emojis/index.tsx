interface EmojisProps {
  emoji: string;
  onChangeEmojiIndex: () => void;
}

const Emojis = ({ emoji, onChangeEmojiIndex }: EmojisProps): JSX.Element => {
  return (
    <div className="w-full uppercase">
      <div className="p-2 font-semibold max-w-lg mx-auto text-center">
        Guess the movie phrase from the emoji
      </div>
      <button
        className="text-center text-4xl w-full"
        onClick={onChangeEmojiIndex}
      >
        {emoji}
      </button>
    </div>
  );
};

export default Emojis;
