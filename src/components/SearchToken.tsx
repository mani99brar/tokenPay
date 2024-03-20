import StandardInput from "./StandardInput";
import { useEffect, useState } from "react";
import { ConnectKitButton } from "connectkit";
import TokenResults from "./TokenResults";
import PopUp from "./PopUp";
import ThemeWrapper from "./ThemeWrapper";
interface SearchTokenProps {
  setSearch: (search: boolean) => void;
}
const SearchToken = ({ setSearch }: SearchTokenProps) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  return (
    <PopUp prompt="Search Token" setValue={setSearch}>
      <ThemeWrapper>
        <div className="text-lg w-3/5">
          <StandardInput
            placeholder="Search Name or paste address"
            label=""
            setValue={setSearchQuery}
            type="text"
          />
        </div>
      </ThemeWrapper>
      <TokenResults searchQuery={searchQuery} setSearch={setSearch} />
    </PopUp>
  );
};

export default SearchToken;
