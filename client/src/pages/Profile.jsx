import { useEffect, useState } from "react";
import { Camera, Edit, Save, X } from "lucide-react";
import { useAuthContext } from "../hooks/useAuthContext";
import { useProfile } from "../hooks/useProfile";
import { motion } from "framer-motion";
import Loader from "../components/utils/Loader";
export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [authUser, setAuthUser] = useState(null);
  const { user } = useAuthContext();

  useEffect(() => {
    if (!user) {
      const u = localStorage.getItem("user");
      setAuthUser(u);
    }
  }, [user]);
  const { profileData, isLoading, error, setProfileData } = useProfile(
    user || authUser
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        import.meta.env.VITE_REACT_BACKEND_URL+"/profile/update-profile",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },

          body: JSON.stringify({
            email: user.email,
            address: profileData.address,
            phone: profileData.phone,
          }),
        }
      );

      const json = await response.json();
      if (!response.ok || !json.success)
        throw new Error(json.message || "Failed to update profile");

      setIsEditing(!isEditing);
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  if (isLoading)
    return (
      <div className="flex justify-center p-10">
        <Loader />
      </div>
    );
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <motion.div
      className="container mx-auto max-w-2xl p-3"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      <div className="bg-background shadow-lg rounded-xl overflow-hidden">
        {/* Profile Header */}
        <div className="relative h-48 bg-gradient-to-r from-primary to-accent">
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
            <div className="w-32 h-32 border-4 border-background rounded-full overflow-hidden">
              {profileData?.img ? (
                <img
                  src={profileData.img}
                  loading="lazy"
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <Camera className="text-foreground w-12 h-12" />
                </div>
              )}
            </div>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="absolute top-4 right-4 bg-background/80 p-2 rounded-full shadow hover:bg-background"
          >
            {isEditing ? (
              <X className="text-failure" />
            ) : (
              <Edit className="text-foreground" />
            )}
          </button>
        </div>

        {/* Profile Content */}
        <div className="pt-20 p-6">
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              {["address", "phone"].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-foreground capitalize">
                    {field}
                  </label>
                  <input
                    type={field === "phone" ? "tel" : "text"}
                    name={field}
                    value={profileData?.[field] || ""}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md p-2 border-border shadow-sm focus:border-primary focus:ring focus:ring-primary"
                  />
                </div>
              ))}
              <button
                type="submit"
                className="w-full py-2 px-4 rounded-md shadow-sm text-sm font-medium text-background bg-primary hover:bg-primary"
              >
                <span className="flex items-center justify-center gap-2">
                  <Save className="mr-2" /> Save Changes
                </span>
              </button>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-foreground">
                  {profileData?.username}
                </h2>
                <p className="text-foreground">{profileData?.email}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {["role", "wallet", "phone", "address"].map((field) => (
                  <div key={field} className="bg-muted p-4 rounded-lg">
                    <p className="text-sm text-foreground capitalize">
                      {field.replace("wallet", "Wallet Balance")}
                    </p>
                    <p className="font-semibold">
                      {field === "wallet"
                        ? `$${profileData?.wallet?.toFixed(2) || "0.00"}`
                        : profileData?.[field] || "Not provided"}
                    </p>
                  </div>
                ))}
              </div>
              <div className="text-center text-sm text-foreground mt-4">
                Joined:{" "}
                {profileData?.createdAt
                  ? new Date(profileData.createdAt).toLocaleDateString()
                  : "Unknown"}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
