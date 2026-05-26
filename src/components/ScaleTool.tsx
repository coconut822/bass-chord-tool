import { useMemo, useState } from 'react';
import { createMarkers } from '../lib/fretboard';
import { ROOT_OPTIONS } from '../lib/musicTheory';
import { buildScale, SCALE_TYPES, ScaleTypeId } from '../lib/scales';
import { BassFretboard } from './BassFretboard';
import { Legend } from './Legend';
import { ToneTags } from './ToneTags';

export function ScaleTool() {
  const [root, setRoot] = useState('E');
  const [scaleTypeId, setScaleTypeId] = useState<ScaleTypeId>('dorian');
  const scale = useMemo(() => buildScale(root, scaleTypeId), [root, scaleTypeId]);
  const markers = useMemo(() => createMarkers(scale.tones, 'scale', scale.rootPitchClass), [scale]);

  return (
    <div className="tool-layout">
      <div className="control-column">
        <section className="panel picker-panel">
          <div className="section-heading">
            <p className="eyebrow">Scale Finder</p>
            <h2>音阶查询</h2>
            <p className="muted">选择根音和音阶类型，查看音阶组成音与指板位置。</p>
          </div>

          <div className="selector-group">
            <h3>根音</h3>
            <div className="button-grid roots">
              {ROOT_OPTIONS.map((option) => (
                <button className={option.value === root ? 'chip selected' : 'chip'} key={option.value} type="button" onClick={() => setRoot(option.value)}>
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
              <p className="eyebrow">当前音阶</p>
              <h2>{scale.standardName}</h2>
            </div>
          </div>

          <dl className="info-grid">
            <div>
              <dt>音阶</dt>
              <dd>{scale.standardName}</dd>
            </div>
            <div>
              <dt>中文名称</dt>
              <dd>{scale.chineseName}</dd>
            </div>
            <div>
              <dt>组成音</dt>
              <dd>
                <ToneTags items={scale.notes} />
              </dd>
            </div>
            <div>
              <dt>音程结构</dt>
              <dd>
                <ToneTags items={scale.intervals} type="role" />
              </dd>
            </div>
          </dl>
        </section>

        <Legend variant="scale" />
        <BassFretboard title="音阶指板" description={`${scale.standardName}，标准四弦贝斯 0 到 12 品。`} markers={markers} animationKey={scale.standardName} />
      </div>
    </div>
  );
}
