import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Category } from "@shared/schema";
import { getQueryFn } from "@/lib/queryClient";

interface ProductSearchProps {
  onSearchChange: (searchTerm: string) => void;
  onFiltersChange: (filters: ProductFilters) => void;
  searchTerm: string;
  filters: ProductFilters;
}

export interface ProductFilters {
  category?: string;
  subcategory?: string;
  priceRange: [number, number];
  inStock?: boolean;
  sortBy: "name" | "price" | "newest" | "oldest";
  sortOrder: "asc" | "desc";
}

const ProductSearch: React.FC<ProductSearchProps> = ({
  onSearchChange,
  onFiltersChange,
  searchTerm,
  filters,
}) => {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const { data: categories } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
    queryFn: getQueryFn({ on401: "throw" }),
  });

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(localSearchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [localSearchTerm, onSearchChange]);

  const handleFilterChange = (key: keyof ProductFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const defaultFilters: ProductFilters = {
      priceRange: [0, 10000],
      sortBy: "name",
      sortOrder: "asc",
    };
    onFiltersChange(defaultFilters);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.category) count++;
    if (filters.subcategory) count++;
    if (filters.inStock !== undefined) count++;
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 10000) count++;
    return count;
  };

  const mainCategories = categories?.filter(cat => !cat.parentId) || [];
  const subcategories = categories?.filter(cat => 
    cat.parentId && (!filters.category || 
    mainCategories.find(main => main.slug === filters.category)?.id === cat.parentId)
  ) || [];

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="text"
          placeholder="Search products..."
          value={localSearchTerm}
          onChange={(e) => setLocalSearchTerm(e.target.value)}
          className="pl-10 pr-4"
        />
      </div>

      {/* Filter Controls */}
      <div className="flex items-center gap-2 flex-wrap">
        <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filters
              {getActiveFilterCount() > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {getActiveFilterCount()}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Filter Products</SheetTitle>
              <SheetDescription>
                Narrow down your search with these filters
              </SheetDescription>
            </SheetHeader>
            
            <div className="space-y-6 mt-6">
              {/* Category Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block">Category</label>
                <Select
                  value={filters.category || ""}
                  onValueChange={(value) => handleFilterChange("category", value || undefined)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All categories</SelectItem>
                    {mainCategories.map((category) => (
                      <SelectItem key={category.id} value={category.slug}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Subcategory Filter */}
              {filters.category && subcategories.length > 0 && (
                <div>
                  <label className="text-sm font-medium mb-2 block">Subcategory</label>
                  <Select
                    value={filters.subcategory || ""}
                    onValueChange={(value) => handleFilterChange("subcategory", value || undefined)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All subcategories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All subcategories</SelectItem>
                      {subcategories.map((subcategory) => (
                        <SelectItem key={subcategory.id} value={subcategory.slug}>
                          {subcategory.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Price Range Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Price Range: ${filters.priceRange[0]} - ${filters.priceRange[1]}
                </label>
                <Slider
                  value={filters.priceRange}
                  onValueChange={(value) => handleFilterChange("priceRange", value)}
                  max={10000}
                  min={0}
                  step={50}
                  className="mt-2"
                />
              </div>

              {/* Stock Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block">Availability</label>
                <Select
                  value={filters.inStock === undefined ? "" : filters.inStock.toString()}
                  onValueChange={(value) => 
                    handleFilterChange("inStock", value === "" ? undefined : value === "true")
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All products" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All products</SelectItem>
                    <SelectItem value="true">In stock only</SelectItem>
                    <SelectItem value="false">Out of stock</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Sort Options */}
              <div>
                <label className="text-sm font-medium mb-2 block">Sort by</label>
                <div className="space-y-2">
                  <Select
                    value={filters.sortBy}
                    onValueChange={(value) => handleFilterChange("sortBy", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name">Name</SelectItem>
                      <SelectItem value="price">Price</SelectItem>
                      <SelectItem value="newest">Newest</SelectItem>
                      <SelectItem value="oldest">Oldest</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select
                    value={filters.sortOrder}
                    onValueChange={(value) => handleFilterChange("sortOrder", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asc">Ascending</SelectItem>
                      <SelectItem value="desc">Descending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Clear Filters */}
              <Button 
                variant="outline" 
                onClick={clearFilters}
                className="w-full"
              >
                Clear All Filters
              </Button>
            </div>
          </SheetContent>
        </Sheet>

        {/* Active Filter Tags */}
        {filters.category && (
          <Badge variant="secondary" className="gap-1">
            {mainCategories.find(cat => cat.slug === filters.category)?.name}
            <X 
              className="h-3 w-3 cursor-pointer" 
              onClick={() => handleFilterChange("category", undefined)}
            />
          </Badge>
        )}
        
        {filters.subcategory && (
          <Badge variant="secondary" className="gap-1">
            {subcategories.find(cat => cat.slug === filters.subcategory)?.name}
            <X 
              className="h-3 w-3 cursor-pointer" 
              onClick={() => handleFilterChange("subcategory", undefined)}
            />
          </Badge>
        )}

        {(filters.priceRange[0] > 0 || filters.priceRange[1] < 10000) && (
          <Badge variant="secondary" className="gap-1">
            ${filters.priceRange[0]} - ${filters.priceRange[1]}
            <X 
              className="h-3 w-3 cursor-pointer" 
              onClick={() => handleFilterChange("priceRange", [0, 10000])}
            />
          </Badge>
        )}

        {filters.inStock !== undefined && (
          <Badge variant="secondary" className="gap-1">
            {filters.inStock ? "In stock" : "Out of stock"}
            <X 
              className="h-3 w-3 cursor-pointer" 
              onClick={() => handleFilterChange("inStock", undefined)}
            />
          </Badge>
        )}
      </div>
    </div>
  );
};

export default ProductSearch;
