import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useAuthContext } from "../hooks/useAuthContext";

const fetchItems = async (user) => {
  if (!user?.token) throw new Error("No token provided");

  const { data } = await axios.get(import.meta.env.VITE_REACT_BACKEND_URL+"/items/get-items", {
    headers: { Authorization: `Bearer ${user.token}` },
  });

  if (!data.success) throw new Error(data.message || "Failed to fetch items");
  return data.items || [];
};

export const useItems = () => {
  const { user } = useAuthContext();

  const { data: items, error, isLoading, refetch } = useQuery({
    queryKey: ["items", user?.token], // Caches & refetches when token changes
    queryFn: () => fetchItems(user),
    enabled: !!user?.token, // Fetch only when token exists
    staleTime: 5 * 60 * 1000, // Cache data for 5 minutes
    retry: 2, // Retry twice if API fails
  });

  return { items, isLoading, error, refetch };
};
