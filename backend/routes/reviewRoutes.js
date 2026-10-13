const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth");
const { createReview, getBookReviews } = require("../controllers/reviewController");

router.post("/", protect, createReview);
router.get("/:bookId", getBookReviews);

module.exports = router;
