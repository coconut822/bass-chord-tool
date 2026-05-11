export type ChordTypeId =
  | 'major'
  | 'minor'
  | 'dim'
  | 'aug'
  | 'sus2'
  | 'sus4'
  | 'dominant7'
  | 'maj7'
  | 'min7';

export type ChordToneRole = '1' | 'b3' | '3' | '4' | '5' | '#5' | 'b5' | 'b7' | '7' | '2';

export interface ChordTypeDefinition {
  id: ChordTypeId;
  label: string;
  symbolSuffix: string;
  intervals: number[];
  roles: ChordToneRole[];
  aliases: string[];
}

export interface ParsedChord {
  root: string;
  rootPitchClass: number;
  type: ChordTypeDefinition;
  standardName: string;
  chineseName: string;
  notes: string[];
  intervals: ChordToneRole[];
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

export interface FretPosition {
  stringName: BassStringName;
  stringPitchClass: number;
  fret: number;
  note: string;
  pitchClass: number;
  isChordTone: boolean;
  role?: ChordToneRole;
}

export type BassStringName = 'G' | 'D' | 'A' | 'E';

export const ROOT_OPTIONS = [
  { label: 'C', value: 'C', pitchClass: 0 },
  { label: 'C# / Db', value: 'C#', pitchClass: 1 },
  { label: 'D', value: 'D', pitchClass: 2 },
  { label: 'D# / Eb', value: 'D#', pitchClass: 3 },
  { label: 'E', value: 'E', pitchClass: 4 },
  { label: 'F', value: 'F', pitchClass: 5 },
  { label: 'F# / Gb', value: 'F#', pitchClass: 6 },
  { label: 'G', value: 'G', pitchClass: 7 },
  { label: 'G# / Ab', value: 'G#', pitchClass: 8 },
  { label: 'A', value: 'A', pitchClass: 9 },
  { label: 'A# / Bb', value: 'A#', pitchClass: 10 },
  { label: 'B', value: 'B', pitchClass: 11 },
] as const;

export const CHORD_TYPES: ChordTypeDefinition[] = [
  {
    id: 'major',
    label: '大三和弦',
    symbolSuffix: '',
    intervals: [0, 4, 7],
    roles: ['1', '3', '5'],
    aliases: ['', 'maj', 'major', '大三和弦'],
  },
  {
    id: 'minor',
    label: '小三和弦',
    symbolSuffix: 'm',
    intervals: [0, 3, 7],
    roles: ['1', 'b3', '5'],
    aliases: ['m', 'min', 'minor', '小三和弦'],
  },
  {
    id: 'dim',
    label: '减三和弦',
    symbolSuffix: 'dim',
    intervals: [0, 3, 6],
    roles: ['1', 'b3', 'b5'],
    aliases: ['dim', 'diminished', '减', '减三和弦'],
  },
  {
    id: 'aug',
    label: '增三和弦',
    symbolSuffix: 'aug',
    intervals: [0, 4, 8],
    roles: ['1', '3', '#5'],
    aliases: ['aug', '+', '增', '增三和弦'],
  },
  {
    id: 'sus2',
    label: 'sus2',
    symbolSuffix: 'sus2',
    intervals: [0, 2, 7],
    roles: ['1', '2', '5'],
    aliases: ['sus2'],
  },
  {
    id: 'sus4',
    label: 'sus4',
    symbolSuffix: 'sus4',
    intervals: [0, 5, 7],
    roles: ['1', '4', '5'],
    aliases: ['sus4', 'sus'],
  },
  {
    id: 'dominant7',
    label: '属七和弦',
    symbolSuffix: '7',
    intervals: [0, 4, 7, 10],
    roles: ['1', '3', '5', 'b7'],
    aliases: ['7', 'dom7', 'dominant7', '属七和弦'],
  },
  {
    id: 'maj7',
    label: '大七和弦',
    symbolSuffix: 'maj7',
    intervals: [0, 4, 7, 11],
    roles: ['1', '3', '5', '7'],
    aliases: ['maj7', 'major7', 'ma7', '大七和弦'],
  },
  {
    id: 'min7',
    label: '小七和弦',
    symbolSuffix: 'm7',
    intervals: [0, 3, 7, 10],
    roles: ['1', 'b3', '5', 'b7'],
    aliases: ['m7', 'min7', 'minor7', '小七和弦'],
  },
];

const NOTE_NAMES = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];
const ROOT_PATTERN = /^([A-Ga-g])([#b♯♭]?)(.*)$/;
const PROGRESSION_SPLITTER = /[\s|,，、/]+/;

const PITCH_CLASS_BY_NAME: Record<string, number> = {
  C: 0,
  'B#': 0,
  'C#': 1,
  Db: 1,
  D: 2,
  'D#': 3,
  Eb: 3,
  E: 4,
  Fb: 4,
  'E#': 5,
  F: 5,
  'F#': 6,
  Gb: 6,
  G: 7,
  'G#': 8,
  Ab: 8,
  A: 9,
  'A#': 10,
  Bb: 10,
  B: 11,
  Cb: 11,
};

const BASS_STRINGS: Array<{ name: BassStringName; pitchClass: number }> = [
  { name: 'G', pitchClass: 7 },
  { name: 'D', pitchClass: 2 },
  { name: 'A', pitchClass: 9 },
  { name: 'E', pitchClass: 4 },
];

export function parseChord(input: string): ParsedChord | null {
  const normalized = normalizeChordText(input);
  if (!normalized) {
    return null;
  }

  const match = normalized.match(ROOT_PATTERN);
  if (!match) {
    return null;
  }

  const [, letter, accidental, suffix] = match;
  const root = `${letter.toUpperCase()}${accidental}`;
  const rootPitchClass = PITCH_CLASS_BY_NAME[root];
  if (rootPitchClass === undefined) {
    return null;
  }

  const type = findChordType(suffix);
  if (!type) {
    return null;
  }

  return buildChord(root, type.id);
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

  const tokens = trimmed
    .split(PROGRESSION_SPLITTER)
    .map((token) => token.trim())
    .filter(Boolean);

  const chords: ParsedChord[] = [];
  const invalidTokens: string[] = [];

  tokens.forEach((token) => {
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

  const notes = type.intervals.map((interval) => pitchClassToNote(rootPitchClass + interval));
  const standardName = `${root}${type.symbolSuffix}`;

  return {
    root,
    rootPitchClass,
    type,
    standardName,
    chineseName: `${root}${type.label}`,
    notes,
    intervals: type.roles,
  };
}

export function getAdjacentCommonTones(chords: ParsedChord[]): CommonTonePair[] {
  return chords.slice(0, -1).map((from, index) => {
    const to = chords[index + 1];
    const toPitchClasses = new Set(to.type.intervals.map((interval) => normalizePitchClass(to.rootPitchClass + interval)));
    const notes = from.type.intervals
      .map((interval) => normalizePitchClass(from.rootPitchClass + interval))
      .filter((pitchClass) => toPitchClasses.has(pitchClass))
      .map(pitchClassToNote);

    return { from, to, notes };
  });
}

export function getChordPitchClasses(chord: ParsedChord): number[] {
  return chord.type.intervals.map((interval) => normalizePitchClass(chord.rootPitchClass + interval));
}

export function getChordType(typeId: ChordTypeId): ChordTypeDefinition | undefined {
  return CHORD_TYPES.find((type) => type.id === typeId);
}

export function generateBassFretboard(chord: ParsedChord, maxFret = 12): FretPosition[] {
  const chordToneMap = new Map<number, ChordToneRole>();
  chord.type.intervals.forEach((interval, index) => {
    chordToneMap.set(normalizePitchClass(chord.rootPitchClass + interval), chord.type.roles[index]);
  });

  return BASS_STRINGS.flatMap((bassString) =>
    Array.from({ length: maxFret + 1 }, (_, fret) => {
      const pitchClass = normalizePitchClass(bassString.pitchClass + fret);
      const role = chordToneMap.get(pitchClass);

      return {
        stringName: bassString.name,
        stringPitchClass: bassString.pitchClass,
        fret,
        note: pitchClassToNote(pitchClass),
        pitchClass,
        isChordTone: role !== undefined,
        role,
      };
    }),
  );
}

export function pitchClassToNote(pitchClass: number): string {
  return NOTE_NAMES[normalizePitchClass(pitchClass)];
}

export function getSupportedInputExamples(): string[] {
  return [
    '单个和弦：Em、Cmaj7、C大三和弦、F#sus4',
    '多个和弦：Em | B | A | G',
    '空格分隔：Em B A G',
    '大三和弦：C / Cmaj / C major / C大三和弦',
    '小三和弦：Cm / Cmin / C minor / C小三和弦',
    '七和弦：C7 / C属七和弦 / Cmaj7 / Cm7',
    '升降根音：C#、Db、F#、Gb 等',
  ];
}

function normalizeChordText(input: string): string {
  return input.trim().replace(/\s+/g, '').replaceAll('♯', '#').replaceAll('♭', 'b');
}

function findChordType(rawSuffix: string): ChordTypeDefinition | undefined {
  const suffix = rawSuffix.toLowerCase();
  return CHORD_TYPES.find((type) => type.aliases.some((alias) => alias.toLowerCase() === suffix));
}

function normalizePitchClass(value: number): number {
  return ((value % 12) + 12) % 12;
}
