import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import api from "../services/api";
import { formatPrice } from "../utils/format";
import { isValidPincode, isValidPhone } from "../utils/validate";
import { Spinner } from "../components/Common";
import useDocumentTitle from "../hooks/useDocumentTitle";

const Checkout = () => {
  useDocumentTitle("Checkout");
  const { user } = useAuth();
  const { items, cartTotal, loading, clearCartLocal } = useCart();
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    line1: user?.address?.line1 || "",
    city: user?.address?.city || "",
    state: user?.address?.state || "",
    pincode: user?.address?.pincode || "",
    phone: user?.address?.phone || "",
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");

  const delivery = cartTotal >= 499 ? 0 : 49;
  const total = cartTotal + delivery;

  const validate = () => {
    const errors = {};
    if (!isValidPincode(address.pincode)) errors.pincode = "Enter a valid 6-digit pincode";
    if (!isValidPhone(address.phone)) errors.phone = "Enter a valid 10-digit mobile number";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError("");
    if (!validate()) return;
    setPlacing(true);
    try {
      await api.post("/orders", { address, paymentMethod });
      clearCartLocal();
      navigate("/orders", { state: { justPlaced: true } });
    } catch (err) {
      setError(err.response?.data?.message || "Could not place order");
    } finally {
      setPlacing(false);
    }
  };

  if (loading) return <Spinner />;

  if (items.length === 0) {
    return (
      <div className="page-container py-16 text-center text-slate">
        Your cart is empty add a few books before checking out.
      </div>
    );
  }

  return (
    <div className="page-container py-8">
      <h1 className="section-title mb-6">Checkout</h1>

      <form onSubmit={handlePlaceOrder} className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <div className="card p-5">
            <h2 className="mb-4 font-serif text-lg font-semibold text-ink">Delivery address</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium text-ink">Address line</label>
                <input
                  required
                  value={address.line1}
                  onChange={(e) => setAddress((a) => ({ ...a, line1: e.target.value }))}
                  className="input-field"
                  placeholder="House no., street, area"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-ink">City</label>
                <input
                  required
                  value={address.city}
                  onChange={(e) => setAddress((a) => ({ ...a, city: e.target.value }))}
                  className="input-field"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-ink">State</label>
                <input
                  required
                  value={address.state}
                  onChange={(e) => setAddress((a) => ({ ...a, state: e.target.value }))}
                  className="input-field"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-ink">Pincode</label>
                <input
                  required
                  inputMode="numeric"
                  maxLength={6}
                  value={address.pincode}
                  onChange={(e) => setAddress((a) => ({ ...a, pincode: e.target.value.replace(/\D/g, "") }))}
                  className="input-field"
                />
                {fieldErrors.pincode && <p className="mt-1 text-xs text-maroon">{fieldErrors.pincode}</p>}
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-ink">Phone</label>
                <input
                  required
                  inputMode="numeric"
                  maxLength={10}
                  value={address.phone}
                  onChange={(e) => setAddress((a) => ({ ...a, phone: e.target.value.replace(/\D/g, "") }))}
                  className="input-field"
                />
                {fieldErrors.phone && <p className="mt-1 text-xs text-maroon">{fieldErrors.phone}</p>}
              </div>
            </div>
          </div>

          <div className="card p-5">
            <h2 className="mb-4 font-serif text-lg font-semibold text-ink">Payment method</h2>
            <div className="space-y-2.5">
              <label className="flex items-center gap-2.5 text-sm text-ink">
                <input
                  type="radio"
                  checked={paymentMethod === "COD"}
                  onChange={() => setPaymentMethod("COD")}
                />
                Cash on delivery
              </label>
              <label className="flex items-center gap-2.5 text-sm text-ink">
                <input
                  type="radio"
                  checked={paymentMethod === "ONLINE"}
                  onChange={() => setPaymentMethod("ONLINE")}
                />
                Pay online (using upi, card, netbanking, etc. but this service is not available yet)
              </label>
            </div>
          </div>
        </div>

        <div className="card h-fit space-y-3 p-5">
          <h2 className="mb-1 font-serif text-lg font-semibold text-ink">Order summary</h2>
          {items.map((item) => (
            <div key={item._id} className="flex justify-between text-sm text-slate">
              <span className="line-clamp-1 pr-2">
                {item.book.title} × {item.quantity}
              </span>
              <span>{formatPrice(item.book.price * item.quantity)}</span>
            </div>
          ))}
          <div className="flex justify-between border-t border-line pt-3 text-sm text-slate">
            <span>Delivery</span>
            <span>{delivery === 0 ? "Free" : formatPrice(delivery)}</span>
          </div>
          <div className="flex justify-between border-t border-line pt-3 font-semibold text-ink">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
          {error && <p className="text-sm text-maroon">{error}</p>}
          <button type="submit" disabled={placing} className="btn-primary w-full">
            {placing ? "Placing order..." : "Place order"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Checkout;