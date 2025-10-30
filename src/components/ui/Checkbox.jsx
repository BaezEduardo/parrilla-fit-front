export default function Checkbox({ className = "", label, ...props }) {
  const cls = `checkbox ${className}`.trim();
  return (
    <label style={{ display: "inline-flex", gap: 8, alignItems: "center" }}>
      <input type="checkbox" className={cls} {...props} />
      {label}
    </label>
  );
}
