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
    | undefined;
  isFetching: boolean;
  refetch: () => void;
  isRefetching: boolean;
}

const TokenBalance = ({ tokenAddress }: TokenBalanceProps) => {
  const { address, chainId } = useAccount();
  const {
    selectedToken,
    setSelectedTokenBalance,
    lastTransaction,
    setSelectedToken,
  } = useGlobalState();
  const { balance, isFetching, refetch, isRefetching }: TokenBalanceReturn =
    getTokenBalance(tokenAddress as `0x${string}`, address);
  //Set the balance to the global state
  const formattedBalance = formatBalance({
    balance: selectedToken?.userBalance as string,
    decimals: selectedToken?.decimals as number,
  });
  useEffect(() => {
    console.log(balance);
    if (balance != undefined) {
      console.log("In Token Balance", balance?.formatted);
      setSelectedTokenBalance(balance.toString());
    } else {
      setSelectedTokenBalance("");
      refetch();
    }
  }, [tokenAddress, balance]);
  useEffect(() => {
    //Update the balance after each transaction
    refetch();
    console.log(lastTransaction, "lastTransaction");
    console.log(balance);
    console.log(isRefetching);
  }, [lastTransaction]);

  useEffect(() => {
    if (selectedToken?.chainId != chainId) setSelectedToken(null);
  }, [chainId]);

  return (
    <p className="w-full text-end p-2">
      {selectedToken != null &&
        (isFetching || isRefetching
          ? "Loading Balance"
          : selectedToken?.userBalance != ""
          ? "Balance: " + formattedBalance
          : "Unknown")}
    </p>
  );
};

export default TokenBalance;
