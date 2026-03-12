// prisma/seed.js
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create admin user
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      passwordHash: '$2b$10$8K1p/a0uS46q5BpIFJcGxeOlCJz7lhOvZ6qAGF2u1Ms5JqQYjL8aK', // 'password' hashed
      role: 'ADMIN',
    },
  });

  console.log('Created admin user:', { email: adminUser.email });

  // Create sample products
  const sampleProducts = [
    {
      name: 'Wireless Headphones',
      slug: 'wireless-headphones',
      description: 'High-quality wireless headphones with noise cancellation. Experience crystal clear audio with our premium sound technology.',
      price: 99.99,
      imageUrl: '/images/headphones.jpg',
      category: 'Electronics',
      stock: 50,
    },
    {
      name: 'Cotton T-Shirt',
      slug: 'cotton-tshirt',
      description: 'Comfortable cotton t-shirt for everyday wear. Made from 100% organic cotton with a relaxed fit.',
      price: 24.99,
      imageUrl: '/images/tshirt.jpg',
      category: 'Clothing',
      stock: 100,
    },
    {
      name: 'Coffee Mug',
      slug: 'coffee-mug',
      description: 'Ceramic coffee mug with custom design. Holds 12 oz of your favorite beverage.',
      price: 12.99,
      imageUrl: '/images/mug.jpg',
      category: 'Home',
      stock: 75,
    },
    {
      name: 'Smart Watch',
      slug: 'smart-watch',
      description: 'Feature-rich smartwatch with health tracking. Monitor your heart rate, sleep patterns, and daily activity.',
      price: 199.99,
      imageUrl: '/images/watch.jpg',
      category: 'Electronics',
      stock: 25,
    },
    {
      name: 'Leather Wallet',
      slug: 'leather-wallet',
      description: 'Genuine leather wallet with multiple card slots. Perfect for everyday use.',
      price: 49.99,
      imageUrl: '/images/wallet.jpg',
      category: 'Accessories',
      stock: 40,
    },
    {
      name: 'Water Bottle',
      slug: 'water-bottle',
      description: 'Insulated stainless steel water bottle. Keeps drinks cold for 24 hours or hot for 12 hours.',
      price: 19.99,
      imageUrl: '/images/bottle.jpg',
      category: 'Home',
      stock: 60,
    },
  ];

  for (const product of sampleProducts) {
    const createdProduct = await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product,
    });
    console.log(`Created product: ${createdProduct.name}`);
  }

  console.log('Database seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });