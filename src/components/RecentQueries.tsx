interface RecentQueriesProps {
  items: string[];
  onSelect: (query: string) => void;
}

export function RecentQueries({ items, onSelect }: RecentQueriesProps) {
  return (
    <section className="panel recent-panel" aria-labelledby="recent-title">
      <div className="section-heading">
        <h2 id="recent-title">最近查询</h2>
        <p className="muted">保留最近 10 次，点击可再次查询。</p>
      </div>

      {items.length > 0 ? (
        <div className="recent-list">
          {items.map((item) => (
            <button className="history-chip" key={item} type="button" onClick={() => onSelect(item)}>
              {item}
            </button>
          ))}
        </div>
      ) : (
        <p className="empty-text">还没有查询记录。</p>
      )}
    </section>
  );
}
