import Web3Provider from "@/components/Web3Provider";
import { GlobalStateProvider } from "@/utils/StateContext";
import LandingPage from "@/components/LandingPage";


export default function Home() {
  return (
    <GlobalStateProvider>
      <Web3Provider>
        <LandingPage />
      </Web3Provider>
    </GlobalStateProvider>
  );
}
