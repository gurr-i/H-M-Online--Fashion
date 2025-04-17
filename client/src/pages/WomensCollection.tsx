import React from "react";
import { useParams } from "wouter";
import ProductGrid from "@/components/products/ProductGrid";
import CategoryFilter from "@/components/products/CategoryFilter";
import useProducts from "@/hooks/useProducts";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Category } from "@shared/schema";

const WomensCollection: React.FC = () => {
  // Get subcategory from route params
  const params = useParams<{ subcategory: string }>();
  const subcategory = params?.subcategory;
  
  // Fetch products by category/subcategory
  const { products, isLoading } = useProducts("ladies", subcategory);
  
  // Fetch categories for filter
  const { data: categories } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">WOMEN'S BLOUSES & SHIRTS</h1>
        
        {/* Category filters */}
        {categories && (
          <CategoryFilter 
            categories={categories} 
            selectedCategory={subcategory} 
            parentCategory="ladies"
          />
        )}
        
        {/* Sort and filter options */}
        <div className="flex justify-between mb-8">
          <Button variant="ghost" size="sm" className="flex items-center text-sm font-medium">
            SORT BY
            <ChevronDown className="h-4 w-4 ml-1" />
          </Button>
          <Button variant="ghost" size="sm" className="flex items-center text-sm font-medium">
            FILTER
            <SlidersHorizontal className="h-4 w-4 ml-1" />
          </Button>
        </div>
        
        {/* Products grid */}
        <ProductGrid products={products} isLoading={isLoading} columns={4} showDetails={true} />
      </div>
    </section>
  );
};

export default WomensCollection;
