// Desc: Reusable TransactionDetails component that displays transaction details
import { useAccount } from "wagmi";
import { faLink } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
interface TransactionDetailsProps {
  symbol: string;
  amount: string;
  sender: string;
  receiver: string;
  date?: number;
  hash: string;
}

const TransactionDetails = ({
  symbol,
  amount,
  sender,
  receiver,
  date,
  hash,
}: TransactionDetailsProps) => {
  const { chain, address } = useAccount();
  return (
    <div className="space-y-2 w-full">
      <a
        href={chain?.blockExplorers?.default.url + "/tx/" + hash}
        className="underline underline-offset-4 text-xl font-bold mb-2"
        target="_blank"
        rel="noopener noreferrer"
      >
        Transaction
        <FontAwesomeIcon icon={faLink} className="ml-2" />
      </a>
      <p>
        Token: <span className="font-bold">{symbol}</span>
      </p>
      <p>
        Amount: <span className="font-bold">{amount}</span>
      </p>
      <p>
        Sender: <span className="font-bold">{sender}</span>
      </p>
      <p>
        Receiver: <span className="font-bold">{receiver}</span>
      </p>
      {date && (
        <p>
          Date:{" "}
          <span className="font-bold">
            {new Date(date * 1000).toLocaleString()}
          </span>
        </p>
      )}
    </div>
  );
};

export default TransactionDetails;
