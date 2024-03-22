import TokenActions from "./TokenActions";
import StandardButton from "./StandardButton";
import StandardInput from "./StandardInput";
import { useEffect, useState } from "react";
import { useGlobalState } from "@/utils/StateContext";
import { ethers } from "ethers";
import {
  parseTokenAmount,
  encodeMethodCall,
  getThemeColors,
} from "@/utils/helpers/allHelpers";
import {
  useWriteContract,
  BaseErrorType,
  useEstimateGas,
  useGasPrice,
  useBalance,
  useAccount,
} from "wagmi";
import abi from "@/utils/abi/ERC20.json";
import TransactionStatus from "./TransactionStatus";
import HistoryTrnx from "./HistoryTrnx";
import ThemeWrapper from "./ThemeWrapper";
import {
  readTrnxHistory,
  storeTransaction,
} from "@/utils/localStorage/readAndWrite";
const SendBox = () => {
  const { selectedToken, lastTransaction, setLastTransaction, uiTheme } =
    useGlobalState();
  const [textColor, bgColor] = getThemeColors(uiTheme);

  const { writeContract, data, status, error } = useWriteContract();
  const [tokenAmount, setTokenAmount] = useState<string>("");
  const [receiverAddress, setReceiverAddress] = useState<string>("");
  const [sendMesasge, setSendMessage] = useState<string>("Enter Inputs");
  const [isRecieverValid, setIsRecieverValid] = useState<boolean>(false);
  const [isAmountValid, setIsAmountValid] = useState<boolean>(false);
  const [isTrnxActive, setIsTrnxActive] = useState<boolean>(false);
  const [trnxPrompt, setTrnxPrompt] = useState<string>("");
  const [encodedData, setEncodeData] = useState<string>("");
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const { address, chainId } = useAccount();
  const { data: userBalance } = useBalance({
    address,
  });
  const { data: gasEstimateData, refetch: refetchGas } = useEstimateGas({
    data: encodedData as `0x${string}`,
    to: selectedToken?.address as `0x${string}`,
  });
  const { data: gasPrice, refetch: refetchGasPrice } = useGasPrice();
  useEffect(() => {
    if (selectedToken == null) {
      setSendMessage("Please Select Token");
      return;
    }
    refetchGas();
    refetchGasPrice();
    if (
      tokenAmount != "" &&
      selectedToken?.userBalance != undefined &&
      parseFloat(tokenAmount) > 0
    ) {
      if (
        parseFloat(parseTokenAmount(tokenAmount, selectedToken?.decimals)) <=
        parseFloat(selectedToken?.userBalance)
      ) {
        setIsAmountValid(true);
        if (isRecieverValid) setSendMessage("Send Tokens");
        else if (receiverAddress == "") setSendMessage("Enter Receiver");
      } else {
        setIsAmountValid(false);
        setSendMessage("Insufficient Token Balance");
      }
    } else {
      setIsAmountValid(false);
      setSendMessage("Enter Amount");
    }

    if (receiverAddress != "") {
      if (ethers.isAddress(receiverAddress)) {
        setIsRecieverValid(true);
        if (isAmountValid) setSendMessage("Send Tokens");
        else if (tokenAmount == "") setSendMessage("Enter Amount");
      } else if (receiverAddress != "") {
        setIsRecieverValid(false);
        setSendMessage("Invalid Receiver");
      }
    } else {
      setIsRecieverValid(false);
      if (receiverAddress == "" && tokenAmount != "") {
        setSendMessage("Enter Receiver");
      } else {
        setSendMessage("Enter Inputs");
      }
    }
    if (isAmountValid && isRecieverValid) {
      const tempEncodedData = encodeMethodCall({
        receiverAddress,
        amount: parseTokenAmount(tokenAmount, selectedToken?.decimals),
      });
      setEncodeData(tempEncodedData);
      console.log(encodedData, "Encoded Data");
    }

    if (
      gasEstimateData != undefined &&
      gasPrice != undefined &&
      userBalance != undefined &&
      tokenAmount != "0" &&
      tokenAmount != ""
    ) {
      const totalGasCost = gasEstimateData * gasPrice;
      if (totalGasCost > userBalance.value) {
        setSendMessage("Insufficient Balance to pay gas");
        setIsAmountValid(false);
        return;
      }
    }
  }, [
    tokenAmount,
    selectedToken,
    receiverAddress,
    encodedData,
    gasEstimateData,
    gasPrice,
    lastTransaction,
  ]);

  const sendTokens = () => {
    writeContract({
      abi,
      address: selectedToken?.address as `0x${string}`,
      functionName: "transfer",
      args: [
        receiverAddress,
        parseTokenAmount(tokenAmount, selectedToken?.decimals),
      ],
    });
  };

  useEffect(() => {
    if (status === "pending") {
      setIsTrnxActive(true);
      setTrnxPrompt("Confirm transaction in your wallet");
    } else if (status === "error") {
      console.log(error);
      const desError = { error }.error?.cause as BaseErrorType;
      console.log(desError.shortMessage);
      setTrnxPrompt("Transaction failed: " + desError.shortMessage);
      setLastTransaction(null);
    } else if (status === "success") {
      if (data == undefined || chainId == undefined) return;
      const transactionDetails = {
        hash: data,
        isPending: true,
        chainId,
      };
      //Make types same
      setLastTransaction({
        hash: data as string,
        isPending: true,
        chainId: chainId ?? 0,
      });
      storeTransaction(transactionDetails);
      const channel = new BroadcastChannel("transaction_channel");
      channel.postMessage(transactionDetails);
      channel.close();
      setTrnxPrompt("");
    }
  }, [status]);

  useEffect(() => {
    const existingTransactions = readTrnxHistory(chainId);
    if (existingTransactions.length > 0) {
      if (existingTransactions[0].isPending === true) {
        setLastTransaction(existingTransactions[0]);
        setIsTrnxActive(true);
      }
    }
    const channel = new BroadcastChannel("transaction_channel");
    channel.onmessage = (event) => {
      if (event.data === undefined) return;
      setLastTransaction({
        hash: event.data.hash,
        isPending: true,
        chainId: chainId ?? 0,
      });
      setIsTrnxActive(true);
    };
    return () => channel.close();
  }, []);

  return (
    <div className="flex w-full flex-col lg:flex-row lg:space-x-2 lg:space-y-0 space-y-2">
      <div
        style={{ backgroundColor: bgColor }}
        className={`lg:w-3/5 w-full bg-[${bgColor}] rounded-lg flex flex-col space-y-2 p-2`}
      >
        {isTrnxActive && (
          <TransactionStatus
            transactionHash={lastTransaction?.hash as `0x${string}`}
            setTrnx={setIsTrnxActive}
            trnxPrompt={trnxPrompt}
          />
        )}
        <ThemeWrapper>
          <>
            <div className="w-3/5 flex flex-col text-2xl">
              <StandardInput
                placeholder="0"
                label="Token Amount"
                value={tokenAmount}
                setValue={setTokenAmount}
                type="number"
              />
            </div>
            <TokenActions />
          </>
        </ThemeWrapper>
        <ThemeWrapper>
          <div className="w-full flex flex-col text-2xl">
            <StandardInput
              placeholder="0x0"
              label="Receiver Address"
              value={receiverAddress}
              setValue={setReceiverAddress}
              type="text"
            />
          </div>
        </ThemeWrapper>
        <StandardButton
          isDisabled={!isAmountValid || !isRecieverValid}
          handleClick={sendTokens}
          prompt={sendMesasge}
        />
      </div>

      <div
        style={{ backgroundColor: bgColor }}
        className={`lg:w-2/6 w-full h-full rounded-lg flex items-center sm:items-stretch flex-col sm:flex-row lg:flex-col justify-between p-2`}
      >
        <ThemeWrapper size="fill">
          <div className="flex w-full  h-full justify-between flex-col">
            <div className="flex lg:flex-col w-full sm:flex-row flex-col items-center justify-between">
              <p className="font-bold w-full sm:w-1/2 lg:w-full">
                Gas Price: <br />
                <span>
                  {gasPrice === undefined ? "Fetching..." : gasPrice.toString()}{" "}
                  wei
                </span>
              </p>
              <p className=" lg:mt-4 w-full sm:w-1/2 lg:w-full">
                Average Wait time : 5 mins
              </p>
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
      </div>
    </div>
  );
};

export default SendBox;
