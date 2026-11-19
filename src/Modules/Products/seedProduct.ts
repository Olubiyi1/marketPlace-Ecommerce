import prisma from "../../lib/prisma.js";

export const seedProduct = async () => {
  const seededProducts = await prisma.product.createMany({
    data: [
      {
        name: "Nike Air Max",
        category: "Footwear",
        price: 85000,
        quantity: 15,
      },
      {
        name: "Adidas Superstar",
        category: "Footwear",
        price: 65000,
        quantity: 20,
      },
      {
        name: "Leather Jacket",
        category: "Clothing",
        price: 45000,
        quantity: 10,
      },
      {
        name: "Classic Denim Jeans",
        category: "Clothing",
        price: 28000,
        quantity: 25,
      },
      {
        name: "Samsung Galaxy A15",
        category: "Electronics",
        price: 250000,
        quantity: 8,
      },
      {
        name: "Wireless Bluetooth Headphones",
        category: "Electronics",
        price: 35000,
        quantity: 18,
      },
      {
        name: "Casio Digital Watch",
        category: "Accessories",
        price: 22000,
        quantity: 12,
      },
      {
        name: "Leather Backpack",
        category: "Accessories",
        price: 30000,
        quantity: 14,
      },
      {
        name: "Office Study Chair",
        category: "Furniture",
        price: 95000,
        quantity: 6,
      },
      {
        name: "Stainless Steel Water Bottle",
        category: "Home & Living",
        price: 8500,
        quantity: 30,
      },
    ],
  });

  return seededProducts;
};