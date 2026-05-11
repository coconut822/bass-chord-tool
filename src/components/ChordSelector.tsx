import { CHORD_TYPES, ChordTypeId, ROOT_OPTIONS } from '../lib/musicTheory';

interface ChordSelectorProps {
  selectedRoot: string;
  selectedTypeId: ChordTypeId;
  onSelect: (root: string, typeId: ChordTypeId) => void;
}

export function ChordSelector({ selectedRoot, selectedTypeId, onSelect }: ChordSelectorProps) {
  return (
    <section className="panel selector-panel" aria-labelledby="selector-title">
      <div className="section-heading">
        <h2 id="selector-title">选择和弦</h2>
        <p className="muted">不用打字，点选根音和类型后自动查询单个和弦。</p>
      </div>

      <div className="selector-group">
        <h3>根音</h3>
        <div className="button-grid roots">
          {ROOT_OPTIONS.map((root) => (
            <button
              className={root.value === selectedRoot ? 'chip selected' : 'chip'}
              key={root.value}
              type="button"
              onClick={() => onSelect(root.value, selectedTypeId)}
            >
              {root.label}
            </button>
          ))}
        </div>
      </div>

      <div className="selector-group">
        <h3>和弦类型</h3>
        <div className="button-grid chord-types">
          {CHORD_TYPES.map((type) => (
            <button
              className={type.id === selectedTypeId ? 'chip selected' : 'chip'}
              key={type.id}
              type="button"
              onClick={() => onSelect(selectedRoot, type.id)}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
