import StandardInput from "./StandardInput";
import SearchToken from "./SearchToken";
import { useState, useEffect } from "react";

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
  const [token, setToken] = useState<TokenData | null>(null);
  const [tokenAmount, setTokenAmount] = useState<string>("");
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
          TokenA
        </p>
        {/* If too many balance is available, show upto three digit or smthn */}
        <p className="text-[#8612F1] text-end p-2">Balance: 0</p>
      </div>
    </div>
  );
};

export default TokenInput;
