import express, { type Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { z } from "zod";
import { 
  insertCartItemSchema, 
  insertProductSchema, 
  insertCategorySchema,
  insertUserSchema,
  insertOrderSchema,
  User 
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication
  setupAuth(app);

  const apiRouter = express.Router();

  // Health check endpoint
  apiRouter.get("/health", (req: Request, res: Response) => {
    res.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      message: "H&M Fashion API is running"
    });
  });

  // Products routes
  apiRouter.get("/products", async (req: Request, res: Response) => {
    try {
      const category = req.query.category as string | undefined;
      const subcategory = req.query.subcategory as string | undefined;

      let products;
      if (subcategory) {
        products = await storage.getProductsBySubCategory(subcategory);
      } else if (category) {
        products = await storage.getProductsByCategory(category);
      } else {
        products = await storage.getAllProducts();
      }

      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  apiRouter.get("/products/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }

      const product = await storage.getProductById(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  // Admin Product Routes
  apiRouter.post("/products", isAdmin, async (req: Request, res: Response) => {
    try {
      const validatedData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(validatedData);
      res.status(201).json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid product data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating product" });
    }
  });

  apiRouter.put("/products/:id", isAdmin, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }
      
      const updatedProduct = await storage.updateProduct(id, req.body);
      
      if (!updatedProduct) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.json(updatedProduct);
    } catch (error) {
      res.status(500).json({ message: "Error updating product" });
    }
  });

  apiRouter.delete("/products/:id", isAdmin, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }
      
      const success = await storage.deleteProduct(id);
      
      if (!success) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Error deleting product" });
    }
  });

  // Categories routes
  apiRouter.get("/categories", async (req: Request, res: Response) => {
    try {
      const categories = await storage.getAllCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  apiRouter.get("/categories/:slug", async (req: Request, res: Response) => {
    try {
      const slug = req.params.slug;
      const category = await storage.getCategoryBySlug(slug);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.json(category);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch category" });
    }
  });

  // Admin Category Routes
  apiRouter.post("/categories", isAdmin, async (req: Request, res: Response) => {
    try {
      const validatedData = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(validatedData);
      res.status(201).json(category);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid category data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating category" });
    }
  });

  apiRouter.put("/categories/:id", isAdmin, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid category ID" });
      }
      
      // Update category
      const category = await storage.getCategoryBySlug(req.body.slug);
      if (category && category.id !== id) {
        return res.status(400).json({ message: "Slug already exists" });
      }
      
      // Implement updateCategory method in storage
      const updatedCategory = { id, ...req.body };
      
      res.json(updatedCategory);
    } catch (error) {
      res.status(500).json({ message: "Error updating category" });
    }
  });

  apiRouter.delete("/categories/:id", isAdmin, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid category ID" });
      }
      
      // Implement deleteCategory method in storage
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Error deleting category" });
    }
  });

  // Cart routes
  apiRouter.get("/cart", async (req: Request, res: Response) => {
    try {
      // Get session ID from query parameter or generate one
      let sessionId = req.query.sessionId as string;

      if (!sessionId) {
        // Fallback to user-based session ID if authenticated
        const userId = (req as any).user?.id;
        if (userId) {
          sessionId = `user-${userId}`;
        } else {
          sessionId = req.session.id || "guest-session";
        }
      }

      const cartItems = await storage.getCartItems(sessionId);
      res.json(cartItems);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cart items" });
    }
  });

  apiRouter.post("/cart", async (req: Request, res: Response) => {
    try {
      const result = insertCartItemSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "Invalid cart item data" });
      }

      // Use sessionId from request body, or generate one
      let sessionId = result.data.sessionId;

      if (!sessionId) {
        // Fallback to user-based session ID if authenticated
        const userId = (req as any).user?.id;
        if (userId) {
          sessionId = `user-${userId}`;
        } else {
          sessionId = req.session.id || "guest-session";
        }
      }

      const cartItem = await storage.addToCart({
        ...result.data,
        sessionId
      });

      res.status(201).json(cartItem);
    } catch (error) {
      res.status(500).json({ message: "Failed to add item to cart" });
    }
  });

  apiRouter.put("/cart/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid cart item ID" });
      }

      const quantitySchema = z.object({
        quantity: z.number().int().positive(),
      });

      const result = quantitySchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "Invalid quantity" });
      }

      const updatedItem = await storage.updateCartItem(id, result.data.quantity);
      if (!updatedItem) {
        return res.status(404).json({ message: "Cart item not found or removed" });
      }

      res.json(updatedItem);
    } catch (error) {
      res.status(500).json({ message: "Failed to update cart item" });
    }
  });

  apiRouter.delete("/cart/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid cart item ID" });
      }

      const success = await storage.removeFromCart(id);
      if (!success) {
        return res.status(404).json({ message: "Cart item not found" });
      }

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to remove cart item" });
    }
  });

  apiRouter.delete("/cart", async (req: Request, res: Response) => {
    try {
      // Get session ID from query parameter or generate one
      let sessionId = req.query.sessionId as string;

      if (!sessionId) {
        // Fallback to user-based session ID if authenticated
        const userId = (req as any).user?.id;
        if (userId) {
          sessionId = `user-${userId}`;
        } else {
          sessionId = req.session.id || "guest-session";
        }
      }

      await storage.clearCart(sessionId);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to clear cart" });
    }
  });

  // Admin User Routes
  apiRouter.get("/users", isAdmin, async (req: Request, res: Response) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Error fetching users" });
    }
  });

  apiRouter.post("/users", isAdmin, async (req: Request, res: Response) => {
    try {
      // Validate user data
      const validatedData = insertUserSchema.parse(req.body);
      
      // Check if username already exists
      const existingUser = await storage.getUserByUsername(validatedData.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      const user = await storage.createUser(validatedData);
      res.status(201).json(user);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid user data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating user" });
    }
  });

  apiRouter.put("/users/:id", isAdmin, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      // Prevent modifying the logged-in admin
      const adminUser = req.user as User;
      if (id === adminUser.id) {
        return res.status(403).json({ message: "Cannot modify your own admin account" });
      }
      
      const updatedUser = await storage.updateUser(id, req.body);
      
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ message: "Error updating user" });
    }
  });

  apiRouter.delete("/users/:id", isAdmin, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      // Prevent deleting the logged-in admin
      const adminUser = req.user as User;
      if (id === adminUser.id) {
        return res.status(403).json({ message: "Cannot delete your own admin account" });
      }
      
      const success = await storage.deleteUser(id);
      
      if (!success) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Error deleting user" });
    }
  });

  // User Orders Route
  apiRouter.get("/user/orders", async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const orders = await storage.getUserOrders(userId);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Error fetching orders" });
    }
  });

  // Admin Order Routes
  apiRouter.get("/orders", isAdmin, async (req: Request, res: Response) => {
    try {
      const orders = await storage.getAllOrders();
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Error fetching orders" });
    }
  });

  apiRouter.get("/orders/:id", async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user?.id;
      const id = parseInt(req.params.id, 10);

      if (!userId) {
        return res.status(401).json({ message: "Authentication required" });
      }

      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid order ID" });
      }

      const order = await storage.getOrderById(id);

      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      // Check if user owns this order (or is admin)
      const user = (req as any).user;
      if (order.userId !== userId && user.role !== "admin") {
        return res.status(403).json({ message: "Access denied" });
      }

      res.json(order);
    } catch (error) {
      res.status(500).json({ message: "Error fetching order" });
    }
  });

  apiRouter.get("/orders/:id/items", async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user?.id;
      const id = parseInt(req.params.id, 10);

      if (!userId) {
        return res.status(401).json({ message: "Authentication required" });
      }

      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid order ID" });
      }

      // First check if user owns this order
      const order = await storage.getOrderById(id);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      const user = (req as any).user;
      if (order.userId !== userId && user.role !== "admin") {
        return res.status(403).json({ message: "Access denied" });
      }

      const orderItems = await storage.getOrderItems(id);
      res.json(orderItems);
    } catch (error) {
      res.status(500).json({ message: "Error fetching order items" });
    }
  });

  apiRouter.put("/orders/:id/status", isAdmin, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid order ID" });
      }
      
      const { status } = req.body;
      
      if (!["pending", "processing", "shipped", "delivered", "cancelled"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }
      
      const updatedOrder = await storage.updateOrderStatus(id, status);
      
      if (!updatedOrder) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      res.json(updatedOrder);
    } catch (error) {
      res.status(500).json({ message: "Error updating order status" });
    }
  });

  // Product Reviews Routes

  // Get product reviews
  apiRouter.get("/products/:id/reviews", async (req: Request, res: Response) => {
    try {
      const productId = parseInt(req.params.id);
      const reviews = await storage.getProductReviews(productId);
      res.json(reviews);
    } catch (error) {
      console.error("Error fetching product reviews:", error);
      res.status(500).json({ error: "Failed to fetch reviews" });
    }
  });

  // Create product review
  apiRouter.post("/products/:id/reviews", async (req: Request, res: Response) => {
    try {
      const productId = parseInt(req.params.id);
      const reviewData = { ...req.body, productId };
      const review = await storage.createProductReview(reviewData);
      res.status(201).json(review);
    } catch (error) {
      console.error("Error creating review:", error);
      res.status(500).json({ error: "Failed to create review" });
    }
  });

  // Get user reviews
  apiRouter.get("/users/:id/reviews", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.id);
      const reviews = await storage.getUserReviews(userId);
      res.json(reviews);
    } catch (error) {
      console.error("Error fetching user reviews:", error);
      res.status(500).json({ error: "Failed to fetch user reviews" });
    }
  });

  // Update review helpful count
  apiRouter.patch("/reviews/:id/helpful", async (req: Request, res: Response) => {
    try {
      const reviewId = parseInt(req.params.id);
      const { helpful } = req.body;
      const review = await storage.updateReviewHelpful(reviewId, helpful);
      if (!review) {
        return res.status(404).json({ error: "Review not found" });
      }
      res.json(review);
    } catch (error) {
      console.error("Error updating review helpful count:", error);
      res.status(500).json({ error: "Failed to update review" });
    }
  });

  // Checkout endpoint
  apiRouter.post("/checkout", async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const { shippingAddress } = req.body;
      if (!shippingAddress?.trim()) {
        return res.status(400).json({ message: "Shipping address is required" });
      }

      // Get user's cart items
      const sessionId = `user-${userId}`;
      console.log(`🛒 Checkout: Looking for cart items with sessionId: ${sessionId}`);

      const cartItems = await storage.getCartItems(sessionId);
      console.log(`🛒 Checkout: Found ${cartItems.length} cart items`);

      if (cartItems.length === 0) {
        console.log(`❌ Checkout failed: Cart is empty for sessionId: ${sessionId}`);
        return res.status(400).json({ message: "Cart is empty" });
      }

      // Calculate total
      const total = cartItems.reduce((sum, item) =>
        sum + (item.product.price || 0) * item.quantity, 0
      );

      // Create order
      const order = await storage.createOrder({
        userId,
        status: "processing", // Automatically mark as processing (paid)
        total,
        shippingAddress: shippingAddress.trim(),
      });

      // Create order items and update inventory
      for (const cartItem of cartItems) {
        // Create order item
        await storage.createOrderItem({
          orderId: order.id,
          productId: cartItem.productId,
          quantity: cartItem.quantity,
          price: cartItem.product.price || 0,
        });

        // Update product inventory
        const product = await storage.getProductById(cartItem.productId);
        if (product && product.inventory) {
          const newInventory = Math.max(0, product.inventory - cartItem.quantity);
          await storage.updateProduct(cartItem.productId, {
            inventory: newInventory,
            inStock: newInventory > 0,
          });
        }
      }

      // Clear cart
      await storage.clearCart(sessionId);

      // Mock email confirmation (log to console)
      console.log(`📧 Mock Email Sent to User ${userId}:`);
      console.log(`Subject: Order Confirmation - Order #${order.id}`);
      console.log(`Order Total: ₹${total.toFixed(2)}`);
      console.log(`Items: ${cartItems.length} items`);
      console.log(`Shipping Address: ${shippingAddress}`);
      console.log(`Status: Processing (Demo - Automatically Paid)`);

      res.status(201).json(order);
    } catch (error) {
      console.error("Checkout error:", error);
      res.status(500).json({ message: "Failed to process checkout" });
    }
  });

  // Register API routes
  app.use("/api", apiRouter);

  const httpServer = createServer(app);
  return httpServer;
}

// Middleware to check if user is admin
function isAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  
  const user = req.user as User;
  if (user.role !== "admin") {
    return res.status(403).json({ message: "Not authorized" });
  }
  
  next();
}
