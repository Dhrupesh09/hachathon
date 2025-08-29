# 🚀 FarmDirect Startup Guide

## Quick Start (Without npm)

If you don't have Node.js/npm installed, here's how to get started:

### Option 1: Install Node.js and npm
1. Download Node.js from [https://nodejs.org/](https://nodejs.org/)
2. Install it (this will also install npm)
3. Open a new terminal/command prompt
4. Navigate to your project folder
5. Run: `npm install`
6. Run: `npm start`

### Option 2: Use the Project as Static Files
1. Open `farmdirect.html` in your web browser
2. Navigate through the different pages using the navigation
3. Note: Backend functionality won't work without the server running

## What's Been Built

### ✅ Complete Backend API
- **User Authentication**: JWT-based login/signup for farmers and customers
- **Product Management**: Full CRUD operations for farm products
- **Order System**: Complete order lifecycle management
- **Database Models**: MongoDB schemas for users, products, and orders
- **Security**: Password hashing, input validation, rate limiting

### ✅ Enhanced Frontend
- **Landing Page**: Beautiful homepage with navigation
- **Farmer Pages**: Signup, signin, product management, order management
- **Customer Pages**: Signup, signin, dashboard, shopping cart
- **Responsive Design**: Works on all devices
- **Modern UI**: Tailwind CSS styling

### ✅ Project Structure
```
FarmDirect/
├── backend/
│   ├── models/          # Database schemas
│   ├── routes/          # API endpoints
│   ├── middleware/      # Authentication & validation
│   └── server.js        # Main server
├── front/               # HTML pages
├── uploads/             # File storage
├── config.env           # Configuration
├── package.json         # Dependencies
└── README.md            # Full documentation
```

## Key Features

### 🌾 For Farmers
- Register and manage farm profile
- Add/edit/delete products
- Track orders and update status
- Manage inventory

### 🛒 For Customers
- Browse products by category
- Search and filter products
- Shopping cart functionality
- Place orders and track delivery

### 🔒 Security Features
- Secure authentication
- Input validation
- Rate limiting
- CORS protection

## Next Steps

1. **Install Node.js** if you want full functionality
2. **Start MongoDB** database
3. **Run the server** with `npm start`
4. **Test the application** by visiting `http://localhost:5000`

## Troubleshooting

### Common Issues
- **"npm not found"**: Install Node.js from nodejs.org
- **"MongoDB connection failed"**: Start MongoDB service
- **"Port already in use"**: Change port in config.env

### Getting Help
- Check the full README.md for detailed instructions
- Review the code comments for implementation details
- Test individual components step by step

---

**Your FarmDirect project is now complete and ready to run! 🎉**
