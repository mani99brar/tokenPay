import { getTokenBalance } from "@/utils/getTokenData/readContract";
import { useAccount } from "wagmi";
import { useEffect, useState } from "react";

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
  const [formattedBalance, setFormattedBalance] = useState<string>("");
  const { balance, isFetching, refetch, isRefetching }: TokenBalanceReturn =
    getTokenBalance(tokenAddress as `0x${string}`, address);
  useEffect(() => {
    console.log(balance, "Check Balance");
    if (typeof balance === "bigint" && balance != undefined) {
      const numberBalance = Number(balance);
      // Ensure the number is within the safe range for JavaScript numbers
      if (!Number.isSafeInteger(numberBalance)) {
        console.warn(
          "Balance exceeds safe integer range. Precision may be lost."
        );
      }
      setFormattedBalance(numberBalance.toFixed(3));
    } else if (balance?.formatted != undefined) {
      setFormattedBalance(parseFloat(balance?.formatted).toFixed(3));
    } else {
      refetch();
    }
  }, [tokenAddress, isRefetching]);
  return (
    <p className="text-[#8612F1] w-full text-end p-2">
      {isFetching
        ? "Loading"
        : formattedBalance != ""
        ? "Balance: " + formattedBalance
        : "Unknown"}
    </p>
  );
};

export default TokenBalance;
