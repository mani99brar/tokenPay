import Dashboard from "@/components/Dashboard";
import { useState, useEffect } from "react";
import { useGlobalState } from "@/utils/StateContext";
import NavBar from "@/components/NavBar";
import { getThemeColors } from "@/utils/helpers/commonHelpers";
import { listenForMessages } from "@/utils/helpers/browserChannel";
import { Message } from "@/types/localTypes";

const LandingPage = () => {
  const { uiTheme, setAllUiTheme, setActiveTransaction } = useGlobalState();
  const [isMounted, setIsMounted] = useState(false);
  const [, , bgClass] = getThemeColors(uiTheme);
  useEffect(() => {
    setIsMounted(true);
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
          hash: data.hash as `0x${string}`,
          isPending: data.isPending,
          chainId: data.chainId,
          isActive: true,
        });
    });
    return () => stopListening();
  }, []);
  return (
    <main
      className={`w-full flex flex-col items-center ${bgClass} min-h-screen`}
    >
      {isMounted && (
        <>
          <NavBar />
          <Dashboard />
        </>
      )}
    </main>
  );
};

export default LandingPage;
