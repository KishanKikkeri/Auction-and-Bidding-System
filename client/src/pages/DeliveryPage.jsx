/* eslint-disable react/prop-types */

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { format, addDays } from "date-fns";
import {
  Package,
  Truck,
  CheckCircle,
  MapPin,
  ArrowLeft,
  Calendar,
  DollarSign,
  ShoppingBag,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import Separator from "../components/ui/separator";
import { useAuthContext } from "../hooks/useAuthContext";
import axios from "axios";
import { toast } from "sonner";
import { useProfile } from "../hooks/useProfile";

export default function DeliveryPage() {
  const { id } = useParams();
  console.log("Received id from useParams:", id);
  const [item, setItem] = useState(null);
  const { user } = useAuthContext();
  const { profileData } = useProfile(user);
  const [deliveryDates, setDeliveryDates] = useState({
    ordered: null,
    dispatched: null,
    outForDelivery: null,
    delivered: null,
  });
  useEffect(() => {
    if (!id || !user?.token) return; // Ensure both id and token are present

    const fetchItem = async () => {
      try {
        const response = await axios.get(
          import.meta.env.VITE_REACT_BACKEND_URL+`/items/get-item/${id}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        if (!response.data.success) {
          toast.error(response.data.message);
          return;
        }
        setItem(response.data.item);

        // Generate delivery dates

        const orderedDate = new Date();
        const dispatchedDate = addDays(
          orderedDate,
          Math.floor(Math.random() * 2 + 1)
        );
        const outForDeliveryDate = addDays(
          dispatchedDate,
          Math.floor(Math.random() * 2 + 1)
        );
        const deliveredDate = addDays(outForDeliveryDate, 1);

        setDeliveryDates({
          ordered: orderedDate,
          dispatched: dispatchedDate,
          outForDelivery: outForDeliveryDate,
          delivered: deliveredDate,
        });
      } catch (error) {
        console.error("Error fetching item:", error);
        toast.error("Failed to fetch item details.");
      }
    };

    fetchItem();
  }, [id, user?.token]);

  const formatDate = (date) => {
    return format(date, "MMM dd, yyyy");
  };

  const isDelivered = new Date() > deliveryDates.delivered;
  if (!item) {
    return <p>No details found</p>;
  }
  return (
    <div className="flex-1  bg-background p-3 m-3 rounded-lg overflow-hidden">
      <div className="overflow-y-auto scroll-auto h-full">
        <div className="container  mx-auto px-4 py-8 w-full">
          <div>
          <Link to={"/dashboard"} className="mb-6 px-6 flex items-center gap-2 py-3  rounded-lg text-foreground underline">
            <ArrowLeft size={16} />
            Back to Home
          </Link>

          </div>
          <div className="flex flex-col gap-8">
            {/* Delivery Status Header */}
            <div className="text-center ">
              <Badge
                className={`px-4 py-1 text-sm text-background ${
                  isDelivered ? "bg-secondary" : "bg-primary"
                }`}
              >
                {isDelivered ? "Delivered" : "In Transit"}
              </Badge>
              <h1 className="text-3xl font-bold mt-2 text-text">
                Order #{item.id}
              </h1>
              <p className="text-muted-foreground">
                {isDelivered
                  ? `Delivered on ${formatDate(deliveryDates.delivered)}`
                  : `Estimated delivery by ${formatDate(
                      deliveryDates.delivered
                    )}`}
              </p>
            </div>

            {/* Item Details */}
            {item && (
              <Card className=" shadow-sm border rounded-lg">
                <CardHeader>
                  <CardTitle className="text-lg">Item Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-shrink-0">
                      <img
                        src={item.image_url || "/placeholder.svg"}
                        alt={item.title}
                        className="w-full md:w-[200px] h-auto rounded-md object-cover"
                      />
                    </div>
                    <div className="flex flex-col justify-between">
                      <div>
                        <h3 className="text-xl font-semibold">{item.title}</h3>
                        <p className="text-muted-foreground mt-1">
                          {item.description}
                        </p>
                      </div>
                      <div className="mt-4 md:mt-0">
                        <div className="flex items-center gap-2">
                          <DollarSign size={18} className="text-primary" />
                          <span className="text-xl font-bold">
                            {item.current_price}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <ShoppingBag
                            size={16}
                            className="text-muted-foreground"
                          />
                          <span className="text-sm text-muted-foreground">
                            Order ID: {item.id}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            {/* Delivery Timeline */}
            <Card className="border rounded-lg shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Delivery Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <TimelineItem
                    icon={<ShoppingBag size={20} />}
                    title="Order Placed"
                    date={formatDate(deliveryDates.ordered)} // Fix: Format the date
                    isCompleted={true}
                  />
                  <TimelineItem
                    icon={<Package size={20} />}
                    title="Order Dispatched"
                    date={formatDate(deliveryDates.dispatched)} // Fix: Format the date
                    isCompleted={new Date() > deliveryDates.dispatched}
                  />
                  <TimelineItem
                    icon={<Truck size={20} />}
                    title="Out for Delivery"
                    date={formatDate(deliveryDates.outForDelivery)} // Fix: Format the date
                    isCompleted={new Date() > deliveryDates.outForDelivery}
                  />
                  <TimelineItem
                    icon={<CheckCircle size={20} />}
                    title="Delivered"
                    date={formatDate(deliveryDates.delivered)} // Fix: Format the date
                    isCompleted={isDelivered}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Delivery Address */}
            <Card className="border rounded-lg shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Delivery Address</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-4">
                  <MapPin
                    size={24}
                    className="text-primary mt-1 flex-shrink-0"
                  />
                  <div>
                    <h3 className="font-semibold">{profileData.full_name}</h3>
                    <p className="text-muted-foreground">
                      {profileData.address}
                    </p>
                    <p className="text-muted-foreground">
                      {profileData.city}, {profileData.state}{" "}
                      {profileData.zipCode}
                    </p>
                    <Separator className="my-3" />
                    <div className="flex flex-col gap-1">
                      <p className="text-sm">
                        <span className="font-medium">Email:</span>{" "}
                        {profileData.email}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Phone:</span>{" "}
                        {profileData.phone}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

// Timeline component
function TimelineItem({ icon, title, date, isCompleted }) {
  return (
    <div className="flex items-start gap-4">
      <div
        className={`rounded-full p-2 ${
          isCompleted
            ? "bg-secondary/20 text-secondary"
            : "bg-muted text-muted-foreground"
        }`}
      >
        {icon}
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-center">
          <h4
            className={`font-medium ${
              isCompleted ? "text-text" : "text-muted-foreground"
            }`}
          >
            {title}
          </h4>
          <div className="flex items-center gap-1">
            <Calendar size={14} className="text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{date}</span>
          </div>
        </div>
        {isCompleted && (
          <p className="text-xs text-secondary mt-1">Completed</p>
        )}
      </div>
    </div>
  );
}
