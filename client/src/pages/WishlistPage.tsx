import React from "react";
import { WishlistItemWithProduct } from "@shared/schema";
import useWishlist from "@/hooks/useWishlist";
import useCart from "@/hooks/useCart";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import { Link } from "wouter";

const WishlistPage: React.FC = () => {
  const { user } = useAuth();
  const { wishlistItems, isLoading, removeFromWishlist, isPending } = useWishlist();
  const { addToCart } = useCart();

  const handleAddToCart = (productId: number) => {
    const sessionId = user?.id ? `user-${user.id}` : 
      localStorage.getItem('guest-session-id') || 
      `guest-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
    
    if (!user?.id && !localStorage.getItem('guest-session-id')) {
      localStorage.setItem('guest-session-id', sessionId);
    }

    addToCart({
      productId,
      quantity: 1,
      sessionId,
    });
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-4">Please Sign In</h1>
          <p className="text-gray-600 mb-6">You need to be signed in to view your wishlist.</p>
          <Link href="/auth">
            <Button>Sign In</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
              <p className="text-gray-600 mt-2">
                {wishlistItems.length} item{wishlistItems.length !== 1 ? 's' : ''} saved
              </p>
            </div>
            <Heart className="h-8 w-8 text-red-500 fill-current" />
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <Skeleton className="aspect-square w-full mb-4" />
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2 mb-4" />
                    <Skeleton className="h-10 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && wishlistItems.length === 0 && (
            <div className="text-center py-16">
              <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Your wishlist is empty</h2>
              <p className="text-gray-600 mb-6">
                Save your favorite items to your wishlist and shop them later.
              </p>
              <Link href="/search">
                <Button>Start Shopping</Button>
              </Link>
            </div>
          )}

          {/* Wishlist Items */}
          {!isLoading && wishlistItems.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {wishlistItems.map((item) => (
                <Card key={item.id} className="group hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <div className="relative">
                      <Link href={`/products/${item.product.id}`}>
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          className="w-full aspect-square object-cover rounded-t-lg group-hover:opacity-90 transition-opacity"
                        />
                      </Link>
                      
                      {/* Remove from wishlist button */}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                        onClick={() => removeFromWishlist(item.productId)}
                        disabled={isPending}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>

                      {/* Stock status */}
                      {!item.product.inStock && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-t-lg">
                          <Badge variant="destructive">Out of Stock</Badge>
                        </div>
                      )}
                    </div>

                    <div className="p-4 space-y-3">
                      <Link href={`/products/${item.product.id}`}>
                        <h3 className="font-medium text-gray-900 hover:underline line-clamp-2">
                          {item.product.name}
                        </h3>
                      </Link>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-gray-900">
                          ${item.product.price ? item.product.price.toFixed(2) : 'N/A'}
                        </span>
                        {item.product.inventory && item.product.inventory < 10 && (
                          <Badge variant="secondary" className="text-xs">
                            Only {item.product.inventory} left
                          </Badge>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleAddToCart(item.productId)}
                          disabled={!item.product.inStock}
                          className="flex-1"
                          size="sm"
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Add to Cart
                        </Button>
                        
                        <Link href={`/products/${item.product.id}`}>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </Link>
                      </div>

                      <p className="text-xs text-gray-500">
                        Added {new Date(typeof item.createdAt === 'number' ? item.createdAt * 1000 : item.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Quick Actions */}
          {!isLoading && wishlistItems.length > 0 && (
            <div className="flex justify-center pt-8">
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    wishlistItems.forEach(item => {
                      if (item.product.inStock) {
                        handleAddToCart(item.productId);
                      }
                    });
                  }}
                >
                  Add All to Cart
                </Button>
                <Link href="/search">
                  <Button variant="outline">Continue Shopping</Button>
                </Link>
              </div>
            </div>
          )}
      </div>
    </div>
  );
};

export default WishlistPage;
