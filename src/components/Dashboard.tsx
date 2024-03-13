import { useAccount } from "wagmi";
import SendBox from "@/components/SendBox";

const Dashboard = () => {
  const { isDisconnected, isConnected } = useAccount();
  return (
    <div className="height-custom w-full flex justify-center">
      {isDisconnected ? (
        <div className="text-4xl mt-8">Connect Wallet</div>
      ) : (
        isConnected && (
          <div className="mt-8 w-2/5 flex flex-col items-center space-y-4">
            <p className="text-4xl font-bold">Send tokens to addresses</p>
            <div className="w-full border-2 border-white rounded-lg">
              <SendBox />
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default Dashboard;
