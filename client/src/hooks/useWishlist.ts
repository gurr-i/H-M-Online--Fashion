import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { WishlistItemWithProduct, InsertWishlistItem } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

export default function useWishlist() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  // Get user's wishlist
  const { data: wishlistItems, isLoading } = useQuery<WishlistItemWithProduct[]>({
    queryKey: ["/api/wishlist", user?.id],
    queryFn: async () => {
      const res = await apiRequest("GET", `/api/wishlist`);
      return res.json();
    },
    enabled: !!user?.id,
  });

  // Add item to wishlist
  const addToWishlistMutation = useMutation({
    mutationFn: async (productId: number) => {
      const res = await apiRequest("POST", "/api/wishlist", { productId });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/wishlist"] });
      toast({
        title: "Added to wishlist",
        description: "Product has been added to your wishlist.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add product to wishlist.",
        variant: "destructive",
      });
    },
  });

  // Remove item from wishlist
  const removeFromWishlistMutation = useMutation({
    mutationFn: async (productId: number) => {
      const res = await apiRequest("DELETE", `/api/wishlist/${productId}`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/wishlist"] });
      toast({
        title: "Removed from wishlist",
        description: "Product has been removed from your wishlist.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to remove product from wishlist.",
        variant: "destructive",
      });
    },
  });

  // Check if product is in wishlist
  const isInWishlist = (productId: number): boolean => {
    return wishlistItems?.some(item => item.productId === productId) || false;
  };

  // Toggle wishlist status
  const toggleWishlist = (productId: number) => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to use the wishlist.",
        variant: "destructive",
      });
      return;
    }

    if (isInWishlist(productId)) {
      removeFromWishlistMutation.mutate(productId);
    } else {
      addToWishlistMutation.mutate(productId);
    }
  };

  return {
    wishlistItems: wishlistItems || [],
    isLoading,
    addToWishlist: addToWishlistMutation.mutate,
    removeFromWishlist: removeFromWishlistMutation.mutate,
    toggleWishlist,
    isInWishlist,
    isPending: addToWishlistMutation.isPending || removeFromWishlistMutation.isPending,
  };
}
