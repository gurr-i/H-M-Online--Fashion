import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Product } from "@shared/schema";
import { getQueryFn } from "@/lib/queryClient";
import ProductSearch, { ProductFilters } from "@/components/products/ProductSearch";
import ProductGrid from "@/components/products/ProductGrid";

const SearchPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filters, setFilters] = useState<ProductFilters>({
    priceRange: [0, 10000],
    sortBy: "name",
    sortOrder: "asc",
  });

  const { data: allProducts, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
    queryFn: getQueryFn({ on401: "throw" }),
  });

  // Filter and sort products based on search term and filters
  const filteredProducts = useMemo(() => {
    if (!allProducts) return [];

    let filtered = allProducts.filter((product) => {
      // Text search
      const matchesSearch = !searchTerm || 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.subcategory.toLowerCase().includes(searchTerm.toLowerCase());

      // Category filter
      const matchesCategory = !filters.category || 
        product.category.toLowerCase() === filters.category.toLowerCase();

      // Subcategory filter
      const matchesSubcategory = !filters.subcategory || 
        product.subcategory.toLowerCase() === filters.subcategory.toLowerCase();

      // Price range filter
      const matchesPrice = product.price >= filters.priceRange[0] && 
        product.price <= filters.priceRange[1];

      // Stock filter
      const matchesStock = filters.inStock === undefined || 
        product.inStock === filters.inStock;

      return matchesSearch && matchesCategory && matchesSubcategory && 
             matchesPrice && matchesStock;
    });

    // Sort products
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (filters.sortBy) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "price":
          comparison = a.price - b.price;
          break;
        case "newest":
          comparison = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          break;
        case "oldest":
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        default:
          comparison = 0;
      }

      return filters.sortOrder === "desc" ? -comparison : comparison;
    });

    return filtered;
  }, [allProducts, searchTerm, filters]);

  return (
    <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Search Products</h1>
          <p className="text-gray-600">Find exactly what you're looking for</p>
        </div>

        <div className="space-y-6">
          {/* Search and Filter Controls */}
          <ProductSearch
            searchTerm={searchTerm}
            filters={filters}
            onSearchChange={setSearchTerm}
            onFiltersChange={setFilters}
          />

          {/* Results */}
          <ProductGrid
            products={filteredProducts}
            isLoading={isLoading}
            showDetails={true}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            showViewToggle={true}
            columns={viewMode === "grid" ? 4 : 1}
          />
      </div>
    </div>
  );
};

export default SearchPage;
