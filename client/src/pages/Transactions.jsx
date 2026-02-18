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
import { Card } from "../components/ui/card";
import { Skeleton } from "../components/ui/skeleton";
import { useAuthContext } from "../hooks/useAuthContext";
import { ShoppingBag , Package} from "lucide-react";
import { Link } from "react-router-dom";
const History = () => {
  const { user } = useAuthContext();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get(
          import.meta.env.VITE_REACT_BACKEND_URL+"/history/get-history",
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        setError(null);
        setHistory(response.data.history);
      } catch (error) {
        console.error("Error fetching history:", error);
        setError("An error occurred while fetching history");
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  return (
    <Card className="p-4 m-3 bg-background rounded-lg overflow-hidden flex-1">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 py-6 p-3 border-b border-border">
        <ShoppingBag className="text-primary " /> Purchase History
      </h2>
      {loading ? (
        <Skeleton className="h-20 w-full bg-gray-300" />
      ) : history ? (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted">
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>Price</TableHead>
                <TableHead> Seller ID</TableHead>
                <TableHead> Purchase Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>{record.item_name}</TableCell>
                  <TableCell>${record.final_price}</TableCell>
                  <TableCell>{record.seller_id}</TableCell>
                  <TableCell>{record.purchase_date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-10 bg-muted/30 rounded-lg flex-1">
              <Package className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-center mb-4">You haven&apos;t purchased any items yet.</p>
              <Link to={'/dashboard'} className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors">
                Browse Auctions
              </Link>
            </div>
      )}
      {error && <p className="text-red-500">{error}</p>}
    </Card>
  );
};

export default History;
