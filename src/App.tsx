import { useMemo, useState } from 'react';
import { BassFretboard } from './components/BassFretboard';
import { ChordInfo } from './components/ChordInfo';
import { ChordInput } from './components/ChordInput';
import { ChordProgression } from './components/ChordProgression';
import { ChordSelector } from './components/ChordSelector';
import { Legend } from './components/Legend';
import { RecentQueries } from './components/RecentQueries';
import {
  buildChord,
  ChordTypeId,
  getAdjacentCommonTones,
  getSupportedInputExamples,
  parseChordProgression,
  ParsedChord,
} from './lib/musicTheory';

const INVALID_CHORD_MESSAGE = '暂时无法识别这个和弦，请尝试输入 Em、Cmaj7 或使用下方按钮选择。';
const INVALID_PROGRESSION_MESSAGE = '有些和弦暂时无法识别，请检查后再查询。';
const INITIAL_CHORD = buildChord('E', 'minor');

function App() {
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
    const nextChord = buildChord(root, typeId);
    applyQueryResult(nextChord.standardName, [nextChord]);
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

    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <main className="app-shell">
      <header className="hero">
        <div>
          <p className="eyebrow">Bass Chord Tone Finder</p>
          <h1>贝斯和弦内音查询器</h1>
          <p className="hero-copy">输入和弦，查看组成音与四弦贝斯指板位置</p>
        </div>
      </header>

      <div className="layout">
        <div className="control-column">
          <ChordInput value={query} error={error} onChange={setQuery} onSubmit={() => submitQuery()} />
          <RecentQueries items={recentQueries} onSelect={submitQuery} />
          <ChordSelector selectedRoot={selectedRoot} selectedTypeId={selectedTypeId} onSelect={selectChord} />
        </div>

        <div className="result-column">
          <ChordInfo chord={focusedChord} copied={copied} onCopy={copyResult} />
          <ChordProgression chords={progression} commonTonePairs={commonTonePairs} onFocusChord={focusChord} />
          <Legend />
          <BassFretboard chord={focusedChord} />
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
      <footer className="corner-signature" aria-label="版本与作者">
        <span>v1</span>
        <span>作者：保湿乳</span>
      </footer>
    </main>
  );
}

export default App;
