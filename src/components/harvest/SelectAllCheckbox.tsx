interface Props {
  checked: boolean;
  indeterminate: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
}

/** Header checkbox that selects/deselects every holding row. */
export function SelectAllCheckbox({ checked, indeterminate, onChange, label }: Props) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-2">
      <input
        type="checkbox"
        checked={checked}
        aria-checked={indeterminate ? "mixed" : checked}
        aria-label="Select all holdings"
        onChange={(e) => onChange(e.target.checked)}
        className="size-4 shrink-0 cursor-pointer accent-[var(--harvest-blue)] transition-transform active:scale-90"
      />
      {label ? <span className="text-sm font-medium">{label}</span> : null}
    </label>
  );
}
