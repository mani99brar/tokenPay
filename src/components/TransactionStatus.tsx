import { useEffect, useState } from "react";
import { useWaitForTransactionReceipt, useAccount } from "wagmi";
import SingleTrnx from "./SingleTrnx";
import PopUp from "./PopUp";
import { updateTransactionStatus } from "@/utils/helpers/allHelpers";
import ThemeWrapper from "./ThemeWrapper";
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
  console.log(transactionHash, "No sped up");
  const { chain, address } = useAccount();
  console.log(chain?.blockExplorers);
  const { data, isError, isLoading } = useWaitForTransactionReceipt({
    hash: transactionHash,
    onReplaced: (replacement) => {
      setSpedUp(true);
      console.log(replacement, "Sped up");
    },
  });
  const [activeHash, setActiveHash] = useState<string | undefined>(
    transactionHash
  );
  const [spedUp, setSpedUp] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState(
    "Waiting for transaction..."
  );

  useEffect(() => {
    setActiveHash(transactionHash);
    if (isLoading) {
      setStatusMessage("Waiting for transaction to confirm...");
    } else if (isError) {
      setStatusMessage("Transaction failed.");
    } else if (data) {
      updateTransactionStatus({ transactionHash, newStatus: "success" });
      setStatusMessage("Transaction succeeded!");
    }
  }, [transactionHash, data, isError, isLoading]);

  return (
    <PopUp prompt="Transaction Status" setValue={setTrnx}>
      <div className="w-full h-full flex flex-col p-4">
        {trnxPrompt != "" ? (
          <ThemeWrapper>
            <p className="h-full rounded-lg text-2xl font-bold">{trnxPrompt}</p>
          </ThemeWrapper>
        ) : (
          <ThemeWrapper>
            <div className="flex flex-col mb-4 space-y-4">
              <p className="text-2xl font-bold">{statusMessage}</p>
              <p className="lg">{spedUp && " Your Transaction was sped up"}</p>
              {activeHash != undefined && (
                <ThemeWrapper>
                  <SingleTrnx hash={activeHash} />
                </ThemeWrapper>
              )}
            </div>
          </ThemeWrapper>
        )}
      </div>
    </PopUp>
  );
};

export default TransactionStatus;
