interface StandardInputProps {
  placeholder: string;
  label: string;
  setValue: (value: string) => void;
  type: string;
}

const StandardInput = ({
  placeholder,
  label,
  setValue,
  type,
}: StandardInputProps) => {
  return (
    <>
      {label != "" && (
        <label htmlFor="token" className="text-lg">
          {label}
        </label>
      )}
      <input
        className="placeholder-inherit outline-none font-bold"
        type={type}
        placeholder={placeholder}
        id="token"
        onChange={(e) => setValue(e.target.value)}
      />
    </>
  );
};

export default StandardInput;
