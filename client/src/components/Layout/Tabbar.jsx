/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { User, Menu } from "lucide-react";
import { Input } from "../ui/input";
//import WalletCard from "../Cards/WalletCard";
import WalletCard from "../Cards/WalletCard";
const Topbar = ({
  onWalletOpen,
  onProfileOpen,
  searchQuery,
  setSearchQuery,
  onNavbarOpen,
}) => {
  const [page, setPage] = useState("Home");
  const location = useLocation();
  useEffect(() => {
    const pageMap = {
      "my-bids": "My Bids",
      "sell-items": "Sell Items",
      history: "History",
      profile: "Profile",
      checkout: "Checkout",
      delivery: "Delivery",
      item: "Item Details",
    };

    const pageName = location.pathname?.split("/")[1];
    setPage(pageMap[pageName] || "Home");
  }, [location.pathname]);

  return (
    <div className="bg-background border border-border m-3 mb-0 rounded-lg px-3">
      <div className="flex items-center justify-between h-14">
        <div className="flex items-center justify-center gap-12 px-3">
          <div className="flex items-center justify-center gap-2 ">
            <div className="block md:hidden">
              <Menu onClick={onNavbarOpen} />
            </div>
            <h1 className="text-lg font-medium text-foreground">{page}</h1>
          </div>
          {page === "Home" && (
            <div className="hidden md:flex items-center justify-center gap-3">
              <Input
                type="search"
                className="max-w-[280px] min-w-[240px]"
                placeholder="Search for items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          )}
        </div>
        <div className="flex items-center space-x-4">
          <div className="hidden md:block">
            <WalletCard onWalletOpen={onWalletOpen} />
          </div>

          <button
            onClick={onProfileOpen}
            className="relative flex items-center justify-center w-9 h-9 bg-accent rounded-full hover:bg-accent/80 transition-colors hover:cursor-pointer"
          >
            <User size={18} className="text-background" />
            <span className="absolute top-0 right-0 block w-2.5 h-2.5 bg-failure border-2 border-background rounded-full"></span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
