// Deletes a user account by email — handy for removing the  user or any other account you want to remove.
// Run with: npm run delete-user -- someone@example.com
// (from the backend folder — the "--" before the email is required)

require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const User = require("../models/User");

const email = process.argv[2];

if (!email) {
  console.error("Please pass an email address.");
  console.error("Usage: npm run delete-user -- someone@example.com");
  process.exit(1);
}

const run = async () => {
  await connectDB();

  const user = await User.findOneAndDelete({ email: email.toLowerCase() });

  if (!user) {
    console.error(`No account found with email: ${email}`);
  } else {
    console.log(`Deleted account: ${user.name} (${user.email})`);
  }

  await mongoose.connection.close();
  process.exit(user ? 0 : 1);
};

run().catch((err) => {
  console.error("Could not delete user:", err);
  process.exit(1);
});