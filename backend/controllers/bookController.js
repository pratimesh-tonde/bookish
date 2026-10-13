const Book = require("../models/Book");

// GET /api/books  (supports ?search=&category=&minPrice=&maxPrice=&sort=&page=&limit=&featured=)
exports.getBooks = async (req, res) => {
  try {
    const { search, category, minPrice, maxPrice, sort, page = 1, limit = 12, featured } = req.query;

    const filter = {};
    if (search) filter.$text = { $search: search };
    if (category) filter.category = category;
    if (featured) filter.isFeatured = featured === "true";
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const sortMap = {
      priceLowHigh: { price: 1 },
      priceHighLow: { price: -1 },
      rating: { rating: -1 },
      newest: { createdAt: -1 },
    };
    const sortOption = sortMap[sort] || { createdAt: -1 };

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.max(1, Number(limit));

    const [books, total] = await Promise.all([
      Book.find(filter)
        .populate("category", "name slug")
        .sort(sortOption)
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum),
      Book.countDocuments(filter),
    ]);

    res.json({
      books,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum) || 1,
    });
  } catch (err) {
    res.status(500).json({ message: "Could not fetch books", error: err.message });
  }
};

// GET /api/books/:id
exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate("category", "name slug");
    if (!book) return res.status(404).json({ message: "Book not found" });

    // simple "related books" by same category
    const related = await Book.find({
      category: book.category?._id,
      _id: { $ne: book._id },
    }).limit(4);

    res.json({ book, related });
  } catch (err) {
    res.status(500).json({ message: "Could not fetch book", error: err.message });
  }
};

// POST /api/books  (admin)
exports.createBook = async (req, res) => {
  try {
    const book = await Book.create(req.body);
    res.status(201).json({ book });
  } catch (err) {
    res.status(400).json({ message: "Could not create book", error: err.message });
  }
};

// PUT /api/books/:id  (admin)
exports.updateBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!book) return res.status(404).json({ message: "Book not found" });
    res.json({ book });
  } catch (err) {
    res.status(400).json({ message: "Could not update book", error: err.message });
  }
};

// DELETE /api/books/:id  (admin)
exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });
    res.json({ message: "Book deleted" });
  } catch (err) {
    res.status(500).json({ message: "Could not delete book", error: err.message });
  }
};
