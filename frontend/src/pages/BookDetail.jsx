import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Heart, ShoppingCart, Minus, Plus } from "lucide-react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import StarRating from "../components/StarRating";
import BookCard from "../components/BookCard";
import { Spinner } from "../components/Common";
import { formatPrice, discountPercent } from "../utils/format";
import useDocumentTitle from "../hooks/useDocumentTitle";

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();

  const [book, setBook] = useState(null);
  const [related, setRelated] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [reviewNickname, setReviewNickname] = useState(""); // honeypot - real users never fill this in
  const [reviewError, setReviewError] = useState("");

  useDocumentTitle(book?.title);

  const loadBook = () => {
    setLoading(true);
    Promise.all([api.get(`/books/${id}`), api.get(`/reviews/${id}`)])
      .then(([bookRes, reviewRes]) => {
        setBook(bookRes.data.book);
        setRelated(bookRes.data.related);
        setReviews(reviewRes.data.reviews);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    loadBook();
    setQty(1);
    
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) return navigate("/login");
    setAdding(true);
    try {
      await addToCart(book._id, qty);
    } finally {
      setAdding(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewError("");
    if (reviewNickname) return; 
    try {
      await api.post("/reviews", { bookId: id, ...reviewForm });
      setReviewForm({ rating: 5, comment: "" });
      loadBook();
    } catch (err) {
      setReviewError(err.response?.data?.message || "Could not submit review");
    }
  };

  if (loading) return <Spinner />;
  if (!book) return <div className="page-container py-16 text-center text-slate">Book not found.</div>;

  const discount = discountPercent(book.price, book.mrp);
  const wishlisted = user && isWishlisted(book._id);

  return (
    <div className="page-container py-8">
      <div className="grid gap-10 md:grid-cols-[320px_1fr]">
        <div className="mx-auto w-full max-w-xs md:mx-0">
          <div className="card overflow-hidden">
            <img src={book.coverImage} alt={book.title} className="aspect-[2/3] w-full object-cover" />
          </div>
        </div>

        <div>
          {book.category && (
            <Link to={`/books?category=${book.category._id}`} className="text-xs font-medium uppercase tracking-wide text-maroon">
              {book.category.name}
            </Link>
          )}
          <h1 className="mt-1.5 font-serif text-3xl font-semibold text-ink">{book.title}</h1>
          <p className="mt-1 text-slate">by {book.author}</p>

          <div className="mt-3">
            <StarRating rating={Number(book.rating)} numReviews={book.numReviews} size={16} />
          </div>

          <div className="mt-4 flex items-baseline gap-3">
            <span className="font-serif text-3xl font-semibold text-ink">{formatPrice(book.price)}</span>
            {discount > 0 && (
              <>
                <span className="text-slate line-through">{formatPrice(book.mrp)}</span>
                <span className="font-semibold text-success">{discount}% off</span>
              </>
            )}
          </div>

          <p className="mt-2 text-sm">
            {book.stock > 0 ? (
              <span className="font-medium text-success">In stock</span>
            ) : (
              <span className="font-medium text-maroon">Out of stock</span>
            )}
          </p>

          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-slate">{book.description}</p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <div className="flex items-center rounded-sm border border-line">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="px-3 py-2.5 text-ink hover:bg-paper"
                aria-label="Decrease quantity"
              >
                <Minus size={14} />
              </button>
              <span className="w-8 text-center text-sm font-medium">{qty}</span>
              <button
                onClick={() => setQty((q) => q + 1)}
                className="px-3 py-2.5 text-ink hover:bg-paper"
                aria-label="Increase quantity"
              >
                <Plus size={14} />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={book.stock === 0 || adding}
              className="btn-primary"
            >
              <ShoppingCart size={16} /> {adding ? "Adding..." : "Add to cart"}
            </button>

            {user && (
              <button
                onClick={() => toggleWishlist(book._id)}
                className="btn-secondary"
              >
                <Heart size={16} className={wishlisted ? "fill-maroon text-maroon" : ""} />
                {wishlisted ? "Saved" : "Save for later"}
              </button>
            )}
          </div>
          {!user && <p className="mt-2 text-xs text-slate">Log in to add items to your cart or wishlist.</p>}
        </div>
      </div>

      {/* Reviews */}
      <section className="mt-14 border-t border-line pt-10">
        <h2 className="section-title mb-5">Ratings &amp; reviews</h2>

        {user && (
          <form onSubmit={handleReviewSubmit} className="card mb-8 max-w-lg space-y-3 p-4">
            <p className="text-sm font-semibold text-ink">Write a review</p>

            {/* Honeypot field - hidden from real users, trips up bots that auto-fill every field */}
            <div className="absolute -left-[9999px] top-auto h-0 w-0 overflow-hidden" aria-hidden="true">
              <label htmlFor="review-nickname">Nickname</label>
              <input
                type="text"
                id="review-nickname"
                name="nickname"
                tabIndex={-1}
                autoComplete="off"
                value={reviewNickname}
                onChange={(e) => setReviewNickname(e.target.value)}
              />
            </div>
            <select
              value={reviewForm.rating}
              onChange={(e) => setReviewForm((f) => ({ ...f, rating: Number(e.target.value) }))}
              className="input-field w-auto"
            >
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>
                  {n} star{n > 1 ? "s" : ""}
                </option>
              ))}
            </select>
            <textarea
              value={reviewForm.comment}
              onChange={(e) => setReviewForm((f) => ({ ...f, comment: e.target.value }))}
              placeholder="Share your thoughts on this book"
              rows={3}
              className="input-field"
            />
            {reviewError && <p className="text-xs text-maroon">{reviewError}</p>}
            <button type="submit" className="btn-secondary">
              Submit review
            </button>
          </form>
        )}

        {reviews.length === 0 ? (
          <p className="text-sm text-slate">No reviews yet — be the first to share your thoughts.</p>
        ) : (
          <div className="space-y-5">
            {reviews.map((r) => (
              <div key={r._id} className="border-b border-line pb-5">
                <div className="flex items-center gap-3">
                  <p className="text-sm font-semibold text-ink">{r.user?.name || "Anonymous"}</p>
                  <StarRating rating={r.rating} size={13} />
                </div>
                {r.comment && <p className="mt-1.5 text-sm text-slate">{r.comment}</p>}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Related books */}
      {related.length > 0 && (
        <section className="mt-14 border-t border-line pt-10">
          <h2 className="section-title mb-5">You may also like</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {related.map((b) => (
              <BookCard key={b._id} book={b} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default BookDetail;