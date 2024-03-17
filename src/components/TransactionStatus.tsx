import { useEffect, useState } from "react";
import { useWaitForTransactionReceipt, useAccount } from "wagmi";
import { formatBalance, trimAddress } from "@/utils/helpers/allHelpers";
import { getTokenData } from "@/utils/getTokenData/readContract";
import PopUp from "./PopUp";
interface Transaction {
  transactionHash: `0x${string}` | undefined;
  setTrnx: (trnx: boolean) => void;
  trnxPrompt: string;
}

const TransactionStatus = ({
  transactionHash,
  setTrnx,
  trnxPrompt,
}: Transaction) => {
  const { chain, address } = useAccount();
  console.log(chain?.blockExplorers);
  const { data, isError, isLoading } = useWaitForTransactionReceipt({
    hash: transactionHash,
    onReplaced: (replacement) => {
      setSpedUp(true);
      console.log(replacement);
    },
  });
  const token = getTokenData(data?.to as string, address);

  const [spedUp, setSpedUp] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState(
    "Waiting for transaction..."
  );

  useEffect(() => {
    if (isLoading) {
      setStatusMessage("Waiting for transaction to confirm...");
    } else if (isError) {
      setStatusMessage("Transaction failed.");
    } else if (data) {
      setStatusMessage("Transaction succeeded!");
    }
  }, [transactionHash, data, isError, isLoading]);

  return (
    <PopUp prompt="Transaction Status" setValue={setTrnx}>
      <div className="w-full h-full flex flex-col p-4">
        {trnxPrompt != "" ? (
          <p className="text-[#8612F1] h-full rounded-lg border-4 p-4 border-[#8612F1] text-2xl font-bold">
            {trnxPrompt}
          </p>
        ) : (
          <div className="text-[#8612F1] border-4 h-full rounded-lg border-[#8612F1] p-4">
            <p className="text-2xl font-bold">{statusMessage}</p>
            <p className="lg">{spedUp && " Your Transaction was sped up"}</p>
            {data != undefined && (
              <div className="mt-2">
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
                <div className="mt-8 flex flex-col space-y-2">
                  <p className="text-2xl mb-2 font-bold">Transaction Details</p>
                  <p>
                    Token:{" "}
                    <span className="font-bold">
                      {token?.tokenData?.symbol}
                    </span>
                  </p>
                  <p>
                    Amount:{" "}
                    <span className="font-bold">
                      {formatBalance({
                        balance: BigInt(data.logs[0].data).toString(),
                        decimals: token?.tokenData.decimals,
                      })}
                    </span>
                  </p>

                  <p>
                    Receiver:{" "}
                    <span className="font-bold">
                      {trimAddress(`0x${data.logs[0].topics[2]?.slice(-40)}`)}
                    </span>
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </PopUp>
  );
};

export default TransactionStatus;
