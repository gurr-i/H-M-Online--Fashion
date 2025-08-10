import { sql, eq } from 'drizzle-orm';
import { db } from '../server/db';
import {
    users,
    products,
    cartItems,
    categories,
    orders,
    orderItems,
    productReviews,
    coupons,
    wishlistItems
} from '../shared/schema';
import { sampleCategories, sampleProducts, createAdminUser } from './seed-data';

async function initializeDatabase() {
    console.log('Initializing database...');

    try {
        // Create tables if they don't exist - execute each statement separately
        const statements = [
            `CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT NOT NULL UNIQUE,
                email TEXT,
                password TEXT NOT NULL,
                role TEXT NOT NULL DEFAULT 'user' CHECK(role IN ('user', 'admin')),
                created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
            )`,
            `CREATE TABLE IF NOT EXISTS products (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                description TEXT NOT NULL,
                price REAL NOT NULL,
                category TEXT NOT NULL,
                subcategory TEXT NOT NULL,
                image_url TEXT NOT NULL,
                in_stock INTEGER NOT NULL DEFAULT 1,
                inventory INTEGER DEFAULT 0,
                created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
            )`,
            `CREATE TABLE IF NOT EXISTS cart_items (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                product_id INTEGER NOT NULL,
                quantity INTEGER NOT NULL DEFAULT 1,
                session_id TEXT NOT NULL,
                created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
            )`,
            `CREATE TABLE IF NOT EXISTS categories (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                parent_id INTEGER,
                slug TEXT NOT NULL UNIQUE,
                created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL
            )`,
            `CREATE TABLE IF NOT EXISTS orders (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
                total REAL NOT NULL,
                shipping_address TEXT,
                created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
            )`,
            `CREATE TABLE IF NOT EXISTS order_items (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                order_id INTEGER NOT NULL,
                product_id INTEGER NOT NULL,
                quantity INTEGER NOT NULL,
                price REAL NOT NULL,
                FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
                FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT
            )`,
            `CREATE TABLE IF NOT EXISTS product_reviews (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                product_id INTEGER NOT NULL,
                user_id INTEGER NOT NULL,
                rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
                title TEXT,
                comment TEXT,
                verified INTEGER DEFAULT 0,
                helpful INTEGER DEFAULT 0,
                created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )`,
            `CREATE TABLE IF NOT EXISTS coupons (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                code TEXT NOT NULL UNIQUE,
                name TEXT NOT NULL,
                description TEXT,
                type TEXT NOT NULL CHECK(type IN ('percentage', 'fixed')),
                value REAL NOT NULL,
                minimum_amount REAL DEFAULT 0,
                maximum_discount REAL,
                usage_limit INTEGER,
                used_count INTEGER DEFAULT 0,
                is_active INTEGER DEFAULT 1,
                valid_from TIMESTAMP NOT NULL,
                valid_until TIMESTAMP,
                created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
            )`,
            `CREATE TABLE IF NOT EXISTS wishlist_items (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                product_id INTEGER NOT NULL,
                created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
                UNIQUE(user_id, product_id)
            )`,
            // Indexes
            `CREATE INDEX IF NOT EXISTS session_idx ON cart_items(session_id)`,
            `CREATE INDEX IF NOT EXISTS product_idx ON cart_items(product_id)`,
            `CREATE INDEX IF NOT EXISTS order_idx ON order_items(order_id)`,
            `CREATE INDEX IF NOT EXISTS product_item_idx ON order_items(product_id)`,
            `CREATE INDEX IF NOT EXISTS review_product_idx ON product_reviews(product_id)`,
            `CREATE INDEX IF NOT EXISTS review_user_idx ON product_reviews(user_id)`,
            `CREATE INDEX IF NOT EXISTS coupon_code_idx ON coupons(code)`,
            `CREATE INDEX IF NOT EXISTS coupon_active_idx ON coupons(is_active)`,
            `CREATE INDEX IF NOT EXISTS wishlist_user_product_idx ON wishlist_items(user_id, product_id)`,
            `CREATE INDEX IF NOT EXISTS wishlist_user_idx ON wishlist_items(user_id)`
        ];

        for (const statement of statements) {
            await db.run(sql.raw(statement));
        }

        console.log('Database initialization completed successfully');
    } catch (error) {
        console.error('Database initialization failed:', error);
        throw error;
    }
}

async function seedDatabase() {
    console.log('Seeding database with sample data...');

    try {
        // Clear existing data (in reverse order due to foreign keys)
        await db.delete(wishlistItems);
        await db.delete(productReviews);
        await db.delete(coupons);
        await db.delete(orderItems);
        await db.delete(orders);
        await db.delete(cartItems);
        await db.delete(products);
        await db.delete(categories);
        await db.delete(users);

        console.log('Existing data cleared');

        // Insert categories
        console.log('Inserting categories...');
        for (const category of sampleCategories) {
            await db.insert(categories).values(category);
        }

        // Insert products
        console.log('Inserting products...');
        for (const product of sampleProducts) {
            await db.insert(products).values(product);
        }

        // Insert/Update admin user
        console.log('Creating/updating admin user...');
        try {
            const adminUser = await createAdminUser();

            // Check if admin user exists
            const existingAdmin = await db.select().from(users).where(eq(users.username, 'admin'));

            if (existingAdmin.length > 0) {
                // Update existing admin user with correct password
                await db.update(users)
                    .set({
                        password: adminUser.password,
                        email: adminUser.email,
                        role: adminUser.role
                    })
                    .where(eq(users.username, 'admin'));
                console.log('✅ Admin user updated with correct password');
            } else {
                // Create new admin user
                await db.insert(users).values(adminUser);
                console.log('✅ Admin user created');
            }
        } catch (error: any) {
            console.error('❌ Error with admin user:', error);
            throw error;
        }

        // Insert sample coupons
        console.log('Inserting sample coupons...');
        const sampleCoupons = [
            {
                code: 'WELCOME10',
                name: 'Welcome Discount',
                description: '10% off your first order',
                type: 'percentage' as const,
                value: 10,
                minimumAmount: 50,
                maximumDiscount: 20,
                usageLimit: 100,
                isActive: true,
                validFrom: new Date(),
                validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
            },
            {
                code: 'SAVE20',
                name: 'Save $20',
                description: '$20 off orders over $100',
                type: 'fixed' as const,
                value: 20,
                minimumAmount: 100,
                usageLimit: 50,
                isActive: true,
                validFrom: new Date(),
                validUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days
            },
            {
                code: 'SUMMER25',
                name: 'Summer Sale',
                description: '25% off summer collection',
                type: 'percentage' as const,
                value: 25,
                minimumAmount: 75,
                maximumDiscount: 50,
                usageLimit: 200,
                isActive: true,
                validFrom: new Date(),
                validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
            }
        ];

        for (const coupon of sampleCoupons) {
            await db.insert(coupons).values(coupon);
        }

        console.log('Database seeding completed successfully');
        console.log(`✅ Inserted ${sampleCategories.length} categories`);
        console.log(`✅ Inserted ${sampleProducts.length} products`);
        console.log(`✅ Created admin user (username: admin, password: admin123)`);
        console.log(`✅ Inserted ${sampleCoupons.length} sample coupons`);
        console.log('\n🎉 Database is ready for use!');

    } catch (error) {
        console.error('Database seeding failed:', error);
        throw error;
    }
}

async function main() {
    const command = process.argv[2];

    try {
        if (command === 'seed' || command === '--seed') {
            await initializeDatabase();
            await seedDatabase();
        } else {
            await initializeDatabase();
            console.log('\n💡 To seed the database with sample data, run: npm run db:seed');
        }
    } catch (error) {
        console.error('Operation failed:', error);
        process.exit(1);
    }
}

// Run based on command line arguments
main();