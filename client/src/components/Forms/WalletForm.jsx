/* eslint-disable react/prop-types */
import { useState } from "react";
import { PlusCircle, CircleX } from "lucide-react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useAuthContext } from "../../hooks/useAuthContext";
import { toast } from "sonner";
import Loader from "../utils/Loader";
import { useWalletContext } from "../../hooks/useWallet";
import axios from "axios";
import { useQueryClient, useMutation } from "@tanstack/react-query";

export default function WalletForm({ onWalletOpen }) {
  const { user } = useAuthContext();
  const [amount, setAmount] = useState("");
  const [error, setError] = useState(null);
  const queryClient = useQueryClient();
  const { wallet, refetch } = useWalletContext(); // Assuming wallet is fetched in a query

  const addMutation = useMutation({
    mutationFn: async (amount) => {
      const { data } = await axios.post(
        import.meta.env.VITE_REACT_BACKEND_URL+"/wallet/add-wallet",
        { amount: Number(amount) }, // Ensure amount is sent as a number
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      if (!data.success) {
        throw new Error(data.message || "Failed to add funds");
      }
      return data.new_balance;
    },
    onSuccess: (newBalance) => {
      queryClient.setQueryData(["wallet"], newBalance);
      refetch();
      toast.success("Funds added successfully!");
      onWalletOpen();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Something went wrong.");
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!amount || isNaN(amount) || amount <= 0) {
      setError("Please enter a valid amount.");
      return;
    }

    addMutation.mutate(amount);
  };

  return (
    <Card className="w-full max-w-md min-w-[350px] m-2 px-2 bg-background text-foreground rounded-lg shadow-md">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle className="text-2xl p-2">Wallet</CardTitle>
          <CardDescription className="pb-3 text-muted-foreground">
            Add funds to your bidding wallet
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && <p className="text-red-500">{error}</p>}

          {/* Current Balance */}
          <div className="bg-background/80 border-2 p-4 rounded-lg mb-4">
            <p className="text-sm text-foreground py-2">Current Balance</p>
            <p className="text-3xl font-bold text-foreground">${wallet || 0}</p>
          </div>

          {/* UPI ID Input */}
          <div className="space-y-2">
            <Label htmlFor="upi-id">UPI ID</Label>
            <Input
              id="upi-id"
              type="text"
              placeholder="Enter UPI ID"
              required
              className="bg-background/80 border-gray-700 text-foreground focus:ring-primary"
            />
          </div>

          {/* Amount Input */}
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              required
              className="bg-background/80 border-gray-700 text-foreground focus:ring-primary"
            />
          </div>
        </CardContent>

        {/* Buttons */}
        <CardFooter className="flex items-center justify-center gap-2 py-4">
          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 hover:cursor-pointer"
            disabled={addMutation.isLoading}
          >
            <span className="flex items-center gap-2 text-background">
              {addMutation.isLoading ? <Loader /> : <PlusCircle size={30} />}
              Add Funds
            </span>
          </Button>

          <Button
            onClick={onWalletOpen}
            className="w-full bg-background/80  border border-gray-600 text-foreground hover:opacity-[80%] hover:bg-background/80 hover:cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <CircleX size={30} />
              Cancel
            </span>
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
