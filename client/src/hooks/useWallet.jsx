/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useAuthContext } from "./useAuthContext";

const fetchWallet = async (user) => {
  if (!user?.token) throw new Error("No token provided");

  const { data } = await axios.get(import.meta.env.VITE_REACT_BACKEND_URL+"/wallet/get-wallet", {
    headers: { Authorization: `Bearer ${user.token}` },
  });

  if (!data.success)
    throw new Error(data.message || "Failed to fetch wallet data");
  return data.wallet;
};

export const useWalletContext = () => {
  const { user } = useAuthContext();

  const {
    data: wallet,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["wallet", user?.token], // Automatically re-fetches when token changes
    queryFn: () => fetchWallet(user),
    enabled: !!user?.token, // Fetch only when token exists
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    retry: 2, // Retry twice if API fails
  });

  return { wallet, isLoading, error, refetch };
};
