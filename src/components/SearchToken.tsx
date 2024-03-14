import StandardInput from "./StandardInput";
import { useEffect, useState } from "react";
import { ConnectKitButton } from "connectkit";
import TokenResults from "./TokenResults";
import PopUp from "./PopUp";
interface SearchTokenProps {
  setSearch: (search: boolean) => void;
}
const SearchToken = ({ setSearch }: SearchTokenProps) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  return (
    <PopUp prompt="Search Token" setValue={setSearch}>
      <div className="w-full border-4 flex items-center justify-between border-[#8612F1] rounded-lg">
        <div className="text-[#8612F1] text-lg p-4 w-3/5">
          <StandardInput
            placeholder="Search Name or paste address"
            label=""
            setValue={setSearchQuery}
            type="text"
          />
        </div>
        <div className="w-1/5 mr-4">
          <ConnectKitButton.Custom>
            {({
              isConnected,
              isConnecting,
              show,
              hide,
              address,
              ensName,
              chain,
            }) => {
              return (
                <button
                  onClick={show}
                  className="bg-[#8612F1] rounded-lg w-full"
                >
                  {isConnected ? chain?.name : "Custom Connect"}
                </button>
              );
            }}
          </ConnectKitButton.Custom>
        </div>
      </div>
      <TokenResults searchQuery={searchQuery} setSearch={setSearch} />
    </PopUp>
  );
};

export default SearchToken;
