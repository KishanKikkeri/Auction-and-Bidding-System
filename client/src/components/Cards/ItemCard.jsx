/* eslint-disable react/prop-types */
import PropTypes from "prop-types";
import { useState, useEffect, lazy, Suspense } from "react";
import axios from "axios";
import { DollarSign, Clock, ArrowRight, CircleCheckBig } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { getTimeRemaining } from "../../lib/getTimeRemaining";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { toast } from "sonner";
import { useItems } from "../../hooks/useItems";
import Loader from "../utils/Loader";

const API_URL = import.meta.env.VITE_REACT_BACKEND_URL+"/bids";
const LazyCheckout = lazy(() => import("../../components/Cards/CheckoutCard"));
const ItemCard = ({ item }) => {
  const [currentItem, setCurrentItem] = useState(item);
  const { refetch } = useItems();
  const [bidAmount, setBidAmount] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const fetchItemDetails = async () => {
    try {
      const response = await axios.get(`${API_URL}/item/${currentItem.id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setCurrentItem(response.data);
    } catch (error) {
      console.error("Error fetching item details:", error);
    }
  };

  useEffect(() => {
    // Poll every 5 seconds for real-time updates

    const interval = setInterval(fetchItemDetails, 2000);
    return () => clearInterval(interval);
  }, [currentItem.id]);

  const handleBidSubmit = async () => {
    setErrorMessage("");
    const amount = parseFloat(bidAmount);

    if (isNaN(amount) || amount <= currentItem.current_price) {
      setErrorMessage("Bid must be higher than the current price");
      return;
    }

    if (!user) {
      navigate("/login");
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/place_bid`,
        {
          item_id: currentItem.id,
          user_id: user.id,
          bid_amount: amount,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        setCurrentItem((prev) => ({
          ...prev,
          current_price: response.data.current_price,
        }));

        toast.success("Bid placed successfully!");

        // Close the dialog with a slight delay
        setTimeout(() => {
          setIsDialogOpen(false);
        }, 100);

        setBidAmount("");
        refetch();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to place bid");
    }
  };

  const timeRemaining = getTimeRemaining(currentItem.auction_end);
  const isEnded = timeRemaining === "Ended";

  return (
    <>
      <Card className="w-56 rounded-lg py-2 px-1 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-border bg-background">
        <div className="relative">
          <div className="h-40 overflow-hidden bg-muted">
            <img
              loading="lazy"
              src={currentItem.image_url || "/placeholder.svg"}
              alt={currentItem.title}
              className={`w-full rounded-md h-full px-2 ${
                isEnded ? "grayscale opacity-90" : "hover:brightness-105"
              }`}
            />
            <div className="absolute w-full inset-0 bg-gradient-to-t from-foreground/80 via-foreground/40 to-transparent " />
          </div>

          <div className="absolute top-[120px] left-3 bg-background/90 backdrop-blur-sm rounded-md px-2.5 py-1 flex items-center gap-1 shadow-sm">
            <DollarSign className="h-3.5 w-3.5 text-foreground" />
            <span className="font-semibold text-foreground text-sm">
              {currentItem.current_price}
            </span>
          </div>

          <div
            className={`absolute top-[120px] right-3 ${
              isEnded ? "bg-muted text-foreground" : "bg-primary"
            } text-background rounded-md px-2.5 py-1 text-sm flex items-center gap-1 shadow-sm`}
          >
            <Clock className="h-3.5 w-3.5" />
            <span>{timeRemaining}</span>
          </div>

          {}

          {isEnded && currentItem.winner && (
            <>
              {item.status !== "Order Placed" ? (
                <>
                  <div className="absolute top-1 w-full">
                    <Suspense fallback={<Loader />}>
                      <LazyCheckout item={item} />
                    </Suspense>
                  </div>
                </>
              ) : (
                <>
                  <div className="absolute  top-1 px-3 py-2 bg-secondary p-3 w-full text-white rounded-md text-sm flex items-center justify-center gap-2 shadow-md">
                    <Link to={`/delivery/${item.id}`}>Order placed</Link>
                    <CircleCheckBig className="h-4 w-4" />
                  </div>
                </>
              )}
            </>
          )}
        </div>

        <CardContent className="py-1 px-2">
          <h3 className="font-bold text-sm leading-tight mb-3 line-clamp-2 text-foreground">
            {currentItem.title}
          </h3>

          <div className="flex flex-col gap-2">
            <Button
              variant="outlined"
              className={`w-full text-sm py-1 h-9 ${
                isEnded
                  ? "bg-muted opacity-100 cursor-not-allowed"
                  : "bg-accent text-background opacity-100"
              }`}
              disabled={isEnded}
              onClick={() => setIsDialogOpen(!isDialogOpen)}
            >
              {isEnded ? "Auction Ended" : "Bid Now"}
            </Button>
            <Button
              variant="outline"
              className="w-full h-9 border-border text-foreground hover:bg-gray-200 flex items-center gap-1"
              onClick={() => navigate(`/item/${currentItem.id}`)}
            >
              <span>More Details</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Place a Bid</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 flex items-start flex-col gap-3 ">
            <div className="space-y-2 w-full">
              <Label>Current Price: ${currentItem.current_price}</Label>
              <br />
              <Label htmlFor="bidAmount">Bid Amount</Label>
              <Input
                className="w-full"
                id="bidAmount"
                type="number"
                min={currentItem.current_price + 1}
                step="1"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
              />
              {errorMessage && (
                <p className="text-sm text-red-500">{errorMessage}</p>
              )}
            </div>

            <Button
              className="w-full text-background"
              onClick={handleBidSubmit}
            >
              Submit Bid
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

ItemCard.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    image_url: PropTypes.string,
    current_price: PropTypes.number.isRequired,
    auction_end: PropTypes.string.isRequired,
    winner: PropTypes.string,
  }).isRequired,
};

export default ItemCard;
