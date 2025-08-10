import {
  Product, InsertProduct,
  CartItem, InsertCartItem,
  Category, InsertCategory,
  User, InsertUser,
  Order, InsertOrder,
  OrderItem, InsertOrderItem,
  ProductReview, InsertProductReview,
  ProductReviewWithUser,
  CartItemWithProduct
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";

// Create memory store for sessions
const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // Users
  getUserByUsername(username: string): Promise<User | undefined>;
  getUser(id: number): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<User>): Promise<User | undefined>;
  deleteUser(id: number): Promise<boolean>;

  // Products
  getAllProducts(): Promise<Product[]>;
  getProductById(id: number): Promise<Product | undefined>;
  getProductsByCategory(category: string): Promise<Product[]>;
  getProductsBySubCategory(subcategory: string): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<Product>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;

  // Cart Items
  getCartItems(sessionId: string): Promise<CartItemWithProduct[]>;
  getCartItemById(id: number): Promise<CartItem | undefined>;
  addToCart(cartItem: InsertCartItem): Promise<CartItem>;
  updateCartItem(id: number, quantity: number): Promise<CartItem | undefined>;
  removeFromCart(id: number): Promise<boolean>;
  clearCart(sessionId: string): Promise<boolean>;

  // Categories
  getAllCategories(): Promise<Category[]>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;

  // Orders
  getAllOrders(): Promise<Order[]>;
  getOrderById(id: number): Promise<Order | undefined>;
  getUserOrders(userId: number): Promise<Order[]>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrderStatus(id: number, status: string): Promise<Order | undefined>;

  // Order Items
  getOrderItems(orderId: number): Promise<OrderItem[]>;
  createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem>;

  // Review management
  getProductReviews(productId: number): Promise<ProductReviewWithUser[]>;
  createProductReview(review: InsertProductReview): Promise<ProductReview>;
  getUserReviews(userId: number): Promise<ProductReview[]>;
  updateReviewHelpful(reviewId: number, helpful: number): Promise<ProductReview | undefined>;

  // Session store
  sessionStore: session.Store;
}

export class MemStorage implements IStorage {
  private products: Map<number, Product>;
  private cartItems: Map<number, CartItem>;
  private categories: Map<number, Category>;
  private users: Map<number, User>;
  private orders: Map<number, Order>;
  private orderItems: Map<number, OrderItem>;
  private productReviews: Map<number, ProductReview>;

  private productCounter: number;
  private cartItemCounter: number;
  private categoryCounter: number;
  private userCounter: number;
  private orderCounter: number;
  private orderItemCounter: number;
  private reviewCounter: number;
  
  public sessionStore: session.Store;

  constructor() {
    this.products = new Map();
    this.cartItems = new Map();
    this.categories = new Map();
    this.users = new Map();
    this.orders = new Map();
    this.orderItems = new Map();
    this.productReviews = new Map();

    this.productCounter = 1;
    this.cartItemCounter = 1;
    this.categoryCounter = 1;
    this.userCounter = 1;
    this.orderCounter = 1;
    this.orderItemCounter = 1;
    this.reviewCounter = 1;
    
    // Initialize session store
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    });
    // Async initialization must be called explicitly after construction
  }

  // Call this after constructing MemStorage
  public async init() {
    await this.createInitialAdminUser();
    await this.initializeCategories();
    await this.initializeProducts();
  }
  
  // Create initial admin user directly (without calling async functions)
  private async createInitialAdminUser() {
    const { createAdminUser } = await import('../scripts/seed-data');
    const adminUser = await createAdminUser();
    const newUser: User = {
      ...adminUser,
      id: this.userCounter++,
      createdAt: new Date()
    };
    this.users.set(newUser.id, newUser);
  }

  // Initialize sample categories
  private async initializeCategories() {
    const { sampleCategories } = await import('../scripts/seed-data');
    sampleCategories.forEach(category => {
      this.createCategory(category);
    });
  }

  // Initialize sample products
  private async initializeProducts() {
    const { sampleProducts } = await import('../scripts/seed-data');
    sampleProducts.forEach(product => {
      this.createProduct(product);
    });
  }

  // Product Methods
  async getAllProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProductById(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      (product) => product.category === category
    );
  }

  async getProductsBySubCategory(subcategory: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      (product) => product.subcategory === subcategory
    );
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const id = this.productCounter++;
    const now = new Date();
    const newProduct: Product = {
      ...product,
      id,
      inStock: product.inStock ?? true,
      inventory: product.inventory ?? 0,
      createdAt: now,
      updatedAt: now
    };
    this.products.set(id, newProduct);
    return newProduct;
  }

  // Cart Methods
  async getCartItems(sessionId: string): Promise<CartItemWithProduct[]> {
    const items = Array.from(this.cartItems.values()).filter(
      (item) => item.sessionId === sessionId
    );

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
    return this.cartItems.get(id);
  }

  async addToCart(cartItem: InsertCartItem): Promise<CartItem> {
    // Check if product exists
    const product = await this.getProductById(cartItem.productId);
    if (!product) {
      throw new Error("Product not found");
    }

    // Check if item already exists in cart
    const existingItem = Array.from(this.cartItems.values()).find(
      (item) => item.productId === cartItem.productId && item.sessionId === cartItem.sessionId
    );

    if (existingItem) {
      // Update quantity if item exists
      existingItem.quantity += cartItem.quantity || 1;
      this.cartItems.set(existingItem.id, existingItem);
      return existingItem;
    } else {
      // Create new cart item
      const id = this.cartItemCounter++;
      const newCartItem: CartItem = {
        ...cartItem,
        id,
        quantity: cartItem.quantity ?? 1,
        createdAt: new Date()
      };
      this.cartItems.set(id, newCartItem);
      return newCartItem;
    }
  }

  async updateCartItem(id: number, quantity: number): Promise<CartItem | undefined> {
    const cartItem = this.cartItems.get(id);
    if (!cartItem) {
      return undefined;
    }

    if (quantity <= 0) {
      this.cartItems.delete(id);
      return undefined;
    }

    const updatedItem: CartItem = { ...cartItem, quantity };
    this.cartItems.set(id, updatedItem);
    return updatedItem;
  }

  async removeFromCart(id: number): Promise<boolean> {
    return this.cartItems.delete(id);
  }

  async clearCart(sessionId: string): Promise<boolean> {
    const cartItemsToRemove = Array.from(this.cartItems.values())
      .filter((item) => item.sessionId === sessionId);
    
    for (const item of cartItemsToRemove) {
      this.cartItems.delete(item.id);
    }
    
    return true;
  }

  // Category Methods
  async getAllCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    return Array.from(this.categories.values()).find(
      (category) => category.slug === slug
    );
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const id = this.categoryCounter++;
    const newCategory: Category = {
      ...category,
      id,
      parentId: category.parentId ?? null,
      createdAt: new Date()
    };
    this.categories.set(id, newCategory);
    return newCategory;
  }

  // User Methods
  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async createUser(user: InsertUser): Promise<User> {
    const id = this.userCounter++;
    const now = new Date();
    const newUser: User = {
      ...user,
      id,
      email: user.email ?? null,
      role: "user",
      createdAt: now
    };
    this.users.set(id, newUser);
    return newUser;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) {
      return undefined;
    }

    const updatedUser = { ...user, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async deleteUser(id: number): Promise<boolean> {
    return this.users.delete(id);
  }

  // Product Update and Delete Methods
  async updateProduct(id: number, productData: Partial<Product>): Promise<Product | undefined> {
    const product = this.products.get(id);
    if (!product) {
      return undefined;
    }

    const updatedProduct = { ...product, ...productData };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }

  async deleteProduct(id: number): Promise<boolean> {
    return this.products.delete(id);
  }

  // Order Methods
  async getAllOrders(): Promise<Order[]> {
    return Array.from(this.orders.values());
  }

  async getOrderById(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async getUserOrders(userId: number): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(
      (order) => order.userId === userId
    );
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const id = this.orderCounter++;
    const now = new Date();
    const newOrder: Order = {
      ...order,
      id,
      userId: order.userId ?? null,
      status: order.status ?? "pending",
      shippingAddress: order.shippingAddress ?? null,
      createdAt: now,
      updatedAt: now
    };
    this.orders.set(id, newOrder);
    return newOrder;
  }

  async updateOrderStatus(id: number, status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (!order) {
      return undefined;
    }

    const updatedOrder = {
      ...order,
      status,
      updatedAt: new Date()
    };
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }

  // Order Item Methods
  async getOrderItems(orderId: number): Promise<OrderItem[]> {
    return Array.from(this.orderItems.values()).filter(
      (item) => item.orderId === orderId
    );
  }

  async createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem> {
    const id = this.orderItemCounter++;
    const newOrderItem: OrderItem = { ...orderItem, id };
    this.orderItems.set(id, newOrderItem);
    return newOrderItem;
  }

  // Review methods
  async getProductReviews(productId: number): Promise<ProductReviewWithUser[]> {
    const reviews = Array.from(this.productReviews.values()).filter(
      (review) => review.productId === productId
    );

    return reviews.map(review => {
      const user = this.users.get(review.userId);
      return {
        ...review,
        user: {
          id: user?.id || 0,
          username: user?.username || 'Unknown User'
        }
      };
    });
  }

  async createProductReview(review: InsertProductReview): Promise<ProductReview> {
    const id = this.reviewCounter++;
    const now = new Date();
    const newReview: ProductReview = {
      ...review,
      id,
      title: review.title || null,
      comment: review.comment || null,
      helpful: 0,
      verified: false, // Would be set based on purchase history
      createdAt: now,
      updatedAt: now
    };
    this.productReviews.set(id, newReview);
    return newReview;
  }

  async getUserReviews(userId: number): Promise<ProductReview[]> {
    return Array.from(this.productReviews.values()).filter(
      (review) => review.userId === userId
    );
  }

  async updateReviewHelpful(reviewId: number, helpful: number): Promise<ProductReview | undefined> {
    const review = this.productReviews.get(reviewId);
    if (!review) return undefined;

    const updatedReview = { ...review, helpful };
    this.productReviews.set(reviewId, updatedReview);
    return updatedReview;
  }
}

import { SQLiteStorage } from './sqlite-storage';

export const storage = new SQLiteStorage();
