import { Link, useNavigate } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../utils/format";
import { Spinner } from "../components/Common";

const Cart = () => {
  const { items, loading, cartTotal, updateQuantity, removeItem } = useCart();
  const navigate = useNavigate();

  if (loading) return <Spinner />;

  if (items.length === 0) {
    return (
      <div className="page-container flex flex-col items-center justify-center gap-4 py-24 text-center">
        <ShoppingBag size={40} className="text-slate" />
        <h1 className="section-title">Your cart is empty</h1>
        <p className="max-w-sm text-sm text-slate">Browse our catalogue and add a few books you'd like to read next.</p>
        <Link to="/books" className="btn-primary">
          Browse books
        </Link>
      </div>
    );
  }

  return (
    <div className="page-container py-8">
      <h1 className="section-title mb-6">Your cart ({items.length})</h1>

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item._id} className="card flex gap-4 p-4">
              <Link to={`/books/${item.book._id}`} className="w-20 shrink-0">
                <img src={item.book.coverImage} alt={item.book.title} className="aspect-[2/3] w-full rounded-sm object-cover" />
              </Link>

              <div className="flex flex-1 flex-col">
                <Link to={`/books/${item.book._id}`} className="font-medium text-ink hover:text-maroon">
                  {item.book.title}
                </Link>
                <p className="text-xs text-slate">{item.book.author}</p>
                <p className="mt-1 font-serif text-lg font-semibold text-ink">{formatPrice(item.book.price)}</p>

                <div className="mt-auto flex items-center justify-between pt-2">
                  <div className="flex items-center rounded-sm border border-line">
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity - 1)}
                      className="px-2.5 py-1.5 hover:bg-paper"
                      aria-label="Decrease quantity"
                    >
                      <Minus size={13} />
                    </button>
                    <span className="w-7 text-center text-sm font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      className="px-2.5 py-1.5 hover:bg-paper"
                      aria-label="Increase quantity"
                    >
                      <Plus size={13} />
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(item._id)}
                    className="flex items-center gap-1.5 text-sm text-maroon hover:underline"
                  >
                    <Trash2 size={14} /> Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="card h-fit p-5">
          <h2 className="mb-4 font-serif text-lg font-semibold text-ink">Order summary</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-slate">
              <span>Subtotal</span>
              <span>{formatPrice(cartTotal)}</span>
            </div>
            <div className="flex justify-between text-slate">
              <span>Delivery</span>
              <span>{cartTotal >= 499 ? "Free" : formatPrice(49)}</span>
            </div>
          </div>
          <div className="mt-3 flex justify-between border-t border-line pt-3 font-semibold text-ink">
            <span>Total</span>
            <span>{formatPrice(cartTotal >= 499 ? cartTotal : cartTotal + 49)}</span>
          </div>
          <button onClick={() => navigate("/checkout")} className="btn-primary mt-5 w-full">
            Proceed to checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
