import { useReadContract } from "wagmi";
import abi from "@/utils/abi/ERC20.json";

//Only refetching for balance as the name, symbol or decimals will not change and very unlikely that
//balance read call goes through and the other calls fail
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
    const token = null;
    return { token, refetch };
  }
  const token = {
    address: contractAddress,
    name,
    symbol,
    decimals,
    balance,
  } as any;
  return { token, refetch, isRefetching };
}
interface TokenBalanceReturn {
  balance:
    | { decimals: number; formatted: string; symbol: string; value: bigint }
    | undefined;
  isFetching: boolean;
  refetch: () => void;
  isRefetching: boolean;
}

function getTokenBalance(
  contractAddress: `0x${string}`,
  userAddress: `0x${string}` | undefined
) {
  const {
    data: balance,
    isFetching,
    refetch,
    isRefetching,
  } = useReadContract({
    abi,
    address: contractAddress,
    functionName: "balanceOf",
    args: [userAddress],
  });
  return { balance, isFetching, refetch, isRefetching } as TokenBalanceReturn;
}

export { getTokenData, getTokenBalance };
