import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

export const useLogin = () => {
  const { dispatch } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);
  //const [error, setError] = useState(null);

  const login = async (email, password) => {
    setIsLoading(true);
    //setError(null); // Reset previous error

    try {
      const response = await fetch(import.meta.env.VITE_REACT_BACKEND_URL+"/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      // Try to parse JSON response
      let json;
      try {
        json = await response.json();
      } catch (error) {
        console.log(error)
        throw new Error("Invalid JSON response from server");
      }

      // Handle server-side errors (like 500, 404)
      if (!response.ok) {
        setIsLoading(false);
        //setError(json.message || "Something went wrong.");
        return json; // Return full error response
      }

      // Handle application-level errors (e.g., wrong credentials)
      if (!json.success) {
        setIsLoading(false);
        //setError(json.message);
        return json;
      }

      // Store user data in localStorage
      const userData = {
        token: json.token,
        email: json.email,
        username: json.username,
        wallet:json.wallet
      };
      localStorage.setItem("user", JSON.stringify(userData));

      // Dispatch login action
      dispatch({ type: "LOGIN", payload: userData });

      setIsLoading(false);
      return json; // Return full success response
    } catch (error) {
      console.error("Login Error:", error);
      setIsLoading(false);
      //setError("Network error. Please try again later.");
      return { success: false, message: "Network error. Please try again later." };
    }
  };

  return { login, isLoading };
};
