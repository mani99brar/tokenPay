// Web3Provider is a custom component that wraps the entire application with the necessary
// context providers for the wagmi and connectkit libraries.
import { WagmiProvider, createConfig, http } from "wagmi";
import { sepolia, mainnet } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";

const walletConnectProjectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_ID;
const sepoliaRpc = process.env.NEXT_PUBLIC_SEPOLIA_RPC;
const ethRpc = process.env.NEXT_PUBLIC_ETH_RPC;
if (!walletConnectProjectId || !ethRpc || !sepoliaRpc) {
  throw new Error(
    "Environment variables for wallet connection are not properly set."
  );
}
const config = createConfig(
  getDefaultConfig({
    chains: [mainnet, sepolia],
    transports: {
      [sepolia.id]: http(sepoliaRpc),
      [mainnet.id]: http(ethRpc),
    },
    walletConnectProjectId,
    appName: "RPS",
  })
);

const queryClient = new QueryClient();
interface Web3ProviderProps {
  children: React.ReactNode;
}

const Web3Provider: React.FC<Web3ProviderProps> = ({ children }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider theme="retro">{children}</ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
export default Web3Provider;
