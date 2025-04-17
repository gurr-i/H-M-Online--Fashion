import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, Search, User, Heart, ShoppingBag } from "lucide-react";
import Logo from "@/components/ui/Logo";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import useCart from "@/hooks/useCart";

const Header: React.FC = () => {
  const [location] = useLocation();
  const { cartItems } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Calculate total items in cart
  const totalItems = cartItems?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  // Helper to check active path for navigation
  const isActivePath = (path: string) => {
    return location === path;
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        {/* Mobile menu button */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px]">
            <div className="flex flex-col gap-6 mt-6">
              <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                <div className="text-xl font-semibold">Home</div>
              </Link>
              <Link href="/women" onClick={() => setMobileMenuOpen(false)}>
                <div className="text-xl font-semibold">Ladies</div>
              </Link>
              <Link href="/men" onClick={() => setMobileMenuOpen(false)}>
                <div className="text-xl font-semibold">Men</div>
              </Link>
              <Link href="/kids" onClick={() => setMobileMenuOpen(false)}>
                <div className="text-xl font-semibold">Kids</div>
              </Link>
              <Link href="/home-collection" onClick={() => setMobileMenuOpen(false)}>
                <div className="text-xl font-semibold">Home</div>
              </Link>
              <Link href="/shopping-bag" onClick={() => setMobileMenuOpen(false)}>
                <div className="text-xl font-semibold">Shopping Bag ({totalItems})</div>
              </Link>
              <Link href="/profile" onClick={() => setMobileMenuOpen(false)}>
                <div className="text-xl font-semibold">My Account</div>
              </Link>
              <Link href="/auth" onClick={() => setMobileMenuOpen(false)}>
                <div className="text-xl font-semibold">Sign In / Register</div>
              </Link>
            </div>
          </SheetContent>
        </Sheet>

        {/* Logo */}
        <Logo />

        {/* Main navigation */}
        <nav className="hidden lg:flex flex-grow justify-center">
          <ul className="flex space-x-8">
            <li>
              <Link href="/women">
                <div className={`uppercase font-semibold text-sm ${isActivePath('/women') ? 'border-b-2 border-black pb-1' : 'hover:border-b-2 hover:border-black pb-1'}`}>
                  Ladies
                </div>
              </Link>
            </li>
            <li>
              <Link href="/men">
                <div className={`uppercase font-semibold text-sm ${isActivePath('/men') ? 'border-b-2 border-black pb-1' : 'hover:border-b-2 hover:border-black pb-1'}`}>
                  Men
                </div>
              </Link>
            </li>
            <li>
              <Link href="/kids">
                <div className={`uppercase font-semibold text-sm ${isActivePath('/kids') ? 'border-b-2 border-black pb-1' : 'hover:border-b-2 hover:border-black pb-1'}`}>
                  Kids
                </div>
              </Link>
            </li>
            <li>
              <Link href="/home-collection">
                <div className={`uppercase font-semibold text-sm ${isActivePath('/home-collection') ? 'border-b-2 border-black pb-1' : 'hover:border-b-2 hover:border-black pb-1'}`}>
                  Home
                </div>
              </Link>
            </li>
          </ul>
        </nav>

        {/* Right side icons */}
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="hidden sm:flex">
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>
          <Link href="/profile">
            <div>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
                <span className="sr-only">Account</span>
              </Button>
            </div>
          </Link>
          <Button variant="ghost" size="icon">
            <Heart className="h-5 w-5" />
            <span className="sr-only">Favorites</span>
          </Button>
          <Link href="/shopping-bag">
            <div className="relative">
              <Button variant="ghost" size="icon">
                <ShoppingBag className="h-5 w-5" />
                <span className="sr-only">Shopping bag</span>
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-white text-[10px] flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Button>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
