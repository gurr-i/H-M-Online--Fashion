import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CartItemWithProduct, InsertCartItem } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

// For simplicity, we're using a fixed session ID
// In a real app, this would come from authentication
const SESSION_ID = "guest-session";

export default function useCart() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const cartEndpoint = `/api/cart?sessionId=${SESSION_ID}`;

  // Fetch cart items
  const { data: cartItems, isLoading, error } = useQuery<CartItemWithProduct[]>({
    queryKey: [cartEndpoint],
  });

  // Calculate cart totals
  const cartTotal = cartItems?.reduce(
    (sum, item) => sum + item.quantity * item.product.price,
    0
  ) || 0;

  // Add item to cart
  const addToCartMutation = useMutation({
    mutationFn: async (item: InsertCartItem) => {
      const res = await apiRequest("POST", "/api/cart", item);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [cartEndpoint] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      });
    },
  });

  // Update cart item
  const updateCartItemMutation = useMutation({
    mutationFn: async ({ id, quantity }: { id: number; quantity: number }) => {
      const res = await apiRequest("PUT", `/api/cart/${id}`, { quantity });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [cartEndpoint] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update cart item",
        variant: "destructive",
      });
    },
  });

  // Remove cart item
  const removeCartItemMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/cart/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [cartEndpoint] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to remove item from cart",
        variant: "destructive",
      });
    },
  });

  // Clear cart
  const clearCartMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("DELETE", `/api/cart?sessionId=${SESSION_ID}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [cartEndpoint] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to clear cart",
        variant: "destructive",
      });
    },
  });

  return {
    cartItems,
    isLoading,
    error,
    cartTotal,
    addToCart: (item: InsertCartItem) => addToCartMutation.mutate(item),
    updateCartItem: (id: number, quantity: number) =>
      updateCartItemMutation.mutate({ id, quantity }),
    removeCartItem: (id: number) => removeCartItemMutation.mutate(id),
    clearCart: () => clearCartMutation.mutate(),
    isPending: 
      addToCartMutation.isPending || 
      updateCartItemMutation.isPending || 
      removeCartItemMutation.isPending || 
      clearCartMutation.isPending,
  };
}
