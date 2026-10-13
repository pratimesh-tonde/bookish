const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth");
const adminOnly = require("../middleware/admin");
const {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
} = require("../controllers/bookController");

router.get("/", getBooks);
router.get("/:id", getBookById);
router.post("/", protect, adminOnly, createBook);
router.put("/:id", protect, adminOnly, updateBook);
router.delete("/:id", protect, adminOnly, deleteBook);

module.exports = router;
