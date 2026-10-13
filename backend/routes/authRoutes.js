const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth");
const {
  register,
  login,
  googleAuth,
  getMe,
  updateProfile,
  toggleWishlist,
  getWishlist,
} = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);
router.post("/google", googleAuth);
router.get("/me", protect, getMe);
router.put("/profile", protect, updateProfile);
router.get("/wishlist", protect, getWishlist);
router.post("/wishlist/:bookId", protect, toggleWishlist);

module.exports = router;