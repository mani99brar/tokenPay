import { useGlobalState } from "@/utils/StateContext";
import { getThemeColors } from "@/utils/helpers/allHelpers";
interface PopUpProps {
  setValue: (value: boolean) => void;
  prompt: string;
  children: React.ReactNode;
}
const PopUp: React.FC<PopUpProps> = ({ setValue, prompt, children }) => {
  const { uiTheme } = useGlobalState();
  const [textColor, bgColor] = getThemeColors(uiTheme);
  return (
    <div className="h-screen w-screen absolute top-0 left-0">
      <div className="flex w-full h-full items-center justify-center absolute z-10">
        <div
          style={{
            backgroundColor: bgColor,
            color: textColor,
          }}
          className="w-2/6 h-[500px] flex flex-col space-y-4 p-4 rounded-lg"
        >
          <div className="w-full flex justify-between items-center p-2">
            <p>{prompt}</p>
            <p
              className="text-2xl cursor-pointer"
              onClick={() => setValue(false)}
            >
              X
            </p>
          </div>
          {children}
        </div>
      </div>
      <div className="bg-[#000] h-full w-full opacity-60 top-0 absolute z-0"></div>
    </div>
  );
};

export default PopUp;
