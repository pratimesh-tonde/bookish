import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { useWishlist } from "../context/WishlistContext";
import BookCard from "../components/BookCard";
import useDocumentTitle from "../hooks/useDocumentTitle";

const Wishlist = () => {
  useDocumentTitle("Wishlist");
  const { books } = useWishlist();

  if (books.length === 0) {
    return (
      <div className="page-container flex flex-col items-center justify-center gap-4 py-24 text-center">
        <Heart size={40} className="text-slate" />
        <h1 className="section-title">Your wishlist is empty</h1>
        <p className="max-w-sm text-sm text-slate">Save books you're not ready to buy yet they'll show up here.</p>
        <Link to="/books" className="btn-primary">
          Browse books
        </Link>
      </div>
    );
  }

  return (
    <div className="page-container py-8">
      <h1 className="section-title mb-6">Your wishlist ({books.length})</h1>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {books.map((book) => (
          <BookCard key={book._id} book={book} />
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
