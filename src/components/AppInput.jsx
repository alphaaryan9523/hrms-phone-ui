export default function AppInput({ label, error, className = '', ...props }) {
  return (
    <label className={`field ${className}`}>
      <span>{label}</span>
      <input className={error ? 'input input--error' : 'input'} {...props} />
      {error ? <small className="field-error">{error}</small> : null}
    </label>
  );
}
