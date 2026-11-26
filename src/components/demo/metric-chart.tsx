export function MetricChart({ values }: { values: number[] }) {
  const max = Math.max(...values, 1);
  return (
    <div className="metric-chart" aria-label="最近 12 个时间片请求趋势">
      {values.map((value, index) => (
        <span
          key={`${value}-${index}`}
          style={{ height: `${Math.max(8, (value / max) * 100)}%` }}
          title={`${value}k requests`}
        />
      ))}
    </div>
  );
}
