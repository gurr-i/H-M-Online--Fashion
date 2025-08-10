import React from "react";
import { Heart, ShoppingCart } from "lucide-react";
import { Product } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import useCart from "@/hooks/useCart";
import useWishlist from "@/hooks/useWishlist";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";

interface ProductCardProps {
  product: Product;
  showDetails?: boolean;
  layout?: "vertical" | "horizontal";
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  showDetails = false,
  layout = "vertical"
}) => {
  const { toast } = useToast();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const handleAddToWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    toggleWishlist(product.id);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    const sessionId = user?.id ? `user-${user.id}` :
      localStorage.getItem('guest-session-id') ||
      `guest-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    if (!user?.id && !localStorage.getItem('guest-session-id')) {
      localStorage.setItem('guest-session-id', sessionId);
    }

    addToCart({
      productId: product.id,
      quantity: 1,
      sessionId,
    });

    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your shopping bag.`,
    });
  };

  if (layout === "horizontal") {
    return (
      <div className="product-card group border rounded-lg p-4 hover:shadow-md transition-shadow">
        <div className="flex gap-4">
          <Link href={`/products/${product.id}`} className="flex-shrink-0">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-32 h-40 object-cover rounded-md"
            />
          </Link>

          <div className="flex-1 space-y-2">
            <div className="flex justify-between items-start">
              <div>
                <Link href={`/products/${product.id}`}>
                  <h3 className="text-lg font-medium hover:underline">{product.name}</h3>
                </Link>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{product.description}</p>
              </div>
              <button
                className="wishlist-icon p-2 hover:bg-gray-100 rounded-full"
                onClick={handleAddToWishlist}
              >
                <Heart className="h-5 w-5" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xl font-bold">${product.price ? product.price.toFixed(2) : 'N/A'}</span>
              {!product.inStock && (
                <Badge variant="destructive">Out of Stock</Badge>
              )}
              {product.inStock && product.inventory && product.inventory < 10 && (
                <Badge variant="secondary">Only {product.inventory} left</Badge>
              )}
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="flex-1"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>
              <Link href={`/products/${product.id}`}>
                <Button variant="outline">View Details</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="product-card group">
      <Link href={`/products/${product.id}`} className="block">
        <div className="relative mb-4">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-auto object-cover aspect-[3/4] rounded-md group-hover:opacity-90 transition-opacity"
          />
          <button
            className={`wishlist-icon absolute top-2 right-2 bg-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity ${
              isInWishlist(product.id) ? 'text-red-500 fill-current' : 'text-gray-600'
            }`}
            onClick={handleAddToWishlist}
          >
            <Heart className="h-5 w-5" />
          </button>
          {!product.inStock && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-md">
              <Badge variant="destructive">Out of Stock</Badge>
            </div>
          )}
        </div>
      </Link>

      {showDetails && (
        <div className="space-y-2">
          <Link href={`/products/${product.id}`}>
            <h3 className="text-sm font-medium hover:underline line-clamp-2">{product.name}</h3>
          </Link>
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold">${product.price ? product.price.toFixed(2) : 'N/A'}</p>
            <Button
              size="sm"
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ShoppingCart className="h-4 w-4" />
            </Button>
          </div>
          {product.inStock && product.inventory && product.inventory < 10 && (
            <Badge variant="secondary" className="text-xs">
              Only {product.inventory} left
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductCard;
