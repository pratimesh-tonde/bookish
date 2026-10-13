import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Truck, ShieldCheck, RotateCcw } from "lucide-react";
import api from "../services/api";
import BookCard from "../components/BookCard";
import { Spinner } from "../components/Common";

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [newest, setNewest] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/books?featured=true&limit=8"),
      api.get("/books?sort=newest&limit=8"),
      api.get("/categories"),
    ])
      .then(([featuredRes, newestRes, catRes]) => {
        setFeatured(featuredRes.data.books);
        setNewest(newestRes.data.books);
        setCategories(catRes.data.categories);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="bg-ink text-paper">
        <div className="page-container grid items-center gap-8 py-14 md:grid-cols-2 md:py-20">
          <div>
            <p className="mb-3 text-sm font-medium uppercase tracking-wide text-gold">
              New this season
            </p>
            <h1 className="font-serif text-4xl font-semibold leading-tight md:text-5xl">
              A good book is the best kind of company.
            </h1>
            <p className="mt-4 max-w-md text-paper/80">
              Browse thousands of titles across fiction, science, biography and more 
              handpicked and delivered to your door.
            </p>
            <Link to="/books" className="btn-primary mt-6">
              Browse all books <ArrowRight size={16} />
            </Link>
          </div>
          <div className="hidden justify-center md:flex">
            <div className="grid grid-cols-3 gap-3">
              {featured.slice(0, 6).map((b) => (
                <img
                  key={b._id}
                  src={b.coverImage}
                  alt={`Cover of ${b.title}`}
                  loading="lazy"
                  decoding="async"
                  className="h-40 w-28 rounded-sm object-cover shadow-lg"
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-b border-line bg-white">
        <div className="page-container grid grid-cols-1 gap-4 py-5 text-sm text-slate sm:grid-cols-3">
          <div className="flex items-center gap-2.5">
            <Truck size={18} className="text-maroon" /> Free delivery over ₹499
          </div>
          <div className="flex items-center gap-2.5">
            <RotateCcw size={18} className="text-maroon" /> 7-day easy returns
          </div>
          <div className="flex items-center gap-2.5">
            <ShieldCheck size={18} className="text-maroon" /> Secure checkout
          </div>
        </div>
      </section>

      {/* Category chips */}
      {categories.length > 0 && (
        <section className="page-container py-10">
          <h2 className="section-title mb-5">Shop by category</h2>
          <div className="flex flex-wrap gap-3">
            {categories.map((c) => (
              <Link
                key={c._id}
                to={`/books?category=${c._id}`}
                className="rounded-full border border-line bg-white px-5 py-2 text-sm font-medium text-ink transition-colors hover:border-maroon hover:text-maroon"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      {loading ? (
        <Spinner />
      ) : (
        <>
          {featured.length > 0 && (
            <section className="page-container py-6">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="section-title">Featured books</h2>
                <Link to="/books" className="text-sm font-medium text-maroon hover:underline">
                  View all
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4">
                {featured.map((book) => (
                  <BookCard key={book._id} book={book} />
                ))}
              </div>
            </section>
          )}

          {newest.length > 0 && (
            <section className="page-container py-10">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="section-title">Newly added</h2>
                <Link to="/books?sort=newest" className="text-sm font-medium text-maroon hover:underline">
                  View all
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4">
                {newest.map((book) => (
                  <BookCard key={book._id} book={book} />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
};

export default Home;