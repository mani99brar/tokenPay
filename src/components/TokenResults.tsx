import tokens from "@/utils/tokenData.json";
import { getTokenData } from "@/utils/getTokenData/readContract";
import { useAccount } from "wagmi";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useGlobalState } from "@/utils/StateContext";

type TokenData = {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  logoURI?: string;
  balance?: string;
};

interface TokenResultsProps {
  searchQuery: string;
  setSearch: (search: boolean) => void;
}

const TokenResults = ({ searchQuery, setSearch }: TokenResultsProps) => {
  const { address, chainId } = useAccount();
  const { setSelectedToken } = useGlobalState();
  const [tokenList, setTokenList] = useState<TokenData[]>([]);
  const [load, setLoad] = useState<boolean>(false);
  const fetchData = getTokenData(searchQuery, address);
  useEffect(() => {
    setLoad(true);
    fetchData?.refetch();
    const filteredTokens = tokens.allTokens.filter(
      (token) => token.chainId === chainId
    );
    if (fetchData?.tokenData != null) {
      const tokenData = fetchData.tokenData;
      const effectiveChainId = chainId ?? 0;
      const searchedToken = {
        name: tokenData.name as string,
        symbol: tokenData.symbol as string,
        address: tokenData.contractAddress as string,
        decimals: tokenData.decimals as number,
        chainId: effectiveChainId,
      };
      setTokenList([searchedToken]);
      setLoad(true);
    } else if (searchQuery != "") {
      const searchResults = filteredTokens.filter(
        (token) =>
          token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          token.symbol.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setTokenList(searchResults);
      if (!ethers.isAddress(searchQuery)) setLoad(false);
    } else {
      setTokenList(filteredTokens);
      setLoad(false);
    }
  }, [searchQuery, fetchData?.tokenData?.name, chainId]);

  useEffect(() => {
    if (fetchData?.isRefetching) {
      setLoad(true);
    } else {
      setLoad(false);
    }
  }, [fetchData?.isRefetching]);

  const handleTokenSelect = (token: TokenData) => {
    if (chainId == undefined) return;
    setSelectedToken({ ...token, chainId });
    setSearch(false);
  };
  return (
    <>
      <p className="text-[#8612F1] px-2">Tokens</p>
      <div className="w-full h-full border-4 overflow-scroll text-[#8612F1] border-[#8612F1] rounded-lg p-4">
        <ul className="h-full">
          {load ? (
            <p>Loading...</p>
          ) : tokenList.length === 0 && !fetchData?.isRefetching ? (
            <li className="mb-4">No token found</li>
          ) : (
            tokenList.map((token) => (
              <li
                key={token.symbol}
                onClick={() => handleTokenSelect(token)}
                className="mb-4 cursor-pointer"
              >
                <p className="font-semibold text-lg">{token.name} </p>
                <p>{token.symbol}</p>
              </li>
            ))
          )}
        </ul>
      </div>
    </>
  );
};
export default TokenResults;
