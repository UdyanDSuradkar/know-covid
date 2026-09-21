/** Small segmented control. `options` is [{ value, label }]. */
export default function Segmented({ options, value, onChange, label, style }) {
  return (
    <div className="segmented" role="group" aria-label={label} style={style}>
      {options.map((o) => (
        <button
          key={o.value}
          aria-pressed={value === o.value}
          onClick={() => onChange(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
