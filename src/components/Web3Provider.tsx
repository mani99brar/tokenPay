import { WagmiProvider, createConfig, http } from "wagmi";
import {
  optimismSepolia,
  sepolia,
  polygonMumbai,
  baseGoerli,
} from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";

const walletConnectProjectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_ID;
const opSepoliaRpc = process.env.NEXT_PUBLIC_OP_SEPOLIA_RPC;
const polygonMumbaiRpc = process.env.NEXT_PUBLIC_MUMBAI_RPC;
const baseGoerliRpc = process.env.NEXT_PUBLIC_BASE_GOERLI_RPC;
const sepoliaRpc = process.env.NEXT_PUBLIC_SEPOLIA_RPC;
if (!walletConnectProjectId || !opSepoliaRpc) {
  throw new Error(
    "Environment variables for wallet connection are not properly set."
  );
}
const config = createConfig(
  getDefaultConfig({
    chains: [optimismSepolia, sepolia, polygonMumbai, baseGoerli],
    transports: {
      [optimismSepolia.id]: http(opSepoliaRpc),
      [sepolia.id]: http(sepoliaRpc),
      [polygonMumbai.id]: http(polygonMumbaiRpc),
      [baseGoerli.id]: http(baseGoerliRpc),
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
        <ConnectKitProvider>{children}</ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
export default Web3Provider;
