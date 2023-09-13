import Modal from "./modal";

interface InstructionsModalProps {
  closeModal: () => void;
}

const InstructionsModal = ({
  closeModal,
}: InstructionsModalProps): JSX.Element => {
  return (
    <Modal closeModal={closeModal}>
      <div className="w-full p-4 space-y-4 text-center uppercase font-semibold text-xl">
        <div>Match Phrase</div>
        <div className="space-y-2">
          <div className="text-sm font-normal normal-case">
            A large language model (LLM) has translated a famous movie phrase into
            emojis. Can you guess the movie phrase?
          </div>
        </div>
        <div className="space-y-2">
          <div className="text-base">Example (from Finding Nemo)</div>
          <div className="text-3xl">️🏊‍♀️🔁🐟</div>
          <div className="uppercase font-semibold">
            <span className="px-1 rounded-sm bg-green-500">just</span>
            <span> </span>
            <span className="px-1 rounded-sm bg-yellow-500">swimming</span>
            <span> </span>
            <span>laps</span>
          </div>
        </div>
        <div className="text-sm text-center font-normal normal-case space-y-1">
          <div>
            <span className="font-semibold uppercase">just</span> is in the
            phrase and in the correct spot.
          </div>
          <div>
            <span className="font-semibold uppercase">swimming</span> is in the
            phrase, but in the wrong spot.
          </div>
          <div>
            <span className="font-semibold uppercase">laps</span> is not in the
            phrase at all.
          </div>
        </div>
        <button
          className="uppercase bg-purple-500 text-white px-4 py-2 rounded-md"
          onClick={closeModal}
        >
          Let&apos;s Play
        </button>
        <div className="text-sm font-normal normal-case">
            5 new puzzles every day.
          </div>
      </div>
    </Modal>
  );
};

export default InstructionsModal;
