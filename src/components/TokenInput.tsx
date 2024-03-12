import StandardInput from "./StandardInput";
const TokenInput = () => {
  return (
    <div className="w-full bg-white rounded-lg p-4 flex justify-between border-4 border-[#8612F1]">
      <div className="w-4/5 flex flex-col text-[#8612F1]">
        <StandardInput placeholder="0" label="Token Amount" />
      </div>
      <div className="w-1/5 flex flex-col">
        <p className="bg-[#8612F1] rounded-lg p-2 text-center">TokenA</p>
        {/* If too many balance is available, show upto three digit or smthn */}
        <p className="text-[#8612F1] text-end p-2">Balance: 0</p>
      </div>
    </div>
  );
};

export default TokenInput;
