export default function Card({ className = "", children, ...props }) {
  const cls = `card ${className}`.trim();
  return (
    <div className={cls} {...props}>
      {children}
    </div>
  );
}
