interface StandardButtonProps {
  prompt: string;
  handleClick: () => void;
  isDisabled?: boolean;
}
const StandardButton = ({
  prompt,
  handleClick,
  isDisabled,
}: StandardButtonProps) => {
  return (
    <button
      className={`w-full font-bold tracking-wide p-4 rounded-lg ${
        isDisabled
          ? " bg-white cursor-not-allowed border-4 border-[#8612F1] text-[#8612F1]"
          : "bg-[#8612F1] border-4 border-[#8612F1] text-white cursor-pointer "
      }`}
      onClick={handleClick}
      disabled={isDisabled}
    >
      {prompt}
    </button>
  );
};

export default StandardButton;
