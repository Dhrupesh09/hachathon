# Database Seeding Guide

This guide will help you populate your FarmDirect database with sample data for testing and demonstration purposes.

## What the Seed Script Creates

### 👥 Sample Users
- **2 Farmers**: John Farmer & Sarah Farmer
- **2 Customers**: Mike Customer & Lisa Customer
- All users have password: `password123`

### 🥕 Sample Products
- **8 Products** across different categories:
  - Vegetables: Tomatoes, Corn, Carrots
  - Fruits: Strawberries
  - Dairy: Milk, Eggs
  - Other: Honey, Basil
- Products are distributed between the two farmers
- Realistic pricing, stock quantities, and expiry dates
- Beautiful product images from Unsplash

### 📦 Sample Orders
- **2 Sample Orders** with different statuses
- Realistic order data with proper relationships

## How to Run the Seed Script

### Prerequisites
1. **MongoDB must be running** on your system
2. **Node.js and npm** must be installed
3. **All dependencies** must be installed (`npm install`)

### Step 1: Start MongoDB
Make sure MongoDB is running on your system:
```bash
# On Windows (if installed as a service)
net start MongoDB

# Or start manually
"C:\Program Files\MongoDB\Server\6.0\bin\mongod.exe"
```

### Step 2: Run the Seed Script
```bash
npm run seed
```

### Step 3: Verify the Data
Check the console output to see what was created. You should see:
- ✅ MongoDB Connected
- ✅ Created users, products, and orders
- 🔑 Login credentials displayed

## Sample Login Credentials

After running the seed script, you can use these accounts:

### Farmers
- **John Farmer**: `john@farm.com` / `password123`
- **Sarah Farmer**: `sarah@farm.com` / `password123`

### Customers
- **Mike Customer**: `mike@email.com` / `password123`
- **Lisa Customer**: `lisa@email.com` / `password123`

## Testing the Application

1. **Start your server**: `npm run dev`
2. **Visit**: `http://localhost:5000`
3. **Login** with any of the sample accounts above
4. **Browse products** on the customer dashboard
5. **Test farmer features** by logging in as a farmer

## What Happens During Seeding

1. **Database Connection**: Connects to MongoDB using your config
2. **Data Cleanup**: Removes any existing data (clean slate)
3. **User Creation**: Creates users with hashed passwords
4. **Product Creation**: Creates products linked to farmers
5. **Order Creation**: Creates sample orders linked to customers and products
6. **Cleanup**: Closes database connection and exits

## Troubleshooting

### "MongoDB connection error"
- Make sure MongoDB is running
- Check your `config.env` file for correct `MONGODB_URI`
- Default fallback: `mongodb://127.0.0.1:27017/farmDB`

### "Module not found" errors
- Run `npm install` to install dependencies
- Make sure you're in the project root directory

### "Permission denied" errors
- Make sure you have write permissions to the database
- Check if MongoDB is running with proper permissions

## Customizing the Seed Data

You can modify `seed-data.js` to:
- Add more users, products, or orders
- Change product details, prices, or images
- Modify user information or roles
- Add different categories or product types

## Security Note

⚠️ **Important**: The seed script creates accounts with simple passwords (`password123`). In production, you should:
- Use stronger passwords
- Change default credentials immediately
- Remove or secure the seed script

## Next Steps

After seeding:
1. Test the login functionality
2. Browse products as a customer
3. Test farmer features (add products, manage orders)
4. Explore the API endpoints using the test page (`/test`)

Happy testing! 🚀
