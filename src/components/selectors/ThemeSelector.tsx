// Desc: Theme selector component for changing the theme
import { themeColors } from "@/utils/helpers/commonHelpers";
import { useGlobalState } from "@/utils/StateContext";
import { broadcastMessage } from "@/utils/helpers/browserChannel";

interface ThemeSelector {
  setChangeTheme: (theme: boolean) => void;
}

const ThemeSelector = ({ setChangeTheme }: ThemeSelector) => {
  const { uiTheme, setAllUiTheme } = useGlobalState();
  function handleThemeChange(theme: string) {
    broadcastMessage({ type: "theme", theme: theme });
    setAllUiTheme(theme);
    setChangeTheme(false);
  }
  return (
    <div className="w-full h-full bg-white rounded-lg flex flex-col p-4 space-y-4">
      {Object.entries(themeColors).map(([themeName, [bgColor, textColor]]) => (
        <button
          key={themeName}
          className={`rounded-lg p-4 font-bold text-2xl ${
            uiTheme === themeName ? "border-4 border-[#8612F1]" : ""
          }`}
          style={{
            backgroundColor: bgColor,
            color: textColor,
            borderColor: textColor,
            borderWidth: "4px",
          }}
          onClick={() => handleThemeChange(themeName)}
        >
          {uiTheme === themeName ? "Selected" : themeName}
        </button>
      ))}
    </div>
  );
};

export default ThemeSelector;
