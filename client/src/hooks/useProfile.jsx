import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchProfile = async (user) => {
  if (!user?.token) throw new Error("No token provided");

  const { data } = await axios.get(import.meta.env.VITE_REACT_BACKEND_URL+"/profile", {
    headers: { Authorization: `Bearer ${user.token}` },
  });

  if (!data.success) throw new Error(data.message || "Failed to load profile");
  return data.profile;
};

export const useProfile = (user) => {
  const { data: profileData, error, isLoading, refetch } = useQuery({
    queryKey: ["profile", user?.token], // Automatically re-fetches when token changes
    queryFn: () => fetchProfile(user),
    enabled: !!user?.token, // Fetch only if token exists
    staleTime: 5 * 60 * 1000, // Cache profile for 5 minutes
    retry: 2, // Retry twice if API fails
  });

  return { profileData, isLoading, error, refetch };
};
