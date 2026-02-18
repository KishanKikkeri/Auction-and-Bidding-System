import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import WalletForm from "../Forms/WalletForm";
import { useState, useEffect } from "react";
import ProfileCard from "../Cards/ProfileCard";
import { motion } from "framer-motion";
import Topbar from "./Tabbar";
const Layout = () => {
  const [isWallet, setIsWallet] = useState(false);
  const [isProfile, setIsProfile] = useState(false);
  const [isNavbar, setIsNavbar] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const onWalletOpen = async () => {
    setIsWallet(!isWallet);
  };
  const onProfileOpen = async () => {
    setIsProfile(!isProfile);
  };
  const onNavbarOpen = async () => {
    setIsNavbar(!isNavbar);
  };
  useEffect(() => {
    document.documentElement.addEventListener("touchstart", () => {
      setIsNavbar(false);
    });
  }, []);

  return (
    <main className="w-screen h-screen font-poppins flex bg-gray-200 overflow-auto">
      {isProfile && (
        <motion.div
          initial={{ opacity: 0, translateY: -20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute z-30 block right-1/12 top-1/12 p-3 m-3 min-w-[230px]  sm:translate-x-[140px]"
        >
          <ProfileCard onProfileOpen={onProfileOpen} />
        </motion.div>
      )}
      {isWallet && (
        /* z-index 20 */
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="absolute z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        >
          <WalletForm onWalletOpen={onWalletOpen} />
        </motion.div>
      )}
      {/* Sidebar (Navbar) */}
      <motion.div
        initial={{ x: -10, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className={`md:block ${
          isNavbar ? "absolute z-20" : "hidden"
        } md:static md:z-0`}
      >
        <Navbar onNavbarOpen={onNavbarOpen} />
      </motion.div>

      {/* Main Content Area */}
      <div
        className={`flex-1 min-w-0 h-screen flex flex-col  ${
          isWallet ? "opacity-80 " : "opacity-100"
        }`}
      >
        
          <Topbar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onWalletOpen={onWalletOpen}
            onProfileOpen={onProfileOpen}
            onNavbarOpen={onNavbarOpen}
          />
      

        {/* Page Content (Outlet) */}

        <Outlet context={{ searchQuery }} />
      </div>
    </main>
  );
};

export default Layout;
