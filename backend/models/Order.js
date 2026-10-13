const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    book: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
    title: String,
    price: Number,
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const statusHistoryEntry = new mongoose.Schema(
  {
    status: { type: String, enum: ["placed", "shipped", "delivered", "cancelled"] },
    date: { type: Date, default: Date.now },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [orderItemSchema],
    totalAmount: { type: Number, required: true },
    address: {
      line1: String,
      city: String,
      state: String,
      pincode: String,
      phone: String,
    },
    paymentMethod: { type: String, enum: ["COD", "ONLINE"], default: "COD" },
    paymentStatus: { type: String, enum: ["pending", "paid", "failed"], default: "pending" },
    orderStatus: {
      type: String,
      enum: ["placed", "shipped", "delivered", "cancelled"],
      default: "placed",
    },
    statusHistory: [statusHistoryEntry],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);