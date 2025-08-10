import React, { useState } from "react";
import { Link, useRoute } from "wouter";
import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  BookOpenText,
  Package,
  Tag,
  LogOut,
  Menu,
  X,
  Home,
  TrendingUp
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Badge } from "@/components/ui/badge";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { logoutMutation, user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { href: "/admin", icon: <LayoutDashboard size={20} />, label: "Dashboard", exact: true },
    { href: "/admin/analytics", icon: <TrendingUp size={20} />, label: "Analytics" },
    { href: "/admin/products", icon: <ShoppingBag size={20} />, label: "Products", badge: "New" },
    { href: "/admin/categories", icon: <Tag size={20} />, label: "Categories" },
    { href: "/admin/orders", icon: <Package size={20} />, label: "Orders" },
    { href: "/admin/users", icon: <Users size={20} />, label: "Users" },
  ];

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const Sidebar = ({ className }: { className?: string }) => (
    <div className={cn("bg-white shadow-lg border-r border-gray-200", className)}>
      <div className="p-6 border-b border-gray-200">
        <Link href="/">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">H&M</span>
            </div>
            <span className="text-xl font-bold text-gray-800">Admin</span>
          </div>
        </Link>
      </div>

      <div className="p-4">
        <div className="mb-6">
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
              <Users size={20} className="text-gray-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{user?.username}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
            </div>
          </div>
        </div>

        <nav className="space-y-1">
          {menuItems.map((item) => {
            const [isActive] = useRoute(item.exact ? item.href : `${item.href}/*`);
            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={cn(
                    "flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  )}
                  onClick={() => setSidebarOpen(false)}
                >
                  <div className="flex items-center">
                    <span className="mr-3">{item.icon}</span>
                    {item.label}
                  </div>
                  {item.badge && (
                    <Badge variant="secondary" className="text-xs">
                      {item.badge}
                    </Badge>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <Link href="/">
            <div className="flex items-center px-4 py-3 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors mb-2">
              <Home size={20} className="mr-3" />
              Back to Store
            </div>
          </Link>
          <Button
            variant="ghost"
            className="flex w-full items-center justify-start px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            onClick={handleLogout}
          >
            <LogOut size={20} className="mr-3" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <Sidebar className="hidden lg:block w-64 fixed inset-y-0 left-0 z-50" />

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setSidebarOpen(false)} />
          <Sidebar className="fixed inset-y-0 left-0 w-64 z-50" />
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
          <div className="flex items-center justify-between px-4 py-4 sm:px-6">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden mr-2"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu size={20} />
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-500">Manage your store efficiently</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <TrendingUp size={16} className="mr-2" />
                Analytics
              </Button>
              <div className="hidden sm:block">
                <Badge variant="outline" className="text-xs">
                  {new Date().toLocaleDateString()}
                </Badge>
              </div>
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          <div className="space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;