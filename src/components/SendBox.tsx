// Desc: SendBox component for sending tokens and displaying stats
import { useEffect, useState } from "react";
import { useGlobalState } from "@/utils/StateContext";
import { getThemeColors } from "@/utils/helpers/commonHelpers";
import { useAccount } from "wagmi";
import { readTrnxHistory } from "@/utils/localStorage/readAndWrite";
import TokenForm from "./tokens/TokenForm";
import useEstimateTime from "@/utils/helpers/gasEstimate";
import Stats from "./Stats";
const SendBox = () => {
  const { setActiveTransaction, uiTheme } = useGlobalState();
  const [, bgColor] = getThemeColors(uiTheme);
  const { chainId } = useAccount();
  const [gasPrice, setGasPrice] = useState<bigint | undefined>(undefined);
  const { estimatedTime } = useEstimateTime({ gasPrice, chainId });
  useEffect(() => {
    const existingTransactions = readTrnxHistory(chainId);
    if (existingTransactions.length > 0) {
      if (
        existingTransactions[0].isPending === true &&
        existingTransactions[0].hash != null
      ) {
        console.log(existingTransactions);
        setActiveTransaction({ ...existingTransactions[0], isActive: true });
      }
    }
  }, []);

  return (
    <div className="flex w-full flex-col lg:flex-row lg:space-x-2 lg:space-y-0 space-y-2">
      <div
        style={{ backgroundColor: bgColor }}
        className={`lg:w-3/5 w-full bg-[${bgColor}] rounded-lg flex flex-col space-y-2 p-2`}
      >
        <TokenForm setGasPrice={setGasPrice} />
      </div>
      <div
        style={{ backgroundColor: bgColor }}
        className={`lg:w-2/6 w-full h-full rounded-lg flex items-center sm:items-stretch flex-col sm:flex-row lg:flex-col justify-between p-2`}
      >
        <Stats gasPrice={gasPrice} estimatedTime={estimatedTime} />
      </div>
    </div>
  );
};

export default SendBox;
