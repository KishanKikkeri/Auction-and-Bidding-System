import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useAuthContext } from "../hooks/useAuthContext";

const fetchSellItems = async (user) => {
  if (!user?.token) throw new Error("No token provided");

  const { data } = await axios.get(import.meta.env.VITE_REACT_BACKEND_URL+"/items/get-listed-items", {
    headers: { Authorization: `Bearer ${user.token}` },
  });

  if (!data.success) throw new Error(data.message || "Failed to fetch listed items");
  return data.items;
};

export const useSellItems = () => {
  const { user } = useAuthContext();
  
  const { data: items, isLoading, error, refetch } = useQuery({
    queryKey: ["sellItems", user?.token], // Caches and refetches when token changes
    queryFn: () => fetchSellItems(user),
    enabled: !!user?.token, // Fetch only if token exists
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    retry: 2, // Retry twice if API fails
  });
  //console.log("Sell Items Data:", items, isLoading, error);
  

  return { items, isLoading, error, refetch };
};
