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
      style={{
        backgroundColor: bgColor,
        color: textColor,
        borderColor: textColor,
      }}
      className={`w-full border-[${textColor}] hover:bg-[${textColor}] hover:text-[${bgColor}] font-bold tracking-wide ${
        size == "small" ? "p-1 border-2" : `p-4 border-4`
      } rounded-lg`}
      onClick={handleClick}
      disabled={isDisabled}
    >
      {prompt}
    </button>
  );
};

export default StandardButton;
