import React from "react";
import { Order } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  MapPin,
  Calendar
} from "lucide-react";

interface OrderTrackerProps {
  order: Order;
}

const OrderTracker: React.FC<OrderTrackerProps> = ({ order }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "processing":
        return <Package className="h-4 w-4" />;
      case "shipped":
        return <Truck className="h-4 w-4" />;
      case "delivered":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getProgressValue = (status: string) => {
    switch (status) {
      case "pending":
        return 25;
      case "processing":
        return 50;
      case "shipped":
        return 75;
      case "delivered":
        return 100;
      case "cancelled":
        return 0;
      default:
        return 0;
    }
  };

  const trackingSteps = [
    {
      status: "pending",
      label: "Order Placed",
      description: "Your order has been received",
      completed: ["pending", "processing", "shipped", "delivered"].includes(order.status),
    },
    {
      status: "processing",
      label: "Processing",
      description: "We're preparing your order",
      completed: ["processing", "shipped", "delivered"].includes(order.status),
    },
    {
      status: "shipped",
      label: "Shipped",
      description: "Your order is on its way",
      completed: ["shipped", "delivered"].includes(order.status),
    },
    {
      status: "delivered",
      label: "Delivered",
      description: "Order has been delivered",
      completed: order.status === "delivered",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Order #{order.id}</CardTitle>
          <Badge className={getStatusColor(order.status)}>
            <div className="flex items-center gap-1">
              {getStatusIcon(order.status)}
              <span className="capitalize">{order.status}</span>
            </div>
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Order Info */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-400" />
            <span className="text-gray-600">Order Date:</span>
            <span className="font-medium">
              {new Date(typeof order.createdAt === 'number' ? order.createdAt * 1000 : order.createdAt).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-gray-400" />
            <span className="text-gray-600">Total:</span>
            <span className="font-medium">${order.total.toFixed(2)}</span>
          </div>
        </div>

        {/* Shipping Address */}
        {order.shippingAddress && (
          <div className="flex items-start gap-2 text-sm">
            <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
            <div>
              <span className="text-gray-600">Shipping to:</span>
              <p className="font-medium">{order.shippingAddress}</p>
            </div>
          </div>
        )}

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Progress</span>
            <span className="font-medium">{getProgressValue(order.status)}%</span>
          </div>
          <Progress value={getProgressValue(order.status)} className="h-2" />
        </div>

        {/* Tracking Steps */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Order Timeline</h4>
          <div className="space-y-3">
            {trackingSteps.map((step, index) => (
              <div key={step.status} className="flex items-start gap-3">
                <div className={`
                  flex items-center justify-center w-8 h-8 rounded-full border-2 
                  ${step.completed 
                    ? 'bg-primary border-primary text-primary-foreground' 
                    : 'bg-gray-100 border-gray-300 text-gray-400'
                  }
                `}>
                  {step.completed ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <span className="text-xs font-medium">{index + 1}</span>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${
                    step.completed ? 'text-gray-900' : 'text-gray-500'
                  }`}>
                    {step.label}
                  </p>
                  <p className="text-xs text-gray-500">{step.description}</p>
                </div>
                
                {order.status === step.status && (
                  <Badge variant="outline" className="text-xs">
                    Current
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Cancelled Status */}
        {order.status === "cancelled" && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 text-red-800">
              <Package className="h-4 w-4" />
              <span className="font-medium">Order Cancelled</span>
            </div>
            <p className="text-sm text-red-600 mt-1">
              This order has been cancelled. If you have any questions, please contact our support team.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OrderTracker;
