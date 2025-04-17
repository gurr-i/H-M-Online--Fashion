import React from "react";
import { Link, useRoute } from "wouter";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Users, 
  BookOpenText, 
  Package, 
  Tag,
  LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { logoutMutation } = useAuth();

  const menuItems = [
    { href: "/admin", icon: <LayoutDashboard size={20} />, label: "Dashboard", exact: true },
    { href: "/admin/products", icon: <ShoppingBag size={20} />, label: "Products" },
    { href: "/admin/categories", icon: <Tag size={20} />, label: "Categories" },
    { href: "/admin/orders", icon: <Package size={20} />, label: "Orders" },
    { href: "/admin/users", icon: <Users size={20} />, label: "Users" },
  ];

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-6 border-b border-gray-200">
          <Link href="/">
            <a className="text-2xl font-bold text-gray-800">H&M Admin</a>
          </Link>
        </div>
        <nav className="flex flex-col p-4">
          {menuItems.map((item) => {
            const [isActive] = useRoute(item.exact ? item.href : `${item.href}/*`);
            return (
              <Link key={item.href} href={item.href}>
                <a
                  className={cn(
                    "flex items-center px-4 py-3 mt-2 text-gray-600 rounded-md hover:bg-gray-100",
                    isActive && "bg-gray-100 text-gray-900 font-medium"
                  )}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.label}
                </a>
              </Link>
            );
          })}
          <div className="mt-auto pt-6 border-t border-gray-200 mt-8">
            <Button 
              variant="ghost" 
              className="flex w-full items-center px-4 py-3 text-gray-600 hover:bg-gray-100"
              onClick={handleLogout}
            >
              <LogOut size={20} className="mr-3" />
              Logout
            </Button>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-x-hidden overflow-y-auto">
        <header className="bg-white shadow">
          <div className="px-6 py-4">
            <h1 className="text-2xl font-semibold text-gray-800">Admin Panel</h1>
          </div>
        </header>
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;