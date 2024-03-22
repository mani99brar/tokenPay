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
          <div className="mt-8 md:w-3/5 sm:w-4/5 w-full px-4 sm:px-0 flex flex-col items-center space-y-4">
            <p className="sm:text-4xl text-2xl font-bold">
              Send tokens to addresses
            </p>
            <SendBox />
          </div>
        )
      )}
    </div>
  );
};

export default Dashboard;
