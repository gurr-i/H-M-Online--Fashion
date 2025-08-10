import React from "react";
import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Product } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import useCart from "@/hooks/useCart";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { getQueryFn } from "@/lib/queryClient";
import ProductReviews from "@/components/reviews/ProductReviews";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ProductDetails: React.FC = () => {
  const params = useParams<{ id: string }>();
  const productId = parseInt(params?.id || "", 10);
  const [quantity, setQuantity] = useState(1);
  const { addToCart, isPending } = useCart();
  const { toast } = useToast();
  const { user } = useAuth();

  const { data: product, isLoading, error } = useQuery<Product>({
    queryKey: [`/api/products/${productId}`],
    queryFn: getQueryFn({ on401: "throw" }),
    enabled: !isNaN(productId),
  });

  // Debug logging
  console.log('ProductDetails Debug:', {
    productId,
    isNaN: isNaN(productId),
    queryEnabled: !isNaN(productId),
    isLoading,
    hasProduct: !!product,
    error: error?.message,
    queryKey: `/api/products/${productId}`
  });

  const handleAddToCart = async () => {
    try {
      // Generate session ID based on user or guest session
      const sessionId = user?.id ? `user-${user.id}` :
        localStorage.getItem('guest-session-id') ||
        `guest-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;

      if (!user?.id && !localStorage.getItem('guest-session-id')) {
        localStorage.setItem('guest-session-id', sessionId);
      }

      addToCart({
        productId,
        quantity,
        sessionId,
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

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Product</h1>
          <p className="text-gray-600 mb-2">Failed to load product details.</p>
          <p className="text-sm text-red-600 mb-6">{error.message}</p>
          <Link href="/search">
            <Button>Browse Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!isLoading && !product) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-6">The product you're looking for doesn't exist or has been removed.</p>
          <Link href="/search">
            <Button>Browse Products</Button>
          </Link>
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
          <p className="text-2xl font-medium">₹ {product.price ? product.price.toFixed(2) : 'N/A'}</p>
          
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

      {/* Product Details and Reviews Tabs */}
      <div className="mt-16">
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Product Details</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="mt-8">
            <div className="prose max-w-none">
              <h3 className="text-xl font-semibold mb-4">Product Information</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2">Description</h4>
                  <p className="text-gray-600">{product.description}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Details</h4>
                  <ul className="text-gray-600 space-y-1">
                    <li>Category: {product.category}</li>
                    <li>Subcategory: {product.subcategory}</li>
                    <li>Price: ${product.price ? product.price.toFixed(2) : 'N/A'}</li>
                    <li>Stock: {product.inStock ? 'In Stock' : 'Out of Stock'}</li>
                    {product.inventory && <li>Available: {product.inventory} items</li>}
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="mt-8">
            <ProductReviews productId={productId} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProductDetails;