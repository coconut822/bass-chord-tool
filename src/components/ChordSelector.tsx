import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { CHORD_TYPES, ChordTypeId } from '../lib/chords';
import { ROOT_OPTIONS } from '../lib/musicTheory';

interface ChordSelectorProps {
  selectedRoot: string;
  selectedTypeId: ChordTypeId;
  onSelect: (root: string, typeId: ChordTypeId) => void;
}

export function ChordSelector({ selectedRoot, selectedTypeId, onSelect }: ChordSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className={isOpen ? 'panel selector-panel is-open' : 'panel selector-panel'} aria-labelledby="selector-title">
      <button className="selector-toggle" type="button" onClick={() => setIsOpen((value) => !value)} aria-expanded={isOpen}>
        <span>
          <strong id="selector-title">选择和弦</strong>
          <small>不用打字，点选根音和类型</small>
        </span>
        <ChevronDown size={18} aria-hidden="true" />
      </button>

      {isOpen ? (
        <div className="selector-content">
          <div className="selector-group">
            <h3>根音</h3>
            <div className="button-grid roots">
              {ROOT_OPTIONS.map((root) => (
                <button className={root.value === selectedRoot ? 'chip selected' : 'chip'} key={root.value} type="button" onClick={() => onSelect(root.value, selectedTypeId)}>
                  {root.label}
                </button>
              ))}
            </div>
          </div>

          <div className="selector-group">
            <h3>和弦类型</h3>
            <div className="button-grid chord-types">
              {CHORD_TYPES.map((type) => (
                <button className={type.id === selectedTypeId ? 'chip selected' : 'chip'} key={type.id} type="button" onClick={() => onSelect(selectedRoot, type.id)}>
                  {type.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
