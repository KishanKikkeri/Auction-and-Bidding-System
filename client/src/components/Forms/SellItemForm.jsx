/* eslint-disable react/prop-types */
import { toast } from "sonner";
import { useAuthContext } from "../../hooks/useAuthContext";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Camera } from "lucide-react";
import { useState } from "react";
import { uploadImage } from "../../lib/uploadImages";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Loader from "../utils/Loader";
const SellItemForm = ({ onSellFormOpen }) => {
  const { user } = useAuthContext();
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  const imageHandler = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file)); // Creates a temporary URL for preview
    }
  };

  const addItemMutation = useMutation({
    mutationFn: async (newItem) => {
      const { data } = await axios.post(
        import.meta.env.VITE_REACT_BACKEND_URL+"/items/add-item",
        newItem,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      if (!data.success) {
        throw new Error(data.message || "Failed to add item");
      }

      return data.item;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["sellItems"]);

      toast.success("Item listed successfully!");
      onSellFormOpen();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Something went wrong.");
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);

    const formData = new FormData(e.target);
    try {
      let uploadedImageUrl = "";
      if (imageFile) {
        uploadedImageUrl = await uploadImage(imageFile);
      }

      const newItem = {
        title: formData.get("title"),
        description: formData.get("description"),
        category: formData.get("category"),
        image_url: uploadedImageUrl,
        starting_price: parseFloat(formData.get("starting_price")),
        condition: formData.get("condition"),
        auction_end: formData.get("end_date"),
      };

      addItemMutation.mutate(newItem);
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      console.error(error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 bg-background rounded-lg shadow-md"
    >
      <h2 className="text-xl font-semibold text-foreground mb-4 pb-3">
        List an Item for Sale
      </h2>

      <div className="flex items-center justify-center w-full gap-6">
        <div className="relative flex items-center justify-center border rounded-lg h-[130px] w-[140px]">
          <Input
            type="file"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            required
            onChange={imageHandler}
          />
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-full object-contain rounded-lg"
            />
          ) : (
            <button className="z-10">
              <Camera />
            </button>
          )}
        </div>
        <div className="flex flex-col flex-wrap items-center justify-center gap-3 w-2/3">
          <div className="space-y-2 w-full">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              placeholder="e.g. MacBook Air M2"
              required
            />
          </div>

          <div className="space-y-2 w-full">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              name="description"
              placeholder="Describe your item..."
              required
              className="w-full border border-border rounded-md p-2 "
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6 justify-center flex-wrap py-6">
        <div className="flex items-center justify-center gap-3 w-full">
          <div className="w-full space-y-2">
            <Label htmlFor="starting_price">Starting Price ($)</Label>
            <Input
              id="starting_price"
              name="starting_price"
              type="number"
              required
              className="w-full border p-2"
              placeholder="$0.00"
            />
          </div>
          <div className="w-full space-y-2">
            <Label htmlFor="end_date">Auction End Date</Label>
            <Input
              id="end_date"
              name="end_date"
              type="date"
              required
              className="w-full border p-2"
            />
          </div>
        </div>

        <div className="w-full flex items-center justify-center gap-3">
          <div className="w-full space-y-2">
            <Label>Condition</Label>
            <select
              name="condition"
              className="w-full border h-[36px] rounded-lg px-3"
            >
              <option value="New">New</option>
              <option value="Used">Used</option>
            </select>
          </div>

          <div className="w-full space-y-2">
            <Label>Category</Label>
            <select
              name="category"
              className="w-full border h-[36px] rounded-lg px-3"
            >
              <option value="electronics">Electronics</option>
              <option value="clothing">Clothing</option>
              <option value="furniture">Furniture</option>
              <option value="books">Books</option>
              <option value="vehicles">Vehicles</option>
              <option value="home_appliances">Home Appliances</option>
              <option value="sports">Sports & Outdoors</option>
              <option value="toys">Toys & Games</option>
              <option value="beauty">Beauty & Personal Care</option>
              <option value="collectibles">Collectibles & Antiques</option>
              <option value="others">Others</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-3 w-full">
        <button
          type="submit"
          className="w-full mt-6 py-2 bg-accent text-background font-medium rounded-md hover:opacity-90"
        >
          {isLoading ? <Loader /> : " List Item"}
        </button>
        <button
          type="button"
          onClick={onSellFormOpen}
          className="w-full mt-6 py-2 bg-gray-200 text-foreground font-medium rounded-md hover:opacity-90"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default SellItemForm;
