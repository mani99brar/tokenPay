import { useReadContract } from "wagmi";
import abi from "@/utils/abi/ERC20.json";

type TokenData = {
  address: `0x${string}`;
  name: string;
  symbol: string;
  decimals: number;
  logoURI?: string;
  balance: string;
};

function getTokenData(
  searchQuery: string,
  userAddress: `0x${string}` | undefined
) {
  if (userAddress === undefined) return null;
  const contractAddress = searchQuery as `0x${string}`;
  const {
    data: balance,
    refetch,
    isRefetching,
  } = useReadContract({
    abi,
    address: contractAddress,
    functionName: "balanceOf",
    args: [userAddress],
  });

  const { data: name } = useReadContract({
    abi,
    address: contractAddress,
    functionName: "name",
  });

  const { data: symbol } = useReadContract({
    abi,
    address: contractAddress,
    functionName: "symbol",
  });

  const { data: decimals } = useReadContract({
    abi,
    address: contractAddress,
    functionName: "decimals",
  });
  if (
    name === undefined ||
    symbol === undefined ||
    decimals === undefined ||
    balance === undefined
  ) {
    const tokenData = null;
    return { tokenData, refetch };
  }
  const tokenData = { contractAddress, name, symbol, decimals, balance } as any;
  return { tokenData, refetch, isRefetching };
}

export { getTokenData };
