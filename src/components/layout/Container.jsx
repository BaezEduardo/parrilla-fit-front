export default function Container({ className = "", ...props }) {
  const cls = `container ${className}`.trim();
  return <div className={cls} {...props} />;
}
