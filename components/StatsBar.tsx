interface Props {
  label: string;
  value: number;
  max?: number;
  color?: string;
  suffix?: string;
}

export function StatsBar({ label, value, max = 100, color = "#00BFFF", suffix = "" }: Props) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <span className="text-xs font-mono text-kc-muted">{label}</span>
        <span className="text-xs font-mono font-medium" style={{ color }}>
          {typeof value === "number" && !Number.isInteger(value) ? value.toFixed(2) : value}{suffix}
        </span>
      </div>
      <div className="h-1 bg-kc-border rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
    </div>
  );
}
