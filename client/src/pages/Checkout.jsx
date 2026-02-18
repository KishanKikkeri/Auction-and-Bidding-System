import { useAuthContext } from "../hooks/useAuthContext";
import { MapPin, ReceiptText } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../components/utils/Loader";
import AddressForm from "../components/Forms/AddressForm";
import { useWalletContext } from "../hooks/useWallet";
import axios from "axios";
import { toast } from "sonner";
import PaymentCard from "../components/Cards/PaymentCard";
const Checkout = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const { refetch } = useWalletContext();
  const handleClick = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        import.meta.env.VITE_REACT_BACKEND_URL+"/bids/complete-purchase",
        {
          item_id: item.id,
          current_price: item.current_price,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.data.success) {
        toast.error(response.data.message || "An error occured");
        return;
      }
      toast.success(response.data.message);
      await refetch();

      navigate(`/delivery/${item.id}`);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    const fetchItem = async () => {
      if (!user || !user.token) {
        setError("User not authenticated");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          import.meta.env.VITE_REACT_BACKEND_URL+`/items/get-item/${id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );

        const json = await response.json();

        if (!response.ok || json.success === false) {
          throw new Error(json.message || "Failed to fetch item");
        }

        setItem(json.item);
        console.log("item", json);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchItem();
  }, [id, user]);

  return (
    <div className="p-3 m-3 bg-background flex-1 rounded-lg overflow-hidden">
      <div className="overflow-y-auto h-full">
        <div className="p-3 m-3">
          <h1 className="font-semibold text-2xl text-foreground">Checkout</h1>
          <p className="py-2 text-foreground/70">
            Complete your purchase to secure your winning bid
          </p>
        </div>
        {isLoading && (
          <div className="flex-1 flex justify-center items-center">
            <Loader />
          </div>
        )}
        {error && (
          <div className="flex-1 flex justify-center items-center text-red-500">
            {error}
          </div>
        )}
        {item && !isLoading && (
          <div className="flex justify-center gap-3 px-3 mx-3 flex-wrap p-3 m-3">
            <div className="flex-3/5 flex flex-col justify-center gap-4">
              <header className="flex items-center justify-start gap-2">
                <MapPin />
                <p className="text-xl text-foreground font-semibold">
                  Shipping Information
                </p>
              </header>
              <AddressForm />
            </div>
            <div className="flex-1/4 flex flex-col justify-center gap-4">
              <header className="flex items-center justify-start gap-2 mb-8">
                <ReceiptText />
                <p className="text-xl text-foreground font-semibold">
                  Order Summary
                </p>
              </header>

              <PaymentCard bidItem={item} onClick={handleClick} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;
