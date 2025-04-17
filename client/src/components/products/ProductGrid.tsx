import React from "react";
import ProductCard from "./ProductCard";
import { Product } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

interface ProductGridProps {
  products: Product[];
  isLoading: boolean;
  columns?: number;
  showDetails?: boolean;
}

const ProductGrid: React.FC<ProductGridProps> = ({ 
  products, 
  isLoading, 
  columns = 4,
  showDetails = true 
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
      </div>
    );
  }

  return (
    <div className={`grid ${columnClass} gap-4`}>
      {products.map((product) => (
        <ProductCard 
          key={product.id} 
          product={product} 
          showDetails={showDetails}
        />
      ))}
    </div>
  );
};

export default ProductGrid;
