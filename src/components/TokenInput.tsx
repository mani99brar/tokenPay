import StandardInput from "./StandardInput";
import SearchToken from "./SearchToken";
import TokenBalance from "./TokenBalance";
import { useState, useEffect } from "react";
import { useGlobalState } from "@/utils/StateContext";

type TokenData = {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  logoURI: string;
  balance: string;
};

const TokenInput = () => {
  const [search, setSearch] = useState<boolean>(false);
  const [tokenAmount, setTokenAmount] = useState<string>("");
  const { selectedToken } = useGlobalState();

  useEffect(() => {
    if (search) {
      console.log("SearchToken");
    }
  }, [search]);
  return (
    <div className="w-full bg-white rounded-lg p-4 flex justify-between border-4 border-[#8612F1]">
      {search && <SearchToken setSearch={setSearch} />}
      <div className="w-4/5 flex flex-col text-[#8612F1]">
        <StandardInput
          placeholder="0"
          label="Token Amount"
          setValue={setTokenAmount}
        />
      </div>
      <div className="w-1/5 flex flex-col">
        <p
          className="bg-[#8612F1] rounded-lg p-2 text-center cursor-pointer"
          onClick={() => setSearch(true)}
        >
          {selectedToken?.symbol ?? "Select Token"}
        </p>
        {/* If too many balance is available, show upto three digit or smthn */}
        <TokenBalance tokenAddress={selectedToken?.address ?? ""} />
      </div>
    </div>
  );
};

export default TokenInput;
