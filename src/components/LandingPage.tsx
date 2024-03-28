// Desc: Listen for messages from the background script and update the UI accordingly
// Loading the app after mount to avoid hydration issues
import { useState, useEffect } from "react";
import { useGlobalState } from "@/utils/StateContext";
import { getThemeColors } from "@/utils/helpers/commonHelpers";
import { listenForMessages } from "@/utils/helpers/browserChannel";
import { Message } from "@/types/localTypes";
import Dashboard from "@/components/Dashboard";
import NavBar from "@/components/layout/NavBar";

const LandingPage = () => {
  const { uiTheme, setAllUiTheme, setActiveTransaction } = useGlobalState();
  const [isMounted, setIsMounted] = useState(false);
  const [, , bgClass] = getThemeColors(uiTheme);
  useEffect(() => {
    setIsMounted(true);
    const stopListening = listenForMessages((data: Message) => {
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
