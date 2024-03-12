import StandardInput from "./StandardInput";
const AddressInput = () => {
  return (
    <div className="w-full p-4 border-4 border-[#8612F1] rounded-lg flex flex-col text-[#8612F1]">
      <StandardInput placeholder="0x0" label="Receiver Address" />
    </div>
  );
};

export default AddressInput;
