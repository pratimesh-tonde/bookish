import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import api from "../services/api";
import { formatPrice } from "../utils/format";
import { Spinner } from "../components/Common";

const emptyForm = {
  title: "",
  author: "",
  price: "",
  mrp: "",
  description: "",
  coverImage: "",
  category: "",
  stock: "",
  isFeatured: false,
};

const ManageBooks = () => {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const loadBooks = () => {
    setLoading(true);
    api
      .get("/books?limit=1000")
      .then(({ data }) => setBooks(data.books))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadBooks();
    api.get("/categories").then(({ data }) => setCategories(data.categories));
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm({ ...emptyForm, category: categories[0]?._id || "" });
    setError("");
    setModalOpen(true);
  };

  const openEdit = (book) => {
    setEditingId(book._id);
    setForm({
      title: book.title,
      author: book.author,
      price: book.price,
      mrp: book.mrp || "",
      description: book.description || "",
      coverImage: book.coverImage || "",
      category: book.category?._id || "",
      stock: book.stock,
      isFeatured: book.isFeatured,
    });
    setError("");
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    const payload = {
      ...form,
      price: Number(form.price),
      mrp: Number(form.mrp) || 0,
      stock: Number(form.stock) || 0,
      coverImage:
        form.coverImage ||
        `https://placehold.co/400x600/1B2A4A/FBF8F3?text=${encodeURIComponent(form.title)}`,
    };
    try {
      if (editingId) {
        await api.put(`/books/${editingId}`, payload);
      } else {
        await api.post("/books", payload);
      }
      setModalOpen(false);
      loadBooks();
    } catch (err) {
      setError(err.response?.data?.message || "Could not save book");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this book? This cannot be undone.")) return;
    await api.delete(`/books/${id}`);
    loadBooks();
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="section-title">Manage books</h1>
        <button onClick={openCreate} className="btn-primary">
          <Plus size={16} /> Add book
        </button>
      </div>

      {loading ? (
        <Spinner />
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-line bg-paper text-xs uppercase text-slate">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {books.map((book) => (
                <tr key={book._id}>
                  <td className="px-4 py-3 font-medium text-ink">{book.title}</td>
                  <td className="px-4 py-3 text-slate">{book.category?.name}</td>
                  <td className="px-4 py-3 text-slate">{formatPrice(book.price)}</td>
                  <td className="px-4 py-3">
                    <span className={book.stock <= 5 ? "font-medium text-maroon" : "text-slate"}>
                      {book.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-3">
                      <button onClick={() => openEdit(book)} className="text-slate hover:text-ink" aria-label="Edit">
                        <Pencil size={15} />
                      </button>
                      <button onClick={() => handleDelete(book._id)} className="text-slate hover:text-maroon" aria-label="Delete">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-sm bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-serif text-lg font-semibold text-ink">
                {editingId ? "Edit book" : "Add book"}
              </h2>
              <button onClick={() => setModalOpen(false)} aria-label="Close">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <input
                required
                placeholder="Title"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                className="input-field"
              />
              <input
                required
                placeholder="Author"
                value={form.author}
                onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))}
                className="input-field"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  required
                  type="number"
                  min="0"
                  placeholder="Price (₹)"
                  value={form.price}
                  onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                  className="input-field"
                />
                <input
                  type="number"
                  min="0"
                  placeholder="MRP (₹, optional)"
                  value={form.mrp}
                  onChange={(e) => setForm((f) => ({ ...f, mrp: e.target.value }))}
                  className="input-field"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <select
                  required
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                  className="input-field"
                >
                  <option value="" disabled>
                    Category
                  </option>
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <input
                  required
                  type="number"
                  min="0"
                  placeholder="Stock"
                  value={form.stock}
                  onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))}
                  className="input-field"
                />
              </div>
              <input
                placeholder="Cover image URL (optional — a placeholder is used otherwise)"
                value={form.coverImage}
                onChange={(e) => setForm((f) => ({ ...f, coverImage: e.target.value }))}
                className="input-field"
              />
              <textarea
                placeholder="Description"
                rows={3}
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                className="input-field"
              />
              <label className="flex items-center gap-2 text-sm text-ink">
                <input
                  type="checkbox"
                  checked={form.isFeatured}
                  onChange={(e) => setForm((f) => ({ ...f, isFeatured: e.target.checked }))}
                />
                Feature on homepage
              </label>

              {error && <p className="text-sm text-maroon">{error}</p>}

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setModalOpen(false)} className="btn-ghost">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="btn-primary">
                  {saving ? "Saving..." : "Save book"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageBooks;
