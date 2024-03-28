// Desc: TokenActions component where the user can search for tokens and view their balances
import { useState } from "react";
import { useGlobalState } from "@/utils/StateContext";
import { getThemeColors } from "@/utils/helpers/commonHelpers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretSquareDown } from "@fortawesome/free-solid-svg-icons";
import SearchToken from "./SearchToken";
import TokenBalance from "./TokenBalance";

const TokenActions = () => {
  const [search, setSearch] = useState<boolean>(false);
  const { selectedToken, uiTheme } = useGlobalState();
  const [textColor, bgColor] = getThemeColors(uiTheme);
  return (
    <>
      {search && <SearchToken setSearch={setSearch} />}
      <div className="w-2/5 flex flex-col items-end">
        <p
          style={{ backgroundColor: textColor, color: bgColor }}
          className={` w-full sm:w-3/4 rounded-lg p-2 text-center cursor-pointer`}
          onClick={() => setSearch(true)}
        >
          {selectedToken?.symbol ?? "Tokens"}
          <span className="ml-2">
            <FontAwesomeIcon icon={faCaretSquareDown} />
          </span>
        </p>
        {/* If too many balance is available, show upto three digit or smthn */}
        <TokenBalance tokenAddress={selectedToken?.address ?? ""} />
      </div>
    </>
  );
};

export default TokenActions;
