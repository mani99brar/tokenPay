import { useEffect, useState } from "react";
import { useWaitForTransactionReceipt, useAccount } from "wagmi";
import { getTokenData } from "@/utils/getTokenData/readContract";
import { formatBalance, trimAddress } from "@/utils/helpers/allHelpers";
import { updateTrnxHash } from "@/utils/localStorage/readAndWrite";
interface TrnxHash {
  hash: `0x${string}`;
}

const SingleTrnx = ({ hash }: TrnxHash) => {
  const [statusMessage, setStatusMessage] = useState("Loading...");
  const { chain, address } = useAccount();
  const { data, isError, isLoading } = useWaitForTransactionReceipt({
    hash: hash as `0x${string}`,
    onReplaced: (replacement) => {
      console.log(replacement, "Sped up");
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
    <div className="mb-4">
      {data != undefined ? (
        <div className="flex flex-col space-y-2">
          <p className="lg">{spedUp && " This Transaction was sped up"}</p>
          <p>
            Token: <span className="font-bold">{token?.token?.symbol}</span>
          </p>
          <p>
            Amount:{" "}
            <span className="font-bold">
              {formatBalance({
                balance: BigInt(data.logs[0].data).toString(),
                decimals: token?.token?.decimals,
              })}
            </span>
          </p>
          <p>
            Sender:{" "}
            <span className="font-bold">
              {trimAddress(`0x${data.logs[0].topics[1]?.slice(-40)}`)}
            </span>
          </p>
          <p>
            Receiver:{" "}
            <span className="font-bold">
              {trimAddress(`0x${data.logs[0].topics[2]?.slice(-40)}`)}
            </span>
          </p>
          <a
            href={
              chain?.blockExplorers?.default.url +
              "/tx/" +
              data?.transactionHash
            }
            className="underline underline-offset-4"
          >
            View on block explorer
          </a>
        </div>
      ) : (
        <p>{statusMessage}</p>
      )}
    </div>
  );
};

export default SingleTrnx;
