import { useMemo, useState } from 'react';
import { parseChord, ParsedChord } from '../lib/chords';
import { FretboardMarker } from '../lib/fretboard';
import { ROOT_OPTIONS, Tone } from '../lib/musicTheory';
import { buildScale, ParsedScale, SCALE_TYPES, ScaleTypeId } from '../lib/scales';
import { BassFretboard } from './BassFretboard';
import { Legend } from './Legend';
import { ToneTags } from './ToneTags';

export function ChordScaleTool() {
  const [chordQuery, setChordQuery] = useState('Em');
  const [scaleRoot, setScaleRoot] = useState('E');
  const [scaleTypeId, setScaleTypeId] = useState<ScaleTypeId>('dorian');
  const parsedChord = useMemo(() => parseChord(chordQuery) ?? parseChord('Em'), [chordQuery]) as ParsedChord;
  const scale = useMemo(() => buildScale(scaleRoot, scaleTypeId), [scaleRoot, scaleTypeId]);
  const scalePitchClasses = useMemo(() => new Set(scale.tones.map((tone) => tone.pitchClass)), [scale]);
  const chordPitchClasses = useMemo(() => new Set(parsedChord.tones.map((tone) => tone.pitchClass)), [parsedChord]);
  const chordInsideScale = parsedChord.tones.filter((tone) => scalePitchClasses.has(tone.pitchClass));
  const otherScaleTones = scale.tones.filter((tone) => !chordPitchClasses.has(tone.pitchClass));
  const markers = useMemo(() => buildChordScaleMarkers(parsedChord, scale), [parsedChord, scale]);

  return (
    <div className="tool-layout">
      <div className="control-column">
        <section className="panel picker-panel">
          <div className="section-heading">
            <p className="eyebrow">Chord + Scale</p>
            <h2>和弦 + 音阶</h2>
            <p className="muted">查看稳定落点与音阶内其他可用音，不自动生成 bassline。</p>
          </div>

          <div className="selector-group">
            <h3>和弦</h3>
            <input className="tool-input" value={chordQuery} onChange={(event) => setChordQuery(event.target.value)} placeholder="例如 Em、Cmaj7、A9" />
            {!parseChord(chordQuery) ? <p className="error-text">暂时无法识别这个和弦。</p> : null}
          </div>

          <div className="selector-group">
            <h3>音阶根音</h3>
            <div className="button-grid roots">
              {ROOT_OPTIONS.map((option) => (
                <button className={option.value === scaleRoot ? 'chip selected' : 'chip'} key={option.value} type="button" onClick={() => setScaleRoot(option.value)}>
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="selector-group">
            <h3>音阶类型</h3>
            <div className="button-grid scale-types">
              {SCALE_TYPES.map((type) => (
                <button className={type.id === scaleTypeId ? 'chip selected' : 'chip'} key={type.id} type="button" onClick={() => setScaleTypeId(type.id)}>
                  {type.label}
                </button>
              ))}
            </div>
          </div>
        </section>
      </div>

      <div className="result-column">
        <section className="panel info-panel">
          <div className="result-title-row">
            <div>
              <p className="eyebrow">叠加分析</p>
              <h2>
                {parsedChord.standardName} + {scale.standardName}
              </h2>
            </div>
          </div>

          <dl className="info-grid overlay-grid">
            <div>
              <dt>和弦内音</dt>
              <dd>
                <ToneTags items={parsedChord.notes} />
              </dd>
            </div>
            <div>
              <dt>音阶音</dt>
              <dd>
                <ToneTags items={scale.notes} />
              </dd>
            </div>
            <div>
              <dt>和弦内音且属于音阶</dt>
              <dd>
                <ToneTags items={chordInsideScale.map((tone) => tone.note)} />
              </dd>
            </div>
            <div>
              <dt>音阶内其他可用音</dt>
              <dd>
                <ToneTags items={otherScaleTones.map((tone) => tone.note)} />
              </dd>
            </div>
          </dl>
        </section>

        <Legend variant="overlay" />
        <BassFretboard
          title="和弦 + 音阶指板"
          description="和弦内音更适合作为稳定落点，音阶内其他音可作为经过音或色彩音。"
          markers={markers}
          animationKey={`${parsedChord.standardName}-${scale.standardName}`}
        />
      </div>
    </div>
  );
}

function buildChordScaleMarkers(chord: ParsedChord, scale: ParsedScale): FretboardMarker[] {
  const scaleMap = new Map(scale.tones.map((tone) => [tone.pitchClass, tone]));
  const chordMap = new Map(chord.tones.map((tone) => [tone.pitchClass, tone]));
  const markers: FretboardMarker[] = [];

  scale.tones.forEach((tone: Tone) => {
    const chordTone = chordMap.get(tone.pitchClass);
    markers.push({
      pitchClass: tone.pitchClass,
      note: tone.note,
      role: chordTone?.role ?? tone.role,
      kind: chordTone ? 'overlap' : 'scale',
      isRoot: tone.pitchClass === scale.rootPitchClass,
    });
  });

  chord.tones.forEach((tone) => {
    if (!scaleMap.has(tone.pitchClass)) {
      markers.push({
        pitchClass: tone.pitchClass,
        note: tone.note,
        role: tone.role,
        kind: 'chord',
        isRoot: tone.pitchClass === chord.rootPitchClass,
      });
    }
  });

  return markers;
}
