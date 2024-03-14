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

const TokenActions = () => {
  const [search, setSearch] = useState<boolean>(false);
  const { selectedToken } = useGlobalState();
  return (
    <>
      {search && <SearchToken setSearch={setSearch} />}
      <div className="w-2/6 flex flex-col items-end">
        <p
          className="bg-[#8612F1] w-3/4 rounded-lg p-2 text-center cursor-pointer"
          onClick={() => setSearch(true)}
        >
          {selectedToken?.symbol ?? "Select Token"}
        </p>
        {/* If too many balance is available, show upto three digit or smthn */}
        <TokenBalance tokenAddress={selectedToken?.address ?? ""} />
      </div>
    </>
  );
};

export default TokenActions;
