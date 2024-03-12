interface StandardInputProps {
  placeholder: string;
  label: string;
}

const StandardInput = ({ placeholder, label }: StandardInputProps) => {
  return (
    <>
      <label htmlFor="token">{label}</label>
      <input
        className="placeholder-inherit outline-none text-2xl font-bold"
        type="text"
        placeholder={placeholder}
        id="token"
      />
    </>
  );
};

export default StandardInput;
