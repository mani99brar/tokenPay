import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Loader = () => {
  return (
    <div className="w-full flex spinner justify-center mt-16 text-8xl">
      <FontAwesomeIcon icon={faSpinner} />
    </div>
  );
};

export default Loader;
