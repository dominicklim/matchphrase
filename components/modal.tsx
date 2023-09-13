import { ReactNode } from "react";

interface ModalProps {
  closeModal: () => void;
  children?: ReactNode;
}

const Modal = ({ closeModal, children }: ModalProps): JSX.Element => {
  return (
    <div className="relative">
      <div
        className="fixed inset-0 flex items-center justify-center"
        onClick={closeModal}
      >
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75" />
        <div
          className="relative z-10 w-full mx-4 max-w-md bg-white rounded-lg shadow-lg"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="absolute z-10 top-4 right-4 hover:opacity-70"
            onClick={closeModal}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="20"
              viewBox="0 0 24 24"
              width="20"
              className="game-icon"
              data-testid="icon-close"
            >
              <path
                fill="var(--color-tone-1)"
                d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
              ></path>
            </svg>
          </button>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
