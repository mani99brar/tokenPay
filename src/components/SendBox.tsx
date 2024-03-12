import TokenInput from "./TokenInput";
import AddressInput from "./AddressInput";
import StandardButton from "./StandardButton";
const SendBox = () => {
  return (
    <div className="w-full bg-white flex flex-col space-y-2 p-2">
      <TokenInput />
      <AddressInput />
      <StandardButton prompt="Send Tokens" />
    </div>
  );
};

export default SendBox;
