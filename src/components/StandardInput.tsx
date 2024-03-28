import { useGlobalState } from "@/utils/StateContext";
import { getThemeColors } from "@/utils/helpers/commonHelpers";
interface StandardInputProps {
  placeholder: string;
  label: string;
  setValue: (value: string) => void;
  type: string;
  value?: string;
  min?: number;
}

const StandardInput = ({
  placeholder,
  label,
  setValue,
  type,
  value,
  min,
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
      {/* Prevent default paste behaviour of input */}
      <style jsx>{`
        input::-selection {
          background-color: ${bgColor};
          color: ${textColor};
          input:-webkit-autofill,
          input:-webkit-autofill:hover,
          input:-webkit-autofill:focus,
          input:-webkit-autofill:active {
            transition: background-color 5000s ease-in-out 0s,
              color 5000s ease-in-out 0s;
            -webkit-text-fill-color: ${textColor} !important;
            background-color: ${bgColor} !important;
          }
        }
      `}</style>
      <input
        className={`placeholder-inherit w-full outline-none font-bold bg-[${bgColor}]`}
        type={type}
        placeholder={placeholder}
        value={value}
        id="token"
        min={min}
        onChange={(e) => setValue(e.target.value)}
      />
    </>
  );
};

export default StandardInput;
