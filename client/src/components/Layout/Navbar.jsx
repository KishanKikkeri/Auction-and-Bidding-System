/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import Logo from "../../assets/logo.jpg";
import { Gavel, History, Home, Tag, User, ArrowLeft } from "lucide-react";

const Navbar = ({ onNavbarOpen }) => {
  
  return (
    <>
      <nav className="bg-sidebar text-sidebar-foreground flex min-h-screen max-h-screen items-start flex-col justify-between px-5 py-1 pb-3 gap-4 w-[200px]">
        <section className="flex flex-col items-start justify-start gap-5 w-full">
          {/* Logo & Title */}
          <header className="flex items-center justify-evenly py-3 min-w-full border-b w-full">
            <img
            loading="lazy"
              className="w-[35px] h-[35px] rounded-full"
              src={Logo}
              alt="logo"
            />
            <p className="text-xl font-semibold">BidSnap</p>
            <ArrowLeft className="block md:hidden" onClick={onNavbarOpen} />
          </header>

          {/* Navigation Links */}
          <div className="flex flex-col items-start justify-around gap-4 w-full py-6 font-poppins">
            <Link className="flex items-center gap-2" to={"/dashboard"}>
              <Home size={18} /> Home
            </Link>
            <Link className="flex items-center gap-2" to={"/my-bids"}>
              <Gavel size={18} /> My Bids
            </Link>
            <Link className="flex items-center gap-2" to={"/sell-items"}>
              <Tag size={18} /> Sell Items
            </Link>
            <Link className="flex items-center gap-2" to={"/history"}>
              <History size={18} /> History
            </Link>
            <Link className="flex items-center gap-2" to={"/profile"}>
              <User size={18} /> Profile
            </Link>
          </div>
        </section>

        {/* Logout Button */}
        <div className="flex w-full items-center justify-center pt-3 border-t ">
          <p>&copy; Bidsnap</p>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
