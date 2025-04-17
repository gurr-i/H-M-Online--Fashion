import React from "react";
import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Product } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import useCart from "@/hooks/useCart";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const ProductDetails: React.FC = () => {
  const params = useParams<{ id: string }>();
  const productId = parseInt(params?.id || "", 10);
  const [quantity, setQuantity] = useState(1);
  const { addToCart, isPending } = useCart();
  const { toast } = useToast();

  const { data: product, isLoading } = useQuery<Product>({
    queryKey: ["/api/products", productId],
    enabled: !isNaN(productId),
  });

  const handleAddToCart = async () => {
    try {
      await addToCart({
        productId,
        quantity,
      });
      toast({
        title: "Added to cart",
        description: `${product?.name} has been added to your shopping bag.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Skeleton className="h-[600px] w-full" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold">Product not found</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="aspect-square overflow-hidden">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="space-y-6">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-2xl font-medium">₹ {product.price.toFixed(2)}</p>
          
          <div className="prose max-w-none">
            <p>{product.description}</p>
          </div>

          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="text-lg font-medium">{quantity}</span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setQuantity(quantity + 1)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <Button
            className="w-full py-6 text-lg font-medium"
            onClick={handleAddToCart}
            disabled={isPending}
          >
            ADD TO BAG
          </Button>

          <div className="space-y-4 text-sm">
            <p>Free standard delivery for Members when spending ₹1,999 or more</p>
            <p>Free & flexible 30 days return</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;