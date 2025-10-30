export default function Input({ className = "", ...props }) {
  const cls = `input ${className}`.trim();
  return <input className={cls} {...props} />;
}
