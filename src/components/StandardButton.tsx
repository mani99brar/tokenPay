import { useGlobalState } from "@/utils/StateContext";
import { getThemeColors } from "@/utils/helpers/allHelpers";
interface StandardButtonProps {
  prompt: string;
  handleClick: () => void;
  isDisabled?: boolean;
  size?: string;
}
const StandardButton = ({
  prompt,
  handleClick,
  isDisabled,
  size,
}: StandardButtonProps) => {
  const { uiTheme } = useGlobalState();
  const [textColor, bgColor] = getThemeColors(uiTheme);
  return (
    <button
      className={`w-full border-[${textColor}] hover:bg-[${textColor}] hover:text-[${bgColor}] font-bold tracking-wide ${
        size == "small" ? "p-2 border-2 border-[${textColor}]" : `p-4 border-4`
      } rounded-lg ${
        isDisabled
          ? ` bg-[${bgColor}] cursor-not-allowed  text-[${textColor}]`
          : `bg-[${textColor}] text-[${bgColor}] cursor-pointer `
      }`}
      onClick={handleClick}
      disabled={isDisabled}
    >
      {prompt}
    </button>
  );
};

export default StandardButton;
