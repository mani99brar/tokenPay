import Dashboard from "@/components/Dashboard";
import { useState, useEffect } from "react";
import { useGlobalState } from "@/utils/StateContext";
import NavBar from "@/components/NavBar";
import { getThemeColors } from "@/utils/helpers/allHelpers";

const LandingPage = () => {
  const { uiTheme } = useGlobalState();
  const [isMounted, setIsMounted] = useState(false);
  const [, , bgClass] = getThemeColors(uiTheme);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  return (
    <main className={`w-full flex flex-col items-center ${bgClass} h-screen`}>
      <NavBar />
      {isMounted && <Dashboard />}
    </main>
  );
};

export default LandingPage;
