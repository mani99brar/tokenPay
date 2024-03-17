import { useEffect, useState } from "react";
import { useWaitForTransactionReceipt, useAccount } from "wagmi";
import { getTokenData } from "@/utils/getTokenData/readContract";
import { formatBalance, trimAddress } from "@/utils/helpers/allHelpers";
interface TrnxHash {
  hash: string;
}

const SingleTrnx = ({ hash }: TrnxHash) => {
  const [statusMessage, setStatusMessage] = useState("Loading...");
  const { chain, address } = useAccount();
  console.log(chain?.blockExplorers);
  const { data, isError, isLoading } = useWaitForTransactionReceipt({
    hash: hash as `0x${string}`,
  });
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
    <>
      {data != undefined ? (
        <div className="flex flex-col space-y-2">
          <p>
            Token: <span className="font-bold">{token?.tokenData?.symbol}</span>
          </p>
          <p>
            Amount:{" "}
            <span className="font-bold">
              {formatBalance({
                balance: BigInt(data.logs[0].data).toString(),
                decimals: token?.tokenData?.decimals,
              })}
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
    </>
  );
};

export default SingleTrnx;
