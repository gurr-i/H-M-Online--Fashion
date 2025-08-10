import React from "react";
import ProductCard from "./ProductCard";
import { Product } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Grid, List } from "lucide-react";

interface ProductGridProps {
  products: Product[];
  isLoading: boolean;
  columns?: number;
  showDetails?: boolean;
  viewMode?: "grid" | "list";
  onViewModeChange?: (mode: "grid" | "list") => void;
  showViewToggle?: boolean;
}

const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  isLoading,
  columns = 4,
  showDetails = true,
  viewMode = "grid",
  onViewModeChange,
  showViewToggle = false
}) => {
  const columnClass = {
    2: "grid-cols-2",
    3: "grid-cols-2 md:grid-cols-3",
    4: "grid-cols-2 md:grid-cols-4",
    6: "grid-cols-2 md:grid-cols-3 lg:grid-cols-6",
  }[columns] || "grid-cols-2 md:grid-cols-4";

  if (isLoading) {
    return (
      <div className={`grid ${columnClass} gap-4`}>
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="space-y-3">
            <Skeleton className="w-full h-[300px]" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-lg text-gray-500">No products found.</p>
        <p className="text-sm text-gray-400 mt-2">Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* View Toggle */}
      {showViewToggle && onViewModeChange && (
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-600">
            {products.length} product{products.length !== 1 ? 's' : ''} found
          </p>
          <div className="flex gap-1">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => onViewModeChange("grid")}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => onViewModeChange("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Products Display */}
      {viewMode === "grid" ? (
        <div className={`grid ${columnClass} gap-4`}>
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              showDetails={showDetails}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              showDetails={showDetails}
              layout="horizontal"
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
