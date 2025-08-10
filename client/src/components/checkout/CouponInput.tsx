import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Coupon } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tag, X, Percent, DollarSign } from "lucide-react";

interface CouponInputProps {
  appliedCoupon?: Coupon | null;
  onCouponApplied: (coupon: Coupon | null) => void;
  orderTotal: number;
}

const CouponInput: React.FC<CouponInputProps> = ({
  appliedCoupon,
  onCouponApplied,
  orderTotal,
}) => {
  const [couponCode, setCouponCode] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const applyCouponMutation = useMutation({
    mutationFn: async (code: string) => {
      const res = await apiRequest("POST", "/api/coupons/validate", { code, orderTotal });
      return res.json();
    },
    onSuccess: (coupon: Coupon) => {
      onCouponApplied(coupon);
      setCouponCode("");
      toast({
        title: "Coupon applied!",
        description: `${coupon.name} has been applied to your order.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Invalid coupon",
        description: error.message || "This coupon code is not valid or has expired.",
        variant: "destructive",
      });
    },
  });

  const removeCoupon = () => {
    onCouponApplied(null);
    toast({
      title: "Coupon removed",
      description: "The coupon has been removed from your order.",
    });
  };

  const calculateDiscount = (coupon: Coupon, total: number): number => {
    if (coupon.type === "percentage") {
      const discount = (total * coupon.value) / 100;
      return coupon.maximumDiscount 
        ? Math.min(discount, coupon.maximumDiscount) 
        : discount;
    } else {
      return Math.min(coupon.value, total);
    }
  };

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      toast({
        title: "Enter coupon code",
        description: "Please enter a coupon code to apply.",
        variant: "destructive",
      });
      return;
    }
    applyCouponMutation.mutate(couponCode.trim().toUpperCase());
  };

  return (
    <div className="space-y-4">
      {/* Applied Coupon Display */}
      {appliedCoupon && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-full">
                  {appliedCoupon.type === "percentage" ? (
                    <Percent className="h-4 w-4 text-green-600" />
                  ) : (
                    <DollarSign className="h-4 w-4 text-green-600" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-green-800">{appliedCoupon.name}</span>
                    <Badge variant="secondary" className="text-xs">
                      {appliedCoupon.code}
                    </Badge>
                  </div>
                  <p className="text-sm text-green-600">
                    {appliedCoupon.description}
                  </p>
                  <p className="text-sm font-medium text-green-800">
                    Discount: -${calculateDiscount(appliedCoupon, orderTotal).toFixed(2)}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={removeCoupon}
                className="text-green-600 hover:text-green-800"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Coupon Input */}
      {!appliedCoupon && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium">Have a coupon code?</span>
          </div>
          
          <div className="flex gap-2">
            <Input
              placeholder="Enter coupon code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              onKeyPress={(e) => e.key === "Enter" && handleApplyCoupon()}
              className="flex-1"
            />
            <Button
              onClick={handleApplyCoupon}
              disabled={applyCouponMutation.isPending || !couponCode.trim()}
              variant="outline"
            >
              {applyCouponMutation.isPending ? "Applying..." : "Apply"}
            </Button>
          </div>
          
          <p className="text-xs text-gray-500">
            Enter your coupon code to get a discount on your order
          </p>
        </div>
      )}
    </div>
  );
};

export default CouponInput;
