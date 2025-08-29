import express from 'express';
import { body, validationResult } from 'express-validator';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// @desc    Create new order
// @route   POST /api/orders
// @access  Private (Customers only)
router.post('/', [
  protect,
  authorize('customer'),
  body('farmerId').isMongoId().withMessage('Valid farmer ID is required'),
  body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
  body('items.*.productId').isMongoId().withMessage('Valid product ID is required'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('deliveryAddress').notEmpty().withMessage('Delivery address is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const { farmerId, items, deliveryAddress, deliveryInstructions, customerNotes } = req.body;

    // Validate products and calculate totals
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      
      if (!product) {
        return res.status(404).json({ 
          success: false, 
          message: `Product ${item.productId} not found` 
        });
      }

      if (!product.isAvailable) {
        return res.status(400).json({ 
          success: false, 
          message: `Product ${product.name} is not available` 
        });
      }

      if (product.quantity < item.quantity) {
        return res.status(400).json({ 
          success: false, 
          message: `Insufficient quantity for ${product.name}` 
        });
      }

      if (product.farmerId.toString() !== farmerId) {
        return res.status(400).json({ 
          success: false, 
          message: `Product ${product.name} does not belong to the selected farmer` 
        });
      }

      const totalPrice = product.price * item.quantity;
      subtotal += totalPrice;

      orderItems.push({
        productId: product._id,
        productName: product.name,
        quantity: item.quantity,
        unitPrice: product.price,
        totalPrice,
        unit: product.unit
      });

      // Update product quantity
      await Product.findByIdAndUpdate(product._id, {
        $inc: { quantity: -item.quantity }
      });
    }

    const orderData = {
      customerId: req.user._id,
      farmerId,
      items: orderItems,
      subtotal,
      totalAmount: subtotal, // Add tax and shipping later if needed
      deliveryAddress,
      deliveryInstructions,
      customerNotes
    };

    const order = await Order.create(orderData);

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error creating order' 
    });
  }
});

// @desc    Get customer orders
// @route   GET /api/orders/customer
// @access  Private (Customers only)
router.get('/customer', [protect, authorize('customer')], async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    const filter = { customerId: req.user._id };
    if (status) filter.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const orders = await Order.find(filter)
      .populate('farmerId', 'name farmName')
      .populate('items.productId', 'name images')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Order.countDocuments(filter);

    res.json({
      success: true,
      count: orders.length,
      total,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        hasNext: skip + orders.length < total,
        hasPrev: parseInt(page) > 1
      },
      orders
    });
  } catch (error) {
    console.error('Get customer orders error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error getting orders' 
    });
  }
});

// @desc    Get farmer orders
// @route   GET /api/orders/farmer
// @access  Private (Farmers only)
router.get('/farmer', [protect, authorize('farmer')], async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    const filter = { farmerId: req.user._id };
    if (status) filter.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const orders = await Order.find(filter)
      .populate('customerId', 'name phone')
      .populate('items.productId', 'name images')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Order.countDocuments(filter);

    res.json({
      success: true,
      count: orders.length,
      total,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        hasNext: skip + orders.length < total,
        hasPrev: parseInt(page) > 1
      },
      orders
    });
  } catch (error) {
    console.error('Get farmer orders error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error getting orders' 
    });
  }
});

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private (Order participants only)
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('customerId', 'name phone')
      .populate('farmerId', 'name farmName phone')
      .populate('items.productId', 'name images description');

    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: 'Order not found' 
      });
    }

    // Check if user is authorized to view this order
    if (order.customerId._id.toString() !== req.user._id.toString() && 
        order.farmerId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to view this order' 
      });
    }

    res.json({
      success: true,
      order
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error getting order' 
    });
  }
});

// @desc    Update order status (farmer only)
// @route   PUT /api/orders/:id/status
// @access  Private (Farmer only)
router.put('/:id/status', [
  protect,
  authorize('farmer'),
  body('status').isIn(['confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled']).withMessage('Invalid status')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const { status, farmerNotes } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: 'Order not found' 
      });
    }

    if (order.farmerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to update this order' 
      });
    }

    const updateData = { status };
    if (farmerNotes) updateData.farmerNotes = farmerNotes;

    if (status === 'delivered') {
      updateData.actualDelivery = Date.now();
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate('customerId', 'name phone');

    res.json({
      success: true,
      message: 'Order status updated successfully',
      order: updatedOrder
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error updating order status' 
    });
  }
});

// @desc    Rate and review order (customer only)
// @route   POST /api/orders/:id/review
// @access  Private (Customer only)
router.post('/:id/review', [
  protect,
  authorize('customer'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('review').optional().trim().isLength({ max: 500 }).withMessage('Review must be less than 500 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const { rating, review } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: 'Order not found' 
      });
    }

    if (order.customerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to review this order' 
      });
    }

    if (order.status !== 'delivered') {
      return res.status(400).json({ 
        success: false, 
        message: 'Can only review delivered orders' 
      });
    }

    if (order.rating) {
      return res.status(400).json({ 
        success: false, 
        message: 'Order already reviewed' 
      });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { rating, review },
      { new: true }
    );

    res.json({
      success: true,
      message: 'Review submitted successfully',
      order: updatedOrder
    });
  } catch (error) {
    console.error('Submit review error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error submitting review' 
    });
  }
});

export default router;
