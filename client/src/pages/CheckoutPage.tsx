import React, { useState } from "react";
import { useLocation, useRoute } from "wouter";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import useCart from "@/hooks/useCart";
import { getQueryFn, apiRequest } from "@/lib/queryClient";
import { CartItemWithProduct } from "@shared/schema";
import { ShoppingCart, CreditCard, Shield, AlertTriangle } from "lucide-react";

interface CheckoutData {
  shippingAddress: string;
  paymentMethod: string;
}

const CheckoutPage: React.FC = () => {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [checkoutData, setCheckoutData] = useState<CheckoutData>({
    shippingAddress: "",
    paymentMethod: "demo-card"
  });

  // Get cart items
  const { data: cartItems = [], refetch: refetchCart } = useQuery<CartItemWithProduct[]>({
    queryKey: ["/api/cart"],
    queryFn: getQueryFn({ on401: "throw" }),
    enabled: !!user,
  });

  // Calculate total
  const cartTotal = cartItems.reduce((sum, item) => 
    sum + (item.product.price || 0) * item.quantity, 0
  );

  // Checkout mutation
  const checkoutMutation = useMutation({
    mutationFn: async (data: CheckoutData) => {
      console.log('🛒 Starting checkout process...', data);
      try {
        const response = await apiRequest("POST", "/api/checkout", data);
        const result = await response.json();
        console.log('✅ Checkout successful:', result);
        return result;
      } catch (error) {
        console.error('❌ Checkout failed:', error);
        throw error;
      }
    },
    onSuccess: (order) => {
      toast({
        title: "Order Placed Successfully!",
        description: `Order #${order.id} has been created. You will receive a confirmation email shortly.`,
      });
      
      // Redirect to order confirmation
      setLocation(`/orders/${order.id}`);
      
      // Refetch cart to clear it
      refetchCart();
    },
    onError: (error: any) => {
      console.error('Checkout mutation error:', error);

      let errorMessage = "Failed to process your order. Please try again.";

      // Handle different types of errors
      if (error.message) {
        if (error.message.includes("<!DOCTYPE")) {
          errorMessage = "Server error: The server returned an HTML page instead of JSON. Please check if the server is running properly.";
        } else if (error.message.includes("401")) {
          errorMessage = "Authentication required. Please log in and try again.";
        } else if (error.message.includes("404")) {
          errorMessage = "Checkout endpoint not found. Please check server configuration.";
        } else {
          errorMessage = error.message;
        }
      }

      toast({
        variant: "destructive",
        title: "Checkout Failed",
        description: errorMessage,
      });
    },
  });

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication Required",
        description: "Please log in to complete your order.",
      });
      setLocation("/auth");
      return;
    }

    if (cartItems.length === 0) {
      toast({
        variant: "destructive",
        title: "Empty Cart",
        description: "Your cart is empty. Add some items before checking out.",
      });
      setLocation("/search");
      return;
    }

    if (!checkoutData.shippingAddress.trim()) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please provide a shipping address.",
      });
      return;
    }

    setIsProcessing(true);
    
    // Simulate processing delay
    setTimeout(() => {
      checkoutMutation.mutate(checkoutData);
      setIsProcessing(false);
    }, 2000);
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
          <p className="text-gray-600 mb-6">Please log in to continue with checkout.</p>
          <Button onClick={() => setLocation("/auth")}>Log In</Button>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <ShoppingCart className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-6">Add some items to your cart before checking out.</p>
          <Button onClick={() => setLocation("/search")}>Continue Shopping</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        
        {/* Demo Mode Warning */}
        <Card className="mb-6 border-orange-200 bg-orange-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              <div>
                <p className="font-medium text-orange-800">Demo Mode - No Real Payment</p>
                <p className="text-sm text-orange-700">
                  This is a demonstration checkout. No actual payment will be processed.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <div>
            <form onSubmit={handleCheckout} className="space-y-6">
              {/* Shipping Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Shipping Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="shippingAddress">Shipping Address *</Label>
                    <textarea
                      id="shippingAddress"
                      className="w-full mt-1 p-3 border border-gray-300 rounded-md resize-none"
                      rows={4}
                      placeholder="Enter your complete shipping address..."
                      value={checkoutData.shippingAddress}
                      onChange={(e) => setCheckoutData(prev => ({
                        ...prev,
                        shippingAddress: e.target.value
                      }))}
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Payment Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Payment Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="h-4 w-4 text-blue-600" />
                      <span className="font-medium text-blue-800">Demo Payment Method</span>
                    </div>
                    <p className="text-sm text-blue-700">
                      Using simulated payment processing. Order will be marked as paid automatically.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 opacity-50">
                    <div>
                      <Label>Card Number</Label>
                      <Input value="**** **** **** 1234" disabled />
                    </div>
                    <div>
                      <Label>Expiry</Label>
                      <Input value="12/25" disabled />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Place Order Button */}
              <Button 
                type="submit" 
                className="w-full py-3 text-lg"
                disabled={isProcessing || checkoutMutation.isPending}
              >
                {isProcessing ? "Processing..." : `Place Order - ₹${cartTotal.toFixed(2)}`}
              </Button>
            </form>
          </div>

          {/* Order Summary */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-center">
                    <div className="flex-1">
                      <p className="font-medium">{item.product.name}</p>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-medium">
                      ₹{item.product.price ? (item.product.price * item.quantity).toFixed(2) : 'N/A'}
                    </p>
                  </div>
                ))}
                
                <Separator />
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>₹0.00</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>₹{cartTotal.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
