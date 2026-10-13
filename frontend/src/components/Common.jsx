export const Spinner = ({ className = "" }) => (
  <div className={`flex justify-center py-16 ${className}`}>
    <div className="h-8 w-8 animate-spin rounded-full border-2 border-line border-t-maroon" />
  </div>
);

const statusStyles = {
  placed: "bg-gold/25 text-ink",
  shipped: "bg-ink/15 text-ink",
  delivered: "bg-success/20 text-success",
  cancelled: "bg-maroon/15 text-maroon",
};

export const StatusBadge = ({ status }) => (
  <span
    className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
      statusStyles[status] || "bg-line text-slate"
    }`}
  >
    {status}
  </span>
);