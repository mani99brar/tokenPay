import { useGlobalState } from "@/utils/StateContext";
import { getThemeColors } from "@/utils/helpers/allHelpers";

interface ThemeWrapperProps {
  children: React.ReactNode;
}

const ThemeWrapper: React.FC<ThemeWrapperProps> = ({ children }) => {
  const { uiTheme } = useGlobalState();
  const [textColor, bgColor] = getThemeColors(uiTheme);
  console.log(textColor, bgColor);
  return (
    <div
      style={{
        backgroundColor: bgColor,
        color: textColor,
        borderColor: textColor,
      }}
      className={`w-full rounded-lg p-4 flex justify-between border-4`}
    >
      {children}
    </div>
  );
};

export default ThemeWrapper;
