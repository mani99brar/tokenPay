import Web3Provider from "@/components/Web3Provider";
import { GlobalStateProvider } from "@/utils/StateContext";
import LandingPage from "@/components/LandingPage";

export default function Home() {
  return (
    <Web3Provider>
      <GlobalStateProvider>
        <LandingPage />
      </GlobalStateProvider>
    </Web3Provider>
  );
}
