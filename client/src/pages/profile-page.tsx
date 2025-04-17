import React from "react";
import { Redirect } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { PackageOpen, ShoppingBag, Heart, User, LogOut, Settings, History } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

const ProfilePage: React.FC = () => {
  const { toast } = useToast();
  
  // Simulate authentication state
  const isLoggedIn = false; // This would be from an auth context
  
  // If user is not logged in, redirect to auth page
  if (!isLoggedIn) {
    return <Redirect to="/auth" />;
  }
  
  const handleLogout = () => {
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully.",
    });
  };
  
  // Mock user data
  const user = {
    username: "johndoe",
    email: "john.doe@example.com",
    memberSince: "January 2022",
    points: 120,
    profileImage: "",
  };
  
  // Mock order history
  const orders = [
    { id: 1, date: "2023-04-10", status: "Delivered", total: 45.99, items: 2 },
    { id: 2, date: "2023-03-22", status: "Delivered", total: 89.50, items: 3 },
    { id: 3, date: "2023-02-15", status: "Delivered", total: 34.99, items: 1 },
  ];
  
  return (
    <div className="py-12 container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Sidebar */}
        <div className="col-span-1">
          <Card>
            <CardHeader>
              <div className="flex flex-col items-center gap-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={user.profileImage} alt={user.username} />
                  <AvatarFallback className="text-xl">{user.username[0].toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <CardTitle>{user.username}</CardTitle>
                  <p className="text-sm text-gray-500">{user.email}</p>
                  <p className="text-xs text-gray-400 mt-1">Member since {user.memberSince}</p>
                </div>
                <Badge className="mt-2 bg-primary">H&M MEMBER - {user.points} POINTS</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button variant="ghost" className="w-full justify-start">
                  <User className="mr-2 h-4 w-4" />
                  My Account
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  My Orders
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <Heart className="mr-2 h-4 w-4" />
                  Wishlist
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <PackageOpen className="mr-2 h-4 w-4" />
                  Returns
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Button>
                <Separator />
                <Button variant="ghost" className="w-full justify-start text-red-500" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Main Content */}
        <div className="col-span-1 md:col-span-2">
          <Tabs defaultValue="overview">
            <TabsList className="grid grid-cols-3 mb-8 w-full">
              <TabsTrigger value="overview">OVERVIEW</TabsTrigger>
              <TabsTrigger value="orders">ORDERS</TabsTrigger>
              <TabsTrigger value="settings">SETTINGS</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <Card>
                <CardHeader>
                  <CardTitle>Account Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Recent Orders</h3>
                      {orders.length > 0 ? (
                        <div className="space-y-4">
                          {orders.slice(0, 2).map((order) => (
                            <div key={order.id} className="flex justify-between border-b pb-4">
                              <div>
                                <p className="font-medium">Order #{order.id}</p>
                                <p className="text-sm text-gray-500">{order.date}</p>
                              </div>
                              <div className="text-right">
                                <Badge variant={order.status === "Delivered" ? "secondary" : "outline"}>
                                  {order.status}
                                </Badge>
                                <p className="text-sm mt-1">₹ {order.total.toFixed(2)}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500">No orders yet</p>
                      )}
                      <Button variant="link" className="px-0 mt-2">
                        View all orders
                      </Button>
                    </div>

                    <Separator />
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Personal Information</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Username</p>
                          <p>{user.username}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Email</p>
                          <p>{user.email}</p>
                        </div>
                      </div>
                      <Button variant="link" className="px-0 mt-2">
                        Edit personal info
                      </Button>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Membership</h3>
                      <p className="mb-2">H&M Member - {user.points} points</p>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                        <div className="bg-primary h-2.5 rounded-full" style={{ width: `${Math.min(user.points / 2, 100)}%` }}></div>
                      </div>
                      <p className="text-sm text-gray-500">Earn 80 more points to reach the next tier</p>
                      <Button variant="link" className="px-0 mt-2">
                        View membership benefits
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="orders">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <History className="mr-2 h-5 w-5" /> Order History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {orders.length > 0 ? (
                    <div className="space-y-6">
                      {orders.map((order) => (
                        <div key={order.id} className="border-b pb-6">
                          <div className="flex justify-between mb-2">
                            <div>
                              <h3 className="font-medium">Order #{order.id}</h3>
                              <p className="text-sm text-gray-500">Placed on {order.date}</p>
                            </div>
                            <Badge variant={order.status === "Delivered" ? "secondary" : "outline"}>
                              {order.status}
                            </Badge>
                          </div>
                          <div className="flex justify-between mt-4">
                            <div>
                              <p className="text-gray-600">{order.items} item(s)</p>
                              <p className="font-medium">₹ {order.total.toFixed(2)}</p>
                            </div>
                            <Button size="sm">View Order</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <ShoppingBag className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <h3 className="text-lg font-medium mb-2">No orders yet</h3>
                      <p className="text-gray-500 mb-4">You haven't placed any orders yet.</p>
                      <Button>Start Shopping</Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="mr-2 h-5 w-5" /> Account Settings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Change Password</h3>
                      <p className="text-gray-500 mb-4">Update your password regularly to keep your account secure.</p>
                      <Button>Change Password</Button>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Communication Preferences</h3>
                      <p className="text-gray-500 mb-4">Manage your email preferences and notification settings.</p>
                      <Button>Manage Preferences</Button>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-2 text-red-500">Delete Account</h3>
                      <p className="text-gray-500 mb-4">Once you delete your account, there is no going back. Please be certain.</p>
                      <Button variant="destructive">Delete Account</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;