const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.customerProfile.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.menuItem.deleteMany({});
  await prisma.category.deleteMany({});

  const salt = await bcrypt.genSalt(10);
  const adminPassword = await bcrypt.hash('admin123', salt);
  const userPassword = await bcrypt.hash('user123', salt);

  await prisma.user.create({
    data: {
      name: 'Smoke & Slice Admin',
      email: 'admin@smokeslice.com',
      password: adminPassword,
      role: 'admin',
      profile: {
        create: {
          phone: '+15550199',
          address: '100 Smokehouse Way',
          city: 'Austin',
        },
      },
    },
  });

  await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'john@example.com',
      password: userPassword,
      role: 'user',
      profile: {
        create: {
          phone: '+15550188',
          address: '42 Baker Street',
          city: 'Austin',
        },
      },
    },
  });

  const categories = [
    {
      name: 'Starters',
      image: 'https://images.unsplash.com/photo-1531749668029-2db88e4b76ce?w=600&auto=format&fit=crop&q=80',
    },
    {
      name: 'Burgers',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80',
    },
    {
      name: 'Pizza',
      image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=600&auto=format&fit=crop&q=80',
    },
    {
      name: 'BBQ',
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
    },
    {
      name: 'Desserts',
      image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop&q=80',
    },
    {
      name: 'Drinks',
      image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&auto=format&fit=crop&q=80',
    },
  ];

  const createdCategories = [];
  for (const cat of categories) {
    const created = await prisma.category.create({
      data: cat,
    });
    createdCategories.push(created);
  }

  const getCategoryId = (name) => {
    return createdCategories.find((c) => c.name === name).id;
  };

  const menuItems = [
    {
      name: 'Crispy Mozzarella Sticks',
      description: 'Golden fried mozzarella cheese sticks served with warm marinara dipping sauce.',
      price: 8.99,
      image: 'https://images.unsplash.com/photo-1531749668029-2db88e4b76ce?w=600&auto=format&fit=crop&q=80',
      categoryId: getCategoryId('Starters'),
    },
    {
      name: 'Garlic Parmesan Bread',
      description: 'Freshly baked baguette slices toasted with garlic butter, parmesan, and herbs.',
      price: 6.99,
      image: 'https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?w=600&auto=format&fit=crop&q=80',
      categoryId: getCategoryId('Starters'),
    },
    {
      name: 'Crispy Onion Rings',
      description: 'Beer-battered thick cut onion rings fried to absolute crunch, served with spicy aioli.',
      price: 7.49,
      image: 'https://images.unsplash.com/photo-1639024471283-2bc7b3c6a267?w=600&auto=format&fit=crop&q=80',
      categoryId: getCategoryId('Starters'),
    },
    {
      name: 'Classic Cheeseburger',
      description: 'Grilled angus beef patty, cheddar cheese, fresh lettuce, tomato, pickles, and signature house sauce on a toasted brioche bun.',
      price: 13.99,
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80',
      categoryId: getCategoryId('Burgers'),
    },
    {
      name: 'BBQ Bacon Smokehouse Burger',
      description: 'Angus beef patty topped with smoked bacon, crispy onion strings, cheddar cheese, and tangy BBQ sauce.',
      price: 15.99,
      image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=600&auto=format&fit=crop&q=80',
      categoryId: getCategoryId('Burgers'),
    },
    {
      name: 'Spicy Firehouse Jalapeno Burger',
      description: 'Flame-grilled patty, pepper jack cheese, fried jalapenos, and chipotle mayo on a toasted bun.',
      price: 14.99,
      image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=600&auto=format&fit=crop&q=80',
      categoryId: getCategoryId('Burgers'),
    },
    {
      name: 'Classic Margherita Pizza',
      description: 'Thin crust loaded with rich tomato sauce, fresh mozzarella cheese, fresh basil leaves, and a drizzle of extra virgin olive oil.',
      price: 14.99,
      image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=600&auto=format&fit=crop&q=80',
      categoryId: getCategoryId('Pizza'),
    },
    {
      name: 'Double Pepperoni Pizza',
      description: 'Crispy crust loaded with signature sauce, double portions of spicy pepperoni slices, and mozzarella cheese.',
      price: 16.99,
      image: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=600&auto=format&fit=crop&q=80',
      categoryId: getCategoryId('Pizza'),
    },
    {
      name: 'BBQ Chicken Pizza',
      description: 'Tender grilled chicken pieces, red onions, fresh cilantro, mozzarella cheese, and rich smokey BBQ sauce base.',
      price: 17.49,
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=80',
      categoryId: getCategoryId('Pizza'),
    },
    {
      name: 'Smoked Texas Brisket Platter',
      description: 'Half-pound of slow-smoked beef brisket, served with pickles, onions, Texas-style BBQ sauce, and two sides.',
      price: 24.99,
      image: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=600&auto=format&fit=crop&q=80',
      categoryId: getCategoryId('BBQ'),
    },
    {
      name: 'Honey Glazed Rib Platter',
      description: 'Half-rack of baby back ribs slow-cooked to fall-off-the-bone tenderness, basted in honey BBQ glaze.',
      price: 26.99,
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
      categoryId: getCategoryId('BBQ'),
    },
    {
      name: 'Smoked Pulled Pork Sandwich',
      description: 'Slow-smoked pulled pork tossed in BBQ sauce, topped with creamy coleslaw on a toasted bun.',
      price: 14.49,
      image: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=600&auto=format&fit=crop&q=80',
      categoryId: getCategoryId('BBQ'),
    },
    {
      name: 'Triple Chocolate Fudge Cake',
      description: 'Decadent, rich chocolate cake layered with fudge frosting and served with vanilla ice cream scoop.',
      price: 8.99,
      image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop&q=80',
      categoryId: getCategoryId('Desserts'),
    },
    {
      name: 'Classic New York Cheesecake',
      description: 'Creamy cheesecake on graham cracker crust, topped with fresh strawberry compote.',
      price: 7.99,
      image: 'https://images.unsplash.com/photo-1524351199679-46cddf530c04?w=600&auto=format&fit=crop&q=80',
      categoryId: getCategoryId('Desserts'),
    },
    {
      name: 'Warm Apple Crisp',
      description: 'Cinnamon spiced apples baked under oat brown sugar streusel, served warm with vanilla ice cream.',
      price: 8.49,
      image: 'https://images.unsplash.com/photo-1586985289688-ca9acf2f3301?w=600&auto=format&fit=crop&q=80',
      categoryId: getCategoryId('Desserts'),
    },
    {
      name: 'Iced Caramel Macchiato',
      description: 'Chilled espresso poured over fresh milk, flavored with sweet vanilla syrup and drizzled with buttery caramel sauce.',
      price: 5.49,
      image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=600&auto=format&fit=crop&q=80',
      categoryId: getCategoryId('Drinks'),
    },
    {
      name: 'Fresh Mint Mojito Mocktail',
      description: 'Refreshing muddled mint leaves, lime slices, simple syrup, and sparkling soda served over crushed ice.',
      price: 4.99,
      image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&auto=format&fit=crop&q=80',
      categoryId: getCategoryId('Drinks'),
    },
    {
      name: 'House Smoked Iced Sweet Tea',
      description: 'Brewed black tea infused with a subtle peach undertone, served ice cold with lemon slices.',
      price: 3.49,
      image: 'https://images.unsplash.com/photo-1497534446932-c925b458314e?w=600&auto=format&fit=crop&q=80',
      categoryId: getCategoryId('Drinks'),
    },
  ];

  for (const item of menuItems) {
    await prisma.menuItem.create({
      data: item,
    });
  }

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
