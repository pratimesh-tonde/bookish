const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Book = require("../models/Book");

// POST /api/orders  { address, paymentMethod }
// Places an order using whatever is currently in the user's cart.
exports.createOrder = async (req, res) => {
  try {
    const { address, paymentMethod = "COD" } = req.body;

    const cart = await Cart.findOne({ user: req.user._id }).populate("items.book");
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Your cart is empty" });
    }

    const items = cart.items.map((item) => ({
      book: item.book._id,
      title: item.book.title,
      price: item.book.price,
      quantity: item.quantity,
    }));

    const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

        const order = await Order.create({
      user: req.user._id,
      items,
      totalAmount,
      address,
      paymentMethod,
      paymentStatus: paymentMethod === "COD" ? "pending" : "paid",
      statusHistory: [{ status: "placed", date: new Date() }],
    });
    
    // reduce stock for each purchased book
    await Promise.all(
      items.map((item) =>
        Book.findByIdAndUpdate(item.book, { $inc: { stock: -item.quantity } })
      )
    );

    // empty the cart after a successful order
    cart.items = [];
    await cart.save();

    res.status(201).json({ order });
  } catch (err) {
    res.status(400).json({ message: "Could not place order", error: err.message });
  }
};

// GET /api/orders/:userId  - a user's own orders (or all orders, for an admin)
exports.getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params;

    if (req.user._id.toString() !== userId && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to view these orders" });
    }

    const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });
    res.json({ orders });
  } catch (err) {
    res.status(500).json({ message: "Could not fetch orders", error: err.message });
  }
};

// GET /api/orders  (admin) - every order in the system
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("user", "name email").sort({ createdAt: -1 });
    res.json({ orders });
  } catch (err) {
    res.status(500).json({ message: "Could not fetch orders", error: err.message });
  }
};
// GET /api/orders/detail/:id  - a single order (used by the track-order page)
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("user", "name email");
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to view this order" });
    }

    res.json({ order });
  } catch (err) {
    res.status(500).json({ message: "Could not fetch order", error: err.message });
  }
};

// PUT /api/orders/:id  (admin)  { orderStatus }
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.orderStatus !== orderStatus) {
      order.orderStatus = orderStatus;
      order.statusHistory.push({ status: orderStatus, date: new Date() });
      await order.save();
    }

    res.json({ order });
  } catch (err) {
    res.status(400).json({ message: "Could not update order", error: err.message });
  }
};