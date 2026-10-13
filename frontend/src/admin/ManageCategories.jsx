import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import api from "../services/api";
import { Spinner } from "../components/Common";

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const loadCategories = () => {
    setLoading(true);
    api
      .get("/categories")
      .then(({ data }) => setCategories(data.categories))
      .finally(() => setLoading(false));
  };

  useEffect(loadCategories, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setError("");
    if (!name.trim()) return;
    try {
      await api.post("/categories", { name: name.trim() });
      setName("");
      loadCategories();
    } catch (err) {
      setError(err.response?.data?.message || "Could not add category");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this category? Books in it will keep their reference.")) return;
    await api.delete(`/categories/${id}`);
    loadCategories();
  };

  return (
    <div>
      <h1 className="section-title mb-6">Manage categories</h1>

      <form onSubmit={handleAdd} className="mb-6 flex max-w-md gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New category name"
          className="input-field"
        />
        <button type="submit" className="btn-primary shrink-0">
          <Plus size={16} /> Add
        </button>
      </form>
      {error && <p className="mb-4 text-sm text-maroon">{error}</p>}

      {loading ? (
        <Spinner />
      ) : (
        <div className="card max-w-md divide-y divide-line">
          {categories.map((c) => (
            <div key={c._id} className="flex items-center justify-between px-4 py-3">
              <span className="text-sm text-ink">{c.name}</span>
              <button onClick={() => handleDelete(c._id)} className="text-slate hover:text-maroon" aria-label="Delete">
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageCategories;
