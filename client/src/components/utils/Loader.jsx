import { Bouncy } from "ldrs/react";
import "ldrs/react/Bouncy.css";

// Default values shown
const Loader = () => {
  return (
    <div className="flex-1 items-center justify-center flex">
      <Bouncy color="black" size={20} />
    </div>
  );
};

export default Loader;
