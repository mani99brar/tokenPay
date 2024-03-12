import Web3Provider from "@/components/Web3Provider";
import NavBar from "@/components/NavBar";
import { store } from "@/store";
import { Provider } from "react-redux";
import Dashboard from "@/components/Dashboard";

export default function Home() {
  return (
    <Provider store={store}>
      <Web3Provider>
        <main className="w-full flex flex-col items-center mainBg h-full">
          <NavBar />
          <Dashboard />
        </main>
      </Web3Provider>
    </Provider>
  );
}
