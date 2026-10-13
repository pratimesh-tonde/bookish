import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Package, Truck, CheckCircle, XCircle, ArrowLeft } from "lucide-react";
import api from "../services/api";
import { formatPrice } from "../utils/format";
import { Spinner } from "../components/Common";
import useDocumentTitle from "../hooks/useDocumentTitle";

const steps = [
  { key: "placed", label: "Order placed", icon: Package },
  { key: "shipped", label: "Shipped", icon: Truck },
  { key: "delivered", label: "Delivered", icon: CheckCircle },
];

const TrackOrder = () => {
  useDocumentTitle("Track Order");
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api
      .get(`/orders/detail/${id}`)
      .then(({ data }) => setOrder(data.order))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Spinner />;
  if (!order) {
    return <div className="page-container py-16 text-center text-slate">Order not found.</div>;
  }

  const currentStepIndex = steps.findIndex((s) => s.key === order.orderStatus);
  const isCancelled = order.orderStatus === "cancelled";

  const dateFor = (statusKey) => {
    const entry = order.statusHistory?.find((h) => h.status === statusKey);
    return entry
      ? new Date(entry.date).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          hour: "2-digit",
          minute: "2-digit",
        })
      : null;
  };

  return (
    <div className="page-container py-8">
      <Link to="/orders" className="mb-4 inline-flex items-center gap-1.5 text-sm text-slate hover:text-ink">
        <ArrowLeft size={15} /> Back to orders
      </Link>

      <h1 className="section-title mb-1">Track order</h1>
      <p className="mb-8 text-sm text-slate">Order #{order._id.slice(-8).toUpperCase()}</p>

      {isCancelled ? (
        <div className="card flex items-center gap-3 p-5 text-maroon">
          <XCircle size={22} />
          <p className="font-medium">This order was cancelled.</p>
        </div>
      ) : (
        <div className="card p-6">
          <div className="flex items-start">
            {steps.map((step, i) => {
              const Icon = step.icon;
              const reached = i <= currentStepIndex;
              return (
                <div key={step.key} className="flex flex-1 flex-col items-center text-center">
                  <div className="flex w-full items-center">
                    <div className={`h-px flex-1 ${i === 0 ? "invisible" : reached ? "bg-maroon" : "bg-line"}`} />
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 ${
                        reached ? "border-maroon bg-maroon text-white" : "border-line bg-white text-slate"
                      }`}
                    >
                      <Icon size={18} />
                    </div>
                    <div
                      className={`h-px flex-1 ${
                        i === steps.length - 1 ? "invisible" : reached ? "bg-maroon" : "bg-line"
                      }`}
                    />
                  </div>
                  <p className={`mt-2 text-sm font-medium ${reached ? "text-ink" : "text-slate"}`}>{step.label}</p>
                  {dateFor(step.key) && <p className="text-xs text-slate">{dateFor(step.key)}</p>}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div className="card p-5">
          <h2 className="mb-3 font-serif text-lg font-semibold text-ink">Items</h2>
          <div className="space-y-2">
            {order.items.map((item, i) => (
              <div key={i} className="flex justify-between text-sm text-slate">
                <span>
                  {item.title} × {item.quantity}
                </span>
                <span>{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
            <div className="flex justify-between border-t border-line pt-2 font-semibold text-ink">
              <span>Total</span>
              <span>{formatPrice(order.totalAmount)}</span>
            </div>
          </div>
        </div>

        <div className="card p-5">
          <h2 className="mb-3 font-serif text-lg font-semibold text-ink">Delivery address</h2>
          <p className="text-sm leading-relaxed text-slate">
            {order.address?.line1}
            <br />
            {order.address?.city}, {order.address?.state} - {order.address?.pincode}
            <br />
            Phone: {order.address?.phone}
          </p>
          <p className="mt-3 text-sm text-slate">
            Payment: {order.paymentMethod} · {order.paymentStatus}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TrackOrder;