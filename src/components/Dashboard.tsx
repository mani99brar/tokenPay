import { useSelector, useDispatch } from "react-redux";
import { setTrnxHash } from "@/utils/updateState";
import { useAccount } from "wagmi";
import SendBox from "@/components/SendBox";
interface TrnxState {
  txHash: string;
}

interface RootState {
  trnx: TrnxState;
}

const Dashboard = () => {
  const { isDisconnected, isConnected } = useAccount();
  const trnx = useSelector((state: RootState) => state.trnx.txHash);

  console.log(trnx);
  const dispath = useDispatch();
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
