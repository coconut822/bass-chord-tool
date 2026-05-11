import { Search } from 'lucide-react';

interface ChordInputProps {
  value: string;
  error: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
}

export function ChordInput({ value, error, onChange, onSubmit }: ChordInputProps) {
  return (
    <section className="panel input-panel" aria-labelledby="chord-input-title">
      <div>
        <h2 id="chord-input-title">快速查询</h2>
        <p className="muted">可输入单个和弦，也可输入和弦组：Em | B | A | G 或 Em B A G</p>
      </div>
      <form
        className="search-form"
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit();
        }}
      >
        <label className="visually-hidden" htmlFor="chord-search">
          和弦名称或和弦组
        </label>
        <input
          id="chord-search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              onSubmit();
            }
          }}
          placeholder="输入和弦或和弦组"
          autoComplete="off"
        />
        <button className="primary-button" type="submit">
          <Search size={18} aria-hidden="true" />
          查询
        </button>
      </form>
      {error ? <p className="error-text">{error}</p> : null}
    </section>
  );
}
