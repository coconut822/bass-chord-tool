const LEGEND_ITEMS = [
  { role: '1', label: '根音' },
  { role: '3 / b3', label: '三音' },
  { role: '5', label: '五音' },
  { role: '7 / b7', label: '七音' },
];

export function Legend() {
  return (
    <section className="panel legend-panel" aria-label="音程图例">
      <h2>图例</h2>
      <div className="legend-list">
        {LEGEND_ITEMS.map((item) => (
          <div className="legend-item" key={item.role}>
            <span className="legend-role">{item.role}</span>
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
