interface StandardInputProps {
  placeholder: string;
  label: string;
  setValue: (value: string) => void;
}

const StandardInput = ({
  placeholder,
  label,
  setValue,
}: StandardInputProps) => {
  return (
    <>
      {label != "" && <label htmlFor="token">{label}</label>}
      <input
        className="placeholder-inherit outline-none font-bold"
        type="text"
        placeholder={placeholder}
        id="token"
        onChange={(e) => setValue(e.target.value)}
      />
    </>
  );
};

export default StandardInput;
