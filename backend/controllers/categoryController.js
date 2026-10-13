const Category = require("../models/Category");

// GET /api/categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json({ categories });
  } catch (err) {
    res.status(500).json({ message: "Could not fetch categories", error: err.message });
  }
};

// POST /api/categories  (admin)
exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const slug = name.toLowerCase().trim().replace(/\s+/g, "-");
    const category = await Category.create({ name, slug });
    res.status(201).json({ category });
  } catch (err) {
    res.status(400).json({ message: "Could not create category", error: err.message });
  }
};

// DELETE /api/categories/:id  (admin)
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found" });
    res.json({ message: "Category deleted" });
  } catch (err) {
    res.status(500).json({ message: "Could not delete category", error: err.message });
  }
};
