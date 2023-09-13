interface ButtonProps {
  label: string;
  onClick: () => void;
}

const Button = ({ label, onClick }: ButtonProps): JSX.Element => (
  <button
    onClick={onClick}
    className={
      "w-full h-12 bg-gray-300 focus:outline-none rounded-md text-center uppercase"
    }
  >
    {label}
  </button>
);

export default Button;
