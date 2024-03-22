import { useGlobalState } from "@/utils/StateContext";
import { getThemeColors } from "@/utils/helpers/allHelpers";

interface ThemeWrapperProps {
  children: React.ReactNode;
  size?: string;
}

const ThemeWrapper: React.FC<ThemeWrapperProps> = ({ children, size }) => {
  const { uiTheme } = useGlobalState();
  const [textColor, bgColor] = getThemeColors(uiTheme);
  return (
    <div
      style={{
        backgroundColor: bgColor,
        color: textColor,
        borderColor: textColor,
      }}
      className={`w-full ${
        size == "fill" ? "h-full" : "h-auto"
      } rounded-lg p-4 flex justify-between border-4`}
    >
      {children}
    </div>
  );
};

export default ThemeWrapper;
