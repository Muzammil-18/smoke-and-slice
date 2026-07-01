
const prisma = require('../config/db');

const getDashboardStats = async (req, res) => {
  try {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const todayOrders = await prisma.order.findMany({
      where: {
        createdAt: { gte: startOfToday },
        status: { not: 'Rejected' },
      },
      select: { grandTotal: true },
    });
    const todaySales = todayOrders.reduce((sum, o) => sum + o.grandTotal, 0);

    const weekOrders = await prisma.order.findMany({
      where: {
        createdAt: { gte: startOfWeek },
        status: { not: 'Rejected' },
      },
      select: { grandTotal: true },
    });
    const weeklySales = weekOrders.reduce((sum, o) => sum + o.grandTotal, 0);

    const monthOrders = await prisma.order.findMany({
      where: {
        createdAt: { gte: startOfMonth },
        status: { not: 'Rejected' },
      },
      select: { grandTotal: true },
    });
    const monthlySales = monthOrders.reduce((sum, o) => sum + o.grandTotal, 0);

    const allOrders = await prisma.order.findMany({
      where: { status: { not: 'Rejected' } },
      select: { grandTotal: true },
    });
    const totalRevenue = allOrders.reduce((sum, o) => sum + o.grandTotal, 0);

    const totalOrdersCount = await prisma.order.count();
    
    const registeredUsersCount = await prisma.user.count({
      where: { role: 'user' },
    });
    
    const totalMenuItems = await prisma.menuItem.count();

    const orderItems = await prisma.orderItem.findMany({
      where: {
        order: { status: { not: 'Rejected' } },
      },
      include: {
        menuItem: true,
      },
    });

    const productSalesMap = {};
    let totalQtySold = 0;

    orderItems.forEach((item) => {
      const pId = item.menuItemId;
      const pName = item.menuItem.name;
      const qty = item.quantity;
      totalQtySold += qty;

      if (!productSalesMap[pId]) {
        productSalesMap[pId] = { id: pId, name: pName, quantity: 0, revenue: 0 };
      }
      productSalesMap[pId].quantity += qty;
      productSalesMap[pId].revenue += qty * item.price;
    });

    const productSalesList = Object.values(productSalesMap);
    
    productSalesList.sort((a, b) => b.quantity - a.quantity);

    const top5Selling = productSalesList.slice(0, 5);
    const mostSelling = productSalesList.length > 0 ? productSalesList[0] : null;
    const leastSelling = productSalesList.length > 0 ? productSalesList[productSalesList.length - 1] : null;

    const ordersTodayCount = await prisma.order.count({
      where: { createdAt: { gte: startOfToday } },
    });
    const ordersThisWeekCount = await prisma.order.count({
      where: { createdAt: { gte: startOfWeek } },
    });
    const ordersThisMonthCount = await prisma.order.count({
      where: { createdAt: { gte: startOfMonth } },
    });

    res.json({
      sales: {
        todaySales,
        weeklySales,
        monthlySales,
        totalRevenue,
        totalOrders: totalOrdersCount,
        totalCustomers: registeredUsersCount,
        totalMenuItems,
      },
      productAnalytics: {
        mostSelling,
        leastSelling,
        top5Selling,
        totalQuantitySold: totalQtySold,
      },
      orderAnalytics: {
        ordersToday: ordersTodayCount,
        ordersThisWeek: ordersThisWeekCount,
        ordersThisMonth: ordersThisMonthCount,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getChartsData = async (req, res) => {
  try {
    const now = new Date();
    
    const last6Months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      last6Months.push({
        year: d.getFullYear(),
        month: d.getMonth(),
        label: d.toLocaleString('default', { month: 'short' }),
        revenue: 0,
        orders: 0,
      });
    }

    const startOf6MonthsAgo = new Date(last6Months[0].year, last6Months[0].month, 1);
    
    const orders = await prisma.order.findMany({
      where: {
        createdAt: { gte: startOf6MonthsAgo },
        status: { not: 'Rejected' },
      },
    });

    orders.forEach((o) => {
      const oDate = new Date(o.createdAt);
      const oYear = oDate.getFullYear();
      const oMonth = oDate.getMonth();

      const monthObj = last6Months.find(
        (m) => m.year === oYear && m.month === oMonth
      );
      if (monthObj) {
        monthObj.revenue += o.grandTotal;
        monthObj.orders += 1;
      }
    });

    const dailyOrders = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
      const label = d.toLocaleDateString('default', { weekday: 'short' });
      dailyOrders.push({
        dateStr: d.toDateString(),
        label,
        count: 0,
      });
    }

    const startOf7DaysAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6);
    const recentOrders = await prisma.order.findMany({
      where: {
        createdAt: { gte: startOf7DaysAgo },
      },
    });

    recentOrders.forEach((o) => {
      const oDateStr = new Date(o.createdAt).toDateString();
      const dayObj = dailyOrders.find((d) => d.dateStr === oDateStr);
      if (dayObj) {
        dayObj.count += 1;
      }
    });

    const orderItems = await prisma.orderItem.findMany({
      where: {
        order: { status: { not: 'Rejected' } },
      },
      include: {
        menuItem: {
          include: {
            category: true,
          },
        },
      },
    });

    const productSalesMap = {};
    const categorySalesMap = {};

    orderItems.forEach((item) => {
      const pName = item.menuItem.name;
      const qty = item.quantity;
      const amount = qty * item.price;
      const cName = item.menuItem.category.name;

      if (!productSalesMap[pName]) {
        productSalesMap[pName] = 0;
      }
      productSalesMap[pName] += qty;

      if (!categorySalesMap[cName]) {
        categorySalesMap[cName] = 0;
      }
      categorySalesMap[cName] += amount;
    });

    const topProducts = Object.entries(productSalesMap)
      .map(([name, qty]) => ({ name, qty }))
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 5);

    const categorySales = Object.entries(categorySalesMap).map(([name, value]) => ({
      name,
      value,
    }));

    res.json({
      monthlyRevenue: last6Months,
      dailyOrders,
      topProducts,
      categorySales,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getCustomers = async (req, res) => {
  try {
    const { search } = req.query;

    const customers = await prisma.user.findMany({
      where: {
        // Remove role:'user' limitation so we can see and manage all admins and users
        OR: search
          ? [
              { name: { contains: search, mode: 'insensitive' } },
              { email: { contains: search, mode: 'insensitive' } },
            ]
          : undefined,
      },
      include: {
        profile: true,
        orders: {
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const formattedCustomers = customers.map((c) => {
      const totalSpent = c.orders
        .filter((o) => o.status !== 'Rejected')
        .reduce((sum, o) => sum + o.grandTotal, 0);

      return {
        id: c.id,
        name: c.name,
        email: c.email,
        phone: c.profile ? c.profile.phone : '',
        address: c.profile ? c.profile.address : '',
        city: c.profile ? c.profile.city : '',
        role: c.role, // Adde role property
        totalOrders: c.orders.length,
        totalSpent,
        orders: c.orders,
        createdAt: c.createdAt,
      };
    });

    res.json(formattedCustomers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role provided' });
    }

    // Safety: Admin cannot demote themselves accidentally
    if (parseInt(id) === req.user.id) {
      return res.status(400).json({ message: 'Safety check: You cannot change your own role.' });
    }

    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) },
      data: { role },
    });

    res.json({ message: 'Role updated successfully', user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getDashboardStats,
  getCustomers,
  getChartsData,
  updateUserRole,
};