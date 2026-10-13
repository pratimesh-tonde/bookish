// Promotes an existing account to admin, by email.
// Run with: npm run make-admin -- your-email@example.com

require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const User = require("../models/User");

const email = process.argv[2];

if (!email) {
  console.error("Please pass an email address.");
  console.error("Usage: npm run make-admin -- tondeprathmesh0@gmail.com");
  process.exit(1);
}

const run = async () => {
  await connectDB();

  const user = await User.findOneAndUpdate(
    { email: email.toLowerCase() },
    { role: "admin" },
    { new: true }
  );

  if (!user) {
    console.error(`No account found with email: ${email}`);
  } else {
    console.log(`${user.name} (${user.email}) is now an admin.`);
  }

  await mongoose.connection.close();
  process.exit(user ? 0 : 1);
};

run().catch((err) => {
  console.error("Could not update user:", err);
  process.exit(1);
});