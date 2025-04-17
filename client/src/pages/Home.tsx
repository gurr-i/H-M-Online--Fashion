import React from "react";
import { Link } from "wouter";
import ProductGrid from "@/components/products/ProductGrid";
import useProducts from "@/hooks/useProducts";
import { Button } from "@/components/ui/button";

const Home: React.FC = () => {
  const { products, isLoading } = useProducts("ladies");

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section relative h-screen">
        <div className="relative w-full h-full overflow-hidden">
          <video
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          >
            <source
              src="https://image.hm.com/content/dam/global_campaigns/season_01/women/startpage-assets/wk15/1011B-startpage-wk15-2x3.mp4"
              type="video/mp4"
              media="(max-width: 767px)"
            />
            <source
              src="https://image.hm.com/content/dam/global_campaigns/season_01/women/startpage-assets/wk15/1011B-startpage-women-wk15-16x9.mp4"
              type="video/mp4"
              media="(min-width: 767.1px)"
            />
          </video>
          <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center">
            <div className="container mx-auto px-4 text-white">
              <div className="max-w-lg">
                <h1 className="text-4xl md:text-6xl font-bold mb-4">S/S 2025</h1>
                <p className="text-xl mb-8">Discover the latest trends</p>
                <Link href="/women">
                  <Button className="bg-white text-black px-6 py-3 font-medium tracking-wider hover:bg-gray-100">
                    SHOP NOW
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">NEW IN</h2>
            <Link href="/women">
              <div className="text-sm uppercase">View all</div>
            </Link>
          </div>
          
          <ProductGrid 
            products={products.slice(0, 6)} 
            isLoading={isLoading}
            columns={6}
            showDetails={false}
          />
        </div>
      </section>

      {/* Trending Collection */}
      <section className="py-12 bg-[#F4F4F4]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="relative overflow-hidden group">
              <img 
                src="https://images.unsplash.com/photo-1485968579580-b6d095142e6e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                alt="Women's collection" 
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                <div className="text-center text-white transform transition-transform group-hover:translate-y-[-5px]">
                  <h3 className="text-2xl font-bold mb-4">BLOUSES IN TREND</h3>
                  <Link href="/women/blouses">
                    <Button className="bg-white text-black px-5 py-2 font-medium tracking-wider hover:bg-gray-100">
                      SHOP NOW
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="relative overflow-hidden group">
              <img 
                src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                alt="Summer collection" 
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                <div className="text-center text-white transform transition-transform group-hover:translate-y-[-5px]">
                  <h3 className="text-2xl font-bold mb-4">SUMMER ESSENTIALS</h3>
                  <Link href="/women">
                    <Button className="bg-white text-black px-5 py-2 font-medium tracking-wider hover:bg-gray-100">
                      SHOP NOW
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
