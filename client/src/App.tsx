import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Layout from "@/components/layout/Layout";
import Home from "@/pages/Home";
import WomensCollection from "@/pages/WomensCollection";
import MensCollection from "@/pages/MensCollection";
import KidsCollection from "@/pages/KidsCollection";
import HomeCollection from "@/pages/HomeCollection";
import ShoppingBag from "@/pages/ShoppingBag";
import AuthPage from "@/pages/auth-page";
import ProfilePage from "@/pages/profile-page";
import ProductDetails from "@/pages/ProductDetails";
import CheckoutPage from "@/pages/CheckoutPage";
import SearchPage from "@/pages/SearchPage";
import OrderHistory from "@/pages/OrderHistory";
import OrderDetailsPage from "@/pages/OrderDetailsPage";
import WishlistPage from "@/pages/WishlistPage";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";

// Admin pages
import AdminDashboard from "@/pages/admin/DashboardPage";
import ProductsPage from "@/pages/admin/ProductsPage";
import CategoriesPage from "@/pages/admin/CategoriesPage";
import OrdersPage from "@/pages/admin/OrdersPage";
import UsersPage from "@/pages/admin/UsersPage";
import AnalyticsPage from "@/pages/admin/AnalyticsPage";

function Router() {
  return (
    <AuthProvider>
      <Switch>
        {/* Admin routes */}
        <ProtectedRoute path="/admin" component={AdminDashboard} adminOnly={true} />
        <ProtectedRoute path="/admin/products" component={ProductsPage} adminOnly={true} />
        <ProtectedRoute path="/admin/categories" component={CategoriesPage} adminOnly={true} />
        <ProtectedRoute path="/admin/orders" component={OrdersPage} adminOnly={true} />
        <ProtectedRoute path="/admin/users" component={UsersPage} adminOnly={true} />
        <ProtectedRoute path="/admin/analytics" component={AnalyticsPage} adminOnly={true} />

        {/* Customer-facing routes */}
        <Route path="/auth" component={AuthPage} />
        <Route>
          <Layout>
            <Switch>
              <Route path="/" component={Home} />
              
              {/* Collection routes */}
              <Route path="/women" component={WomensCollection} />
              <Route path="/women/:subcategory" component={WomensCollection} />
              <Route path="/men" component={MensCollection} />
              <Route path="/men/:subcategory" component={MensCollection} />
              <Route path="/kids" component={KidsCollection} />
              <Route path="/kids/:subcategory" component={KidsCollection} />
              <Route path="/home-collection" component={HomeCollection} />
              <Route path="/home-collection/:subcategory" component={HomeCollection} />
              <Route path="/products/:id" component={ProductDetails} />

              {/* Search and User-related routes */}
              <Route path="/search" component={SearchPage} />
              <Route path="/shopping-bag" component={ShoppingBag} />
              <Route path="/checkout" component={CheckoutPage} />
              <ProtectedRoute path="/profile" component={ProfilePage} />
              <ProtectedRoute path="/orders" component={OrderHistory} />
              <ProtectedRoute path="/orders/:id" component={OrderDetailsPage} />
              <ProtectedRoute path="/wishlist" component={WishlistPage} />
              
              <Route component={NotFound} />
            </Switch>
          </Layout>
        </Route>
      </Switch>
    </AuthProvider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
