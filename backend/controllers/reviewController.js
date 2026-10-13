const Review = require("../models/Review");
const Book = require("../models/Book");

// helper to recompute a book's aggregate rating
const recalculateBookRating = async (bookId) => {
  const reviews = await Review.find({ book: bookId });
  const numReviews = reviews.length;
  const rating = numReviews
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / numReviews
    : 0;
  await Book.findByIdAndUpdate(bookId, { rating: rating.toFixed(1), numReviews });
};

// POST /api/reviews  { bookId, rating, comment }
exports.createReview = async (req, res) => {
  try {
    const { bookId, rating, comment } = req.body;

    const existing = await Review.findOne({ book: bookId, user: req.user._id });
    if (existing) {
      return res.status(400).json({ message: "You have already reviewed this book" });
    }

    const review = await Review.create({
      book: bookId,
      user: req.user._id,
      rating,
      comment,
    });

    await recalculateBookRating(bookId);
    await review.populate("user", "name");

    res.status(201).json({ review });
  } catch (err) {
    res.status(400).json({ message: "Could not add review", error: err.message });
  }
};

// GET /api/reviews/:bookId
exports.getBookReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ book: req.params.bookId })
      .populate("user", "name")
      .sort({ createdAt: -1 });
    res.json({ reviews });
  } catch (err) {
    res.status(500).json({ message: "Could not fetch reviews", error: err.message });
  }
};
