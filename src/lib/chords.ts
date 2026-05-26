import {
  buildTones,
  IntervalRole,
  normalizePitchClass,
  parseRoot,
  pitchClassToNote,
  PITCH_CLASS_BY_NAME,
  Tone,
} from './musicTheory';

export type ChordTypeId =
  | 'major'
  | 'minor'
  | 'dim'
  | 'aug'
  | 'sus2'
  | 'sus4'
  | 'dominant7'
  | 'maj7'
  | 'min7'
  | 'dominant9'
  | 'maj9'
  | 'min9';

export interface ChordTypeDefinition {
  id: ChordTypeId;
  label: string;
  symbolSuffix: string;
  intervals: number[];
  roles: IntervalRole[];
  aliases: string[];
}

export interface ParsedChord {
  root: string;
  rootPitchClass: number;
  type: ChordTypeDefinition;
  standardName: string;
  chineseName: string;
  notes: string[];
  intervals: IntervalRole[];
  tones: Tone[];
}

export interface ParsedProgression {
  chords: ParsedChord[];
  invalidTokens: string[];
}

export interface CommonTonePair {
  from: ParsedChord;
  to: ParsedChord;
  notes: string[];
}

export const CHORD_TYPES: ChordTypeDefinition[] = [
  { id: 'major', label: '大三和弦', symbolSuffix: '', intervals: [0, 4, 7], roles: ['1', '3', '5'], aliases: ['', 'maj', 'major', '大三和弦'] },
  { id: 'minor', label: '小三和弦', symbolSuffix: 'm', intervals: [0, 3, 7], roles: ['1', 'b3', '5'], aliases: ['m', 'min', 'minor', '小三和弦'] },
  { id: 'dim', label: '减三和弦', symbolSuffix: 'dim', intervals: [0, 3, 6], roles: ['1', 'b3', 'b5'], aliases: ['dim', 'diminished', '减', '减三和弦'] },
  { id: 'aug', label: '增三和弦', symbolSuffix: 'aug', intervals: [0, 4, 8], roles: ['1', '3', '#5'], aliases: ['aug', '+', '增', '增三和弦'] },
  { id: 'sus2', label: 'sus2', symbolSuffix: 'sus2', intervals: [0, 2, 7], roles: ['1', '2', '5'], aliases: ['sus2'] },
  { id: 'sus4', label: 'sus4', symbolSuffix: 'sus4', intervals: [0, 5, 7], roles: ['1', '4', '5'], aliases: ['sus4', 'sus'] },
  { id: 'dominant7', label: '属七和弦', symbolSuffix: '7', intervals: [0, 4, 7, 10], roles: ['1', '3', '5', 'b7'], aliases: ['7', 'dom7', 'dominant7', '属七和弦'] },
  { id: 'maj7', label: '大七和弦', symbolSuffix: 'maj7', intervals: [0, 4, 7, 11], roles: ['1', '3', '5', '7'], aliases: ['maj7', 'major7', 'ma7', '大七和弦'] },
  { id: 'min7', label: '小七和弦', symbolSuffix: 'm7', intervals: [0, 3, 7, 10], roles: ['1', 'b3', '5', 'b7'], aliases: ['m7', 'min7', 'minor7', '小七和弦'] },
  { id: 'dominant9', label: '属九和弦', symbolSuffix: '9', intervals: [0, 4, 7, 10, 14], roles: ['1', '3', '5', 'b7', '9'], aliases: ['9', 'dom9', 'dominant9', '属九和弦'] },
  { id: 'maj9', label: '大九和弦', symbolSuffix: 'maj9', intervals: [0, 4, 7, 11, 14], roles: ['1', '3', '5', '7', '9'], aliases: ['maj9', 'major9', 'ma9', '大九和弦'] },
  { id: 'min9', label: '小九和弦', symbolSuffix: 'm9', intervals: [0, 3, 7, 10, 14], roles: ['1', 'b3', '5', 'b7', '9'], aliases: ['m9', 'min9', 'minor9', '小九和弦'] },
];

const PROGRESSION_SPLITTER = /[\s|,，、/]+/;

export function parseChord(input: string): ParsedChord | null {
  const parsedRoot = parseRoot(input);
  if (!parsedRoot) {
    return null;
  }

  const type = findChordType(parsedRoot.suffix);
  if (!type) {
    return null;
  }

  return buildChord(parsedRoot.root, type.id);
}

export function parseChordProgression(input: string): ParsedProgression {
  const trimmed = input.trim();
  if (!trimmed) {
    return { chords: [], invalidTokens: [] };
  }

  const singleChord = parseChord(trimmed);
  if (singleChord) {
    return { chords: [singleChord], invalidTokens: [] };
  }

  const chords: ParsedChord[] = [];
  const invalidTokens: string[] = [];

  trimmed
    .split(PROGRESSION_SPLITTER)
    .map((token) => token.trim())
    .filter(Boolean)
    .forEach((token) => {
      const chord = parseChord(token);
      if (chord) {
        chords.push(chord);
      } else {
        invalidTokens.push(token);
      }
    });

  return { chords, invalidTokens };
}

export function buildChord(root: string, typeId: ChordTypeId): ParsedChord {
  const rootPitchClass = PITCH_CLASS_BY_NAME[root];
  const type = getChordType(typeId);
  if (rootPitchClass === undefined || !type) {
    throw new Error(`Unsupported chord: ${root} ${typeId}`);
  }

  const tones = buildTones(rootPitchClass, type.intervals, type.roles);

  return {
    root,
    rootPitchClass,
    type,
    standardName: `${root}${type.symbolSuffix}`,
    chineseName: `${root}${type.label}`,
    notes: tones.map((tone) => tone.note),
    intervals: tones.map((tone) => tone.role),
    tones,
  };
}

export function getChordType(typeId: ChordTypeId): ChordTypeDefinition | undefined {
  return CHORD_TYPES.find((type) => type.id === typeId);
}

export function getAdjacentCommonTones(chords: ParsedChord[]): CommonTonePair[] {
  return chords.slice(0, -1).map((from, index) => {
    const to = chords[index + 1];
    const toPitchClasses = new Set(to.tones.map((tone) => tone.pitchClass));
    const notes = from.tones.filter((tone) => toPitchClasses.has(tone.pitchClass)).map((tone) => pitchClassToNote(tone.pitchClass));

    return { from, to, notes };
  });
}

export function getChordPitchClasses(chord: ParsedChord): number[] {
  return chord.tones.map((tone) => normalizePitchClass(tone.pitchClass));
}

export function getSupportedInputExamples(): string[] {
  return [
    '单个和弦：Em、Cmaj7、C9、Cmaj9、Cm9、F#sus4',
    '多个和弦：Em | B9 | Amaj9 | G',
    '空格分隔：Em B A G',
    '大三和弦：C / Cmaj / C major / C大三和弦',
    '小三和弦：Cm / Cmin / C minor / C小三和弦',
    '七和弦：C7 / C属七和弦 / Cmaj7 / Cm7',
    '九和弦：C9 / C属九和弦 / Cmaj9 / C大九和弦 / Cm9 / C小九和弦',
    '升降根音：C#、Db、F#、Gb 等',
  ];
}

function findChordType(rawSuffix: string): ChordTypeDefinition | undefined {
  const suffix = rawSuffix.toLowerCase();
  return CHORD_TYPES.find((type) => type.aliases.some((alias) => alias.toLowerCase() === suffix));
}
