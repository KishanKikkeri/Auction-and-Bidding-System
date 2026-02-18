/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../components/ui/table";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card";
import { Skeleton } from "../components/ui/skeleton";
import { useAuthContext } from "../hooks/useAuthContext";
import { Badge } from "../components/ui/badge";
import { AlertCircle, Clock, DollarSign, Package } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";
const MyBids = () => {
  const { user } = useAuthContext();
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBids = async () => {
      try {
        const response = await axios.get(
          import.meta.env.VITE_REACT_BACKEND_URL+"/bids/get-bids",
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        setBids(response.data.bids);
      } catch (error) {
        console.error("Error fetching bids:", error);
        setError("Failed to load your bids. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (user?.token) {
      fetchBids();
    }
  }, [user]);

  // Format the bid time to a more readable format
  const formatBidTime = (timeString) => {
    try {
      const date = new Date(timeString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (e) {
      return timeString;
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full p-3">
      <Card className="flex-1 flex flex-col bg-background  border-0 m-0">
        <CardHeader className="bg-background/80 text-foreground  px-3">
          <CardTitle className="text-xl font-bold flex items-center py-6 px-3 border-b">
            <DollarSign className="mr-2 h-5 w-5" />
            My Bidding History
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5 flex-1 flex flex-col">
          {loading ? (
            <div className="space-y-4 flex-1">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          ) : error ? (
            <div className="flex items-center justify-center p-6 bg-red-50 text-red-700 rounded-lg flex-1">
              <AlertCircle className="mr-2 h-5 w-5" />
              <p>{error}</p>
            </div>
          ) : bids ? (
            <div className="overflow-x-auto flex-1">
              <Table>
                <TableHeader className="bg-muted">
                  <TableRow>
                    <TableHead className="font-bold text-accent">
                      Item
                    </TableHead>
                    <TableHead className="font-bold text-accent">
                      Bid Amount
                    </TableHead>
                    <TableHead className="font-bold text-accent">
                      Time
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bids.map((bid) => (
                    <TableRow
                      key={bid.id}
                      className="hover:bg-muted/50 transition-colors"
                    >
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          <Package className="h-4 w-4 mr-2 text-primary" />
                          {bid.item_name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="flex items-center text-secondary font-semibold">
                          <DollarSign className="h-4 w-4 mr-1" />
                          {bid.amount.toFixed(2)}
                        </span>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        <span className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {formatBidTime(bid.bid_time)}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-10 bg-muted/30 rounded-lg flex-1">
              <Package className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-center mb-4">
                You haven&apos;t placed any bids yet.
              </p>
              <Link
                to={"/dashboard"}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
              >
                Browse Auctions
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MyBids;
