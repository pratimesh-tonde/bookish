export const formatPrice = (value = 0) =>
  `₹${Number(value).toLocaleString("en-IN")}`;

export const discountPercent = (price, mrp) => {
  if (!mrp || mrp <= price) return 0;
  return Math.round(((mrp - price) / mrp) * 100);
};
