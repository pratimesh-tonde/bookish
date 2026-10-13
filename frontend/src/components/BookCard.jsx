import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import StarRating from "./StarRating";
import { formatPrice, discountPercent } from "../utils/format";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";

const BookCard = ({ book }) => {
  const { user } = useAuth();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const discount = discountPercent(book.price, book.mrp);
  const wishlisted = user && isWishlisted(book._id);

  const handleWishlist = (e) => {
    e.preventDefault();
    if (!user) return;
    toggleWishlist(book._id);
  };

  return (
    <Link
      to={`/books/${book._id}`}
      className="card group relative flex flex-col overflow-hidden transition-shadow hover:shadow-md"
    >
      {user && (
        <button
          onClick={handleWishlist}
          aria-label={wishlisted ? "Remove from wishlist" : "Save for later"}
          className="absolute right-2 top-2 z-10 rounded-full bg-white/90 p-1.5 shadow-sm"
        >
          <Heart size={16} className={wishlisted ? "fill-maroon text-maroon" : "text-slate"} />
        </button>
      )}

      <div className="aspect-[2/3] w-full overflow-hidden bg-line">
        <img
          src={book.coverImage}
          alt={book.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
      </div>

      <div className="flex flex-1 flex-col gap-1 p-3">
        <p className="line-clamp-2 text-sm font-medium leading-snug text-ink">{book.title}</p>
        <p className="text-xs text-slate">{book.author}</p>
        <StarRating rating={Number(book.rating)} numReviews={book.numReviews} />
        <div className="mt-auto flex items-baseline gap-2 pt-1">
          <span className="font-serif text-lg font-semibold text-ink">{formatPrice(book.price)}</span>
          {discount > 0 && (
            <>
              <span className="text-xs text-slate line-through">{formatPrice(book.mrp)}</span>
              <span className="text-xs font-semibold text-success">{discount}% off</span>
            </>
          )}
        </div>
        {book.stock === 0 && (
          <span className="text-xs font-medium text-maroon">Out of stock</span>
        )}
      </div>
    </Link>
  );
};

export default BookCard;
