import StandardInput from "./StandardInput";
import { useState, memo } from "react";
import TokenResults from "./TokenResults";
import PopUp from "./PopUp";
import ThemeWrapper from "./ThemeWrapper";
import ChainSelect from "./ChainSelect";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

interface SearchTokenProps {
  setSearch: (search: boolean) => void;
}
const ChainSelectMemoized = memo(ChainSelect);

const SearchToken = ({ setSearch }: SearchTokenProps) => {
  const [searchQuery, setSearchQuery] = useState<string>("");

  return (
    <PopUp prompt="Search Token" setValue={setSearch}>
      <ThemeWrapper>
        <div className="flex w-full h-full flex-col-reverse sm:flex-row items-center justify-between">
          <div className="text-lg flex items-center mt-4 sm:mt-0 w-full sm:w-3/5 mr-2">
            <span className="mr-2">
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </span>
            <StandardInput
              placeholder="Name or address"
              label=""
              setValue={setSearchQuery}
              type="text"
            />
          </div>
          <div className="sm:w-2/5 w-full">
            <ChainSelectMemoized />
          </div>
        </div>
      </ThemeWrapper>
      <TokenResults searchQuery={searchQuery} setSearch={setSearch} />
    </PopUp>
  );
};

export default SearchToken;
