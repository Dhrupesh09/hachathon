# 🚜 FarmDirect - Direct Farm to Customer Marketplace

A modern, full-stack web application that connects farmers directly with customers, eliminating middlemen and providing fresh farm products at competitive prices.

## ✨ Features

### 🌾 For Farmers
- **User Registration & Authentication**: Secure signup/login with JWT tokens
- **Product Management**: Add, edit, and delete farm products
- **Order Management**: Track and update order statuses
- **Inventory Control**: Real-time stock management
- **Customer Communication**: Built-in messaging system
- **Analytics Dashboard**: View sales and order statistics

### 🛒 For Customers
- **Product Discovery**: Browse products by category, search, and filters
- **Shopping Cart**: Add products and manage quantities
- **Order Placement**: Place orders with multiple farmers
- **Order Tracking**: Real-time order status updates
- **Product Reviews**: Rate and review delivered products
- **Delivery Management**: Multiple delivery address support

### 🔒 Security Features
- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt encryption for user passwords
- **Input Validation**: Comprehensive form validation
- **Rate Limiting**: API request throttling
- **CORS Protection**: Cross-origin resource sharing security
- **Helmet Security**: HTTP header security middleware

## 🛠️ Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Token authentication
- **Bcrypt** - Password hashing
- **Express Validator** - Input validation
- **Helmet** - Security middleware
- **Rate Limiter** - API protection

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Styling with Tailwind CSS
- **JavaScript (ES6+)** - Modern JavaScript features
- **Tailwind CSS** - Utility-first CSS framework
- **Responsive Design** - Mobile-first approach

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v16 or higher)
- **MongoDB** (v5 or higher)
- **npm** or **yarn** package manager

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd FarmDirect
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `config.env` file in the root directory:
```env
# Database Configuration
MONGODB_URI=mongodb://127.0.0.1:27017/farmDB

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# Server Configuration
PORT=5000
NODE_ENV=development

# File Upload Configuration
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads
```

### 4. Start MongoDB
Make sure MongoDB is running on your system:
```bash
# On Windows
net start MongoDB

# On macOS/Linux
sudo systemctl start mongod
# or
brew services start mongodb-community
```

### 5. Run the Application
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The application will be available at `http://localhost:5000`

## 📁 Project Structure

```
FarmDirect/
├── backend/
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── middleware/      # Custom middleware
│   └── server.js        # Main server file
├── front/               # Frontend HTML files
├── uploads/             # File uploads directory
├── config.env           # Environment variables
├── package.json         # Dependencies and scripts
└── README.md            # This file
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get user profile
- `PUT /api/auth/me` - Update user profile

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create new product (farmers only)
- `PUT /api/products/:id` - Update product (owner only)
- `DELETE /api/products/:id` - Delete product (owner only)
- `GET /api/products/farmer/:farmerId` - Get farmer's products

### Orders
- `POST /api/orders` - Create new order (customers only)
- `GET /api/orders/customer` - Get customer orders
- `GET /api/orders/farmer` - Get farmer orders
- `GET /api/orders/:id` - Get single order
- `PUT /api/orders/:id/status` - Update order status (farmers only)
- `POST /api/orders/:id/review` - Rate and review order (customers only)

## 🎯 Usage Examples

### Farmer Registration
```javascript
const farmerData = {
  name: "John Doe",
  email: "john@farm.com",
  password: "securepassword",
  phone: "+1234567890",
  role: "farmer",
  farmName: "Green Valley Farm",
  address: {
    street: "123 Farm Road",
    city: "Farmville",
    state: "CA",
    zipCode: "12345",
    country: "USA"
  }
};

const response = await fetch('/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(farmerData)
});
```

### Adding a Product
```javascript
const productData = {
  name: "Fresh Tomatoes",
  description: "Organic, vine-ripened tomatoes",
  category: "vegetables",
  price: 2.99,
  unit: "lb",
  quantity: 50,
  images: ["tomato1.jpg", "tomato2.jpg"],
  isOrganic: true
};

const response = await fetch('/api/products', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify(productData)
});
```

### Placing an Order
```javascript
const orderData = {
  farmerId: "farmer123",
  items: [
    {
      productId: "product456",
      quantity: 2
    }
  ],
  deliveryAddress: {
    street: "456 Customer St",
    city: "Customer City",
    state: "CA",
    zipCode: "67890",
    country: "USA"
  }
};

const response = await fetch('/api/orders', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify(orderData)
});
```

## 🔧 Configuration Options

### Database
- **MongoDB URI**: Configure your MongoDB connection string
- **Database Name**: Default is `farmDB`

### JWT Settings
- **Secret Key**: Change the JWT secret for production
- **Expiration**: Set token expiration time (default: 7 days)

### Server Settings
- **Port**: Configure server port (default: 5000)
- **Environment**: Set to `production` for production deployment

## 🚀 Deployment

### Production Considerations
1. **Environment Variables**: Set `NODE_ENV=production`
2. **JWT Secret**: Use a strong, unique secret key
3. **Database**: Use MongoDB Atlas or production MongoDB instance
4. **HTTPS**: Enable SSL/TLS encryption
5. **PM2**: Use process manager for production
6. **Nginx**: Reverse proxy for load balancing

### Docker Deployment
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## 🧪 Testing

### Manual Testing
1. **User Registration**: Test farmer and customer signup
2. **Authentication**: Test login/logout functionality
3. **Product Management**: Test CRUD operations for products
4. **Order Flow**: Test complete order lifecycle
5. **API Endpoints**: Test all API endpoints with Postman

### Automated Testing (Future Enhancement)
```bash
npm test
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](issues) page
2. Create a new issue with detailed description
3. Contact the development team

## 🔮 Future Enhancements

- **Real-time Chat**: WebSocket-based messaging system
- **Payment Integration**: Stripe/PayPal payment processing
- **Mobile App**: React Native mobile application
- **Analytics Dashboard**: Advanced reporting and insights
- **Push Notifications**: Order updates and promotions
- **Multi-language Support**: Internationalization
- **Advanced Search**: Elasticsearch integration
- **Image Processing**: Automatic image optimization
- **Delivery Tracking**: Real-time delivery updates
- **Subscription Service**: Weekly/monthly product boxes

## 📊 Performance Metrics

- **Response Time**: < 200ms for API calls
- **Database Queries**: Optimized with proper indexing
- **Image Loading**: Lazy loading and optimization
- **Mobile Performance**: Responsive design optimization

---

**Built with ❤️ for the farming community**
