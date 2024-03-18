import { useEffect, useState } from "react";
import { useWaitForTransactionReceipt, useAccount } from "wagmi";
import SingleTrnx from "./SingleTrnx";
import PopUp from "./PopUp";
import { updateTransactionStatus } from "@/utils/helpers/allHelpers";
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
          <p className="text-[#8612F1] h-full rounded-lg border-4 p-4 border-[#8612F1] text-2xl font-bold">
            {trnxPrompt}
          </p>
        ) : (
          <div className="text-[#8612F1] border-4 h-full rounded-lg border-[#8612F1] p-4">
            <p className="text-2xl font-bold">{statusMessage}</p>
            <p className="lg">{spedUp && " Your Transaction was sped up"}</p>
            {activeHash != undefined && (
              <div className="border-4 p-4 rounded-lg border-[#8612F1] mt-4">
                <SingleTrnx hash={activeHash} />
              </div>
            )}
          </div>
        )}
      </div>
    </PopUp>
  );
};

export default TransactionStatus;
