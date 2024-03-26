import Dashboard from "@/components/Dashboard";
import { useState, useEffect } from "react";
import { useGlobalState } from "@/utils/StateContext";
import NavBar from "@/components/NavBar";
import { getThemeColors } from "@/utils/helpers/allHelpers";
import { listenForMessages } from "@/utils/helpers/browserChannel";
import { Message } from "@/types/localTypes";
import { readTrnxHistory } from "@/utils/localStorage/readAndWrite";
import { useAccount } from "wagmi";

const LandingPage = () => {
  const { uiTheme, setAllUiTheme, setActiveTransaction } = useGlobalState();
  const [isMounted, setIsMounted] = useState(false);
  const [, , bgClass] = getThemeColors(uiTheme);
  const { chainId } = useAccount();
  useEffect(() => {
    setIsMounted(true);
    const existingTransaction = readTrnxHistory(chainId);
    console.log(existingTransaction);
    const stopListening = listenForMessages((data: Message) => {
      console.log(data);
      if (data.type === "theme" && data.theme) setAllUiTheme(data.theme);
      else if (
        data.type === "transaction" &&
        data.hash &&
        data.isPending &&
        data.chainId
      )
        setActiveTransaction({
          hash: data.hash,
          isPending: data.isPending,
          chainId: data.chainId,
        });
    });
    return () => stopListening();
  }, []);
  return (
    <main
      className={`w-full flex flex-col items-center ${bgClass} min-h-screen`}
    >
      <NavBar />
      {isMounted && <Dashboard />}
    </main>
  );
};

export default LandingPage;
