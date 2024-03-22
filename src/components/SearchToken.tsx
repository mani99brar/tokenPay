import StandardInput from "./StandardInput";
import { useState } from "react";
import TokenResults from "./TokenResults";
import PopUp from "./PopUp";
import ThemeWrapper from "./ThemeWrapper";
import ChainSelect from "./ChainSelect";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

interface SearchTokenProps {
  setSearch: (search: boolean) => void;
}

const SearchToken = ({ setSearch }: SearchTokenProps) => {
  const [searchQuery, setSearchQuery] = useState<string>("");

  return (
    <PopUp prompt="Search Token" setValue={setSearch}>
      <ThemeWrapper>
        <div className="flex w-full flex-col-reverse sm:flex-row items-center justify-between">
          <div className="text-lg flex items-center mt-4 sm:mt-0 w-full sm:w-6/8">
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
          <div className="sm:w-2/8 w-full">
            <ChainSelect />
          </div>
        </div>
      </ThemeWrapper>
      <TokenResults searchQuery={searchQuery} setSearch={setSearch} />
    </PopUp>
  );
};

export default SearchToken;
