/* eslint-disable react/prop-types */
import { Trash } from "lucide-react";
import { Link } from "react-router-dom";

const ListedItemCard = ({ item , onDelete}) => {
  return (
    <div className="border rounded-lg p-4 bg-muted shadow-sm flex flex-col gap-2">
      <img
      loading="lazy"
        src={item.image_url}
        alt="Item Image"
        className="w-full h-36 object-contain rounded-md mb-3 bg-white"
      />
      <h3 className="text-lg font-semibold">{item.title}</h3>
      <p className="text-sm text-foreground">
        Start price: ${item.starting_price}
      </p>
      <p className="text-sm text-foreground">
        Current Price: ${item.current_price}
      </p>
      <p className="text-sm text-foreground/80">Status: {item.status}</p>
      <p className="text-sm text-foreground/80">
        Auction Ends: {item.auction_end}
      </p>
      <div className="w-full flex items-center justify-center gap-3">
        <Link
          to={`/item/${item.id}`}
          className="flex items-center justify-center w-full bg-primary text-background py-2 rounded-md"
        >
          View Details
        </Link>
        <span
          className="p-2 bg-background/80 rounded-md hover:cursor-pointer hover:bg-red-500 hover:text-white transition"
          onClick={onDelete}
        >
          <Trash />
        </span>
      </div>
    </div>
  );
};

export default ListedItemCard;
