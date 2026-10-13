// re-populates categories, books, and two demo accounts (admin + regular user).

require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const User = require("../models/User");
const Category = require("../models/Category");
const Book = require("../models/Book");
const Cart = require("../models/Cart");
const Order = require("../models/Order");
const Review = require("../models/Review");

const categoryList = ["Fiction", "Non-Fiction", "Self-Help", "Comics", "Science", "Biography"];

// Generates a simple placeholder cover so the storefront looks populated
const coverFor = (title) =>
  `https://placehold.co/400x600/1B2A4A/FAF7F2?font=playfair-display&text=${encodeURIComponent(
    title
  )}`;

const bookSeeds = [
  { title: "The Silent Orchard", author: "Meera Kulkarni", category: "Fiction", price: 349, mrp: 499 },
  { title: "Monsoon Diaries", author: "Rohan Verma", category: "Fiction", price: 299, mrp: 399 },
  { title: "The Last Lighthouse", author: "Ananya Rao", category: "Fiction", price: 399, mrp: 550 },
  { title: "Sapiens: A Brief History", author: "Yuval N. Harari", category: "Non-Fiction", price: 499, mrp: 699 },
  { title: "The Ministry of Small Things", author: "Devika Menon", category: "Non-Fiction", price: 379, mrp: 450 },
  { title: "Atomic Habits", author: "James Clear", category: "Self-Help", price: 399, mrp: 599 },
  { title: "The 5 AM Mindset", author: "Kabir Anand", category: "Self-Help", price: 249, mrp: 350 },
  { title: "Deep Work", author: "Cal Newport", category: "Self-Help", price: 349, mrp: 499 },
  { title: "Chakra Chronicles Vol.1", author: "Studio Inklight", category: "Comics", price: 199, mrp: 299 },
  { title: "Pixel Knights", author: "Studio Inklight", category: "Comics", price: 219, mrp: 299 },
  { title: "A Brief History of Time", author: "Stephen Hawking", category: "Science", price: 449, mrp: 599 },
  { title: "The Code Breakers", author: "Walter Isaacson", category: "Science", price: 549, mrp: 750 },
  { title: "Cosmos", author: "Carl Sagan", category: "Science", price: 429, mrp: 599 },
  { title: "Steve Jobs", author: "Walter Isaacson", category: "Biography", price: 499, mrp: 699 },
  { title: "Wings of Fire", author: "A.P.J. Abdul Kalam", category: "Biography", price: 299, mrp: 399 },
  { title: "Educated", author: "Tara Westover", category: "Biography", price: 399, mrp: 550 },
  { title: "The Midnight Library", author: "Matt Haig", category: "Fiction", price: 349, mrp: 499 },
  { title: "Ikigai", author: "Hector Garcia", category: "Self-Help", price: 299, mrp: 399 },
];

const seed = async () => {
  await connectDB();
  console.log("Clearing old data...");
  await Promise.all([
    User.deleteMany({}),
    Category.deleteMany({}),
    Book.deleteMany({}),
    Cart.deleteMany({}),
    Order.deleteMany({}),
    Review.deleteMany({}),
  ]);

  console.log("Creating categories...");
  const categories = await Category.insertMany(
    categoryList.map((name) => ({ name, slug: name.toLowerCase().replace(/\s+/g, "-") }))
  );
  const categoryByName = Object.fromEntries(categories.map((c) => [c.name, c._id]));

  console.log("Creating books...");
  await Book.insertMany(
    bookSeeds.map((b, i) => ({
      title: b.title,
      author: b.author,
      price: b.price,
      mrp: b.mrp,
      description: `${b.title} by ${b.author} is a reader favourite in the ${b.category} section. A great pick whether you're buying for yourself or gifting a fellow reader.`,
      coverImage: coverFor(b.title),
      category: categoryByName[b.category],
      stock: 15 + (i % 10),
      rating: (3.5 + (i % 5) * 0.3).toFixed(1),
      numReviews: (i % 6) * 3,
      isFeatured: i % 4 === 0,
    }))
  );

  console.log("Creating demo accounts...");
  await User.create({
    name: "Admin",
    email: "admin@bookportal.com",
    password: "admin123",
    role: "admin",
  });
  await User.create({
    name: "Demo Reader",
    email: "reader@bookportal.com",
    password: "reader123",
    role: "user",
  });

  console.log("\nSeed complete!");
  console.log("Admin login  -> admin@bookportal.com  / admin123");
  console.log("User login   -> reader@bookportal.com / reader123");

  await mongoose.connection.close();
  process.exit(0);
};

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
