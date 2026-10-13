import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal, X } from "lucide-react";
import api from "../services/api";
import BookCard from "../components/BookCard";
import { Spinner } from "../components/Common";
import useDocumentTitle from "../hooks/useDocumentTitle";


const sortOptions = [
  { value: "", label: "Relevance" },
  { value: "newest", label: "Newest first" },
  { value: "priceLowHigh", label: "Price: Low to High" },
  { value: "priceHighLow", label: "Price: High to Low" },
  { value: "rating", label: "Customer rating" },
];

const BookList = () => {
  useDocumentTitle("Browse Books");
  const [searchParams, setSearchParams] = useSearchParams();
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const sort = searchParams.get("sort") || "";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const page = Number(searchParams.get("page") || 1);

  useEffect(() => {
    api.get("/categories").then(({ data }) => setCategories(data.categories));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = { search, category, sort, minPrice, maxPrice, page, limit: 12 };
    Object.keys(params).forEach((k) => !params[k] && delete params[k]);

    api
      .get("/books", { params })
      .then(({ data }) => {
        setBooks(data.books);
        setTotalPages(data.totalPages);
      })
      .finally(() => setLoading(false));
  }, [search, category, sort, minPrice, maxPrice, page]);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    if (key !== "page") next.delete("page"); // reset pagination whenever a filter changes
    setSearchParams(next);
  };

  const clearFilters = () => setSearchParams(search ? { search } : {});

  const activeCategory = categories.find((c) => c._id === category);

  return (
    <div className="page-container py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="section-title">
            {search ? `Results for "${search}"` : activeCategory ? activeCategory.name : "All books"}
          </h1>
          <p className="mt-1 text-sm text-slate">{books.length ? `Showing page ${page} of ${totalPages}` : ""}</p>
        </div>
        <button
          onClick={() => setFiltersOpen((o) => !o)}
          className="btn-secondary sm:hidden"
        >
          <SlidersHorizontal size={15} /> Filters
        </button>
      </div>

      <div className="grid gap-8 sm:grid-cols-[220px_1fr]">
        {/* Filters sidebar */}
        <aside className={`${filtersOpen ? "block" : "hidden"} sm:block`}>
          <div className="card space-y-6 p-4">
            <div className="flex items-center justify-between sm:hidden">
              <p className="font-semibold text-ink">Filters</p>
              <button onClick={() => setFiltersOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <div>
              <p className="mb-2.5 text-sm font-semibold text-ink">Category</p>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm text-slate">
                  <input
                    type="radio"
                    name="category"
                    checked={!category}
                    onChange={() => updateParam("category", "")}
                  />
                  All categories
                </label>
                {categories.map((c) => (
                  <label key={c._id} className="flex items-center gap-2 text-sm text-slate">
                    <input
                      type="radio"
                      name="category"
                      checked={category === c._id}
                      onChange={() => updateParam("category", c._id)}
                    />
                    {c.name}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2.5 text-sm font-semibold text-ink">Price range</p>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  defaultValue={minPrice}
                  onBlur={(e) => updateParam("minPrice", e.target.value)}
                  className="input-field !py-1.5 text-xs"
                />
                <span className="text-slate">–</span>
                <input
                  type="number"
                  placeholder="Max"
                  defaultValue={maxPrice}
                  onBlur={(e) => updateParam("maxPrice", e.target.value)}
                  className="input-field !py-1.5 text-xs"
                />
              </div>
            </div>

            <button onClick={clearFilters} className="text-sm font-medium text-maroon hover:underline">
              Clear filters
            </button>
          </div>
        </aside>

        {/* Results */}
        <div>
          <div className="mb-5 flex justify-end">
            <select
              value={sort}
              onChange={(e) => updateParam("sort", e.target.value)}
              className="input-field w-auto !py-1.5 text-sm"
            >
              {sortOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  Sort: {o.label}
                </option>
              ))}
            </select>
          </div>

          {loading ? (
            <Spinner />
          ) : books.length === 0 ? (
            <div className="py-16 text-center text-slate">
              No books matched your filters. Try widening your search.
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {books.map((book) => (
                  <BookCard key={book._id} book={book} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-8 flex justify-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => updateParam("page", String(p))}
                      className={`h-9 w-9 rounded-sm text-sm font-medium ${
                        p === page ? "bg-ink text-paper" : "border border-line text-ink hover:border-ink"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookList;
