// Desc: TokenResults component that displays token search results
import tokens from "@/utils/tokenData.json";
import { getTokenData } from "@/utils/getTokenData/readContract";
import { useAccount } from "wagmi";
import { useEffect, useState } from "react";
import { useGlobalState } from "@/utils/StateContext";
import ThemeWrapper from "../layout/ThemeWrapper";
import Loader from "../common/Loader";
import { ethers } from "ethers";
import { Token } from "@/types/blockchainData";

interface TokenResultsProps {
  searchQuery: string;
  setSearch: (search: boolean) => void;
}

const TokenResults = ({ searchQuery, setSearch }: TokenResultsProps) => {
  const { address, chainId } = useAccount();
  const { selectedToken, setSelectedToken } = useGlobalState();
  const [tokenList, setTokenList] = useState<Token[]>([]);
  const [load, setLoad] = useState<boolean>(false);
  const fetchData = getTokenData(searchQuery, address);

  useEffect(() => {
    setLoad(true);
    const filteredTokens = tokens.allTokens.filter(
      (token) => token.chainId === chainId
    );
    if (fetchData?.token != null) {
      const tokenData = fetchData.token;
      const searchedToken = { ...tokenData };
      setTokenList([searchedToken]);
      setLoad(false);
    } else if (searchQuery != "") {
      const searchResults = filteredTokens.filter(
        (token) =>
          token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          token.symbol.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setTokenList(searchResults);
      if (fetchData?.isFetched || !ethers.isAddress(searchQuery))
        setLoad(false);
    } else {
      setTokenList(filteredTokens);
      setLoad(false);
    }
  }, [searchQuery, fetchData?.token?.name, chainId]);

  useEffect(() => {
    if (fetchData?.isRefetching) {
      setLoad(true);
    } else {
      setLoad(false);
    }
  }, [fetchData?.isRefetching]);

  const handleTokenSelect = (token: Token) => {
    if (chainId == undefined) return;
    if (selectedToken?.address == token.address) {
      setSearch(false);
      return;
    }
    setSelectedToken({ ...token, chainId });
    setSearch(false);
  };
  return (
    <>
      <p className="px-2">Tokens</p>
      <div className="overflow-hidden p-2">
        <ThemeWrapper size="fill">
          <ul className="h-full w-full overflow-scroll">
            {load ? (
              <Loader />
            ) : tokenList.length === 0 ? (
              <li className="mb-4">No token found</li>
            ) : (
              tokenList.map((token) => (
                <li
                  key={token.symbol}
                  onClick={() => handleTokenSelect(token)}
                  className="mb-4 cursor-pointer w-full"
                >
                  <p className="font-semibold text-lg">
                    {token.name != selectedToken?.name
                      ? `${token.name}`
                      : "Selected"}
                  </p>
                  <p>{token.symbol}</p>
                </li>
              ))
            )}
          </ul>
        </ThemeWrapper>
      </div>
    </>
  );
};
export default TokenResults;
