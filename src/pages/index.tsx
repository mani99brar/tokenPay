import Web3Provider from "@/components/Web3Provider";
import NavBar from "@/components/NavBar";
import { GlobalStateProvider } from "@/utils/StateContext";
import Dashboard from "@/components/Dashboard";
import { useState, useEffect } from "react";

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  return (
    <Web3Provider>
      <GlobalStateProvider>
        <main className="w-full flex flex-col items-center mainBg h-screen">
          <NavBar />
          {isMounted && <Dashboard />}
        </main>
      </GlobalStateProvider>
    </Web3Provider>
  );
}
