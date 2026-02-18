import { useNavigate } from "react-router-dom";
import { useLogin } from "../../hooks/useLogin";
import { useSignup } from "../../hooks/useSignup";
import "../../styles/Form.css";
import { useState } from "react";
import Loader from "../utils/Loader";
import { toast } from "sonner";
import Logo from "../../assets/logo.jpg";

const Form = () => {
  // useState vars
  const [isSignUp, setIsSignUp] = useState(true);
  const [error, setError] = useState("");
  
  // hooks
  const { signup, isLoading: signUpIsLoading } = useSignup();
  const { login, isLoading: loginIsLoading } = useLogin();
  const navigate = useNavigate();
  
  // form vars
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  
  // event functions
  const handleSignUp = async (e) => {
    e.preventDefault();
    const jsonData = await signup(email, username, password);
    console.log(jsonData);
    if (jsonData.success) {
      toast.success(jsonData.message);
      navigate("/dashboard");
    } else {
      setError(jsonData.message);
    }
    setEmail("");
    setPassword("");
    setUsername("");
  };
  
  const handleLogin = async (e) => {
    e.preventDefault();
    const jsonData = await login(email, password);
    console.log(jsonData);
    if (jsonData.success) {
      toast.success(jsonData.message);
      navigate("/dashboard");
    } else {
      setError(jsonData.message);
    }
    setEmail("");
    setPassword("");
  };

  const renderForm = () => {
    if (isSignUp) {
      return (
        <form onSubmit={handleSignUp} className="flex flex-col items-center justify-center gap-3 px-6 py-5 w-full">
          <div className="flex items-center justify-center flex-col w-full gap-4 py-2">
            {/* Email */}
            <div className="form-group w-full">
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder=" "
                className="w-full border rounded-md py-2 px-3"
              />
              <label className="form-label">Email</label>
            </div>

            {/* Username */}
            <div className="form-group w-full">
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                type="text"
                placeholder=" "
                className="w-full border rounded-md py-2 px-3"
              />
              <label className="form-label">Username</label>
            </div>

            {/* Password */}
            <div className="form-group w-full">
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder=" "
                className="w-full border rounded-md py-2 px-3"
              />
              <label className="form-label">Password</label>
            </div>
          </div>
          
          <button className="my-2 bg-primary text-white w-full py-2 rounded-md hover:cursor-pointer flex items-center justify-center">
            {signUpIsLoading ? <Loader /> : "Sign Up"}
          </button>
          
          {error && <p className="text-center text-red-600 text-sm">{error}</p>}

          <div className="py-2 text-sm">
            Have an account?{" "}
            <span
              onClick={() => setIsSignUp(false)}
              className="text-accent cursor-pointer"
            >
              Login
            </span>
          </div>
        </form>
      );
    } else {
      return (
        <form onSubmit={handleLogin} className="flex flex-col items-center justify-center gap-3 px-6 py-5 w-full">
          <div className="flex items-center justify-center flex-col w-full gap-4 py-2">
            {/* Email */}
            <div className="form-group w-full">
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder=" "
                className="w-full border rounded-md py-2 px-3"
              />
              <label className="form-label">Email</label>
            </div>

            {/* Password */}
            <div className="form-group w-full">
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder=" "
                className="w-full border rounded-md py-2 px-3"
              />
              <label className="form-label">Password</label>
            </div>
          </div>
        
          
          <button className="my-2 bg-primary text-white w-full py-2 rounded-md hover:cursor-pointer flex items-center justify-center">
            {loginIsLoading ? <Loader /> : "Login"}
          </button>
          
          {error && <p className="text-center text-red-600 text-sm">{error}</p>}

          <div className="py-2 text-sm">
            No account?{" "}
            <span
              onClick={() => setIsSignUp(true)}
              className="text-accent cursor-pointer"
            >
              Sign up
            </span>
          </div>
        </form>
      );
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-[500px] w-full max-w-6xl mx-auto my-8 shadow-lg rounded-xl overflow-hidden">
      {/* Left side - Introduction */}
      <div className="bg-primary text-white gap-3 w-full md:w-1/2 p-8 flex flex-col justify-center items-center px-10 ">
        <div className="flex items-center mb-6 ">
          <img
            loading="lazy"
            className="w-12 h-12 object-contain rounded-full mr-3"
            src={Logo}
            alt="logo"
          />
          <h1 className="text-4xl font-bold">BidSnap</h1>
        </div>
        
        <h2 className="text-xl font-bold mb-4">Bid, Win, Receive</h2>
        
        <ul className="space-y-3 mb-6">
          <li className="flex items-center">
            <span className="mr-2">✓</span>
            Live auctions
          </li>
          <li className="flex items-center">
            <span className="mr-2">✓</span>
            Secure payments
          </li>
          <li className="flex items-center">
            <span className="mr-2">✓</span>
            Instant alerts
          </li>
        </ul>
      </div>

      {/* Right side - Form */}
      <div className="bg-white w-full md:w-1/2 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md flex flex-col items-center mb-6">
          <h2 className="text-2xl font-bold mb-2">{isSignUp ? "Join BidSnap" : "Welcome Back"}</h2>
          <p  className="text-foreground/80">{isSignUp ? "Create a new BidSnap account" : "Login to your BidSnap account"}</p>
        </div>
        <div className="w-full max-w-md">
          {renderForm()}
        </div>
      </div>
    </div>
  );
};

export default Form;