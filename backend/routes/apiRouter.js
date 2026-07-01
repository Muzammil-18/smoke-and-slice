
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const { protect, admin } = require('../middleware/authMiddleware');
const authController = require('../controllers/authController');
const menuController = require('../controllers/menuController');
const orderController = require('../controllers/orderController');
const adminController = require('../controllers/adminController');

const optionalProtect = (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = { id: decoded.id };
    } catch (error) {}
  }
  next();
};

router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.get('/auth/profile', protect, authController.getProfile);
router.put('/auth/profile', protect, authController.updateProfile);

router.get('/menu/categories', menuController.getCategories);
router.post('/menu/categories', protect, admin, menuController.createCategory);
router.put('/menu/categories/:id', protect, admin, menuController.updateCategory);
router.delete('/menu/categories/:id', protect, admin, menuController.deleteCategory);

router.get('/menu/items', menuController.getMenuItems);
router.get('/menu/items/:id', menuController.getMenuItemById);
router.post('/menu/items', protect, admin, menuController.createMenuItem);
router.put('/menu/items/:id', protect, admin, menuController.updateMenuItem);
router.patch('/menu/items/:id/toggle', protect, admin, menuController.toggleAvailability);
router.delete('/menu/items/:id', protect, admin, menuController.deleteMenuItem);

router.post('/orders', optionalProtect, orderController.createOrder);
router.get('/orders/my', protect, orderController.getMyOrders);
router.get('/orders/:id', optionalProtect, orderController.getOrderById);

router.get('/admin/orders', protect, admin, orderController.getAllOrders);
router.get('/admin/orders/pending-count', protect, admin, orderController.getPendingOrdersCount);
router.put('/admin/orders/:id/status', protect, admin, orderController.updateOrderStatus);
router.get('/admin/stats', protect, admin, adminController.getDashboardStats);
router.get('/admin/charts', protect, admin, adminController.getChartsData);
router.get('/admin/customers', protect, admin, adminController.getCustomers);
router.patch('/admin/customers/:id/role', protect, admin, adminController.updateUserRole);

module.exports = router;