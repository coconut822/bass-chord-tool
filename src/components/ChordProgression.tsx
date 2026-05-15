import { useEffect, useMemo, useRef } from 'react';
import { CommonTonePair, ParsedChord } from '../lib/musicTheory';
import { animateCommonTonePulse, animateListItems, animatePanelRefresh } from '../lib/motion';

interface ChordProgressionProps {
  chords: ParsedChord[];
  commonTonePairs: CommonTonePair[];
  onFocusChord: (chord: ParsedChord) => void;
}

export function ChordProgression({ chords, commonTonePairs, onFocusChord }: ChordProgressionProps) {
  const panelRef = useRef<HTMLElement | null>(null);
  const progressionKey = useMemo(() => chords.map((chord) => chord.standardName).join('|'), [chords]);

  useEffect(() => {
    if (chords.length <= 1) {
      return;
    }

    const panelAnimation = animatePanelRefresh(panelRef.current);
    const cardAnimation = animateListItems(panelRef.current?.querySelectorAll('.progression-card') ?? []);
    const commonToneAnimation = animateCommonTonePulse(panelRef.current?.querySelectorAll('.common-tone-row') ?? []);

    return () => {
      panelAnimation?.revert();
      cardAnimation?.revert();
      commonToneAnimation?.revert();
    };
  }, [chords.length, progressionKey]);

  if (chords.length <= 1) {
    return null;
  }

  return (
    <section className="panel progression-panel" ref={panelRef} aria-labelledby="progression-title">
      <div className="section-heading">
        <p className="eyebrow">多和弦模式</p>
        <h2 id="progression-title">和弦组信息</h2>
        <p className="muted">逐个查看组成音，并观察相邻和弦之间可以保留的共同音。</p>
      </div>

      <div className="progression-grid">
        {chords.map((chord, index) => (
          <button className="progression-card" key={`${chord.standardName}-${index}`} type="button" onClick={() => onFocusChord(chord)}>
            <span className="step-number">{index + 1}</span>
            <strong>{chord.standardName}</strong>
            <span>{chord.notes.join(' ')}</span>
            <small>{chord.intervals.join(' ')}</small>
          </button>
        ))}
      </div>

      <div className="common-tones">
        <h3>相邻共同音</h3>
        {commonTonePairs.map((pair) => (
          <div className="common-tone-row" key={`${pair.from.standardName}-${pair.to.standardName}`}>
            <span className="transition-label">
              {pair.from.standardName} → {pair.to.standardName}
            </span>
            <span className={pair.notes.length > 0 ? 'common-note-list' : 'common-note-list empty'}>
              共同音：{pair.notes.length > 0 ? pair.notes.join('、') : '无'}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
