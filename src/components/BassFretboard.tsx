import { useEffect, useRef } from 'react';
import { FretPosition, generateBassFretboard, ParsedChord } from '../lib/musicTheory';
import { animateMarkers, animatePanelRefresh } from '../lib/motion';

interface BassFretboardProps {
  chord: ParsedChord;
}

const FRETS = Array.from({ length: 13 }, (_, index) => index);
const STRING_NAMES = ['G', 'D', 'A', 'E'] as const;

export function BassFretboard({ chord }: BassFretboardProps) {
  const panelRef = useRef<HTMLElement | null>(null);
  const positions = generateBassFretboard(chord);

  useEffect(() => {
    const panelAnimation = animatePanelRefresh(panelRef.current);
    const markerAnimation = animateMarkers(panelRef.current?.querySelectorAll('.note-marker') ?? []);

    return () => {
      panelAnimation?.revert();
      markerAnimation?.revert();
    };
  }, [chord.standardName]);

  return (
    <section className="panel fretboard-panel" ref={panelRef} aria-labelledby="fretboard-title">
      <div className="section-heading">
        <h2 id="fretboard-title">标准四弦贝斯指板</h2>
        <p className="muted">当前显示 {chord.standardName}。标准调弦 E A D G，范围 0 到 12 品。</p>
      </div>

      <div className="fretboard-scroll" aria-label={`${chord.standardName} 指板音位`}>
        <div className="fretboard">
          <div className="fret-row fret-header">
            <div className="string-label">弦</div>
            {FRETS.map((fret) => (
              <div className="fret-number" key={fret}>
                {fret}
              </div>
            ))}
          </div>

          {STRING_NAMES.map((stringName) => (
            <div className="fret-row string-row" key={stringName}>
              <div className="string-label">{stringName} 弦</div>
              {positions
                .filter((position) => position.stringName === stringName)
                .map((position) => (
                  <FretCell key={`${position.stringName}-${position.fret}`} position={position} />
                ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FretCell({ position }: { position: FretPosition }) {
  const roleClass = position.role ? ` role-${position.role.replace('#', 'sharp').replace('b', 'flat')}` : '';

  return (
    <div className="fret-cell">
      <span className="string-line" aria-hidden="true" />
      {position.isChordTone ? (
        <span className={`note-marker${roleClass}`} title={`${position.note} ${position.role}`}>
          <strong>{position.note}</strong>
          <small>{position.role}</small>
        </span>
      ) : null}
    </div>
  );
}
