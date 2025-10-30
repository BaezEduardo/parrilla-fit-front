export default function Button({ as: As = "button", className = "", ...props }) {
  const cls = `btn ${className}`.trim();
  return <As className={cls} {...props} />;
}
