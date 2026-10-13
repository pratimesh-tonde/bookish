import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Package } from "lucide-react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { formatPrice } from "../utils/format";
import { Spinner, StatusBadge } from "../components/Common";
import useDocumentTitle from "../hooks/useDocumentTitle";

const MyOrders = () => {
  useDocumentTitle("My Orders");
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/orders/${user._id}`)
      .then(({ data }) => setOrders(data.orders))
      .finally(() => setLoading(false));
  }, [user._id]);

  if (loading) return <Spinner />;

  if (orders.length === 0) {
    return (
      <div className="page-container flex flex-col items-center justify-center gap-4 py-24 text-center">
        <Package size={40} className="text-slate" />
        <h1 className="section-title">No orders yet</h1>
        <p className="max-w-sm text-sm text-slate">Once you place an order, you'll be able to track it here.</p>
        <Link to="/books" className="btn-primary">
          Browse books
        </Link>
      </div>
    );
  }

  return (
    <div className="page-container py-8">
      <h1 className="section-title mb-6">Your orders</h1>
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order._id} className="card p-5">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line pb-3">
              <div>
                <p className="text-xs text-slate">Order placed</p>
                <p className="text-sm font-medium text-ink">
                  {new Date(order.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate">Total</p>
                <p className="text-sm font-medium text-ink">{formatPrice(order.totalAmount)}</p>
              </div>
              <div>
                <p className="text-xs text-slate">Payment</p>
                <p className="text-sm font-medium text-ink">
                  {order.paymentMethod} · {order.paymentStatus}
                </p>
              </div>
               <StatusBadge status={order.orderStatus} />
              <Link to={`/orders/${order._id}`} className="text-sm font-medium text-maroon hover:underline">
                Track order
              </Link>
            </div>

            <div className="mt-3 space-y-1.5">
              {order.items.map((item, i) => (
                <div key={i} className="flex justify-between text-sm text-slate">
                  <span>
                    {item.title} × {item.quantity}
                  </span>
                  <span>{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyOrders;
