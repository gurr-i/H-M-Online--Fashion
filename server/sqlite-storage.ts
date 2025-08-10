import { IStorage } from './storage';
import { db } from './db';
import { eq, and, sql } from 'drizzle-orm';
import session from 'express-session';
import createMemoryStore from 'memorystore';
import {
  Product, InsertProduct,
  CartItem, InsertCartItem,
  Category, InsertCategory,
  User, InsertUser,
  Order, InsertOrder,
  OrderItem, InsertOrderItem,
  ProductReview, InsertProductReview,
  ProductReviewWithUser,
  CartItemWithProduct,
  products,
  cartItems,
  categories,
  users,
  orders,
  orderItems,
  productReviews
} from '@shared/schema';

// Create memory store for sessions
const MemoryStore = createMemoryStore(session);

export class SQLiteStorage implements IStorage {
  public sessionStore: session.Store;

  constructor() {
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    });

    // Note: Database initialization is now handled by the seeding script
    // this.initializeData() is no longer called automatically

    // Enable foreign key constraints
    db.run(sql`PRAGMA foreign_keys = ON;`);
  }



  // User Methods
  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  async createUser(user: InsertUser): Promise<User> {
    const result = await db.insert(users).values(user).returning();
    return result[0];
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const result = await db.update(users)
      .set(userData)
      .where(eq(users.id, id))
      .returning();
    return result[0];
  }

  async deleteUser(id: number): Promise<boolean> {
    const result = await db.delete(users).where(eq(users.id, id));
    return result.changes > 0;
  }

  // Product Methods
  async getAllProducts(): Promise<Product[]> {
    return await db.select().from(products);
  }

  async getProductById(id: number): Promise<Product | undefined> {
    const result = await db.select().from(products).where(eq(products.id, id));
    return result[0];
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return await db.select().from(products).where(eq(products.category, category));
  }

  async getProductsBySubCategory(subcategory: string): Promise<Product[]> {
    return await db.select().from(products).where(eq(products.subcategory, subcategory));
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const result = await db.insert(products).values(product).returning();
    return result[0];
  }

  async updateProduct(id: number, productData: Partial<Product>): Promise<Product | undefined> {
    const result = await db.update(products)
      .set(productData)
      .where(eq(products.id, id))
      .returning();
    return result[0];
  }

  async deleteProduct(id: number): Promise<boolean> {
    const result = await db.delete(products).where(eq(products.id, id));
    return result.changes > 0;
  }

  // Cart Methods
  async getCartItems(sessionId: string): Promise<CartItemWithProduct[]> {
    const items = await db.select()
      .from(cartItems)
      .where(eq(cartItems.sessionId, sessionId));

    const itemsWithProduct: CartItemWithProduct[] = [];
    for (const item of items) {
      const product = await this.getProductById(item.productId);
      if (product) {
        itemsWithProduct.push({ ...item, product });
      }
    }

    return itemsWithProduct;
  }

  async getCartItemById(id: number): Promise<CartItem | undefined> {
    const result = await db.select().from(cartItems).where(eq(cartItems.id, id));
    return result[0];
  }

  async addToCart(cartItem: InsertCartItem): Promise<CartItem> {
    const existingItem = await db.select()
      .from(cartItems)
      .where(
        and(
          eq(cartItems.productId, cartItem.productId),
          eq(cartItems.sessionId, cartItem.sessionId)
        )
      );

    if (existingItem.length > 0) {
      const updatedItem = await db.update(cartItems)
        .set({ quantity: existingItem[0].quantity + (cartItem.quantity || 1) })
        .where(eq(cartItems.id, existingItem[0].id))
        .returning();
      return updatedItem[0];
    }

    const result = await db.insert(cartItems).values(cartItem).returning();
    return result[0];
  }

  async updateCartItem(id: number, quantity: number): Promise<CartItem | undefined> {
    if (quantity <= 0) {
      await this.removeFromCart(id);
      return undefined;
    }

    const result = await db.update(cartItems)
      .set({ quantity })
      .where(eq(cartItems.id, id))
      .returning();
    return result[0];
  }

  async removeFromCart(id: number): Promise<boolean> {
    const result = await db.delete(cartItems).where(eq(cartItems.id, id));
    return result.changes > 0;
  }

  async clearCart(sessionId: string): Promise<boolean> {
    const result = await db.delete(cartItems).where(eq(cartItems.sessionId, sessionId));
    return result.changes > 0;
  }

  // Category Methods
  async getAllCategories(): Promise<Category[]> {
    return await db.select().from(categories);
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    const result = await db.select().from(categories).where(eq(categories.slug, slug));
    return result[0];
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const result = await db.insert(categories).values(category).returning();
    return result[0];
  }

  // Order Methods
  async getAllOrders(): Promise<Order[]> {
    return await db.select().from(orders);
  }

  async getOrderById(id: number): Promise<Order | undefined> {
    const result = await db.select().from(orders).where(eq(orders.id, id));
    return result[0];
  }

  async getUserOrders(userId: number): Promise<Order[]> {
    return await db.select().from(orders).where(eq(orders.userId, userId));
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const result = await db.insert(orders).values(order).returning();
    return result[0];
  }

  async updateOrderStatus(id: number, status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"): Promise<Order | undefined> {
    const result = await db.update(orders)
      .set({ status, updatedAt: new Date() })
      .where(eq(orders.id, id))
      .returning();
    return result[0];
  }

  // Order Item Methods
  async getOrderItems(orderId: number): Promise<OrderItem[]> {
    return await db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
  }

  async createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem> {
    const result = await db.insert(orderItems).values(orderItem).returning();
    return result[0];
  }

  // Review Methods
  async getProductReviews(productId: number): Promise<ProductReviewWithUser[]> {
    const result = await db
      .select({
        id: productReviews.id,
        productId: productReviews.productId,
        userId: productReviews.userId,
        rating: productReviews.rating,
        title: productReviews.title,
        comment: productReviews.comment,
        verified: productReviews.verified,
        helpful: productReviews.helpful,
        createdAt: productReviews.createdAt,
        updatedAt: productReviews.updatedAt,
        user: {
          id: users.id,
          username: users.username
        }
      })
      .from(productReviews)
      .leftJoin(users, eq(productReviews.userId, users.id))
      .where(eq(productReviews.productId, productId))
      .orderBy(productReviews.createdAt);

    return result.map(row => ({
      ...row,
      user: row.user || { id: 0, username: 'Unknown User' }
    }));
  }

  async createProductReview(review: InsertProductReview): Promise<ProductReview> {
    const result = await db.insert(productReviews).values(review).returning();
    return result[0];
  }

  async getUserReviews(userId: number): Promise<ProductReview[]> {
    return await db.select().from(productReviews).where(eq(productReviews.userId, userId));
  }

  async updateReviewHelpful(reviewId: number, helpful: number): Promise<ProductReview | undefined> {
    const result = await db
      .update(productReviews)
      .set({ helpful })
      .where(eq(productReviews.id, reviewId))
      .returning();
    return result[0];
  }
}