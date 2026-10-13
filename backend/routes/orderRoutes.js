const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth");
const adminOnly = require("../middleware/admin");
const {
  createOrder,
  getUserOrders,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
} = require("../controllers/orderController");

router.use(protect); // every order route requires login

router.post("/", createOrder);
router.get("/all", adminOnly, getAllOrders); // admin: view every order
router.get("/detail/:id", getOrderById); // single order (must come before /:userId)
router.get("/:userId", getUserOrders); // a user's own orders (admins can view any)
router.put("/:id", adminOnly, updateOrderStatus);

module.exports = router;    