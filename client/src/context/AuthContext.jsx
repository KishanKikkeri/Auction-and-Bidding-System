import { createContext, useReducer, useEffect } from "react";
import PropTypes from "prop-types";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      localStorage.setItem("user", JSON.stringify(action.payload)); 
      return { user: action.payload };
    case "LOGOUT":
      localStorage.removeItem("user"); 
      return { user: null };
    default:
      return state;
  }
};

const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, { user: null });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      dispatch({ type: "LOGIN", payload: storedUser });
    }
  }, []);

  

  return (
    <AuthContext.Provider value={{ user: state.user, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthContextProvider;
