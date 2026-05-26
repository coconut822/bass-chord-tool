type LegendVariant = 'chord' | 'scale' | 'overlay';

interface LegendProps {
  variant?: LegendVariant;
}

const CHORD_ITEMS = [
  { role: '1', label: '根音' },
  { role: '3 / b3', label: '三音' },
  { role: '5', label: '五音' },
  { role: '7 / b7', label: '七音' },
  { role: '9', label: '九音' },
];

const SCALE_ITEMS = [
  { role: '1', label: '音阶根音' },
  { role: '2-7', label: '音阶音' },
];

const OVERLAY_ITEMS = [
  { role: '1', label: '根音' },
  { role: '实心', label: '和弦内音' },
  { role: '浅色', label: '音阶内其他音' },
];

export function Legend({ variant = 'chord' }: LegendProps) {
  const items = variant === 'overlay' ? OVERLAY_ITEMS : variant === 'scale' ? SCALE_ITEMS : CHORD_ITEMS;

  return (
    <section className="panel legend-panel" aria-label="音程图例">
      <h2>图例</h2>
      <div className="legend-list">
        {items.map((item) => (
          <div className="legend-item" key={item.role}>
            <span className="legend-role">{item.role}</span>
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
