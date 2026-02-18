import { useState, useEffect } from "react";
// import { User, Mail, Phone, Home, Building, Globe } from "lucide-react";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useProfile } from "../../hooks/useProfile";
import { Button } from "../ui/button";
import { toast } from "sonner";
import axios from "axios";

const AddressForm = () => {
  const { user } = useAuthContext();
  const { profileData } = useProfile(user);

  // Form states
  const [formData, setFormData] = useState({
    full_name: "",
    address: "",
    phone: "",
    city: "",
    state: "",
    zip_code: "",
    country: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (profileData) {
      setFormData({
        full_name: profileData.full_name || "",
        address: profileData.address || "",
        phone: profileData.phone || "",
        city: profileData.city || "",
        state: profileData.state || "",
        zip_code: profileData.zip_code || "",
        country: profileData.country || "",
      });
    }
  }, [profileData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.address.trim() && !formData.phone.trim()) {
      toast.error("Please provide at least an address or phone number");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await axios.post(
        import.meta.env.VITE_REACT_BACKEND_URL+"/profile/update-at-checkout",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      toast.success(res.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid p-3 space-y-6 border-background my-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <Label htmlFor="full_name">Full Name</Label>
          <Input
            id="full_name"
            value={formData.full_name}
            onChange={handleChange}
            placeholder="Enter your full name"
          />
        </div>
        <div className="space-y-3">
          <Label>Email</Label>
          <Input value={user?.email || ""} readOnly disabled />
        </div>
      </div>
      <div className="space-y-3">
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Enter your phone number"
        />
      </div>
      <div className="space-y-3">
        <Label htmlFor="address">Street Address</Label>
        <Textarea
          id="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Enter your street address"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="City"
          />
        </div>
        <div className="space-y-3">
          <Label htmlFor="state">State/Province</Label>
          <Input
            id="state"
            value={formData.state}
            onChange={handleChange}
            placeholder="State/Province"
          />
        </div>
        <div className="space-y-3">
          <Label htmlFor="zip_code">ZIP/Postal Code</Label>
          <Input
            id="zip_code"
            value={formData.zip_code}
            onChange={handleChange}
            placeholder="ZIP/Postal Code"
          />
        </div>
      </div>
      <div className="space-y-3">
        <Label htmlFor="country">Country</Label>
        <Input
          id="country"
          value={formData.country}
          onChange={handleChange}
          placeholder="Country"
        />
      </div>
      <div>
        <Button
          className="w-full text-background"
          size="lg"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Save"}
        </Button>
      </div>
    </form>
  );
};

export default AddressForm;
