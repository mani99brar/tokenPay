import StandardInput from "./StandardInput";
import { useEffect, useState } from "react";
import { ConnectKitButton } from "connectkit";
import TokenResults from "./TokenResults";

interface SearchTokenProps {
  setSearch: (search: boolean) => void;
}
const SearchToken = ({ setSearch }: SearchTokenProps) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  return (
    <div className="h-screen w-screen absolute top-0 left-0">
      <div className="flex w-full h-full items-center justify-center absolute z-10">
        <div className="w-2/6 h-[500px] flex flex-col space-y-4 bg-white p-4 rounded-lg">
          <div className="w-full flex justify-between items-center p-2 text-[#8612F1]">
            <p>Select a token</p>
            <p
              className="text-2xl cursor-pointer"
              onClick={() => setSearch(false)}
            >
              X
            </p>
          </div>
          <div className="w-full border-4 flex items-center justify-between border-[#8612F1] rounded-lg">
            <div className="text-[#8612F1] text-lg p-4 w-3/5">
              <StandardInput
                placeholder="Search Name or paste address"
                label=""
                setValue={setSearchQuery}
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
        </div>
      </div>
      <div className="bg-[#000] h-full w-full opacity-60 top-0 absolute z-0"></div>
    </div>
  );
};

export default SearchToken;
