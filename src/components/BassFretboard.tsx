import { useEffect, useRef } from 'react';
import { FretPosition, FretboardMarker, generateFretboard } from '../lib/fretboard';
import { animateMarkers, animatePanelRefresh } from '../lib/motion';

interface BassFretboardProps {
  title: string;
  description: string;
  markers: FretboardMarker[];
  animationKey: string;
}

const FRETS = Array.from({ length: 13 }, (_, index) => index);
const STRING_NAMES = ['G', 'D', 'A', 'E'] as const;
const MARKED_FRETS = new Set([3, 5, 7, 9, 12]);

export function BassFretboard({ title, description, markers, animationKey }: BassFretboardProps) {
  const panelRef = useRef<HTMLElement | null>(null);
  const positions = generateFretboard(markers);

  useEffect(() => {
    const panelAnimation = animatePanelRefresh(panelRef.current);
    const markerAnimation = animateMarkers(panelRef.current?.querySelectorAll('.note-marker') ?? []);

    return () => {
      panelAnimation?.revert();
      markerAnimation?.revert();
    };
  }, [animationKey]);

  return (
    <section className="panel fretboard-panel" ref={panelRef} aria-labelledby="fretboard-title">
      <div className="section-heading">
        <h2 id="fretboard-title">{title}</h2>
        <p className="muted">{description}</p>
      </div>

      <div className="fretboard-scroll" aria-label={`${title} 指板音位`}>
        <div className="fretboard">
          <div className="fret-row fret-header">
            <div className="string-label">弦</div>
            {FRETS.map((fret) => (
              <div className={MARKED_FRETS.has(fret) ? 'fret-number marked' : 'fret-number'} key={fret}>
                <span>{fret}</span>
                {MARKED_FRETS.has(fret) ? <i aria-hidden="true" /> : null}
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
  const marker = position.marker;
  const roleClass = marker ? ` role-${marker.role.replace('#', 'sharp').replace('b', 'flat')}` : '';
  const kindClass = marker ? ` marker-${marker.kind}` : '';
  const rootClass = marker?.isRoot ? ' is-root' : '';

  return (
    <div className="fret-cell">
      <span className="string-line" aria-hidden="true" />
      {marker ? (
        <span className={`note-marker${roleClass}${kindClass}${rootClass}`} title={`${marker.note} ${marker.role}`}>
          <strong>{marker.note}</strong>
          <em aria-hidden="true" />
          <small>{marker.role}</small>
        </span>
      ) : null}
    </div>
  );
}
