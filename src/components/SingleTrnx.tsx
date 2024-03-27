import { useEffect, useState } from "react";
import { useWaitForTransactionReceipt, useAccount } from "wagmi";
import { getTokenData } from "@/utils/getTokenData/readContract";
import { formatBalance, trimAddress } from "@/utils/helpers/allHelpers";
import { updateTrnxHash } from "@/utils/localStorage/readAndWrite";
import TransactionDetails from "./TransactionDetails";
import Loader from "./Loader";
import ThemeWrapper from "./ThemeWrapper";
interface TrnxHash {
  hash: `0x${string}`;
}

const SingleTrnx = ({ hash }: TrnxHash) => {
  const [statusMessage, setStatusMessage] = useState("Loading...");
  const { chain, address } = useAccount();
  const { data, isError, isLoading } = useWaitForTransactionReceipt({
    hash: hash as `0x${string}`,
    onReplaced: (replacement) => {
      if (hash) updateTrnxHash(hash, replacement.transaction.hash);
      setSpedUp(true);
    },
  });
  const [spedUp, setSpedUp] = useState<boolean>(false);
  const token = getTokenData(data?.to as string, address);
  useEffect(() => {
    if (isLoading) {
      setStatusMessage("Waiting for transaction data...");
    } else if (isError) {
      setStatusMessage("Transaction failed.");
    } else if (data) {
      setStatusMessage("Transaction succeeded!");
    }
  }, [data, isError, isLoading]);
  return (
    <div className="w-full">
      {data != undefined ? (
        <ThemeWrapper size="fill">
          <div className="flex w-full flex-col space-y-2">
            <p className="lg">{spedUp && " This Transaction was sped up"}</p>
            <TransactionDetails
              hash={data.transactionHash}
              symbol={token?.token?.symbol}
              amount={formatBalance({
                balance: BigInt(data.logs[0].data).toString(),
                decimals: token?.token?.decimals,
              })}
              sender={trimAddress(`0x${data.logs[0].topics[1]?.slice(-40)}`)}
              receiver={trimAddress(`0x${data.logs[0].topics[2]?.slice(-40)}`)}
            />
          </div>
        </ThemeWrapper>
      ) : (
        <>
          {isError && <p>{statusMessage}</p>}
          {isLoading && <Loader />}
        </>
      )}
    </div>
  );
};

export default SingleTrnx;
