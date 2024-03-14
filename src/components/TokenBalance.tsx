import { getTokenBalance } from "@/utils/getTokenData/readContract";
import { useAccount } from "wagmi";
import { useEffect } from "react";
import { useGlobalState } from "@/utils/StateContext";
import { formatBalance } from "@/utils/helpers/allHelpers";
interface TokenBalanceProps {
  tokenAddress: string;
}
interface TokenBalanceReturn {
  balance:
    | { decimals: number; formatted: string; symbol: string; value: bigint }
    | bigint
    | undefined;
  isFetching: boolean;
  refetch: () => void;
  isRefetching: boolean;
}

const TokenBalance = ({ tokenAddress }: TokenBalanceProps) => {
  const { address } = useAccount();
  const { selectedToken, setSelectedTokenBalance } = useGlobalState();
  const { balance, isFetching, refetch, isRefetching }: TokenBalanceReturn =
    getTokenBalance(tokenAddress as `0x${string}`, address);
  //Formating balance to show upto 3 digits
  let formattedBalance = "";
  if (
    tokenAddress == "0x0" &&
    balance != undefined &&
    typeof balance !== "bigint"
  ) {
    formattedBalance = parseFloat(balance?.formatted).toFixed(3);
  } else
    formattedBalance = formatBalance({
      balance: selectedToken?.userBalance,
      decimals: selectedToken?.decimals,
    });
  //Set the balance to the global state
  useEffect(() => {
    if (typeof balance === "bigint" && balance != undefined) {
      setSelectedTokenBalance(balance.toString());
    } else if (balance?.formatted != undefined) {
      console.log("In Token Balance", balance?.formatted);
      setSelectedTokenBalance(balance?.value.toString());
    } else {
      setSelectedTokenBalance("");
      refetch;
    }
  }, [tokenAddress, balance]);
  return (
    <p className="text-[#8612F1] w-full text-end p-2">
      {isFetching || isRefetching
        ? "Loading"
        : selectedToken?.userBalance != ""
        ? "Balance: " + formattedBalance
        : "Unknown"}
    </p>
  );
};

export default TokenBalance;
