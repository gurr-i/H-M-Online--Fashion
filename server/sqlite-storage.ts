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
  CartItemWithProduct,
  products,
  cartItems,
  categories,
  users,
  orders,
  orderItems
} from '@shared/schema';

// Create memory store for sessions
const MemoryStore = createMemoryStore(session);

export class SQLiteStorage implements IStorage {
  public sessionStore: session.Store;

  constructor() {
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    });
    
    // Initialize database with sample data
    this.initializeData().catch(err => {
      console.error('Failed to initialize database:', err);
      process.exit(1); // Exit if database initialization fails
    });

    // Enable foreign key constraints
    db.run(sql`PRAGMA foreign_keys = ON;`);
  }

  private async initializeData() {
    try {
      // Import sample data
      const { adminUser, sampleCategories, sampleProducts } = await import('../scripts/seed-data');

      // Create admin user if not exists
      const existingAdmin = await this.getUserByUsername('admin');
      if (!existingAdmin) {
        await this.createUser(adminUser);
      }

      // Initialize categories if none exist
      const existingCategories = await this.getAllCategories();
      if (existingCategories.length === 0) {
        for (const category of sampleCategories) {
          await this.createCategory(category);
        }
      }

      // Initialize products if none exist
      const existingProducts = await this.getAllProducts();
      if (existingProducts.length === 0) {
        for (const product of sampleProducts) {
          await this.createProduct(product);
        }
      }
    } catch (error) {
      console.error('Error initializing database:', error);
      throw error;
    }
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
        .set({ quantity: existingItem[0].quantity + cartItem.quantity })
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

  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
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
}