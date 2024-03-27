import ThemeWrapper from "./ThemeWrapper";
import StandardButton from "./StandardButton";
import { useState } from "react";
import HistoryTrnx from "./HistoryTrnx";
import { useGlobalState } from "@/utils/StateContext";

interface StatsProps {
  gasPrice: bigint | undefined;
  estimatedTime: number;
}

const Stats = ({ gasPrice, estimatedTime }: StatsProps) => {
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const { activeTransaction, setActiveTransactionState } = useGlobalState();
  return (
    <>
      <ThemeWrapper size="fill">
        <div className="flex w-full  h-full justify-between flex-col">
          <div className="flex lg:flex-col w-full sm:flex-row  flex-col items-center justify-between">
            <p className=" w-full sm:w-1/2 sm:text-start text-center lg:w-full">
              Gas Price: <br />
              <span className="font-bold text-xl">
                {gasPrice === undefined
                  ? "Fetching..."
                  : gasPrice.toString() + " wei"}
              </span>
            </p>
            <p className=" lg:mt-4 w-full sm:w-1/2 sm:text-start text-center  lg:w-full">
              Average Wait time <br />{" "}
              <span className="font-bold text-xl">
                {estimatedTime != 0
                  ? "Around " +
                    (estimatedTime > 60
                      ? (estimatedTime / 60).toFixed(0) + " mins"
                      : estimatedTime + " secs")
                  : "Calculating..."}
              </span>
            </p>
          </div>
          <div className="sm:mt-2 lg:mt-0">
            {activeTransaction != null && activeTransaction.isPending && (
              <StandardButton
                prompt="Pending Trnx"
                size="small"
                handleClick={() => setActiveTransactionState(true)}
              />
            )}
          </div>
        </div>
      </ThemeWrapper>
      <div className="lg:w-full mt-2 ml-2 lg:ml-0 sm:mt-0 lg:mt-2 flex w-full sm:w-1/4">
        <StandardButton
          prompt="History"
          handleClick={() => setShowHistory(true)}
        />
      </div>

      {showHistory && <HistoryTrnx setOpen={setShowHistory} />}
    </>
  );
};

export default Stats;
