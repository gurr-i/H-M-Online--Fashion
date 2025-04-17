import React from "react";
import useCart from "@/hooks/useCart";
import { Minus, Plus, Trash2, CreditCard, Receipt, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

const ShoppingBag: React.FC = () => {
  const { 
    cartItems, 
    isLoading, 
    cartTotal, 
    updateCartItem, 
    removeCartItem,
    isPending
  } = useCart();

  const isCartEmpty = !isLoading && (!cartItems || cartItems.length === 0);

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">SHOPPING BAG</h1>
        
        <Alert variant="destructive" className="bg-red-50 border-red-200 mb-8">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-sm">
            H&M NEVER SENDS PAYMENT LINKS VIA WHATSAPP, SMS OR EMAIL. PAY ONLY VIA H&M WEBSITE/APP OR AT DOORSTEP ON DELIVERY AND DISREGARD UNUSUAL PAYMENT REQUESTS.
          </AlertDescription>
        </Alert>
        
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-[100px] w-full" />
            <Skeleton className="h-[100px] w-full" />
            <Skeleton className="h-[100px] w-full" />
          </div>
        ) : isCartEmpty ? (
          <Card className="bg-white p-6 border border-gray-200 mb-8">
            <CardContent className="p-0">
              <p className="text-lg font-bold mb-4">YOUR SHOPPING BAG IS EMPTY!</p>
              <p className="text-sm mb-4">Sign in to save or access already saved items in your shopping bag.</p>
              <Button className="w-full py-3 border border-black mb-4 text-sm font-medium" variant="outline">
                SIGN IN
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="md:grid md:grid-cols-12 gap-8">
            <div className="md:col-span-8">
              {cartItems?.map((item) => (
                <div key={item.id} className="flex border-b border-gray-200 py-4">
                  <div className="w-24 h-24 flex-shrink-0">
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="ml-4 flex-grow">
                    <h3 className="font-medium">{item.product.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">₹ {item.product.price.toFixed(2)}</p>
                    <div className="flex items-center mt-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => updateCartItem(item.id, item.quantity - 1)}
                        disabled={isPending}
                      >
                        <Minus className="h-3 w-3" />
                        <span className="sr-only">Decrease quantity</span>
                      </Button>
                      <span className="mx-2 text-sm">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => updateCartItem(item.id, item.quantity + 1)}
                        disabled={isPending}
                      >
                        <Plus className="h-3 w-3" />
                        <span className="sr-only">Increase quantity</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-4"
                        onClick={() => removeCartItem(item.id)}
                        disabled={isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Remove item</span>
                      </Button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">₹ {(item.quantity * item.product.price).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="md:col-span-4 mt-8 md:mt-0">
              <div className="border border-gray-200 p-4">
                <div className="flex justify-between mb-4">
                  <h3 className="font-medium">DISCOUNTS</h3>
                  <button className="text-sm text-blue-700 font-medium">ADD</button>
                </div>
                
                <Separator className="my-4" />
                
                <div className="pt-4">
                  <div className="flex justify-between mb-4">
                    <h3 className="font-medium">TOTAL</h3>
                    <p className="font-medium">₹ {cartTotal.toFixed(2)}</p>
                  </div>
                  
                  <Button className="w-full bg-gray-200 py-3 text-sm font-medium mb-4 hover:bg-gray-300 text-black" variant="secondary">
                    CONTINUE TO CHECKOUT
                  </Button>
                  
                  <div className="flex justify-center space-x-2 mb-4">
                    <Receipt className="h-6 w-8" />
                    <CreditCard className="h-6 w-8" />
                  </div>
                  
                  <p className="text-xs text-gray-500 mb-4">Prices and delivery costs are not confirmed until you've reached the checkout.</p>
                  
                  <p className="text-xs text-gray-500 mb-4">30 days free returns. Read more about return and refund policy.</p>
                  
                  <button className="text-xs text-blue-700 font-medium">DELIVERY AND RETURN OPTIONS</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ShoppingBag;
