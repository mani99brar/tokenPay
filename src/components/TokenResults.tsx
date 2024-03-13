import ethereumTokens from "@/utils/tokenData.json"; // Adjust the path as necessary

const TokenResults = () => {
  const handleTokenSelect = (token: string) => {
    console.log(token);
  };
  return (
    <>
      <p className="text-[#8612F1] px-2">Popular tokens</p>
      <div className="w-full border-4 overflow-scroll text-[#8612F1] border-[#8612F1] rounded-lg p-4">
        <ul>
          {ethereumTokens.ethereumTokens.map((token) => (
            <li
              key={token.symbol}
              onClick={() => console.log(token)}
              className="mb-4 cursor-pointer"
            >
              <p className="font-semibold text-lg">{token.name} </p>
              <p>{token.symbol}</p>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};
export default TokenResults;
