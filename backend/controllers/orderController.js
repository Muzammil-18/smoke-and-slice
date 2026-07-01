
const prisma = require('../config/db');
const { sendOrderConfirmationEmail } = require('../config/emailService');

const createOrder = async (req, res) => {
  try {
    const { name, email, phone, address, city, specialInstructions, items } = req.body;

    if (!name || !email || !phone || !address || !city || !items || items.length === 0) {
      return res.status(400).json({ message: 'Missing required order details or items' });
    }

    let subtotal = 0;
    const itemsToCreate = [];

    for (const item of items) {
      const dbItem = await prisma.menuItem.findUnique({ where: { id: item.menuItemId } });
      if (!dbItem) {
        return res.status(404).json({ message: `Menu item with ID ${item.menuItemId} not found` });
      }

      const selectedSize = item.selectedSize || null;
      const basePrice = selectedSize ? parseFloat(selectedSize.price) : dbItem.price;

      const selectedExtras = Array.isArray(item.selectedExtras) ? item.selectedExtras : [];
      const extrasTotal = selectedExtras.reduce((sum, e) => sum + (parseFloat(e.price) || 0), 0);
      
      const linePrice = basePrice + extrasTotal;

      subtotal += linePrice * item.quantity;

      itemsToCreate.push({
        menuItemId: item.menuItemId,
        quantity: item.quantity,
        price: linePrice,
        selectedSize: selectedSize,
        selectedExtras: selectedExtras,
      });
    }

    const tax = subtotal * 0.1;
    const deliveryCharge = subtotal > 50 ? 0.0 : 5.0;
    const grandTotal = subtotal + tax + deliveryCharge;

    const orderData = {
      name,
      email,
      phone,
      address,
      city,
      specialInstructions: specialInstructions || '',
      total: subtotal,
      tax,
      deliveryCharge,
      grandTotal,
      orderItems: {
        create: itemsToCreate,
      },
    };

    if (req.user) {
      orderData.userId = req.user.id;
    }

    const order = await prisma.order.create({
      data: orderData,
      include: {
        orderItems: {
          include: { menuItem: true },
        },
      },
    });

    sendOrderConfirmationEmail(order).catch((err) => {
      console.error('Email dispatch error:', err.message);
    });

    res.status(201).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      include: {
        orderItems: { include: { menuItem: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await prisma.order.findUnique({
      where: { id: parseInt(id) },
      include: {
        orderItems: { include: { menuItem: true } },
      },
    });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.userId && (!req.user || (req.user.id !== order.userId && req.user.role !== 'admin'))) {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }
    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        orderItems: { include: { menuItem: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!status) return res.status(400).json({ message: 'Please provide a status' });

    const order = await prisma.order.findUnique({ where: { id: parseInt(id) } });
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const updatedOrder = await prisma.order.update({
      where: { id: parseInt(id) },
      data: { status },
      include: {
        orderItems: { include: { menuItem: true } },
      },
    });
    res.json(updatedOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getPendingOrdersCount = async (req, res) => {
  try {
    const count = await prisma.order.count({
      where: { status: 'Pending' },
    });
    res.json({ pendingCount: count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  getPendingOrdersCount,
};