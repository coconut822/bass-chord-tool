import { Check, Copy } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { ParsedChord } from '../lib/musicTheory';
import { animatePanelRefresh } from '../lib/motion';

interface ChordInfoProps {
  chord: ParsedChord;
  copied: boolean;
  onCopy: () => void;
}

export function ChordInfo({ chord, copied, onCopy }: ChordInfoProps) {
  const panelRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const animation = animatePanelRefresh(panelRef.current);
    return () => {
      animation?.revert();
    };
  }, [chord.standardName]);

  return (
    <section className="panel info-panel" ref={panelRef} aria-labelledby="result-title">
      <div className="result-title-row">
        <div>
          <p className="eyebrow">当前聚焦和弦</p>
          <h2 id="result-title">{chord.standardName}</h2>
        </div>
        <button className="copy-button" type="button" onClick={onCopy}>
          {copied ? <Check size={18} aria-hidden="true" /> : <Copy size={18} aria-hidden="true" />}
          {copied ? '已复制' : '复制结果'}
        </button>
      </div>

      <dl className="info-grid">
        <div>
          <dt>和弦</dt>
          <dd>{chord.standardName}</dd>
        </div>
        <div>
          <dt>中文名称</dt>
          <dd>{chord.chineseName}</dd>
        </div>
        <div>
          <dt>组成音</dt>
          <dd>{chord.notes.join(' ')}</dd>
        </div>
        <div>
          <dt>音程结构</dt>
          <dd>{chord.intervals.join(' ')}</dd>
        </div>
      </dl>
    </section>
  );
}
