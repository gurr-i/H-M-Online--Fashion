import React from "react";
import { Heart } from "lucide-react";
import { Product } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import useCart from "@/hooks/useCart";

interface ProductCardProps {
  product: Product;
  showDetails?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, showDetails = false }) => {
  const { toast } = useToast();
  const { addToCart } = useCart();
  
  const handleAddToWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast({
      title: "Added to wishlist",
      description: `${product.name} has been added to your wishlist.`,
    });
  };

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      quantity: 1,
      sessionId: "guest-session", // In a real app, this would be a real session ID
    });
    
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your shopping bag.`,
    });
  };

  return (
    <div className="product-card group cursor-pointer" onClick={handleAddToCart}>
      <div className="relative mb-4">
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className="w-full h-auto object-cover aspect-[3/4]"
        />
        <button 
          className="wishlist-icon absolute top-2 right-2 bg-white rounded-full p-1.5"
          onClick={handleAddToWishlist}
        >
          <Heart className="h-5 w-5" />
        </button>
      </div>
      
      {showDetails && (
        <>
          <h3 className="text-sm font-medium">{product.name}</h3>
          <p className="text-sm text-gray-600">₹ {product.price.toFixed(2)}</p>
        </>
      )}
    </div>
  );
};

export default ProductCard;
