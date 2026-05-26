import { useMemo, useState } from 'react';
import { buildChord, ChordTypeId, getAdjacentCommonTones, getSupportedInputExamples, parseChordProgression, ParsedChord } from '../lib/chords';
import { createMarkers } from '../lib/fretboard';
import { BassFretboard } from './BassFretboard';
import { ChordInfo } from './ChordInfo';
import { ChordInput } from './ChordInput';
import { ChordProgression } from './ChordProgression';
import { ChordSelector } from './ChordSelector';
import { Legend } from './Legend';
import { RecentQueries } from './RecentQueries';

const INVALID_CHORD_MESSAGE = '暂时无法识别这个和弦，请尝试输入 Em、Cmaj7 或使用下方按钮选择。';
const INVALID_PROGRESSION_MESSAGE = '有些和弦暂时无法识别，请检查后再查询。';
const INITIAL_CHORD = buildChord('E', 'minor');

export function ChordTool() {
  const [query, setQuery] = useState('Em');
  const [selectedRoot, setSelectedRoot] = useState('E');
  const [selectedTypeId, setSelectedTypeId] = useState<ChordTypeId>('minor');
  const [focusedChord, setFocusedChord] = useState<ParsedChord>(INITIAL_CHORD);
  const [progression, setProgression] = useState<ParsedChord[]>([INITIAL_CHORD]);
  const [recentQueries, setRecentQueries] = useState<string[]>(['Em']);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const supportedExamples = useMemo(() => getSupportedInputExamples(), []);
  const commonTonePairs = useMemo(() => getAdjacentCommonTones(progression), [progression]);
  const markers = useMemo(() => createMarkers(focusedChord.tones, 'chord', focusedChord.rootPitchClass), [focusedChord]);

  function submitQuery(nextQuery = query) {
    const result = parseChordProgression(nextQuery);
    if (result.invalidTokens.length > 0 || result.chords.length === 0) {
      const invalidText = result.invalidTokens.length > 0 ? ` 无法识别：${result.invalidTokens.join('、')}` : '';
      setError(`${result.chords.length > 1 ? INVALID_PROGRESSION_MESSAGE : INVALID_CHORD_MESSAGE}${invalidText}`);
      return;
    }

    applyQueryResult(nextQuery, result.chords);
  }

  function selectChord(root: string, typeId: ChordTypeId) {
    applyQueryResult(`${root}${buildChord(root, typeId).type.symbolSuffix}`, [buildChord(root, typeId)]);
  }

  function applyQueryResult(rawQuery: string, chords: ParsedChord[]) {
    const nextFocusedChord = chords[0];
    setProgression(chords);
    setFocusedChord(nextFocusedChord);
    setSelectedRoot(nextFocusedChord.root);
    setSelectedTypeId(nextFocusedChord.type.id);
    setQuery(rawQuery.trim());
    setError('');
    setCopied(false);
    rememberQuery(chords.map((chord) => chord.standardName).join(' | '));
  }

  function focusChord(chord: ParsedChord) {
    setFocusedChord(chord);
    setSelectedRoot(chord.root);
    setSelectedTypeId(chord.type.id);
    setCopied(false);
  }

  function rememberQuery(value: string) {
    setRecentQueries((items) => [value, ...items.filter((item) => item !== value)].slice(0, 10));
  }

  async function copyResult() {
    const text =
      progression.length > 1
        ? progression.map((chord) => `${chord.standardName} = ${chord.notes.join(' ')} = ${chord.intervals.join(' ')}`).join('\n')
        : `${focusedChord.standardName} = ${focusedChord.notes.join(' ')} = ${focusedChord.intervals.join(' ')}`;

    await copyText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="tool-layout">
      <div className="control-column">
        <ChordInput value={query} error={error} onChange={setQuery} onSubmit={() => submitQuery()} />
        <RecentQueries items={recentQueries} onSelect={submitQuery} />
        <ChordSelector selectedRoot={selectedRoot} selectedTypeId={selectedTypeId} onSelect={selectChord} />
      </div>

      <div className="result-column">
        <ChordInfo chord={focusedChord} copied={copied} onCopy={copyResult} />
        <ChordProgression chords={progression} commonTonePairs={commonTonePairs} onFocusChord={focusChord} />
        <Legend variant="chord" />
        <BassFretboard
          title="标准四弦贝斯指板"
          description={`当前显示 ${focusedChord.standardName}。标准调弦 E A D G，范围 0 到 12 品。`}
          markers={markers}
          animationKey={focusedChord.standardName}
        />
        <section className="panel support-panel" aria-labelledby="support-title">
          <h2 id="support-title">当前支持的输入格式</h2>
          <ul>
            {supportedExamples.map((example) => (
              <li key={example}>{example}</li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  }
}
