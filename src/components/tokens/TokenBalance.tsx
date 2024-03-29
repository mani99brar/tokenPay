// Desc: This file contains the component that displays the balance of the selected token
import { getTokenBalance } from "@/utils/getTokenData/readContract";
import { useAccount } from "wagmi";
import { useEffect } from "react";
import { useGlobalState } from "@/utils/StateContext";
import {
  formatBalance,
  scientificToDecimal,
} from "@/utils/helpers/commonHelpers";
import { faCopy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { TokenBalanceReturn } from "@/types/blockchainData";

interface TokenBalanceProps {
  tokenAddress: string;
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
  }, [activeTransaction?.hash]);

  useEffect(() => {
    if (selectedToken?.chainId != chainId) setSelectedToken(null);
  }, [chainId]);

  const copyToClipboard = async () => {
    if (formattedBalance) {
      try {
        if (balance != undefined)
          await navigator.clipboard.writeText(
            scientificToDecimal(parseFloat(formattedBalance))
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
