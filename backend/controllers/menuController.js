const prisma = require('../config/db');

const getCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { menuItems: true },
        },
      },
      orderBy: { id: 'asc' },
    });
    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const createCategory = async (req, res) => {
  try {
    const { name, image } = req.body;
    if (!name || !image) {
      return res.status(400).json({ message: 'Please provide category name and image URL' });
    }
    const categoryExists = await prisma.category.findUnique({ where: { name } });
    if (categoryExists) {
      return res.status(400).json({ message: 'Category already exists' });
    }
    const category = await prisma.category.create({ data: { name, image } });
    res.status(201).json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, image } = req.body;
    const category = await prisma.category.findUnique({ where: { id: parseInt(id) } });
    if (!category) return res.status(404).json({ message: 'Category not found' });
    const updatedCategory = await prisma.category.update({
      where: { id: parseInt(id) },
      data: { name, image },
    });
    res.json(updatedCategory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await prisma.category.findUnique({ where: { id: parseInt(id) } });
    if (!category) return res.status(404).json({ message: 'Category not found' });
    await prisma.category.delete({ where: { id: parseInt(id) } });
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getMenuItems = async (req, res) => {
  try {
    const { category, search } = req.query;
    const where = {};
    if (category) where.categoryId = parseInt(category);
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }
    const menuItems = await prisma.menuItem.findMany({
      where,
      include: { category: { select: { name: true } } },
      orderBy: { id: 'asc' },
    });
    res.json(menuItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getMenuItemById = async (req, res) => {
  try {
    const { id } = req.params;
    const menuItem = await prisma.menuItem.findUnique({
      where: { id: parseInt(id) },
      include: { category: { select: { name: true } } },
    });
    if (!menuItem) return res.status(404).json({ message: 'Menu item not found' });
    res.json(menuItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const createMenuItem = async (req, res) => {
  try {
    const { name, description, price, image, categoryId, sizes, extras } = req.body;
    if (!name || !description || price === undefined || !image || !categoryId) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }
    const itemExists = await prisma.menuItem.findUnique({ where: { name } });
    if (itemExists) return res.status(400).json({ message: 'Menu item already exists' });

    const menuItem = await prisma.menuItem.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        image,
        categoryId: parseInt(categoryId),
        sizes: sizes || [],
        extras: extras || [],
        isAvailable: true,
      },
    });
    res.status(201).json(menuItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, image, categoryId, sizes, extras, isAvailable } = req.body;
    const menuItem = await prisma.menuItem.findUnique({ where: { id: parseInt(id) } });
    if (!menuItem) return res.status(404).json({ message: 'Menu item not found' });

    const updatedMenuItem = await prisma.menuItem.update({
      where: { id: parseInt(id) },
      data: {
        name,
        description,
        price: price !== undefined ? parseFloat(price) : undefined,
        image,
        categoryId: categoryId !== undefined ? parseInt(categoryId) : undefined,
        sizes: sizes !== undefined ? sizes : undefined,
        extras: extras !== undefined ? extras : undefined,
        isAvailable: isAvailable !== undefined ? Boolean(isAvailable) : undefined,
      },
    });
    res.json(updatedMenuItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const toggleAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const menuItem = await prisma.menuItem.findUnique({ where: { id: parseInt(id) } });
    if (!menuItem) return res.status(404).json({ message: 'Menu item not found' });
    const updated = await prisma.menuItem.update({
      where: { id: parseInt(id) },
      data: { isAvailable: !menuItem.isAvailable },
    });
    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const menuItem = await prisma.menuItem.findUnique({ where: { id: parseInt(id) } });
    if (!menuItem) return res.status(404).json({ message: 'Menu item not found' });
    await prisma.menuItem.delete({ where: { id: parseInt(id) } });
    res.json({ message: 'Menu item deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  toggleAvailability,
  deleteMenuItem,
};