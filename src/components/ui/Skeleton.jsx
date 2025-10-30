export default function Skeleton({ rows = 6 }) {
  return (
    <div className="skeleton-grid">
      {Array.from({ length: rows }).map((_, i) => <div key={i} className="skeleton-card" />)}
    </div>
  );
}
