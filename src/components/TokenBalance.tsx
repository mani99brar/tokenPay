import { getTokenBalance } from "@/utils/getTokenData/readContract";
import { useAccount } from "wagmi";
import { useEffect } from "react";
import { useGlobalState } from "@/utils/StateContext";
import { formatBalance, scientificToDecimal } from "@/utils/helpers/allHelpers";
import { faCopy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


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
    activeTransaction,
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
    if (balance != undefined) {
      setSelectedTokenBalance(balance.toString());
    } else {
      setSelectedTokenBalance("");
      refetch();
    }
  }, [tokenAddress, balance]);
  useEffect(() => {
    //Update the balance after each transaction
    refetch();
  }, [activeTransaction]);

  useEffect(() => {
    if (selectedToken?.chainId != chainId) setSelectedToken(null);
  }, [chainId]);

  const copyToClipboard = async () => {
    if (formattedBalance) {
      try {
        if (balance != undefined)
          await navigator.clipboard.writeText(
            scientificToDecimal(formattedBalance)
          );
      } catch (err) {
        console.error("Failed to copy balance to clipboard", err);
      }
    }
  };
  return (
    <p className="w-full text-end p-2 cursor-pointer" onClick={copyToClipboard}>
      {selectedToken != null &&
        (isFetching || isRefetching ? (
          "Loading Balance"
        ) : selectedToken?.userBalance != "" ? (
          <>
            <FontAwesomeIcon icon={faCopy} /> Balance: {formattedBalance}
          </>
        ) : (
          "Unknown"
        ))}
    </p>
  );
};

export default TokenBalance;
