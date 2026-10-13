import { useEffect, useState } from "react";
import api from "../services/api";
import { formatPrice } from "../utils/format";
import { Spinner } from "../components/Common";
import { StatusBadge } from "../components/Common";

const statusOptions = ["placed", "shipped", "delivered", "cancelled"];

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = () => {
    setLoading(true);
    api
      .get("/orders/all")
      .then(({ data }) => setOrders(data.orders))
      .finally(() => setLoading(false));
  };

  useEffect(loadOrders, []);

  const handleStatusChange = async (id, orderStatus) => {
    setOrders((prev) => prev.map((o) => (o._id === id ? { ...o, orderStatus } : o))); // optimistic
    await api.put(`/orders/${id}`, { orderStatus });
  };

  if (loading) return <Spinner />;

  return (
    <div>
      <h1 className="section-title mb-6">Manage orders</h1>

      {orders.length === 0 ? (
        <p className="text-sm text-slate">No orders have been placed yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="card p-5">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-3">
                <div>
                  <p className="text-xs text-slate">Customer</p>
                  <p className="text-sm font-medium text-ink">{order.user?.name}</p>
                  <p className="text-xs text-slate">{order.user?.email}</p>
                </div>
                <div>
                  <p className="text-xs text-slate">Placed on</p>
                  <p className="text-sm font-medium text-ink">
                    {new Date(order.createdAt).toLocaleDateString("en-IN")}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate">Total</p>
                  <p className="text-sm font-medium text-ink">{formatPrice(order.totalAmount)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={order.orderStatus} />
                  <select
                    value={order.orderStatus}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    className="input-field w-auto !py-1.5 text-xs"
                  >
                    {statusOptions.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-3 space-y-1">
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
      )}
    </div>
  );
};

export default ManageOrders;
