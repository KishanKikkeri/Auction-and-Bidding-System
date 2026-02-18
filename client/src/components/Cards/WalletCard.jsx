/* eslint-disable react/prop-types */

import { useWalletContext } from "../../hooks/useWallet";
import { Wallet, Plus } from "lucide-react";

const WalletCard = ({ onWalletOpen }) => {
  const { wallet, isLoading } = useWalletContext();

  return (
    <div className="flex justify-center gap-1 items-center bg-muted rounded-full py-1.5 pl-3 pr-1.5 border border-border">
      <Wallet size={16} className="text-foreground mr-2" />
      {isLoading ? (
        <span className="text-sm  font-medium text-foreground mr-2">...</span>
      ) : (
        <span className="text-sm font-medium text-foreground mr-2">
          ${wallet}
        </span>
      )}
      <button
        onClick={onWalletOpen}
        className="bg-accent hover:cursor-pointer text-background p-1.5 rounded-full hover:opacity-90 transition-opacity"
      >
        <Plus size={12} />
      </button>
    </div>
  );
};

export default WalletCard;
