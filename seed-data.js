import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config({ path: './config.env' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import models
import User from './backend/models/User.js';
import Product from './backend/models/Product.js';
import Order from './backend/models/Order.js';

// Sample data
const sampleUsers = [
  {
    name: 'John Farmer',
    email: 'john@farm.com',
    password: 'password123',
    role: 'farmer',
    phone: '1234567890',
    address: '123 Farm Road, Green Valley',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
  },
  {
    name: 'Sarah Farmer',
    email: 'sarah@farm.com',
    password: 'password123',
    role: 'farmer',
    phone: '2345678901',
    address: '456 Organic Lane, Fresh Meadows',
    profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
  },
  {
    name: 'Mike Customer',
    email: 'mike@email.com',
    password: 'password123',
    role: 'customer',
    phone: '3456789012',
    address: '789 City Street, Urban Center'
  },
  {
    name: 'Lisa Customer',
    email: 'lisa@email.com',
    password: 'password123',
    role: 'customer',
    phone: '4567890123',
    address: '321 Suburban Ave, Town Square'
  }
];

const sampleProducts = [
  {
    name: 'Fresh Organic Tomatoes',
    description: 'Sweet, juicy tomatoes grown without pesticides. Perfect for salads and cooking.',
    price: 2.99,
    category: 'Vegetables',
    stockQuantity: 50,
    unit: 'kg',
    image: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=300&h=200&fit=crop',
    isOrganic: true,
    harvestDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    location: 'Green Valley Farm'
  },
  {
    name: 'Sweet Corn',
    description: 'Fresh sweet corn picked this morning. Great for grilling or boiling.',
    price: 1.49,
    category: 'Vegetables',
    stockQuantity: 100,
    unit: 'pieces',
    image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=300&h=200&fit=crop',
    isOrganic: false,
    harvestDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    expiryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    location: 'Green Valley Farm'
  },
  {
    name: 'Fresh Strawberries',
    description: 'Sweet and juicy strawberries. Perfect for desserts or eating fresh.',
    price: 4.99,
    category: 'Fruits',
    stockQuantity: 25,
    unit: 'kg',
    image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=300&h=200&fit=crop',
    isOrganic: true,
    harvestDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    expiryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    location: 'Fresh Meadows Farm'
  },
  {
    name: 'Organic Carrots',
    description: 'Fresh organic carrots. Great for juicing, cooking, or eating raw.',
    price: 1.99,
    category: 'Vegetables',
    stockQuantity: 75,
    unit: 'kg',
    image: 'https://images.unsplash.com/photo-1447175008436-170170e8860b?w=300&h=200&fit=crop',
    isOrganic: true,
    harvestDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    expiryDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
    location: 'Fresh Meadows Farm'
  },
  {
    name: 'Fresh Milk',
    description: 'Pure, fresh milk from grass-fed cows. No additives or preservatives.',
    price: 3.49,
    category: 'Dairy',
    stockQuantity: 30,
    unit: 'liters',
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=300&h=200&fit=crop',
    isOrganic: true,
    harvestDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    expiryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    location: 'Green Valley Farm'
  },
  {
    name: 'Free-Range Eggs',
    description: 'Fresh eggs from free-range chickens. Rich in nutrients and flavor.',
    price: 5.99,
    category: 'Dairy',
    stockQuantity: 60,
    unit: 'dozen',
    image: 'https://images.unsplash.com/photo-1506976785307-8732e85410d2?w=300&h=200&fit=crop',
    isOrganic: false,
    harvestDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    expiryDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 21 days from now
    location: 'Fresh Meadows Farm'
  },
  {
    name: 'Honey',
    description: 'Pure, natural honey from local beehives. Great for tea and baking.',
    price: 8.99,
    category: 'Other',
    stockQuantity: 20,
    unit: 'kg',
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=300&h=200&fit=crop',
    isOrganic: true,
    harvestDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
    location: 'Green Valley Farm'
  },
  {
    name: 'Fresh Basil',
    description: 'Aromatic fresh basil. Perfect for Italian dishes and pesto.',
    price: 2.49,
    category: 'Herbs',
    stockQuantity: 40,
    unit: 'bunches',
    image: 'https://images.unsplash.com/photo-1618377382884-cf5b0c3f3b3b?w=300&h=200&fit=crop',
    isOrganic: true,
    harvestDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    location: 'Fresh Meadows Farm'
  }
];

const sampleOrders = [
  {
    customer: null, // Will be set after user creation
    items: [
      {
        product: null, // Will be set after product creation
        quantity: 2,
        price: 2.99
      }
    ],
    totalAmount: 5.98,
    status: 'pending',
    paymentStatus: 'pending',
    deliveryAddress: '789 City Street, Urban Center',
    orderDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
  },
  {
    customer: null, // Will be set after user creation
    items: [
      {
        product: null, // Will be set after product creation
        quantity: 1,
        price: 4.99
      },
      {
        product: null, // Will be set after product creation
        quantity: 3,
        price: 1.99
      }
    ],
    totalAmount: 10.96,
    status: 'confirmed',
    paymentStatus: 'paid',
    deliveryAddress: '321 Suburban Ave, Town Square',
    orderDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
  }
];

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/farmDB', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Seed the database
const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});
    console.log('🗑️  Cleared existing data');
    
    // Create users
    console.log('👥 Creating users...');
    const createdUsers = [];
    for (const userData of sampleUsers) {
      const hashedPassword = await bcrypt.hash(userData.password, 12);
      const user = new User({
        ...userData,
        password: hashedPassword
      });
      const savedUser = await user.save();
      createdUsers.push(savedUser);
      console.log(`✅ Created user: ${savedUser.name} (${savedUser.role})`);
    }
    
    // Get farmer IDs for products
    const farmers = createdUsers.filter(user => user.role === 'farmer');
    
    // Create products
    console.log('🥕 Creating products...');
    const createdProducts = [];
    for (let i = 0; i < sampleProducts.length; i++) {
      const productData = sampleProducts[i];
      const farmer = farmers[i % farmers.length]; // Distribute products among farmers
      
      const product = new Product({
        ...productData,
        farmer: farmer._id
      });
      const savedProduct = await product.save();
      createdProducts.push(savedProduct);
      console.log(`✅ Created product: ${savedProduct.name} by ${farmer.name}`);
    }
    
    // Get customer IDs for orders
    const customers = createdUsers.filter(user => user.role === 'customer');
    
    // Create orders
    console.log('📦 Creating orders...');
    for (let i = 0; i < sampleOrders.length; i++) {
      const orderData = sampleOrders[i];
      const customer = customers[i % customers.length];
      
      // Update order items with actual product IDs
      const orderItems = orderData.items.map((item, index) => ({
        product: createdProducts[index % createdProducts.length]._id,
        quantity: item.quantity,
        price: item.price
      }));
      
      const order = new Order({
        ...orderData,
        customer: customer._id,
        items: orderItems
      });
      
      const savedOrder = await order.save();
      console.log(`✅ Created order: ${savedOrder._id} for ${customer.name}`);
    }
    
    console.log('\n🎉 Database seeding completed successfully!');
    console.log(`📊 Created ${createdUsers.length} users, ${createdProducts.length} products, and ${sampleOrders.length} orders`);
    
    // Display login credentials
    console.log('\n🔑 Login Credentials:');
    console.log('Farmers:');
    createdUsers.filter(u => u.role === 'farmer').forEach(user => {
      console.log(`  ${user.name}: ${user.email} / password123`);
    });
    console.log('\nCustomers:');
    createdUsers.filter(u => u.role === 'customer').forEach(user => {
      console.log(`  ${user.name}: ${user.email} / password123`);
    });
    
    console.log('\n🚀 You can now test the application with these accounts!');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
};

// Run the seeding
connectDB().then(() => {
  seedDatabase();
});
