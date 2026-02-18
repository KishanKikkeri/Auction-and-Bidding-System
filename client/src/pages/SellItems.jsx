import { useState } from "react";
import SellItemForm from "../components/Forms/SellItemForm";
import { ShoppingBag, Package } from "lucide-react";
import { motion } from "framer-motion";
import ListedItemCard from "../components/Cards/ListedItemCard";
import { useAuthContext } from "../hooks/useAuthContext";
import { useSellItems } from "../hooks/useSellItems";
import { SkeletonCard } from "../components/utils/SkeletonCard";
import DeleteConfirmationDialog from "../components/modals/DialogBox";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

const SellItems = () => {
  const { user } = useAuthContext();
  const [isSellFormOpen, setIsFormOpen] = useState(false);
  const { items, isLoading, error } = useSellItems();
  const queryClient = useQueryClient();

  // Modal state
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const onSellFormOpen = () => {
    setIsFormOpen(!isSellFormOpen);
  };

  // ✅ Delete mutation with React Query & Axios
  const deleteMutation = useMutation({
    mutationFn: async (itemId) => {
      const { data } = await axios.delete(
        import.meta.env.VITE_REACT_BACKEND_URL+`/items/delete-item/${itemId}`,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      if (!data.success) {
        throw new Error(data.message || "Failed to delete item");
      }

      return itemId; // Return the deleted item ID
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["sellItems"]);
      toast.success("Item deleted successfully!");
    },
    onError: () => {
      toast.error("Failed to delete item.");
    },
    // onSettled ensures that the query refetches if needed
  });

  const handleDeleteItem = () => {
    if (!selectedItem) return;
    deleteMutation.mutate(selectedItem.id);
    setDeleteModalOpen(false);
  };

  const onModalAction = () => {
    setDeleteModalOpen(!isDeleteModalOpen);
  };

  return (
    <>
      {isSellFormOpen && (
        <motion.section
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="left-1/2 top-1/2 mt-7 -translate-x-1/2 -translate-y-1/2 z-30 absolute max-w-lg w-full m-3"
        >
          <SellItemForm onSellFormOpen={onSellFormOpen} />
        </motion.section>
      )}
      {isDeleteModalOpen && (
        <DeleteConfirmationDialog
          isOpen={isDeleteModalOpen}
          onClose={onModalAction}
          onConfirm={handleDeleteItem}
        />
      )}

      <main className="flex-1 flex flex-col rounded-lg bg-background p-6 m-3 overflow-hidden">
        <header className="flex items-center justify-between p-3 w-full border-b">
          <h3 className="text-2xl font-semibold ">Place an Item for Auction</h3>
          <button
            className="px-3 py-2 bg-accent rounded-lg text-background hover:opacity-90 hover:cursor-pointer"
            onClick={onSellFormOpen}
          >
            <span className="flex items-center justify-center gap-3">
              <ShoppingBag size={18} />
              Sell an item
            </span>
          </button>
        </header>

        <section>
          <div className="w-full p-6">
            <p className="text-center text-lg font-medium p-3">
              Your Auction Listed Items
            </p>
          </div>
          <div className="flex flex-1 gap-3 flex-wrap w-full overflow-hidden">
            {isLoading && (
              <div className="outer h-[500px] px-3 py-3 w-full">
                <div className="inner grid sm:grid-cols-2 lg:grid-cols-3   xl:grid-cols-4 gap-4 place-items-center py-6">
                  <SkeletonCard />
                  <SkeletonCard />
                  <SkeletonCard />
                  <SkeletonCard />
                  <SkeletonCard />
                  <SkeletonCard />
                  <SkeletonCard />
                  <SkeletonCard />
                </div>
              </div>
            )}

            <div className="max-h-[400px] overflow-y-auto w-full">
              {items && (
                <div className="flex flex-wrap justify-center place-items-center gap-8">
                  {items.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{
                        delay: index * 0.1,
                        duration: 0.4,
                        ease: "easeOut",
                      }}
                      viewport={{ once: true }}
                    >
                      <ListedItemCard
                        item={item}
                        onDelete={() => {
                          setSelectedItem(item);
                          setDeleteModalOpen(true);
                        }}
                      />
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
            {error && (
              <div className="flex flex-col items-center justify-center p-10 bg-muted/30 rounded-lg flex-1">
                <Package className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground text-center mb-4">
                  You haven&apos;t sold any items yet.
                </p>
                <button
                  className="px-3 py-2 bg-accent rounded-lg text-background hover:opacity-90 hover:cursor-pointer"
                  onClick={onSellFormOpen}
                >
                  <span className="flex items-center justify-center gap-3">
                    <ShoppingBag size={18} />
                    Sell an item
                  </span>
                </button>
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
};

export default SellItems;
