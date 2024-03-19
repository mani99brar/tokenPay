import { useGlobalState } from "@/utils/StateContext";
import { getThemeColors } from "@/utils/helpers/allHelpers";
interface StandardInputProps {
  placeholder: string;
  label: string;
  setValue: (value: string) => void;
  type: string;
  value?: string;
}

const StandardInput = ({
  placeholder,
  label,
  setValue,
  type,
  value,
}: StandardInputProps) => {
  const { uiTheme } = useGlobalState();
  const [textColor, bgColor] = getThemeColors(uiTheme);
  return (
    <>
      {label != "" && (
        <label htmlFor="token" className="text-lg">
          {label}
        </label>
      )}
      <input
        className={`placeholder-inherit outline-none font-bold bg-[${bgColor}]`}
        type={type}
        placeholder={placeholder}
        value={value}
        id="token"
        onChange={(e) => setValue(e.target.value)}
      />
    </>
  );
};

export default StandardInput;
