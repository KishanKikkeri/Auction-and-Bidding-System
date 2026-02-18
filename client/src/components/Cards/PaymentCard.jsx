/* eslint-disable react/prop-types */
import { Card, CardContent } from "../ui/card";
import Separator from "../ui/separator";
import { Button } from "../ui/button";
import { AlertCircle } from "lucide-react";
const PaymentCard = ({ bidItem, onClick }) => {
  return (
    <>
      <div className="space-y-6">
        <Card className=" border ">
          <CardContent className="p-6 space-y-6">
            <div className="flex gap-4">
              <div className="h-20 w-20 rounded-md overflow-hidden bg-muted flex-shrink-0">
                <img
                  loading="lazy"
                  src={bidItem.image_url || "/placeholder.svg"}
                  alt={bidItem.name}
                  className="h-full w-full object-contain bg-white"
                />
              </div>

              <div className="flex-1 space-y-1">
                <h3 className="font-medium text-foreground">{bidItem.name}</h3>

                <p className="text-sm text-muted-foreground">
                  Seller: {bidItem.seller_name}
                </p>

                <p className="font-semibold text-primary">
                  ${bidItem.current_price}
                </p>
              </div>
            </div>

            <Separator className="bg-accent/20" />

            <div className="space-y-2">
              <div className="flex justify-between text-foreground">
                <span>Winning Bid</span>
                <span>${bidItem.current_price}</span>
              </div>
              <div className="flex justify-between text-foreground">
                <span>Shipping + Tax</span>
                <span>$20</span>
              </div>
            </div>

            <Separator className="bg-accent/20" />

            <div className="flex justify-between font-bold text-foreground">
              <span>Total</span>
              <span>${bidItem.current_price + 20}</span>
            </div>

            <div className="bg-secondary/10 border border-secondary/20 rounded-md p-3 text-sm flex gap-2">
              <AlertCircle className="h-5 w-5 text-secondary flex-shrink-0" />
              <p className="text-foreground">
                By completing this purchase, you agree to pay the applicable
                fees.
              </p>
            </div>

            <Button
              onClick={onClick}
              className="w-full bg-primary hover:bg-primary/90 text-white"
              size="lg"
            >
              Complete Purchase
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default PaymentCard;
