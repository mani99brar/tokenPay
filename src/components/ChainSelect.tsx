import { useGlobalState } from "@/utils/StateContext";
import { useSwitchChain, useAccount } from "wagmi";
import { getThemeColors } from "@/utils/helpers/allHelpers";

const ChainSelect = () => {
  const { chains, switchChain, isPending } = useSwitchChain();
  const { chainId } = useAccount();
  const { uiTheme } = useGlobalState();
  const [textColor, bgColor] = getThemeColors(uiTheme);
  return (
    <select
      style={{
        backgroundColor: bgColor,
        color: textColor,
        borderWidth: "4px",
        borderColor: textColor,
      }}
      className="w-full p-1 rounded-lg"
      name="chains"
      id="chain"
      onChange={(e) => switchChain({ chainId: parseInt(e.target.value) })}
      value={chainId}
    >
      {chains.map((chain) => (
        <option className="p-2" key={chain.id} value={chain.id}>
          {isPending ? "Confirm" : chain.name}
        </option>
      ))}
    </select>
  );
};

export default ChainSelect;
