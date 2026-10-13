import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ShoppingCart, Heart, User, ChevronDown, BookOpen, LogOut, Package, LayoutDashboard } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import api from "../services/api";

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const menuRef = useRef(null);

  useEffect(() => {
    api.get("/categories").then(({ data }) => setCategories(data.categories)).catch(() => {});
  }, []);

  useEffect(() => {
    const closeMenu = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", closeMenu);
    return () => document.removeEventListener("mousedown", closeMenu);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(query.trim() ? `/books?search=${encodeURIComponent(query.trim())}` : "/books");
  };

  return (
    <header className="sticky top-0 z-40 bg-ink text-paper shadow-sm">
      <div className="page-container flex h-16 items-center gap-4">
        <Link to="/" className="flex shrink-0 items-center gap-2">
          <BookOpen size={24} className="text-gold" />
          <span className="font-serif text-xl font-semibold">Bookish</span>
        </Link>

        <form onSubmit={handleSearch} className="hidden flex-1 items-center sm:flex">
          <div className="flex w-full max-w-xl items-center rounded-sm bg-white">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title or author"
              className="w-full rounded-l-sm px-3.5 py-2 text-sm text-ink outline-none"
            />
            <button type="submit" aria-label="Search" className="rounded-r-sm bg-gold px-3.5 py-2 text-ink">
              <Search size={18} />
            </button>
          </div>
        </form>

        <nav className="ml-auto flex items-center gap-1.5 sm:gap-3">
          {user && (
            <Link to="/wishlist" className="btn-ghost !text-paper/90 hover:!text-paper" aria-label="Wishlist">
              <Heart size={20} />
              <span className="hidden md:inline">Wishlist</span>
            </Link>
          )}

          <Link to="/cart" className="btn-ghost relative !text-paper/90 hover:!text-paper" aria-label="Cart">
            <ShoppingCart size={20} />
            <span className="hidden md:inline">Cart</span>
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4.5 min-w-[18px] items-center justify-center rounded-full bg-maroon px-1 text-[10px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen((o) => !o)}
                className="btn-ghost !text-paper/90 hover:!text-paper"
              >
                <User size={20} />
                <span className="hidden md:inline">{user.name.split(" ")[0]}</span>
                <ChevronDown size={14} />
              </button>
              {menuOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 rounded-sm border border-line bg-white py-1.5 text-ink shadow-lg">
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm hover:bg-paper"
                    >
                      <LayoutDashboard size={15} /> Admin dashboard
                    </Link>
                  )}
                  <Link
                    to="/profile"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-sm hover:bg-paper"
                  >
                    <User size={15} /> Profile
                  </Link>
                  <Link
                    to="/orders"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-sm hover:bg-paper"
                  >
                    <Package size={15} /> My orders
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setMenuOpen(false);
                      navigate("/");
                    }}
                    className="flex w-full items-center gap-2.5 px-4 py-2 text-left text-sm text-maroon hover:bg-paper"
                  >
                    <LogOut size={15} /> Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="btn-ghost !text-paper/90 hover:!text-paper">
              <User size={20} />
              <span className="hidden md:inline">Login</span>
            </Link>
          )}
        </nav>
      </div>

      <form onSubmit={handleSearch} className="page-container flex pb-3 sm:hidden">
        <div className="flex w-full items-center rounded-sm bg-white">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title or author"
            className="w-full rounded-l-sm px-3.5 py-2 text-sm text-ink outline-none"
          />
          <button type="submit" aria-label="Search" className="rounded-r-sm bg-gold px-3.5 py-2 text-ink">
            <Search size={18} />
          </button>
        </div>
      </form>

      {categories.length > 0 && (
        <div className="border-t border-white/10 bg-ink-light">
          <div className="page-container flex gap-5 overflow-x-auto py-2 text-sm">
            <Link to="/books" className="shrink-0 text-paper/80 hover:text-paper">
              All books
            </Link>
            {categories.map((c) => (
              <Link
                key={c._id}
                to={`/books?category=${c._id}`}
                className="shrink-0 text-paper/80 hover:text-paper"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
