interface StandardInputProps {
  placeholder: string;
  label: string;
  setValue?: (value: string) => void;
}

const StandardInput = ({ placeholder, label }: StandardInputProps) => {
  return (
    <>
      {label != "" && <label htmlFor="token">{label}</label>}
      <input
        className="placeholder-inherit outline-none font-bold"
        type="text"
        placeholder={placeholder}
        id="token"
      />
    </>
  );
};

export default StandardInput;
