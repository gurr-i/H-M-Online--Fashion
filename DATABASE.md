# Database Setup & Management

## Overview
The HnMfashion application uses SQLite as the database with Drizzle ORM for type-safe database operations.

## Database Schema
The database includes the following tables:
- **users** - User accounts and authentication
- **products** - Product catalog with categories and inventory
- **categories** - Hierarchical category structure
- **cart_items** - Shopping cart functionality
- **orders** - Order management and tracking
- **order_items** - Individual items within orders
- **product_reviews** - Customer reviews and ratings
- **coupons** - Discount codes and promotions
- **wishlist_items** - User favorites and wishlist

## Available Commands

### Initialize Database
Creates all tables and indexes if they don't exist:
```bash
npm run db:init
```

### Seed Database
Initializes the database AND populates it with comprehensive sample data:
```bash
npm run db:seed
```

### Push Schema Changes
Pushes schema changes to the database (use with caution):
```bash
npm run db:push
```

## Sample Data Included

### Categories (29 total)
- **Ladies** (12 subcategories): Shirts & Blouses, Dresses, Skirts, Pants, Jeans, Jackets, Knitwear, Shoes
- **Men** (8 subcategories): T-shirts, Shirts, Pants, Jeans, Jackets, Suits, Shoes, Accessories  
- **Kids** (4 subcategories): Girls, Boys, Baby, Shoes
- **Home** (5 subcategories): Bedding, Bath, Kitchen, Decoration, Storage

### Products (52 total)
- **Ladies Collection** (24 products): Complete range from casual to formal wear
- **Men's Collection** (16 products): T-shirts, shirts, pants, suits, shoes, accessories
- **Kids Collection** (8 products): Clothing and shoes for girls, boys, and babies
- **Home Collection** (12 products): Bedding, bath, kitchen, decoration, and storage items

### Admin User
- **Username**: admin
- **Password**: admin123
- **Role**: admin
- **Email**: admin@example.com

### Sample Coupons (3 total)
- **WELCOME10**: 10% off first order (min $50, max $20 discount)
- **SAVE20**: $20 off orders over $100
- **SUMMER25**: 25% off summer collection (min $75, max $50 discount)

## Product Features
- **Realistic Pricing**: $14.99 - $349.99 range
- **Inventory Tracking**: Stock levels (6-50 items per product)
- **High-Quality Images**: Professional product photography
- **Detailed Descriptions**: Comprehensive product information
- **Category Mapping**: Proper parent/child category relationships

## Database File Location
The SQLite database file is located at: `./database.sqlite`

## Development Workflow

1. **First Time Setup**:
   ```bash
   npm run db:seed
   ```

2. **Reset Database** (clears all data and reseeds):
   ```bash
   npm run db:seed
   ```

3. **Just Initialize Tables** (no sample data):
   ```bash
   npm run db:init
   ```

## Schema Updates
When making changes to the schema in `shared/schema.ts`:

1. Update the schema file
2. Run `npm run db:push` to apply changes
3. Update `scripts/init-db.ts` if needed for new tables
4. Test with `npm run db:seed` to ensure seeding still works

## Notes
- The seeding process clears existing data before inserting new data
- Admin user creation is idempotent (won't fail if user already exists)
- All foreign key relationships are properly maintained
- Indexes are created for optimal query performance

## Troubleshooting

### Common Issues
1. **"UNIQUE constraint failed"**: Usually means trying to insert duplicate data. The seed script handles this gracefully for admin users.

2. **"Table already exists"**: This is normal and expected. The `CREATE TABLE IF NOT EXISTS` statements prevent errors.

3. **Schema conflicts**: If you get schema conflicts, you may need to delete the database file and run `npm run db:seed` again.

### Reset Everything
To completely reset the database:
```bash
rm database.sqlite
npm run db:seed
```

This will create a fresh database with all sample data.
