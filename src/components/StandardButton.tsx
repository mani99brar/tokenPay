interface StandardButtonProps {
  prompt: string;
}
const StandardButton = ({ prompt }: StandardButtonProps) => {
  return (
    <button className="w-full p-4 rounded-lg bg-[#8612F1]">{prompt}</button>
  );
};

export default StandardButton;
