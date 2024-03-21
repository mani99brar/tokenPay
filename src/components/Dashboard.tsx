import { useAccount } from "wagmi";
import SendBox from "@/components/SendBox";

const Dashboard = () => {
  const { isDisconnected, isConnected, isConnecting } = useAccount();
  return (
    <div className="height-custom w-full flex justify-center">
      {isDisconnected || isConnecting ? (
        <div className="text-6xl w-1/2 text-center mt-8 font-bold">
          Connect Wallet and start sending tokens.
        </div>
      ) : (
        isConnected && (
          <div className="mt-8 w-4/6 flex flex-col items-center space-y-4">
            <p className="text-4xl font-bold">Send tokens to addresses</p>
            <SendBox />
          </div>
        )
      )}
    </div>
  );
};

export default Dashboard;
