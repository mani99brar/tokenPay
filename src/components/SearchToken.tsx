import StandardInput from "./StandardInput";
import { useState } from "react";
import TokenResults from "./TokenResults";
import PopUp from "./PopUp";
import ThemeWrapper from "./ThemeWrapper";
import ChainSelect from "./ChainSelect";

interface SearchTokenProps {
  setSearch: (search: boolean) => void;
}

const SearchToken = ({ setSearch }: SearchTokenProps) => {
  const [searchQuery, setSearchQuery] = useState<string>("");

  return (
    <PopUp prompt="Search Token" setValue={setSearch}>
      <ThemeWrapper>
        <div className="flex w-full items-center justify-between">
          <div className="text-lg w-6/8">
            <StandardInput
              placeholder="Search Name or paste address"
              label=""
              setValue={setSearchQuery}
              type="text"
            />
          </div>
          <div className="w-2/8">
            <ChainSelect />
          </div>
        </div>
      </ThemeWrapper>
      <TokenResults searchQuery={searchQuery} setSearch={setSearch} />
    </PopUp>
  );
};

export default SearchToken;
