export type IntervalRole = '1' | 'b3' | '3' | '4' | '5' | '#5' | 'b5' | 'b6' | '6' | 'b7' | '7' | '2' | '9';

export interface Tone {
  note: string;
  pitchClass: number;
  role: IntervalRole;
}

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

export const NOTE_NAMES = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];

export const PITCH_CLASS_BY_NAME: Record<string, number> = {
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

export function normalizePitchClass(value: number): number {
  return ((value % 12) + 12) % 12;
}

export function pitchClassToNote(pitchClass: number): string {
  return NOTE_NAMES[normalizePitchClass(pitchClass)];
}

export function normalizeChordText(input: string): string {
  return input.trim().replace(/\s+/g, '').replaceAll('♯', '#').replaceAll('♭', 'b');
}

export function parseRoot(input: string): { root: string; rootPitchClass: number; suffix: string } | null {
  const normalized = normalizeChordText(input);
  const match = normalized.match(/^([A-Ga-g])([#b♯♭]?)(.*)$/);
  if (!match) {
    return null;
  }

  const [, letter, accidental, suffix] = match;
  const root = `${letter.toUpperCase()}${accidental}`;
  const rootPitchClass = PITCH_CLASS_BY_NAME[root];
  if (rootPitchClass === undefined) {
    return null;
  }

  return { root, rootPitchClass, suffix };
}

export function buildTones(rootPitchClass: number, intervals: number[], roles: IntervalRole[]): Tone[] {
  return intervals.map((interval, index) => {
    const pitchClass = normalizePitchClass(rootPitchClass + interval);

    return {
      note: pitchClassToNote(pitchClass),
      pitchClass,
      role: roles[index],
    };
  });
}
