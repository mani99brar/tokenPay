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
  console.log(isDisabled);
  return (
    <button
      className={`w-full font-bold tracking-wide p-4 rounded-lg ${
        isDisabled
          ? "bg-[#8612F1] text-white cursor-pointer"
          : "text-[#8612F1] bg-white cursor-not-allowed border-4 border-[#8612F1]"
      }`}
      onClick={() => handleClick()}
      disabled={isDisabled}
    >
      {prompt}
    </button>
  );
};

export default StandardButton;
