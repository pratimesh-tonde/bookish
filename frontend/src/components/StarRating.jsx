import { Star } from "lucide-react";

// Renders a row of 5 stars, filled up to `rating`. Optionally shows the
// numeric value and review count next to it.
const StarRating = ({ rating = 0, numReviews, size = 14 }) => {
  const rounded = Math.round(rating);
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((n) => (
          <Star
            key={n}
            size={size}
            className={n <= rounded ? "fill-gold text-gold" : "fill-line text-line"}
          />
        ))}
      </div>
      {rating > 0 && (
        <span className="text-xs text-slate">
          {rating}
          {typeof numReviews === "number" && ` (${numReviews})`}
        </span>
      )}
    </div>
  );
};

export default StarRating;
