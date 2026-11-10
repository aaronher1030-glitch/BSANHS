/**
 * One published figure: the value, its label and the as-of note.
 * Presentational — the Finance page owns the data (FINANCE_STATS).
 * Styled for the mint band: light-side tokens, 1px rules between tiles.
 */
export function Stat({
  value,
  label,
  note,
}: {
  value: string;
  label: string;
  note?: string;
}) {
  return (
    <div className="stat">
      <p className="stat__value">{value}</p>
      <p className="stat__label">{label}</p>
      {note ? <p className="stat__note">{note}</p> : null}
    </div>
  );
}
