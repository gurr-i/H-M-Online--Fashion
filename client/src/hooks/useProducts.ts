import { useQuery } from "@tanstack/react-query";
import { Product } from "@shared/schema";

export default function useProducts(category?: string, subcategory?: string) {
  const queryParams = new URLSearchParams();
  
  if (category) {
    queryParams.append("category", category);
  }
  
  if (subcategory) {
    queryParams.append("subcategory", subcategory);
  }
  
  const queryString = queryParams.toString() ? `?${queryParams.toString()}` : "";
  const endpoint = `/api/products${queryString}`;
  
  const { data, isLoading, error } = useQuery<Product[]>({
    queryKey: [endpoint],
  });
  
  return {
    products: data || [],
    isLoading,
    error,
  };
}
