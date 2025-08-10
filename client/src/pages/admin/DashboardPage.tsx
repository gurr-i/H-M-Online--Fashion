import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import AdminLayout from "@/components/layout/AdminLayout";
import StatsCard from "@/components/admin/StatsCard";
import { getQueryFn } from "@/lib/queryClient";
import { Product, User, Order } from "@shared/schema";
import {
  Loader2,
  ShoppingBag,
  Users,
  Package,
  TrendingUp,
  DollarSign,
  AlertTriangle,
  Clock,
  CheckCircle
} from "lucide-react";

const AdminDashboard: React.FC = () => {
  const { data: products, isLoading: isLoadingProducts } = useQuery<Product[]>({
    queryKey: ["/api/products"],
    queryFn: getQueryFn({ on401: "throw" }),
  });

  const { data: users, isLoading: isLoadingUsers } = useQuery<User[]>({
    queryKey: ["/api/users"],
    queryFn: getQueryFn({ on401: "throw" }),
  });

  const { data: orders, isLoading: isLoadingOrders } = useQuery<Order[]>({
    queryKey: ["/api/orders"],
    queryFn: getQueryFn({ on401: "throw" }),
  });

  const isLoading = isLoadingProducts || isLoadingUsers || isLoadingOrders;

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  const totalProducts = products?.length || 0;
  const totalUsers = users?.length || 0;
  const totalOrders = orders?.length || 0;
  const revenue = orders?.reduce((sum, order) => sum + order.total, 0) || 0;

  // Calculate additional metrics
  const lowStockProducts = products?.filter(p => p.inventory && p.inventory < 10).length || 0;
  const pendingOrders = orders?.filter(o => o.status === 'pending').length || 0;
  const completedOrders = orders?.filter(o => o.status === 'delivered').length || 0;
  const averageOrderValue = totalOrders > 0 ? revenue / totalOrders : 0;

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Dashboard Overview</h2>
          <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your store today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Revenue"
            value={`$${revenue.toFixed(2)}`}
            description="Total earnings"
            icon={<DollarSign className="h-4 w-4" />}
            trend={{ value: 12.5, label: "vs last month" }}
          />

          <StatsCard
            title="Orders"
            value={totalOrders}
            description="Total orders placed"
            icon={<Package className="h-4 w-4" />}
            trend={{ value: 8.2, label: "vs last month" }}
          />

          <StatsCard
            title="Products"
            value={totalProducts}
            description="Items in inventory"
            icon={<ShoppingBag className="h-4 w-4" />}
            trend={{ value: -2.1, label: "vs last month" }}
          />

          <StatsCard
            title="Customers"
            value={totalUsers}
            description="Registered users"
            icon={<Users className="h-4 w-4" />}
            trend={{ value: 15.3, label: "vs last month" }}
          />
        </div>

        {/* Secondary Stats */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Average Order Value"
            value={`$${averageOrderValue.toFixed(2)}`}
            description="Per order"
            icon={<TrendingUp className="h-4 w-4" />}
          />

          <StatsCard
            title="Pending Orders"
            value={pendingOrders}
            description="Awaiting processing"
            icon={<Clock className="h-4 w-4" />}
          />

          <StatsCard
            title="Completed Orders"
            value={completedOrders}
            description="Successfully delivered"
            icon={<CheckCircle className="h-4 w-4" />}
          />

          <StatsCard
            title="Low Stock Items"
            value={lowStockProducts}
            description="Need restocking"
            icon={<AlertTriangle className="h-4 w-4" />}
          />
        </div>

        {/* Detailed Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>
              Latest orders placed on the platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            {orders && orders.length > 0 ? (
              <div className="space-y-4">
                <div className="grid grid-cols-4 font-medium text-sm">
                  <div>Order ID</div>
                  <div>Date</div>
                  <div>Status</div>
                  <div className="text-right">Total</div>
                </div>
                <div className="space-y-2">
                  {orders.slice(0, 5).map((order) => (
                    <div key={order.id} className="grid grid-cols-4 text-sm">
                      <div>#{order.id}</div>
                      <div>{new Date(typeof order.createdAt === 'number' ? order.createdAt * 1000 : order.createdAt).toLocaleDateString()}</div>
                      <div>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          order.status === 'delivered'
                            ? 'bg-green-100 text-green-800'
                            : order.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                      <div className="text-right">${order.total.toFixed(2)}</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No orders yet</p>
            )}
          </CardContent>
        </Card>
        
          <Card>
            <CardHeader>
              <CardTitle>Top Products</CardTitle>
              <CardDescription>
                Most popular products by sales
              </CardDescription>
            </CardHeader>
            <CardContent>
              {products && products.length > 0 ? (
                <div className="space-y-4">
                  {products.slice(0, 5).map((product) => (
                    <div key={product.id} className="flex items-center space-x-3">
                      <div className="h-12 w-12 rounded-lg bg-gray-100 overflow-hidden">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{product.name}</p>
                        <p className="text-xs text-muted-foreground">${product.price.toFixed(2)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{product.inventory || 0}</p>
                        <p className="text-xs text-muted-foreground">in stock</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No products yet</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;