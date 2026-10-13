import { useEffect, useState } from "react";
import { BookOpen, Package, Users, IndianRupee, AlertTriangle } from "lucide-react";
import api from "../services/api";
import { formatPrice } from "../utils/format";
import { Spinner } from "../components/Common";

const StatCard = ({ icon: Icon, label, value }) => (
  <div className="card flex items-center gap-4 p-5">
    <div className="rounded-sm bg-ink/5 p-3 text-maroon">
      <Icon size={20} />
    </div>
    <div>
      <p className="text-xs text-slate">{label}</p>
      <p className="font-serif text-xl font-semibold text-ink">{value}</p>
    </div>
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [lowStock, setLowStock] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get("/orders/all"), api.get("/books?limit=1000")]).then(
      ([ordersRes, booksRes]) => {
        const orders = ordersRes.data.orders;
        const books = booksRes.data.books;
        const revenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
        const uniqueUsers = new Set(orders.map((o) => o.user?._id)).size;

        setStats({
          totalBooks: books.length,
          totalOrders: orders.length,
          revenue,
          uniqueUsers,
        });
        setLowStock(books.filter((b) => b.stock <= 5).slice(0, 6));
        setLoading(false);
      }
    );
  }, []);

  if (loading) return <Spinner />;

  return (
    <div>
      <h1 className="section-title mb-6">Dashboard</h1>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={BookOpen} label="Total books" value={stats.totalBooks} />
        <StatCard icon={Package} label="Total orders" value={stats.totalOrders} />
        <StatCard icon={IndianRupee} label="Revenue" value={formatPrice(stats.revenue)} />
        <StatCard icon={Users} label="Customers" value={stats.uniqueUsers} />
      </div>

      <div className="card mt-8 p-5">
        <div className="mb-4 flex items-center gap-2">
          <AlertTriangle size={16} className="text-maroon" />
          <h2 className="font-serif text-lg font-semibold text-ink">Low stock</h2>
        </div>
        {lowStock.length === 0 ? (
          <p className="text-sm text-slate">Everything is well stocked.</p>
        ) : (
          <div className="divide-y divide-line">
            {lowStock.map((b) => (
              <div key={b._id} className="flex items-center justify-between py-2.5 text-sm">
                <span className="text-ink">{b.title}</span>
                <span className="font-medium text-maroon">{b.stock} left</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
