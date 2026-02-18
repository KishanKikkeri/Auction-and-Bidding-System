
import { cn } from "../../lib/utils";

// eslint-disable-next-line react/prop-types
const Separator = ({ className }) => {
  return <div className={cn("border-t border-border", className)} />;
};

export default Separator;
