import { InsertProduct, InsertCategory } from '@shared/schema';
import { hashPassword } from '../server/auth';

export const sampleCategories: InsertCategory[] = [
  // Main categories
  { name: "Ladies", parentId: null, slug: "ladies" },
  { name: "Men", parentId: null, slug: "men" },
  { name: "Kids", parentId: null, slug: "kids" },
  { name: "Home", parentId: null, slug: "home" },

  // Ladies subcategories
  { name: "Shirts & Blouses", parentId: 1, slug: "shirts-blouses" },
  { name: "Dresses", parentId: 1, slug: "dresses" },
  { name: "Skirts", parentId: 1, slug: "skirts" },
  { name: "Pants", parentId: 1, slug: "pants" },
  { name: "Jeans", parentId: 1, slug: "jeans" },
  { name: "Jackets", parentId: 1, slug: "jackets" },
  { name: "Knitwear", parentId: 1, slug: "knitwear" },
  { name: "Shoes", parentId: 1, slug: "shoes" },

  // Men subcategories
  { name: "T-shirts", parentId: 2, slug: "t-shirts" },
  { name: "Shirts", parentId: 2, slug: "shirts" },
  { name: "Pants", parentId: 2, slug: "mens-pants" },
  { name: "Jeans", parentId: 2, slug: "mens-jeans" },
  { name: "Jackets", parentId: 2, slug: "mens-jackets" },
  { name: "Suits", parentId: 2, slug: "suits" },
  { name: "Shoes", parentId: 2, slug: "mens-shoes" },
  { name: "Accessories", parentId: 2, slug: "mens-accessories" },

  // Kids subcategories
  { name: "Girls", parentId: 3, slug: "girls" },
  { name: "Boys", parentId: 3, slug: "boys" },
  { name: "Baby", parentId: 3, slug: "baby" },
  { name: "Shoes", parentId: 3, slug: "kids-shoes" },

  // Home subcategories
  { name: "Bedding", parentId: 4, slug: "bedding" },
  { name: "Bath", parentId: 4, slug: "bath" },
  { name: "Kitchen", parentId: 4, slug: "kitchen" },
  { name: "Decoration", parentId: 4, slug: "decoration" },
  { name: "Storage", parentId: 4, slug: "storage" },
];

export const sampleProducts: InsertProduct[] = [
  // LADIES COLLECTION
  // Shirts & Blouses
  {
    name: "Printed Linen-Blend Shirt",
    description: "A stylish printed linen-blend shirt perfect for any occasion. Lightweight and breathable.",
    price: 29.99,
    category: "ladies",
    subcategory: "shirts-blouses",
    imageUrl: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=600&fit=crop",
    inStock: true,
    inventory: 25,
  },
  {
    name: "Cotton Embroidered Blouse",
    description: "A light cotton blouse with delicate embroidered details. Perfect for casual or office wear.",
    price: 34.99,
    category: "ladies",
    subcategory: "shirts-blouses",
    imageUrl: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=600&fit=crop",
    inStock: true,
    inventory: 18,
  },
  {
    name: "Silk Button-Up Shirt",
    description: "Luxurious silk shirt with a classic button-up design. Elegant and versatile.",
    price: 79.99,
    category: "ladies",
    subcategory: "shirts-blouses",
    imageUrl: "https://images.unsplash.com/photo-1564257577-2d5d8b3c9c1e?w=400&h=600&fit=crop",
    inStock: true,
    inventory: 12,
  },

  // Dresses
  {
    name: "Scalloped Mini Dress",
    description: "An elegant scalloped mini dress for special occasions. Features delicate trim details.",
    price: 49.99,
    category: "ladies",
    subcategory: "dresses",
    imageUrl: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=600&fit=crop",
    inStock: true,
    inventory: 15,
  },
  {
    name: "Floral Maxi Dress",
    description: "Beautiful flowing maxi dress with floral print. Perfect for summer occasions.",
    price: 69.99,
    category: "ladies",
    subcategory: "dresses",
    imageUrl: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&h=600&fit=crop",
    inStock: true,
    inventory: 20,
  },
  {
    name: "Little Black Dress",
    description: "Classic little black dress that's perfect for any formal occasion. Timeless elegance.",
    price: 89.99,
    category: "ladies",
    subcategory: "dresses",
    imageUrl: "https://images.unsplash.com/photo-1566479179817-c0b5b4b8b1e1?w=400&h=600&fit=crop",
    inStock: true,
    inventory: 8,
  },

  // Skirts
  {
    name: "Printed Mini Skirt",
    description: "A fashionable printed mini skirt for a trendy look. Perfect for casual outings.",
    price: 24.99,
    category: "ladies",
    subcategory: "skirts",
    imageUrl: "https://images.unsplash.com/photo-1583496661160-fb5886a13d77?w=400&h=600&fit=crop",
    inStock: true,
    inventory: 30,
  },
  {
    name: "Pleated Midi Skirt",
    description: "Elegant pleated midi skirt that's perfect for office or evening wear.",
    price: 39.99,
    category: "ladies",
    subcategory: "skirts",
    imageUrl: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=600&fit=crop",
    inStock: true,
    inventory: 22,
  },

  // Pants
  {
    name: "High-Waisted Trousers",
    description: "Classic high-waisted trousers with a tailored fit. Professional and stylish.",
    price: 54.99,
    category: "ladies",
    subcategory: "pants",
    imageUrl: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=600&fit=crop",
    inStock: true,
    inventory: 16,
  },
  {
    name: "Wide-Leg Palazzo Pants",
    description: "Comfortable wide-leg palazzo pants perfect for casual or dressy occasions.",
    price: 44.99,
    category: "ladies",
    subcategory: "pants",
    imageUrl: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=600&fit=crop",
    inStock: true,
    inventory: 19,
  },

  // Jeans
  {
    name: "Skinny Fit Jeans",
    description: "Classic skinny fit jeans in premium denim. Comfortable stretch fabric.",
    price: 49.99,
    category: "ladies",
    subcategory: "jeans",
    imageUrl: "https://images.unsplash.com/photo-1582418702059-97ebafb35d09?w=400&h=600&fit=crop",
    inStock: true,
    inventory: 35,
  },
  {
    name: "High-Waisted Mom Jeans",
    description: "Trendy high-waisted mom jeans with a relaxed fit. Vintage-inspired style.",
    price: 59.99,
    category: "ladies",
    subcategory: "jeans",
    imageUrl: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&h=600&fit=crop",
    inStock: true,
    inventory: 28,
  },

  // Jackets
  {
    name: "Denim Jacket",
    description: "Classic denim jacket that goes with everything. Timeless style.",
    price: 69.99,
    category: "ladies",
    subcategory: "jackets",
    imageUrl: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=600&fit=crop",
    inStock: true,
    inventory: 14,
  },
  {
    name: "Blazer",
    description: "Professional blazer perfect for office wear. Tailored fit.",
    price: 89.99,
    category: "ladies",
    subcategory: "jackets",
    imageUrl: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=600&fit=crop",
    inStock: true,
    inventory: 11,
  },

  // Knitwear
  {
    name: "Cashmere Sweater",
    description: "Luxurious cashmere sweater for ultimate comfort and style.",
    price: 129.99,
    category: "ladies",
    subcategory: "knitwear",
    imageUrl: "https://images.unsplash.com/photo-1564257577-2d5d8b3c9c1e?w=400&h=600&fit=crop",
    inStock: true,
    inventory: 9,
  },
  {
    name: "Chunky Knit Cardigan",
    description: "Cozy chunky knit cardigan perfect for layering.",
    price: 79.99,
    category: "ladies",
    subcategory: "knitwear",
    imageUrl: "https://images.unsplash.com/photo-1566479179817-c0b5b4b8b1e1?w=400&h=600&fit=crop",
    inStock: true,
    inventory: 16,
  },

  // Ladies Shoes
  {
    name: "Leather Ankle Boots",
    description: "Stylish leather ankle boots with a comfortable heel.",
    price: 99.99,
    category: "ladies",
    subcategory: "shoes",
    imageUrl: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&h=600&fit=crop",
    inStock: true,
    inventory: 20,
  },
  {
    name: "Ballet Flats",
    description: "Classic ballet flats in soft leather. Comfortable for all-day wear.",
    price: 59.99,
    category: "ladies",
    subcategory: "shoes",
    imageUrl: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400&h=600&fit=crop",
    inStock: true,
    inventory: 25,
  },

  // MEN'S COLLECTION
  // T-shirts
  {
    name: "Basic Cotton T-Shirt",
    description: "Essential cotton t-shirt in classic fit. Available in multiple colors.",
    price: 14.99,
    category: "men",
    subcategory: "t-shirts",
    imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=600&fit=crop",
    inStock: true,
    inventory: 50,
  },
  {
    name: "Graphic Print T-Shirt",
    description: "Trendy graphic print t-shirt with modern design.",
    price: 19.99,
    category: "men",
    subcategory: "t-shirts",
    imageUrl: "https://images.unsplash.com/photo-1583743814966-8936f37f4678?w=400&h=600&fit=crop",
    inStock: true,
    inventory: 35,
  },

  // Men's Shirts
  {
    name: "Oxford Button-Down Shirt",
    description: "Classic Oxford button-down shirt perfect for business or casual wear.",
    price: 49.99,
    category: "men",
    subcategory: "shirts",
    imageUrl: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&h=600&fit=crop",
    inStock: true,
    inventory: 22,
  },
  {
    name: "Linen Casual Shirt",
    description: "Lightweight linen shirt perfect for summer. Breathable and comfortable.",
    price: 39.99,
    category: "men",
    subcategory: "shirts",
    imageUrl: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=600&fit=crop",
    inStock: true,
    inventory: 18,
  },

  // Men's Pants
  {
    name: "Chino Pants",
    description: "Classic chino pants in cotton twill. Perfect for casual or smart-casual wear.",
    price: 44.99,
    category: "men",
    subcategory: "mens-pants",
    imageUrl: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=600&fit=crop",
    inStock: true,
    inventory: 30,
  },
  {
    name: "Dress Pants",
    description: "Formal dress pants with a tailored fit. Perfect for business attire.",
    price: 69.99,
    category: "men",
    subcategory: "mens-pants",
    imageUrl: "https://images.unsplash.com/photo-1506629905607-d9b1b2e3d75b?w=400&h=600&fit=crop",
    inStock: true,
    inventory: 20,
  },

  // Men's Jeans
  {
    name: "Slim Fit Jeans",
    description: "Modern slim fit jeans in premium denim. Comfortable and stylish.",
    price: 59.99,
    category: "men",
    subcategory: "mens-jeans",
    imageUrl: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=600&fit=crop",
    inStock: true,
    inventory: 40,
  },
  {
    name: "Relaxed Fit Jeans",
    description: "Comfortable relaxed fit jeans perfect for casual wear.",
    price: 54.99,
    category: "men",
    subcategory: "mens-jeans",
    imageUrl: "https://images.unsplash.com/photo-1565084888279-aca607ecce0c?w=400&h=600&fit=crop",
    inStock: true,
    inventory: 32,
  },

  // Men's Jackets
  {
    name: "Leather Jacket",
    description: "Classic leather jacket with timeless appeal. Perfect for any season.",
    price: 199.99,
    category: "men",
    subcategory: "mens-jackets",
    imageUrl: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=600&fit=crop",
    inStock: true,
    inventory: 12,
  },
  {
    name: "Bomber Jacket",
    description: "Modern bomber jacket with a contemporary fit. Versatile and stylish.",
    price: 89.99,
    category: "men",
    subcategory: "mens-jackets",
    imageUrl: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=600&fit=crop",
    inStock: true,
    inventory: 18,
  },

  // Suits
  {
    name: "Two-Piece Business Suit",
    description: "Professional two-piece suit perfect for business meetings and formal events.",
    price: 299.99,
    category: "men",
    subcategory: "suits",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop",
    inStock: true,
    inventory: 8,
  },
  {
    name: "Slim Fit Suit",
    description: "Modern slim fit suit with contemporary styling. Perfect for special occasions.",
    price: 349.99,
    category: "men",
    subcategory: "suits",
    imageUrl: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=600&fit=crop",
    inStock: true,
    inventory: 6,
  },

  // Men's Shoes
  {
    name: "Oxford Dress Shoes",
    description: "Classic Oxford dress shoes in genuine leather. Perfect for formal occasions.",
    price: 129.99,
    category: "men",
    subcategory: "mens-shoes",
    imageUrl: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=600&fit=crop",
    inStock: true,
    inventory: 15,
  },
  {
    name: "Casual Sneakers",
    description: "Comfortable casual sneakers perfect for everyday wear.",
    price: 79.99,
    category: "men",
    subcategory: "mens-shoes",
    imageUrl: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400&h=600&fit=crop",
    inStock: true,
    inventory: 25,
  },

  // Men's Accessories
  {
    name: "Leather Belt",
    description: "Classic leather belt with silver buckle. Essential accessory for any wardrobe.",
    price: 39.99,
    category: "men",
    subcategory: "mens-accessories",
    imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=600&fit=crop",
    inStock: true,
    inventory: 30,
  },
  {
    name: "Silk Tie",
    description: "Elegant silk tie perfect for business or formal occasions.",
    price: 29.99,
    category: "men",
    subcategory: "mens-accessories",
    imageUrl: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=600&fit=crop",
    inStock: true,
    inventory: 20,
  },

  // KIDS COLLECTION
  // Girls
  {
    name: "Girls Floral Dress",
    description: "Beautiful floral dress for girls. Perfect for special occasions.",
    price: 24.99,
    category: "kids",
    subcategory: "girls",
    imageUrl: "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=400&h=600&fit=crop",
    inStock: true,
    inventory: 20,
  },
  {
    name: "Girls Denim Jacket",
    description: "Trendy denim jacket for girls. Perfect for layering.",
    price: 34.99,
    category: "kids",
    subcategory: "girls",
    imageUrl: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=400&h=600&fit=crop",
    inStock: true,
    inventory: 15,
  },

  // Boys
  {
    name: "Boys Polo Shirt",
    description: "Classic polo shirt for boys. Comfortable and stylish.",
    price: 19.99,
    category: "kids",
    subcategory: "boys",
    imageUrl: "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=400&h=600&fit=crop",
    inStock: true,
    inventory: 25,
  },
  {
    name: "Boys Cargo Shorts",
    description: "Practical cargo shorts for active boys. Multiple pockets.",
    price: 22.99,
    category: "kids",
    subcategory: "boys",
    imageUrl: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=400&h=600&fit=crop",
    inStock: true,
    inventory: 18,
  },

  // Baby
  {
    name: "Baby Onesie Set",
    description: "Soft cotton onesie set for babies. Pack of 3.",
    price: 29.99,
    category: "kids",
    subcategory: "baby",
    imageUrl: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&h=600&fit=crop",
    inStock: true,
    inventory: 30,
  },
  {
    name: "Baby Sleep Suit",
    description: "Cozy sleep suit for babies. Ultra-soft fabric.",
    price: 19.99,
    category: "kids",
    subcategory: "baby",
    imageUrl: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&h=600&fit=crop",
    inStock: true,
    inventory: 25,
  },

  // Kids Shoes
  {
    name: "Kids Sneakers",
    description: "Comfortable sneakers for kids. Perfect for play and school.",
    price: 39.99,
    category: "kids",
    subcategory: "kids-shoes",
    imageUrl: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400&h=600&fit=crop",
    inStock: true,
    inventory: 22,
  },
  {
    name: "Kids Sandals",
    description: "Summer sandals for kids. Lightweight and breathable.",
    price: 24.99,
    category: "kids",
    subcategory: "kids-shoes",
    imageUrl: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&h=600&fit=crop",
    inStock: true,
    inventory: 28,
  },

  // HOME COLLECTION
  // Bedding
  {
    name: "Cotton Bed Sheets Set",
    description: "Soft cotton bed sheets set. Includes fitted sheet, flat sheet, and pillowcases.",
    price: 49.99,
    category: "home",
    subcategory: "bedding",
    imageUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=600&fit=crop",
    inStock: true,
    inventory: 20,
  },
  {
    name: "Down Alternative Comforter",
    description: "Hypoallergenic down alternative comforter. Machine washable.",
    price: 79.99,
    category: "home",
    subcategory: "bedding",
    imageUrl: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&h=600&fit=crop",
    inStock: true,
    inventory: 15,
  },

  // Bath
  {
    name: "Turkish Cotton Towel Set",
    description: "Luxurious Turkish cotton towel set. Includes bath and hand towels.",
    price: 39.99,
    category: "home",
    subcategory: "bath",
    imageUrl: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&h=600&fit=crop",
    inStock: true,
    inventory: 18,
  },
  {
    name: "Bamboo Bath Mat",
    description: "Eco-friendly bamboo bath mat. Non-slip and water-resistant.",
    price: 24.99,
    category: "home",
    subcategory: "bath",
    imageUrl: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&h=600&fit=crop",
    inStock: true,
    inventory: 22,
  },

  // Kitchen
  {
    name: "Ceramic Dinnerware Set",
    description: "16-piece ceramic dinnerware set. Dishwasher and microwave safe.",
    price: 89.99,
    category: "home",
    subcategory: "kitchen",
    imageUrl: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&h=600&fit=crop",
    inStock: true,
    inventory: 12,
  },
  {
    name: "Stainless Steel Cookware Set",
    description: "Professional stainless steel cookware set. Includes pots and pans.",
    price: 149.99,
    category: "home",
    subcategory: "kitchen",
    imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=600&fit=crop",
    inStock: true,
    inventory: 8,
  },

  // Decoration
  {
    name: "Scented Candles Set",
    description: "Set of 3 scented candles in glass jars. Various fragrances.",
    price: 34.99,
    category: "home",
    subcategory: "decoration",
    imageUrl: "https://images.unsplash.com/photo-1602874801006-e26c4c5b5e8a?w=400&h=600&fit=crop",
    inStock: true,
    inventory: 30,
  },
  {
    name: "Wall Art Print Set",
    description: "Set of 3 modern wall art prints. Ready to frame.",
    price: 19.99,
    category: "home",
    subcategory: "decoration",
    imageUrl: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=600&fit=crop",
    inStock: true,
    inventory: 25,
  },

  // Storage
  {
    name: "Woven Storage Baskets",
    description: "Set of 3 woven storage baskets. Perfect for organizing.",
    price: 44.99,
    category: "home",
    subcategory: "storage",
    imageUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=600&fit=crop",
    inStock: true,
    inventory: 16,
  },
  {
    name: "Under-Bed Storage Box",
    description: "Clear under-bed storage box with wheels. Space-saving solution.",
    price: 29.99,
    category: "home",
    subcategory: "storage",
    imageUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=600&fit=crop",
    inStock: true,
    inventory: 20,
  }
];

export const createAdminUser = async () => ({
  username: "admin",
  password: await hashPassword("admin123"),
  email: "admin@example.com",
  role: "admin" as const
});