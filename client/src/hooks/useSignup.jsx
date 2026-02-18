import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

export const useSignup = () => {
  const { dispatch } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);
  //const [error, setError] = useState(null);

  const signup = async (email, username, password) => {
    setIsLoading(true);
    //setError(null);

    try {
      const response = await fetch(import.meta.env.VITE_REACT_BACKEND_URL+"/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, username, password }),
      });

      // Check if the response is valid JSON
      let json;
      try {
        json = await response.json();
      } catch (error) {
        console.log(error);
        throw new Error("Invalid JSON response from server");
      }

      // If response.ok is false (server-side failure)
      if (!response.ok) {
        setIsLoading(false);
        return {
          success: false,
          message: json.message || "Something went wrong.",
        };
      }

      // If the server returns success=false (application-level error)
      if (!json.success) {
        setIsLoading(false);
        return json; // Returning full JSON with the error message
      }

      // Store user data in localStorage
      const userData = {
        token: json.token,
        email: json.email,
        username: json.username,
        wallet: json.wallet,
      };
      localStorage.setItem("user", JSON.stringify(userData));

      // Dispatch login action
      dispatch({ type: "LOGIN", payload: userData });

      setIsLoading(false);
      return json; // Return full JSON (including success message)
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      return {
        success: false,
        message: "Network error. Please try again later.",
      };
    }
  };
  return { signup, isLoading };
};
