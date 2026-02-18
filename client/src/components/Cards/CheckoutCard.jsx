/* eslint-disable react/prop-types */
import { Trophy, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
const CheckoutCard = ({ item }) => {
  return (
    <div className="absolute w-full px-3 py-2 bg-secondary text-white rounded-md text-sm flex items-center gap-2 shadow-md">
      <Trophy className="h-4 w-4" />
      <span>You Won</span>
      <div className="bg-white rounded-lg  p-1">
        <Link
          to={`/checkout/${item.id}`}
          className="flex text-foreground items-center justify-center gap-2 text-sm"
        >
          Checkout <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
};

export default CheckoutCard;
