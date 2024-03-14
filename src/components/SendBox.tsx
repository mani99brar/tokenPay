import TokenActions from "./TokenActions";
import StandardButton from "./StandardButton";
import StandardInput from "./StandardInput";
import { useEffect, useState } from "react";
import { useGlobalState } from "@/utils/StateContext";
import { ethers } from "ethers";
import { parseTokenAmount } from "@/utils/helpers/allHelpers";
import { useWriteContract } from "wagmi";
import abi from "@/utils/abi/ERC20.json";
const SendBox = () => {
  const { selectedToken } = useGlobalState();
  const { writeContract, data, status, error } = useWriteContract();
  const [tokenAmount, setTokenAmount] = useState<string>("");
  const [receiverAddress, setReceiverAddress] = useState<string>("");
  const [sendMesasge, setSendMessage] = useState<string>("Enter Inputs");
  const [isRecieverValid, setIsRecieverValid] = useState<boolean>(false);
  const [isAmountValid, setIsAmountValid] = useState<boolean>(false);
  useEffect(() => {
    if (
      tokenAmount != "" &&
      selectedToken?.userBalance != undefined &&
      parseFloat(tokenAmount) > 0
    ) {
      console.log("In Send Box", tokenAmount, selectedToken?.userBalance);
      if (
        parseFloat(parseTokenAmount(tokenAmount, selectedToken?.decimals)) <=
        parseFloat(selectedToken?.userBalance)
      ) {
        setIsAmountValid(true);
        if (isRecieverValid) setSendMessage("Send Tokens");
        else if (receiverAddress == "") setSendMessage("Enter Receiver");
        else setSendMessage("Invalid Receiver");
      } else {
        setIsAmountValid(false);
        setSendMessage("Insufficient Balance");
      }
    } else {
      setIsAmountValid(false);
      setSendMessage("Enter Amount");
    }
  }, [tokenAmount, selectedToken]);

  useEffect(() => {
    if (receiverAddress != "") {
      if (ethers.isAddress(receiverAddress)) {
        setIsRecieverValid(true);
        if (isAmountValid) setSendMessage("Send Tokens");
        else if (tokenAmount == "") setSendMessage("Enter Amount");
        else setSendMessage("Insufficient Balance");
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
  }, [receiverAddress]);

  const sendTokens = () => {
    console.log("Send Tokens");
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
    console.log(data, status, error);
    if (status === "success") {
      setReceiverAddress("");
      setTokenAmount("");
    } else if (status === "error") {
      setSendMessage("Failed to Send Tokens");
    }
  }, [status]);

  return (
    <div className="w-full bg-white flex flex-col space-y-2 p-2">
      <div className="w-full bg-white rounded-lg p-4 flex justify-between border-4 border-[#8612F1]">
        <div className="w-3/6 flex flex-col text-[#8612F1] text-2xl">
          <StandardInput
            placeholder="0"
            label="Token Amount"
            value={tokenAmount}
            setValue={setTokenAmount}
            type="number"
          />
        </div>
        <TokenActions />
      </div>
      <div className="w-full p-4 border-4 text-2xl pb-8 border-[#8612F1] rounded-lg flex flex-col text-[#8612F1]">
        <StandardInput
          placeholder="0x0"
          label="Receiver Address"
          value={receiverAddress}
          setValue={setReceiverAddress}
          type="text"
        />
      </div>
      <StandardButton
        isDisabled={!isAmountValid || !isRecieverValid}
        handleClick={sendTokens}
        prompt={sendMesasge}
      />
    </div>
  );
};

export default SendBox;
