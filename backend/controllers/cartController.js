const Cart = require("../models/Cart");

// GET /api/cart
exports.getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate("items.book");
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }
    res.json({ cart });
  } catch (err) {
    res.status(500).json({ message: "Could not fetch cart", error: err.message });
  }
};

// POST /api/cart  { bookId, quantity }
exports.addToCart = async (req, res) => {
  try {
    const { bookId, quantity = 1 } = req.body;

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) cart = new Cart({ user: req.user._id, items: [] });

    const existingItem = cart.items.find((item) => item.book.toString() === bookId);
    if (existingItem) {
      existingItem.quantity += Number(quantity);
    } else {
      cart.items.push({ book: bookId, quantity: Number(quantity) });
    }

    await cart.save();
    await cart.populate("items.book");
    res.json({ cart });
  } catch (err) {
    res.status(400).json({ message: "Could not add to cart", error: err.message });
  }
};

// PUT /api/cart/:itemId  { quantity }
exports.updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.id(req.params.itemId);
    if (!item) return res.status(404).json({ message: "Item not found in cart" });

    if (quantity <= 0) {
      item.deleteOne();
    } else {
      item.quantity = quantity;
    }

    await cart.save();
    await cart.populate("items.book");
    res.json({ cart });
  } catch (err) {
    res.status(400).json({ message: "Could not update cart item", error: err.message });
  }
};

// DELETE /api/cart/:itemId
exports.removeFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter((item) => item._id.toString() !== req.params.itemId);

    await cart.save();
    await cart.populate("items.book");
    res.json({ cart });
  } catch (err) {
    res.status(500).json({ message: "Could not remove item", error: err.message });
  }
};

// DELETE /api/cart  - clear the whole cart (used after placing an order)
exports.clearCart = async (req, res) => {
  try {
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });
    res.json({ message: "Cart cleared" });
  } catch (err) {
    res.status(500).json({ message: "Could not clear cart", error: err.message });
  }
};
